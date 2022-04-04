<template>
    <div class="mt-10">
        <!-- -->
        <div class="grid grid-cols-[17rem_auto] items-center gap-10">
            <!-- Cover -->
            <div class="relative z-0 aspect-square self-start">
                <div
                    v-if="!isLoadingAlbum"
                    class="absolute top-3.5 z-[-1] h-full w-full scale-x-[.92] scale-y-[.96] rounded-lg bg-cover opacity-60 blur-lg filter"
                    :style="{
                        backgroundImage: `url(&quot;${coverUrl}&quot;)`,
                    }"
                >
                </div>

                <img
                    v-if="!isLoadingAlbum"
                    class="rounded-lg border border-black border-opacity-5"
                    :src="coverUrl"
                    alt="cover"
                />
                <Skeleton v-else class="h-full w-full rounded-lg"></Skeleton>
            </div>

            <!-- Album info -->
            <div class="z-10">
                <!-- Name -->
                <div v-if="!isLoadingAlbum" class="text-6xl font-bold text-black dark:text-white">
                    {{ album?.name }}
                </div>
                <Skeleton v-else class="w-3/4 text-7xl">PLACEHOLDER</Skeleton>

                <!-- Artist -->
                <div v-if="!isLoadingAlbum" class="mt-5 text-lg font-medium text-black dark:text-white"
                    >Album by
                    <span class="font-semibold decoration-2 hover:underline">
                        {{ album?.artist.name }}
                    </span>
                </div>
                <Skeleton v-else class="mt-5 w-64 text-lg">PLACEHOLDER</Skeleton>

                <!-- Last update time & time count -->
                <div v-if="!isLoadingAlbum" class="text-sm font-thin text-black dark:text-white">
                    {{ dayjs(album?.publishTime || 0).year() }} · {{ album?.size }} Songs,
                    {{ albumDuration }}
                </div>
                <Skeleton v-else class="w-72 translate-y-px text-sm">PLACEHOLDER</Skeleton>

                <!-- Description -->
                <div
                    v-if="!isLoadingAlbum"
                    class="line-clamp-3 mt-5 min-h-[3.75rem] max-w-xl text-sm text-black dark:text-white"
                >
                    {{ album?.description }}
                </div>
                <Skeleton v-else class="mt-5 flex gap-4">PLACEHOLDER</Skeleton>

                <!-- Button -->
                <div class="mt-5 flex gap-4">
                    <Button :is-skeleton="isLoadingAlbum" @click="play">
                        <SvgIcon class="h-4 w-4" name="play"></SvgIcon
                    ></Button>
                    <Button :is-skeleton="isLoadingAlbum" shape="square" color="gray">
                        <SvgIcon class="h-4 w-4" name="heart"></SvgIcon
                    ></Button>
                </div>
            </div>
        </div>

        <!-- Tracks -->
        <TrackList class="mt-10" :tracks="tracks || []" layout="album" :isLoading="isLoadingAlbum"></TrackList>

        <!-- Release date and company -->
        <div class="mt-5 text-xs text-black dark:text-white">
            <div> Realease {{ formatDate(album?.publishTime || 0, 'zh-CN') }}</div>
            <div v-if="album?.company" class="mt-[2px]">
                {{ album.company }}
            </div>
        </div>

        <!-- More by artist -->
        <div class="my-5 h-px w-full bg-gray-100"></div>
        <div class="pl-px text-[1.375rem] font-semibold text-black dark:text-white">
            More by
            <span
                class="hover:underline"
                @click="
                    router.push({
                        name: 'artist',
                        params: {
                            id: artistIDs,
                        },
                    })
                "
            >
                {{ album?.artist.name }}
            </span>
        </div>
        <div class="mt-3">
            <CoverRow
                :albums="filteredOtherAlbums"
                :is-skeleton="isLoadingMoreAlbums"
                subtitle="type+releaseYear"
            ></CoverRow>
        </div>
    </div>
</template>

<script setup lang="ts">
    import usePlayer from '@/hooks/usePlayer'
    import { PlaylistSourceType, PlayerMode } from '@/hooks/usePlayer'
    import useFetchAlbum from '@/hooks/useFetchAlbum'
    import useFetchArtistAlbums from '@/hooks/useFetchArtistAlbums'
    import { formatDate, formatDuration, resizeImage } from '@/utils/common'
    import dayjs from 'dayjs'

    const route = useRoute()
    const router = useRouter()
    const player = usePlayer()

    // Validate album id
    const albumID = computed(() => {
        return route.params.id as string
    })

    if (!albumID.value || isNaN(Number(albumID.value))) {
        router.replace('/404')
    }

    // Fetch album data
    const { data: albumRaw, isLoading: isLoadingAlbum } = useFetchAlbum(
        reactive({
            id: albumID.value,
        }),
    )

    const artistIDs = computed(() => {
        return albumRaw.value?.album.artist.id
    })

    const album = computed(() => {
        return albumRaw?.value?.album
    })

    const tracks = computed(() => {
        return albumRaw?.value?.songs
    })

    const coverUrl = computed(() => {
        return resizeImage(album?.value?.picUrl || '', 'lg')
    })

    const albumDuration = computed(() => {
        const duration = tracks.value?.reduce((acc, cur) => acc + Number(cur.dt), 0) || 0
        return formatDuration(duration, 'zh-CN', 'hh[hr] mm[min]')
    })

    // Fetch artist's albums

    const { data: otherAlbums, isLoading: isLoadingMoreAlbums } = useFetchArtistAlbums(
        reactive({
            id: artistIDs.value as number,
        }),
    )

    const filteredOtherAlbums = computed(() => {
        const allRealease = otherAlbums.value?.hotAlbums || []

        const albums = allRealease.filter((album) => {
            return ['专辑', 'EP/Single', 'EP'].includes(album.type) && album.size > 1
        })

        const singles = allRealease.filter((album) => {
            return album.type === 'Single'
        })

        // 去除名字相同的专辑和当前页面现实的专辑
        const deDuplicatedAlbums: Album[] = []

        albums.forEach((album) => {
            if (
                deDuplicatedAlbums.findIndex((a) => a.name === album.name) === -1 &&
                String(album.id) !== albumID.value
            ) {
                deDuplicatedAlbums.push(album)
            }
        })

        return [...deDuplicatedAlbums, ...singles].slice(0, 5)
    })

    // Handle play album
    const play = () => {
        player!.mode = PlayerMode.PLAYLIST
        player?.replacePlaylist(tracks.value?.map((s) => s.id) || [], {
            type: PlaylistSourceType.ALBUM,
            id: albumID.value,
        })
    }
</script>
