<template>
    <!-- Tracks info -->
    <div class="mb-3 mt-10 text-xl font-semibold text-black dark:text-white"> Songs </div>
    <div>
        <div
            v-for="track in tracks"
            class="group btn-hover-animation flex w-full rounded-lg p-2 pr-4 after:scale-[.98] after:rounded-lg after:bg-green-400"
        >
            <img
                class="mr-4 box-content h-12 w-12 rounded-md border border-black border-opacity-[.03]"
                :src="resizeImage(track.al.picUrl, 'xs')"
                alt="track picture"
            />
            <div class="flex flex-col justify-center">
                <div class="line-clamp-1 break-all text-lg font-semibold text-black dark:text-white">
                    {{ track.name }}
                </div>
                <div class="text-sm text-black dark:text-white">
                    song
                    <span class="mx-1.5">•</span>
                    <ArtistInline :artists="track.ar" class="inline-flex"></ArtistInline>
                </div>
            </div>
        </div>
    </div>

    <!-- Albums info -->
    <div class="mb-3 mt-6 text-xl font-semibold text-black dark:text-white"> Albums </div>
    <div>
        <div
            v-for="album in albums"
            class="group btn-hover-animation flex w-full rounded-lg p-2 pr-4 after:rounded-lg after:bg-green-400"
            @click="
                router.push({
                    name: 'album',
                    params: {
                        id: album.id,
                    },
                })
            "
        >
            <img
                class="mr-4 box-content h-12 w-12 rounded-md border border-black border-opacity-[.03]"
                :src="resizeImage(album.picUrl, 'xs')"
                alt="album picture"
            />
            <div class="flex flex-col justify-center">
                <div class="line-clamp-1 break-all text-lg font-semibold text-black dark:text-white">
                    {{ album.name }}
                </div>
                <div class="text-sm text-black dark:text-white">
                    Album
                    <span class="mx-1.5">•</span>
                    {{ album.artist.name }}
                    <span class="mx-1.5">•</span>
                    {{ dayjs(album.publishTime).year() }}
                </div>
            </div>
        </div>
    </div>

    <!-- Artists info -->
    <div class="mb-3 mt-6 text-xl font-semibold text-black dark:text-white"> Artists </div>
    <div>
        <div
            v-for="artist in artists"
            class="group btn-hover-animation flex w-full rounded-lg p-2 pr-4 after:rounded-lg after:bg-green-400"
            @click="
                router.push({
                    name: 'artist',
                    params: {
                        id: artist.id,
                    },
                })
            "
        >
            <img
                class="mr-4 box-content h-12 w-12 rounded-md border border-black border-opacity-[.03]"
                :src="resizeImage(artist.img1v1Url, 'xs')"
                alt="artist picture"
            />
            <div class="flex flex-col justify-center">
                <div class="line-clamp-1 break-all text-lg font-semibold text-black dark:text-white">
                    {{ artist.name }}
                </div>
                <div class="text-sm text-black dark:text-white"> Artist </div>
            </div>
        </div>
    </div>

    <!-- Playlists info -->
    <div class="mb-3 mt-6 text-xl font-semibold text-black dark:text-white"> Playlists </div>
    <div>
        <div
            v-for="playlist in playlists"
            class="group btn-hover-animation flex w-full rounded-lg p-2 pr-4 after:rounded-lg after:bg-green-400"
            @click="
                router.push({
                    name: 'playlist',
                    params: {
                        id: playlist.id,
                    },
                })
            "
        >
            <img
                class="mr-4 box-content h-12 w-12 rounded-md border border-black border-opacity-[.03]"
                :src="resizeImage(playlist.coverImgUrl || playlist.picUrl || '', 'xs')"
                alt="artist picture"
            />
            <div class="flex flex-col justify-center">
                <div class="line-clamp-1 break-all text-lg font-semibold text-black dark:text-white">
                    {{ playlist.name }}
                </div>
                <div class="text-sm text-black dark:text-white">
                    Playlists
                    <span class="mx-1.5">•</span>
                    {{ playlist.creator.nickname }}
                    <span class="mx-1.5">•</span>
                    {{ playlist.trackCount }}
                    Songs
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { multiMatchSearch, search, SearchApiName, SearchTypes } from '@/api/search'
    import { useUiStore } from '@/stores/ui'
    import { resizeImage } from '@/utils/common'
    import dayjs from 'dayjs'

    const router = useRouter()
    const uiStore = useUiStore()

    const keywords = computed<string>({
        get() {
            return uiStore.searchKeywords
        },
        set(keywords) {
            uiStore.updateSearchKeywords(keywords)
        },
    })

    // 搜索结果
    const {
        data: searchResult,
        isLoading: isSearchLoading,
        refetch: refetchSearch,
    } = useQuery(
        reactive([SearchApiName.SEARCH, keywords]),
        async () => {
            const { data } = await search({
                keywords: keywords.value,
                type: SearchTypes.ALL,
            })
            return data
        },
        reactive({
            enabled: !!keywords,
        }),
    )

    const tracks = computed(() => {
        return searchResult.value?.result?.song?.songs ?? []
    })

    const albums = computed(() => {
        return searchResult.value?.result?.album?.albums ?? []
    })

    const artists = computed(() => {
        return searchResult.value?.result?.artist?.artists ?? []
    })

    const playlists = computed(() => {
        return searchResult.value?.result?.playList?.playLists ?? []
    })

    const users = computed(() => {
        return searchResult.value?.result?.user?.users ?? []
    })

    // 最佳匹配(仅在综合分类中使用)
    const {
        data: multiMatchSearchResult,
        isLoading: isMultiMatchSearchLoading,
        refetch: refetchMultiMatchSearch,
    } = useQuery(
        reactive([SearchApiName.MULTI_MATCH_SEARCH, keywords]),
        async () => {
            const data = await multiMatchSearch({ keywords: keywords.value })
            return data
        },
        reactive({
            enabled: !!keywords,
        }),
    )

    const topResult = computed(() => {
        const searchData = multiMatchSearchResult.value?.data.value?.result
        if (!searchData) {
            return null
        }
        const type = searchData?.orders?.[0] ?? 'artist'

        return {
            item: searchData[type][0],
            type,
        }
    })

    debouncedWatch(
        computed(() => uiStore.searchKeywords),
        () => {
            const newKeywords = uiStore.searchKeywords

            if (newKeywords.trim() === keywords.value.trim()) {
                // 输入空格时不重新搜索
                return
            }

            keywords.value = newKeywords

            console.debug(`[debug] fetch search result (keywords: ${uiStore.searchKeywords})`)

            refetchSearch.value()
            refetchMultiMatchSearch.value()
        },
        {
            debounce: 500,
        },
    )
</script>
