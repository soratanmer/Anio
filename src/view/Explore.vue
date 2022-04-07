<template>
    <!-- Header buttons -->
    <div class="text-3xl font-semibold text-black dark:text-white py-2 px-4 mb-2 mt-10">发现</div>
    <div class="flex flex-wrap">
        <div
            v-for="category in staticCategory"
            class="py-2 px-4 mt-1 mr-4 mb-1.5 flex content-center items-center rounded-lg text-black dark:text-white"
            :class="{
                'bg-gray-500': route.query.active !== category.name,
                'bg-green-500': route.query.active === category.name,
            }"
            @click="updateActiveStatic(category)"
        >
            {{ category.name }}
        </div>
        <div
            class="py-2 px-4 mt-1 mr-4 mb-1.5 flex content-center items-center rounded-lg bg-gray-500"
            @click="showPanel = !showPanel"
        >
            <SvgIcon class="h-4 w-4 text-black dark:text-white" name="more"></SvgIcon>
        </div>
    </div>

    <!-- panel -->
    <div v-show="showPanel" v-for="(bigCat, index) in playlistCategory?.categories" class="mt-1">
        <!-- name -->
        <div class="text-2xl font-semibold text-black dark:text-white py-2 px-4"> {{ bigCat }}</div>
        <!-- cats -->
        <div class="flex flex-wrap">
            <div v-for="cat in playlistCategory?.sub">
                <div
                    v-if="cat.category === Number(index)"
                    class="py-2 px-4 mt-1 mr-4 mb-1.5 flex content-center items-center rounded-lg text-black dark:text-white"
                    :class="{
                        'bg-gray-500': route.query.active !== cat.name,
                        'bg-green-500': route.query.active === cat.name,
                    }"
                    @click="updateActiveStatic(cat)"
                    >{{ cat.name }}
                </div>
            </div>
        </div>
    </div>

    <div class="mt-4">
        <CoverRow
            v-if="
                route.query.active !== '排行榜' &&
                route.query.active !== '精品歌单' &&
                route.query.active !== '推荐歌单'
            "
            v-for="page in topPlaylists?.pages"
            :playlists="page.playlists"
            subtitle="creator"
            :is-skeleton="isLoadingTopPlaylists"
        ></CoverRow>

        <CoverRow
            v-if="route.query.active === '排行榜'"
            :toplists="toplists?.list"
            :is-skeleton="isLoadingToplists"
        ></CoverRow>

        <CoverRow
            v-if="route.query.active === '推荐歌单'"
            :toplists="recommendedPlaylists?.result"
            :is-skeleton="isLoadingRecommendedPlaylists"
        ></CoverRow>

        <CoverRow
            v-if="route.query.active === '精品歌单'"
            v-for="page in hightQualityPlaylists?.pages"
            :playlists="page.playlists"
            subtitle="creator"
            :is-skeleton="isLoadingHighQualityPlaylists"
        ></CoverRow>
    </div>
</template>

<script setup lang="ts">
    import useFetchHighQualityPlaylists from '@/hooks/useFetchHighQualityPlaylist'
    import useFetchPlaylistCategory from '@/hooks/useFetchPlaylistCategory'
    import useFetchRecommendedPlaylists from '@/hooks/useFetchRecommendedPlaylists'
    import useFetchToplist from '@/hooks/useFetchToplist'
    import useFetchTopPlaylists from '@/hooks/useFetchTopPlaylists'

    interface Category {
        name: string
    }

    const showPanel = ref<boolean>(false)

    const staticCategory: Category[] = [
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

    const updateActiveStatic = (category: Category) => {
        if (category.name !== '推荐歌单' && category.name !== '精品歌单' && category.name !== '排行榜') {
            router.push({
                name: 'explore',
                query: {
                    category: category.name,
                    active: category.name,
                },
            })
        } else {
            router.push({
                name: 'explore',
                query: {
                    category: '全部',
                    active: category.name,
                },
            })
        }
    }

    const route = useRoute()
    const router = useRouter()

    const { data: playlistCategory, isLoading: isLoadingPlaylistCategory } = useFetchPlaylistCategory()

    const {
        data: topPlaylists,
        isLoading: isLoadingTopPlaylists,
        isFetching: isFetchingTopPlaylists,
        hasNextPage: TopPlaylistsHasNextPage,
        fetchNextPage: fetchTopPlaylistsNextPage,
    } = useFetchTopPlaylists(
        reactive({
            cat: String(route.query.category),
            limit: 90,
        }),
    )

    const { data: toplists, isLoading: isLoadingToplists } = useFetchToplist()

    const {
        data: hightQualityPlaylists,
        isLoading: isLoadingHighQualityPlaylists,
        isFetching: isFetchingHighQualityPlaylists,
        hasNextPage: HighQualityPlaylistsHasNextPage,
        fetchNextPage: fetchHighQualityPlaylistsNextPage,
    } = useFetchHighQualityPlaylists({
        cat: '全部',
        limit: 90,
    })

    const { data: recommendedPlaylists, isLoading: isLoadingRecommendedPlaylists } = useFetchRecommendedPlaylists(
        reactive({ limit: 100 }),
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
