<template>
    <div class="mt-10">
        <div class="grid grid-cols-[16rem_auto] items-center gap-9 mb-10">
            <!-- Cover -->
            <div class="relative z-0 aspect-square self-start">
                <div
                    v-if="!isLoadingPlaylist"
                    class="absolute top-3.5 z-[-1] h-full w-full scale-x-[.92] scale-y-[.96] rounded-lg bg-cover opacity-40 blur-lg filter"
                    :style="{
                        backgroundImage: `url(&quot;${coverUrl}&quot;)`,
                    }"
                >
                </div>

                <img
                    v-if="!isLoadingPlaylist"
                    class="rounded-lg border border-black border-opacity-5"
                    :src="coverUrl"
                    alt="cover"
                />
                <Skeleton v-else class="h-full w-full rounded-lg"></Skeleton>
            </div>

            <!-- Playlist Info -->
            <div class="z-10">
                <!-- Playlist name -->
                <div v-if="!isLoadingPlaylist" class="text-4xl font-bold text-black dark:text-white">
                    {{ playlist?.name }}
                </div>
                <Skeleton v-else class="w-3/4 text-4xl">PLACEHOLDER</Skeleton>

                <!-- playlist Creator -->
                <div v-if="!isLoadingPlaylist" class="mt-5 text-lg font-medium text-black dark:text-white">
                    Playlist by <span>{{ playlist?.creator.nickname }}</span>
                </div>
                <Skeleton v-else class="mt-5 w-64 text-lg">PLACEHOLDER</Skeleton>

                <!-- Playlist last update time & track count -->
                <div v-if="!isLoadingPlaylist" class="text-sm font-thin text-black dark:text-white">
                    Update at {{ formatDate(playlist?.updateTime || 0, 'zh-CN') }} · {{ playlist?.trackCount }} Songs
                </div>
                <Skeleton v-else class="w-72 translate-x-px text-sm">PLACEHOLDER</Skeleton>

                <!-- Playlist description -->
                <div v-if="!isLoadingPlaylist" class="line-clamp-2 mt-5 min-h-10 text-sm text-black dark:text-white">
                    {{ playlist?.description }}
                </div>
                <Skeleton v-else class="mt-5 min-h-10 w-1/2 text-sm">PLACEHOLDER</Skeleton>

                <!-- Buttons -->
                <div class="mt-5 flex gap-4">
                    <Button :is-skeleton="isLoadingPlaylist" shape="button" @click="play">
                        <SvgIcon class="h-4 w-4" :name="player?.isPlaying ? 'pause' : 'play' "></SvgIcon>
                    </Button>

                    <Button :is-skeleton="isLoadingPlaylist" shape="button" color="gray">
                        <SvgIcon class="h-4 w-4" name="heart"></SvgIcon>
                    </Button>

                    <Button :is-skeleton="isLoadingPlaylist" shape="button" color="gray" icon-color="gray">
                        <SvgIcon class="h-4 w-4" name="more"></SvgIcon>
                    </Button>
                </div>
            </div>
        </div>

        <!-- Infinite tracks -->
        <TrackList v-for="page in infiniteTracks?.pages" :tracks="page?.songs || []" layout="list" />
    </div>
</template>

<script setup lang="ts">
    import usePlaylist from '@/hooks/usePlaylist'
    import useTracksInfinite from '@/hooks/useTracksInfinite'
    import { formatDate, resizeImage } from '@/utils/common'
    import usePlayer, { PlaylistSourceType } from '@/utils/player'

    const route = useRoute()
    const router = useRouter()

    // Validate playlist id
    const playlistID = computed(() => {
        return route.params.id as string
    })
    if (!playlistID.value || isNaN(Number(playlistID.value))) {
        router.replace('/404')
    }

    // Fetch playlist date
    const { data: playlistRaw, isLoading: isLoadingPlaylist } = usePlaylist(
        reactive({
            id: playlistID,
            s: 0,
        }),
    )

    const playlist = computed(() => {
        return playlistRaw.value?.playlist
    })

    const coverUrl = computed(() => {
        return resizeImage(playlist.value?.coverImgUrl || '', 'md')
    })

    const trackIDs = computed(() => {
        return playlist.value?.trackIds?.map((t) => t.id) || []
    })

    // Infinite query tracks
    const {
        data: infiniteTracks,
        isFetching: isFetchingTracks,
        isLoading: isLoadingTracks,
        hasNextPage,
        fetchNextPage,
    } = useTracksInfinite(
        reactive({
            ids: trackIDs,
        }),
    )

    // Load more tracks when scrolled to bottom
    const mainContainerRef = ref<HTMLElement | null>(document.getElementById('mainContainer'))

    const mainContainerScroll = useScroll(mainContainerRef)

    watch(
        () => mainContainerScroll.arrivedState.bottom,
        (isScrolledToBottom) => {
            if (!isScrolledToBottom && isFetchingTracks.value && !hasNextPage?.value) {
                return
            }
            console.debug('scrolled to bottom, load more tracks!')
            fetchNextPage.value()
        },
    )

    // Show track from usePlaylist() until useTrackInfinite() is loaded
    const isShowTracksFromPlaylistQuery = ref(true)

    watch(
        () => isLoadingTracks.value,
        (isLoadingTracks) => {
            if (isLoadingTracks) {
                return
            }
            isShowTracksFromPlaylistQuery.value = false
        },
    )

    watch(
        // Reset isShowTracksFromPlaylistQuery when Playlist id is changed
        () => playlistID.value,
        () => {
            isShowTracksFromPlaylistQuery.value = true
        },
    )

    const player = usePlayer()
    const play = () => {
        player?.replacePlaylist(trackIDs.value, {
            type: PlaylistSourceType.PLAYLIST,
            id: playlistID.value,
        })
    }
</script>
