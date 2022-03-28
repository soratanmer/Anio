<template>
    <!-- Header buttons -->
    <div class="text-3xl font-semibold text-gray-600 py-2 px-4 mb-2">发现</div>
    <div class="flex flex-wrap">
        <div
            v-for="category in staticCategory"
            class="py-2 px-4 mt-1 mr-4 mb-1.5 flex content-center items-center rounded-lg"
            :class="{
                'bg-gray-100': route.query.active !== category.name,
                'bg-green-200': route.query.active === category.name,
            }"
            @click="updateActiveStatic(category)"
        >
            {{ category.name }}
        </div>
        <div
            class="py-2 px-4 mt-1 mr-4 mb-1.5 flex content-center items-center rounded-lg bg-gray-100"
            @click="showPanel = !showPanel"
        >
            <SvgIcon class="h-4 w-4" name="more"></SvgIcon>
        </div>
    </div>

    <!-- panel -->
    <div v-show="showPanel" v-for="(bigCat, index) in playlistCategory?.categories" class="mt-1">
        <!-- name -->
        <div class="text-2xl font-semibold text-gray-600 py-2 px-4"> {{ bigCat }}</div>
        <!-- cats -->
        <div class="flex flex-wrap">
            <div v-for="cat in playlistCategory?.sub">
                <div
                    v-if="cat.category === Number(index)"
                    class="py-2 px-4 mt-1 mr-4 mb-1.5 flex content-center items-center rounded-lg"
                    :class="{
                        'bg-gray-100': route.query.active !== cat.name,
                        'bg-green-200': route.query.active === cat.name,
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
    import useHighQualityPlaylists from '@/hooks/useHighQualityPlaylist'
    import usePlaylistCategory from '@/hooks/usePlaylistCategory'
    import useRecommendedPlaylists from '@/hooks/useRecommendedPlaylists'
    import useToplist from '@/hooks/useToplist'
    import useTopPlaylists from '@/hooks/useTopPlaylists'

    const showPanel = ref<boolean>(false)

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

    const updateActiveStatic = (category) => {
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
