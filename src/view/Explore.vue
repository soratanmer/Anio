<template>
    <!-- Header buttons -->
    <div class="flex flex-wrap">
        <div
            v-for="category in staticCategory"
            class="py-2 px-4 mt-2.5 mr-4 mb-1.5 flex content-center items-center font-semibold text-xl rounded-lg"
            @click="updateActiveStatic(category)"
        >
            {{ category.name }}
        </div>
    </div>

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
            v-if="activeStatic !== '排行榜' && activeStatic !== '精品歌单' && activeStatic !== '推荐歌单'"
            v-for="page in topPlaylists?.pages"
            :playlists="page.playlists"
            subtitle="creator"
            :is-skeleton="isLoadingTopPlaylists"
        ></CoverRow>

        <CoverRow
            v-if="activeStatic === '排行榜'"
            :toplists="toplists?.list"
            :is-skeleton="isLoadingToplists"
        ></CoverRow>

        <CoverRow
            v-if="activeStatic === '推荐歌单'"
            :toplists="recommendedPlaylists?.result"
            :is-skeleton="isLoadingRecommendedPlaylists"
        ></CoverRow>

        <CoverRow
            v-if="activeStatic === '精品歌单'"
            v-for="page in hightQualityPlaylists?.pages"
            :playlists="page.playlists"
            subtitle="creator"
            :is-skeleton="isLoadingHighQualityPlaylists"
        ></CoverRow>
    </div>
</template>

<script setup lang="ts">
    import usePlaylistCategory from '@/hooks/usePlaylistCategory'
    import useTopPlaylists from '@/hooks/useTopPlaylists'
    import useToplist from '@/hooks/useToplist'
    import useHighQualityPlaylists from '@/hooks/useHighQualityPlaylist'
    import useRecommendedPlaylists from '@/hooks/useRecommendedPlaylists'

    const staticCategory: {
        name: string
    }[] = [
        {
            name: '全部',
        },
        {
            name: '官方',
        },
        {
            name: '推荐歌单',
        },
        {
            name: '精品歌单',
        },
        {
            name: '排行榜',
        },
    ]

    const activeStatic = ref<string>('全部')

    const updateActiveStatic = (category) => {
        activeStatic.value = category.name
    }

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

    const { data: toplists, isLoading: isLoadingToplists } = useToplist()

    const {
        data: hightQualityPlaylists,
        isLoading: isLoadingHighQualityPlaylists,
        isFetching: isFetchingHighQualityPlaylists,
        hasNextPage: HighQualityPlaylistsHasNextPage,
        fetchNextPage: fetchHighQualityPlaylistsNextPage,
    } = useHighQualityPlaylists({
        cat: '全部',
        limit: 90,
    })

    const { data: recommendedPlaylists, isLoading: isLoadingRecommendedPlaylists } = useRecommendedPlaylists(
        reactive({limit:100})
    )

    // Load more tracks when scrolled to bottom
    const mainContainerRef = ref<HTMLElement | null>(document.getElementById('mainContainer'))

    const mainContainerScroll = useScroll(mainContainerRef)

    watch(
        () => mainContainerScroll.arrivedState.bottom,
        (isScrolledToBottom) => {
            if (!isScrolledToBottom && isFetchingTopPlaylists.value && !TopPlaylistsHasNextPage?.value) {
                return
            } else {
                console.debug('scrolled to bottom, load more tracks!')
                fetchTopPlaylistsNextPage.value()
            }

            if (
                !isScrolledToBottom &&
                isFetchingHighQualityPlaylists.value &&
                !HighQualityPlaylistsHasNextPage?.value
            ) {
                return
            } else {
                console.debug('scrolled to bottom, load more tracks!')
                fetchHighQualityPlaylistsNextPage.value()
            }
        },
    )
</script>
