<template>
    <!-- Header buttons -->
    <div class="mt-10 text-2xl">发现</div>
    <div class="flex flex-wrap text-sm">
        <div
            v-for="category in staticCategory"
            class="btn-hover-animation category"
            :class="{
                'bg-green-500': route.params.category === category.name,
            }"
            @click="updateActiveStatic(category)"
        >
            {{ category.name }}
        </div>
        <div class="btn-hover-animation category" @click="showPanel = !showPanel">
            <SvgIcon class="h-4 w-4" name="more"></SvgIcon>
        </div>
    </div>

    <!-- panel -->
    <div v-for="(bigCat, index) in playlistCategory?.categories" v-show="showPanel">
        <!-- name -->
        <div class="text-2xl"> {{ bigCat }}</div>
        <!-- cats -->
        <div class="flex flex-wrap text-sm">
            <div v-for="cat in playlistCategory?.sub">
                <div
                    v-if="cat.category === Number(index)"
                    class="btn-hover-animation category"
                    :class="{
                        'bg-green-500': route.params.category === cat.name,
                    }"
                    @click="updateActiveStatic(cat)"
                    >{{ cat.name }}
                </div>
            </div>
        </div>
    </div>

    <CoverRow
        v-for="page in topPlaylists?.pages"
        :playlists="page?.playlists"
        type="playlist"
        subtitle="creator"
        :is-skeleton="isLoadingTopPlaylists"
    ></CoverRow>
</template>

<script setup lang="ts">
    import { fetchPlaylistCategory } from '@/api/playlist'
    import useFetchTopPlaylistsInfinite from '@/hooks/useFetchTopPlaylistsInfinite'

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
    ]

    const updateActiveStatic = (category: Category) => {
        router.push({
            name: 'explore',
            params: {
                category: category.name,
            },
        })
    }

    const route = useRoute()
    const router = useRouter()

    const { data: playlistCategory } = fetchPlaylistCategory()

    const {
        data: topPlaylists,
        isLoading: isLoadingTopPlaylists,
        isFetching: isFetchingTopPlaylists,
        hasNextPage: TopPlaylistsHasNextPage,
        fetchNextPage: fetchTopPlaylistsNextPage,
    } = useFetchTopPlaylistsInfinite(
        reactive({
            cat: String(route.params.category),
            limit: 90,
        }),
    )

    // Load more tracks when scrolled to bottom
    const mainContainerRef = ref<HTMLElement | null>(document.getElementById('mainContainer'))

    const mainContainerScroll = useScroll(mainContainerRef)

    watch(
        () => mainContainerScroll.arrivedState.bottom,
        (isScrolledToBottom) => {
            if (isScrolledToBottom) {
                if (isFetchingTopPlaylists.value) {
                    return
                } else if (TopPlaylistsHasNextPage?.value) {
                    console.debug('scrolled to bottom, load more tracks!')
                    fetchTopPlaylistsNextPage.value()
                }
            }
        },
    )
</script>

<style lang="scss">
    .category {
        @apply my-2 mr-2 flex items-center rounded-lg px-3 py-2 transition-colors duration-200 after:scale-[0.97] after:bg-green-400;
    }
</style>
