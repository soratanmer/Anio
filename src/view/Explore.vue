<template>
    <!-- Panel -->
    <div class="p-2">
        <!-- bigCat -->
        <div v-for="(bigCat, index) in playlistCategory?.categories" class="flex mt-2">
            <!-- name -->
            <div class="text-2xl font-semibold text-gray-600 mt-2 h-7 w-14 mr-6"> {{ bigCat }}</div>
            <!-- cats -->
            <div class="flex flex-wrap">
                <div v-for="cat in playlistCategory?.sub" class="flex items-center mt-1.5">
                    <span
                        v-if="cat.category === Number(index)"
                        class="flex justify-center items-center px-3 py-1.5 mb-2 font-medium text-lg"
                        :class="{
                            'bg-green-200 rounded-lg': route.query.category === cat.name,
                        }"
                        @click="
                            router.push({
                                name: 'explore',
                                query: {
                                    category: cat.name,
                                },
                            })
                        "
                        >{{ cat.name }}
                    </span>
                </div>
            </div>
        </div>
    </div>

    <div class="mt-4">
        <CoverRow
            v-for="page in topPlaylists?.pages"
            :playlists="page.playlists"
            subtitle="creator"
            :is-skeleton="isLoadingTopPlaylists"
        ></CoverRow>
    </div>
</template>

<script setup lang="ts">
    import usePlaylistCategory from '@/hooks/usePlaylistCategory'
    import useTopPlaylists from '@/hooks/useTopPlaylists'

    const route = useRoute()
    const router = useRouter()

    const { data: playlistCategory, isLoading: isLoadingPlaylistCategory } = usePlaylistCategory()

    const {
        data: topPlaylists,
        isLoading: isLoadingTopPlaylists,
        isFetching: isFetchingTopPlaylists,
        hasNextPage: TopPlaylistsHasNextPage,
        fetchNextPage: fetchTopPlaylistsNextPage,
    } = useTopPlaylists(
        reactive({
            cat: String(route.query.category),
            limit: 90,
        }),
    )

    // Load more tracks when scrolled to bottom
    const mainContainerRef = ref<HTMLElement | null>(document.getElementById('mainContainer'))

    const mainContainerScroll = useScroll(mainContainerRef)

    watch(
        () => mainContainerScroll.arrivedState.bottom,
        (isScrolledToBottom) => {
            if (!isScrolledToBottom && isFetchingTopPlaylists.value && !TopPlaylistsHasNextPage?.value) {
                return
            }
            console.debug('scrolled to bottom, load more tracks!')
            fetchTopPlaylistsNextPage.value()
        },
    )
</script>
