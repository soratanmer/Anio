<template>
    <div class="grid-layout-col my-10">
        <!-- Cover -->
        <div class="relative aspect-square self-start col-span-1">
            <img v-if="!isFetchingPlaylist" class="rounded-lg" :src="coverUrl" alt="cover" />
            <Skeleton v-else class="h-full w-full rounded-lg"></Skeleton>
        </div>

        <!-- Playlist Info -->
        <div class="cols-span flex flex-col justify-around">
            <!-- Playlist name -->
            <div
                v-if="!isFetchingPlaylist"
                class="line-clamp-1 break-all text-4xl font-bold text-black dark:text-white"
            >
                {{ playlist?.name }}
            </div>
            <Skeleton v-else class="w-3/4 text-4xl">PLACEHOLDER</Skeleton>

            <!-- playlist Creator -->
            <div v-if="!isFetchingPlaylist" class="text-lg font-medium text-black dark:text-white">
                Playlist by <span>{{ playlist?.creator.nickname }}</span>
            </div>
            <Skeleton v-else class="w-64 text-lg">PLACEHOLDER</Skeleton>

            <!-- Playlist last update time & track count -->
            <div v-if="!isFetchingPlaylist" class="text-sm font-thin text-black dark:text-white">
                Update at {{ formatDate(playlist?.updateTime || 0, 'zh-CN') }} · {{ playlist?.trackCount }} Songs
            </div>
            <Skeleton v-else class="w-72 translate-x-px text-sm">PLACEHOLDER</Skeleton>

            <!-- Playlist description -->
            <div v-if="!isFetchingPlaylist" class="line-clamp-1 break-all min-h-10 text-sm text-black dark:text-white">
                {{ playlist?.description }}
            </div>
            <Skeleton v-else class="min-h-10 w-1/2 text-sm">PLACEHOLDER</Skeleton>

            <!-- Buttons -->
            <div class="flex gap-4">
                <ButtonIcon @click="play">
                    <SvgIcon class="h-5 w-5 text-black dark:text-white" name="play"></SvgIcon>
                </ButtonIcon>
                <ButtonIcon :disabled="!isMyPlaylist" @click="subscribe">
                    <SvgIcon
                        class="h-5 w-5 text-black dark:text-white"
                        :name="isSub ? 'heart' : 'heart-outline'"
                    ></SvgIcon>
                </ButtonIcon>
            </div>
        </div>
    </div>

    <!-- Infinite tracks -->
    <TrackList
        v-for="page in infiniteTracks?.pages"
        :tracks="page?.songs || []"
        layout="list"
        :id="playlistID"
        :is-loading="isFetchingPlaylist"
        :isUserOwnPlaylist="isUserOwnPlaylist"
        dbclick-track-func="playPlaylistByID"
    />
</template>

<script setup lang="ts">
    import usePlayer from '@/hooks/usePlayer'
    import { PlaylistSourceType, PlayerMode } from '@/hooks/usePlayer'
    import useFetchTracksInfinite from '@/hooks/useFetchTracksInfinite'
    import { useUserStore } from '@/stores/user'
    import { formatDate, resizeImage } from '@/utils/common'
    import { isLoggedIn } from '@/utils/user'
    import { subscribePlaylist, fetchPlaylist, IsSubPlaylist } from '@/api/playlist'

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

    const { data: playlistRaw, isFetching: isFetchingPlaylist } = fetchPlaylist({
        id: playlistID.value,
        s: 0,
    })

    const playlist = computed(() => {
        return playlistRaw.value?.playlist
    })

    const isUserOwnPlaylist = computed(() => {
        return (
            userStore.userAccount?.profile?.userId === playlistRaw.value?.playlist.creator.userId &&
            playlistID.value !== userStore.userLikedSongListID
        )
    })

    const coverUrl = computed(() => {
        return resizeImage(playlist.value?.coverImgUrl || '', 'md')
    })

    const trackIDs = computed(() => {
        return playlist.value?.trackIds?.map((t) => t.id) || []
    })

    const isMyPlaylist = computed(() => {
        return userStore.userAccount?.account?.id !== playlistRaw.value?.playlist.creator.userId
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

    const isShowTracksFromPlaylistQuery = ref<boolean>(true)

    watch(isLoadingTracks, (isLoadingTracks) => {
        if (isLoadingTracks) {
            return
        }
        isShowTracksFromPlaylistQuery.value = false
    })

    // Reset isShowTracksFromPlaylistQuery when Playlist id is changed

    watch(playlistID, () => {
        isShowTracksFromPlaylistQuery.value = true
    })

    // Play Playlist

    const play = () => {
        player!.mode = PlayerMode.PLAYLIST
        player?.replacePlaylist(trackIDs.value, {
            type: PlaylistSourceType.PLAYLIST,
            id: playlistID.value,
        })
    }

    // Like Playlist

    const isSub = ref<boolean>(false)

    watch(isFetchingPlaylist, () => {
        isSub.value = Boolean(playlistRaw.value?.playlist.subscribed)
    })

    const subscribe = async () => {
        if (!isLoggedIn()) {
            return
        }

        await subscribePlaylist({
            t: isSub.value ? IsSubPlaylist.DISLIKED : IsSubPlaylist.LIKE,
            id: playlistID.value,
        })

        isSub.value = !isSub.value
    }
</script>
