<template>
    <div class="grid-layout-col my-10">
        <!-- Cover -->
        <div class="relative col-span-1 aspect-square self-start">
            <img v-if="!isFetchingAlbum" class="rounded-lg" :src="coverUrl" alt="cover" />
            <Skeleton v-else class="h-full w-full rounded-lg"></Skeleton>
        </div>

        <!-- Album info -->
        <div class="cols-span flex flex-col justify-around">
            <!-- Name -->
            <div v-if="!isFetchingAlbum" class="line-clamp-1 break-all text-3xl font-bold">
                {{ album?.name }}
            </div>
            <Skeleton v-else class="w-3/4 text-3xl">PLACEHOLDER</Skeleton>

            <!-- Artist -->
            <div v-if="!isFetchingAlbum" class="text-sm font-medium">
                <span
                    class="font-semibold decoration-2 hover:underline"
                    @click="
                        router.push({
                            name: 'artist',
                            params: {
                                id: album?.artist.id,
                            },
                        })
                    "
                >
                    {{ album?.artist.name }}
                </span>
            </div>
            <Skeleton v-else class="w-64 text-sm">PLACEHOLDER</Skeleton>

            <!-- Last update time & time count -->
            <div v-if="!isFetchingAlbum" class="text-sm font-thin">
                {{ dayjs(album?.publishTime || 0).year() }} · {{ album?.size }} Songs,
                {{ albumDuration }}
            </div>
            <Skeleton v-else class="w-72 translate-y-px text-sm">PLACEHOLDER</Skeleton>

            <!-- Description -->
            <div v-if="!isFetchingAlbum" class="line-clamp-1 break-all text-sm">
                {{ album?.description }}
            </div>
            <Skeleton v-else class="">PLACEHOLDER</Skeleton>

            <!-- Button -->
            <div class="flex gap-4">
                <ButtonIcon @click="play">
                    <SvgIcon class="h-5 w-5" name="play"></SvgIcon>
                </ButtonIcon>
                <ButtonIcon @click="subscribe">
                    <SvgIcon class="h-5 w-5" :name="isSub ? 'heart' : 'heart-outline'"></SvgIcon>
                </ButtonIcon>
            </div>
        </div>
    </div>

    <!-- Tracks -->
    <TrackList
        :id="albumID"
        :tracks="tracks || []"
        layout="album"
        :is-loading="isFetchingAlbum"
        dbclick-track-func="playAlbumByID"
    ></TrackList>

    <!-- Release date and company -->
    <div class="mt-5 text-xs">
        <div> Realease {{ formatDate(album?.publishTime || 0, 'zh-CN') }}</div>
        <div v-if="album?.company" class="mt-[2px]">
            {{ album.company }}
        </div>
    </div>
</template>

<script setup lang="ts">
    import dayjs from 'dayjs'

    import { fetchAlbum, fetchAlbumDynamicDetail, SubScribeAlbum, IsSubAlbum } from '@/api/album'
    import usePlayer from '@/hooks/usePlayer'
    import { PlaylistSourceType, PlayerMode } from '@/hooks/usePlayer'
    import { formatDate, formatDuration, resizeImage } from '@/utils/common'
    import { isLoggedIn } from '@/utils/user'

    const route = useRoute()
    const router = useRouter()
    const player = usePlayer()

    // Validate album id
    const albumID = computed(() => {
        return Number(route.params.id)
    })

    if (!albumID.value || isNaN(albumID.value)) {
        router.replace('/404')
    }

    // Fetch album data
    const { data: albumRaw, isFetching: isFetchingAlbum } = fetchAlbum({
        id: albumID.value,
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

    // Play Album
    const play = () => {
        player!.mode = PlayerMode.PLAYLIST
        player?.replacePlaylist(tracks.value?.map((s) => s.id) || [], {
            type: PlaylistSourceType.ALBUM,
            id: albumID.value,
        })
    }

    // Like Album
    const isSub = ref<boolean>(false)

    const { data: albumDynamicDetail, isFetching: isFetchingAlbumDynamicDetail } = fetchAlbumDynamicDetail({
        id: albumID.value,
    })

    watch(isFetchingAlbumDynamicDetail, () => {
        isSub.value = Boolean(albumDynamicDetail.value?.isSub)
    })

    const subscribe = async () => {
        if (!isLoggedIn()) {
            return
        }

        await SubScribeAlbum({
            id: albumID.value,
            t: isSub.value ? IsSubAlbum.DISLIKED : IsSubAlbum.LIKE,
        })

        isSub.value = !isSub.value
    }
</script>
