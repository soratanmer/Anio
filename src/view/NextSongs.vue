<template>
    <!-- Header -->
    <div class="mb-10 mt-10 py-2 px-4 text-2xl font-semibold">播放列表</div>

    <!-- Infinite tracks -->
    <TrackList
        v-for="page in infiniteTracks?.pages"
        :tracks="page?.songs || []"
        layout="list"
        :is-loading="isLoadingInfiniteTracks"
    />
</template>

<script setup lang="ts">
    import usePlayer from '@/hooks/usePlayer'
    import useFetchTracksInfinite from '@/hooks/useFetchTracksInfinite'

    const player = usePlayer()

    const {
        data: infiniteTracks,
        isLoading: isLoadingInfiniteTracks,
        isFetching: isFetchingInfiniteTracks,
        hasNextPage,
        fetchNextPage,
    } = useFetchTracksInfinite(
        reactive({
            ids: player?.currentPlaylist as number[],
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
