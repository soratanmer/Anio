<template>
    <!-- Header -->
    <div class="mt-10 text-2xl">精品歌单</div>

    <CoverRow
        v-for="page in hightQualityPlaylists?.pages"
        :playlists="page?.playlists"
        type="playlist"
        subtitle="creator"
        :is-skeleton="isLoadingHighQualityPlaylists"
    ></CoverRow>
</template>
<script setup lang="ts">
    import useFetchHighQualityPlaylistInfinite from '@/hooks/useFetchHighQualityPlaylistInfinite'

    const {
        data: hightQualityPlaylists,
        isLoading: isLoadingHighQualityPlaylists,
        isFetching: isFetchingHighQualityPlaylists,
        hasNextPage: HighQualityPlaylistsHasNextPage,
        fetchNextPage: fetchHighQualityPlaylistsNextPage,
    } = useFetchHighQualityPlaylistInfinite({
        cat: '全部',
        limit: 90,
    })

    // Load more tracks when scrolled to bottom
    const mainContainerRef = ref<HTMLElement | null>(document.getElementById('mainContainer'))

    const mainContainerScroll = useScroll(mainContainerRef)

    watch(
        () => mainContainerScroll.arrivedState.bottom,
        (isScrolledToBottom) => {
            if (isScrolledToBottom) {
                if (isFetchingHighQualityPlaylists.value) {
                    return
                } else if (HighQualityPlaylistsHasNextPage?.value) {
                    console.debug('scrolled to bottom, load more tracks!')
                    fetchHighQualityPlaylistsNextPage.value()
                }
            }
        },
    )
</script>
