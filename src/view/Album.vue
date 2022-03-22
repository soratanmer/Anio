<template>
    <div class="mt-10">
        <!-- Header background -->
        <div class="absolute top-0 left-0 z-0 h-96 w-full overflow-hidden">
            <img class="absolute top-0 w-full blur-[100px]" :src="coverUrl" alt="cover" />
            <img class="absolute top-0 w-full blur-[100px]" :src="coverUrl" alt="cover" />
            <div class="absolute top-0 h-full w-full bg-gradient-to-b from-[#ffffffd6] to-white/100"> </div>
        </div>

        <!-- -->
        <div class="grid grid-cols-[17rem_auto] items-center gap-10">
            <!-- Cover -->
            <div class="relative z-0 aspect-square self-start">
                <div
                    v-if="!isLoading"
                    class="absolute top-3.5 z-[-1] h-full w-full scale-x-[.92] scale-y-[.96] rounded-2xl bg-cover opacity-60 blur-lg filter"
                    :style="{
                        backgroundImage: `url(&quot;${coverUrl}&quot;)`,
                    }"
                >
                </div>

                <img
                    v-if="!isLoading"
                    class="rounded-2xl border border-black border-opacity-5"
                    :src="coverUrl"
                    alt="cover"
                />
                <Skeleton v-else class="h-full w-full rounded-2xl"></Skeleton>
            </div>

            <!-- Album info -->
            <div class="z-10">
                <!-- Name -->
                <div v-if="!isLoading" class="text-6xl font-bold">
                    {{ album?.name }}
                </div>
                <Skeleton v-else class="w-3/4 text-7xl">PLACEHOLDER</Skeleton>

                <!-- Artist -->
                <div v-if="!isLoading" class="mt-5 text-lg font-medium text-gray-800"
                    >Album by
                    <span class="font-semibold decoration-2 hover:underline">
                        {{ album?.artist.name }}
                    </span>
                </div>
                <Skeleton v-else class="mt-5 w-64 text-lg">PLACEHOLDER</Skeleton>

                <!-- Last update time & time count -->
                <div v-if="!isLoading" class="text-sm font-thin text-gray-500">
                    {{ dayjs(album?.publishTime || 0).year() }} · {{ album?.size }} Songs,
                    {{ albumDuration }}
                </div>
                <Skeleton v-else class="w-72 translate-y-px text-sm">PLACEHOLDER</Skeleton>

                <!-- Description -->
                <div v-if="!isLoading" class="line-clamp-3 mt-5 min-h-[3.75rem] max-w-xl text-sm text-gray-500">
                    {{ album?.description }}
                </div>
                <Skeleton v-else class="mt-5 flex gap-4">PLACEHOLDER</Skeleton>

                <!-- Button -->
                <div class="mt-5 flex gap-4">
                    <Button :is-skeleton="isLoading" @click="play">
                        <SvgIcon class="h-4 w-4" name="play"></SvgIcon>PLAY</Button
                    >
                    <Button :is-skeleton="isLoading" shape="square" color="gray">
                        <SvgIcon class="h-4 w-4" name="heart"></SvgIcon
                    ></Button>
                    <Button :is-skeleton="isLoading" shape="square" color="gray" iconColor="gray">
                        <SvgIcon class="h-4 w-4" name="more"></SvgIcon
                    ></Button>
                </div>
            </div>
        </div>

        <!-- Tracks table header -->
        <div class="mx-4 mt-10 mb-2 grid grid-cols-12 border-b border-gray-100 py-2.5 text-sm text-gray-400">
            <div class="col-span-6 grid grid-cols-[2rem_auto]">
                <div>#</div>
                <div>TITLE</div>
            </div>
            <div class="col-span-4">ARTIST</div>
            <div class="col-span-2 justify-self-end">TIME</div>
        </div>

        <!-- Tracks -->
        <TrackList :tracks="tracks || []" layout="album" :isLoading="isLoading"></TrackList>

        <!-- Release date and company -->
        <div class="mt-5 text-xs text-gray-400">
            <div> Realease {{ formatDate(album?.publishTime || 0, 'zh-CN') }}</div>
            <div v-if="album?.company" class="mt-[2px]">
                {{ album.company }}
            </div>
        </div>

        <!-- More by artist -->
        <div class="my-5 h-px w-full bg-gray-100"></div>
        <div class="pl-px text-[1.375rem] font-semibold text-gray-800">
            More by
            <router-link
                :to="{
                    name: 'artist',
                    params: {
                        id: album?.artist.id,
                    },
                }"
                >{{ album?.artist.name }}</router-link
            >
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
    import useAlbum from '@/hooks/useAlbum'
    import useArtistAlbums from '@/hooks/useArtistAlbums'
    import usePlayer from '@/hooks/usePlayer'
    import { formatDate, formatDuration, resizeImage } from '@/utils/common'
    import dayjs from 'dayjs'

    const route = useRoute()
    const router = useRouter()

    // Validate album id
    const albumID = computed(() => {
        return route.params.id as string
    })

    if (!albumID.value || isNaN(Number(albumID.value))) {
        router.replace('/404')
    }

    // Fetch album data
    const { data: albumRaw, isLoading } = useAlbum(
        reactive({
            id: albumID,
        }),
    )

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
        const duration = tracks.value?.reduce((acc, cur) => acc + cur.dt, 0) || 0
        return formatDuration(duration, 'zh-CN', 'hh[hr] mm[min]')
    })

    // Fetch artist's albums
    const { data: otherAlbums, isLoading: isLoadingMoreAlbums } = useArtistAlbums(
        reactive({
            id: computed(() => {
                return album.value?.artist.id || 0
            }),
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
    const player = usePlayer()
    const play = () => {
        player?.replacePlaylist(tracks.value?.map((s) => s.id) || [], {
            type: 'album',
            id: albumID.value,
        })
    }
</script>
