<template>
    <!-- Header -->
    <div class="text-2xl font-semibold text-gray-600 py-2 px-4 mb-2">最近播放的 {{ recentSongsLimit }} 首歌</div>

    <!-- Tracks table header -->
    <div class="ml-2 mr-4 mb-2 grid grid-cols-12 border-b border-gary-100 py-2.5 text-sm text-gray-400">
        <div class="col-span-6 grid grid-cols-[4.2rem_auto]">
            <div></div>
            <div>TITLE</div>
        </div>
        <div class="col-span-5">ALBUM</div>
        <div class="col-span-1 text-right justify-end">TIME</div>
    </div>

    <!-- Tracks -->
    <!-- <TrackList :tracks="tracks?.songs || []" layout="list" :is-loading="isLoadingTracks" /> -->

    <!-- Infinite tracks -->
    <TrackList
        v-for="page in infiniteTracks?.pages"
        :tracks="page?.songs || []"
        layout="list"
        :is-loading="isLoadingInfiniteTracks"
    />
</template>

<script setup lang="ts">
    import useRecentSongs from '@/hooks/useRecentSongs'
    import useTracksInfinite from '@/hooks/useTracksInfinite'
    import { useSettingsStore } from '@/stores/settints'

    const { recentSongsLimit } = useSettingsStore()

    // const recentSongsLimit = ref<number>(300)

    const { data: recentSongs, isLoading: isLoadingRecentSongs } = useRecentSongs(reactive({ limit: recentSongsLimit }))

    const trackIDs = computed(() => {
        return recentSongs.value?.data.list.map((item) => item.data.id) || []
    })

    const {
        data: infiniteTracks,
        isLoading: isLoadingInfiniteTracks,
        isFetching: isFetchingInfiniteTracks,
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
            if (!isScrolledToBottom && isFetchingInfiniteTracks.value && !hasNextPage?.value) {
                return
            }
            console.debug('scrolled to bottom, load more tracks!')
            fetchNextPage.value()
        },
    )
</script>
