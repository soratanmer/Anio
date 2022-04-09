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
                    <ButtonIcon @click="play">
                        <SvgIcon class="h-5 w-5 text-black dark:text-white" name="play"></SvgIcon>
                    </ButtonIcon>
                    <ButtonIcon :disabled="!isMyPlaylist" @click="subscribe">
                        <SvgIcon
                            class="h-5 w-5 text-black dark:text-white"
                            :name="playlist?.subscribed ? 'heart' : 'heart-outline'"
                        ></SvgIcon>
                    </ButtonIcon>
                </div>
            </div>
        </div>

        <!-- Infinite tracks -->
        <TrackList v-for="page in infiniteTracks?.pages" :tracks="page?.songs || []" layout="list" :id="playlistID" dbclick-track-func="playPlaylistByID" />
    </div>
</template>

<script setup lang="ts">
    import { focusManager } from 'vue-query'

    import usePlayer from '@/hooks/usePlayer'
    import { PlaylistSourceType, PlayerMode } from '@/hooks/usePlayer'
    import useFetchPlaylist from '@/hooks/useFetchPlaylist'
    import useFetchTracksInfinite from '@/hooks/useFetchTracksInfinite'
    import { useUserStore } from '@/stores/user'
    import { formatDate, resizeImage } from '@/utils/common'
    import { isLoggedIn } from '@/utils/user'
    import { subscribePlaylist, fetchPlaylist } from '@/api/playlist'

    const route = useRoute()
    const router = useRouter()
    const player = usePlayer()
    const userStore = useUserStore()

    // Validate playlist id
    const playlistID = computed(() => {
        return Number(route.params.id)
    })
    if (!playlistID.value || isNaN(playlistID.value)) {
        router.replace('/404')
    }

    // Fetch playlist date
    const { data: playlistRaw, isLoading: isLoadingPlaylist } = useFetchPlaylist(
        reactive({
            id: playlistID.value,
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
    } = useFetchTracksInfinite(
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

    const play = () => {
        player!.mode = PlayerMode.PLAYLIST
        player?.replacePlaylist(trackIDs.value, {
            type: PlaylistSourceType.PLAYLIST,
            id: playlistID.value,
        })
    }

    const isMyPlaylist = computed(() => {
        return userStore.userAccount.account?.id !== playlistRaw.value?.playlist.creator.userId
    })

    const subscribe = async () => {
        if (!isLoggedIn()) {
            return
        }
        await subscribePlaylist({
            t: playlist.value?.subscribed ? 2 : 1,
            id: playlistID.value,
        })
    }
</script>
