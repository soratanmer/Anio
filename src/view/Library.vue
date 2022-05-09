<template>
    <!-- XXX's Library -->
    <div class="grid-layout-col my-10">
        <!-- Cover -->
        <div class="relative col-span-1 aspect-square self-start">
            <img class="rounded-lg" :src="coverUrl" alt="cover" />
        </div>

        <!-- User info -->
        <div class="cols-span flex flex-col justify-around">
            <!-- User name -->
            <div class="text-3xl font-bold">
                {{ userAccount?.profile?.nickname }}
            </div>

            <!-- User ID -->
            <div class="text-sm font-thin">
                ID:
                <span class="font-semibold decoration-2">
                    {{ userAccount?.profile?.userId }}
                </span>
            </div>

            <!-- Create time -->
            <div class="text-sm font-thin">
                注册时间: {{ formatDate(Number(userAccount?.profile?.createTime), 'zh-CN') }}
            </div>

            <!-- Signature -->
            <div class="text-sm font-thin">
                {{ userAccount?.profile?.signature }}
            </div>
        </div>
    </div>

    <!-- Tabs -->
    <div class="mb-5 flex gap-3.5">
        <div
            v-for="tab in tabs"
            class="btn-hover-animation rounded-lg px-3.5 py-1.5 text-lg font-semibold text-black after:bg-green-400 dark:text-white"
            :class="{
                'bg-green-500': tab.id === activeTab,
            }"
            @click="updateTabs(tab)"
        >
            {{ tab.name }}
        </div>
    </div>

    <!-- Playlist tab content -->
    <CoverRow
        v-if="activeTab === 'MyPlaylists'"
        :playlists="userCreatePlaylist || []"
        type="playlist"
        subtitle="creator"
    ></CoverRow>

    <CoverRow
        v-if="activeTab === 'LikedPlaylists'"
        :playlists="userLikedPlaylist || []"
        type="playlist"
        subtitle="creator"
    ></CoverRow>

    <CoverRow
        v-for="page in likedAlbums?.pages"
        v-if="activeTab === 'albums'"
        :albums="page?.data || []"
        type="album"
        subtitle="artist"
        :is-skeleton="isLoadingLikedAlbums"
    ></CoverRow>

    <CoverRow
        v-for="page in likedArtists?.pages"
        v-if="activeTab === 'artists'"
        :artists="page?.data || []"
        type="artist"
        :is-skeleton="isLoadingLikedArtists"
    ></CoverRow>
</template>

<script setup lang="ts">
    import useFetchUserLikedAlbumsInfinite from '@/hooks/useFetchUserLikedAlbumsInfinite'
    import useFetchUserLikedArtistsInfinite from '@/hooks/useFetchUserLikedArtistsInfinite'
    import { formatDate, resizeImage } from '@/utils/common'
    import { useUserStore } from '@/stores/user'

    interface Tab {
        name: string
        id: string
    }

    const userStore = useUserStore()

    const tabs: Tab[] = [
        {
            name: '创建的歌单',
            id: 'MyPlaylists',
        },
        {
            name: '收藏的歌单',
            id: 'LikedPlaylists',
        },
        {
            name: '收藏的专辑',
            id: 'albums',
        },
        {
            name: '收藏的歌手',
            id: 'artists',
        },
    ]

    const activeTab = ref<string>('MyPlaylists')

    const updateTabs = (tab: Tab) => {
        activeTab.value = tab.id
    }

    const userAccount = computed(() => {
        return userStore.userAccount
    })

    const coverUrl = computed(() => {
        return userAccount.value?.profile?.avatarUrl ? resizeImage(userAccount.value?.profile?.avatarUrl, 'sm') : ''
    })

    const userPlaylists = computed(() => {
        return userStore.userPlaylists
    })

    const userCreatePlaylist = computed(() => {
        return userPlaylists.value?.playlist.filter((item) => {
            return item.creator.userId === userAccount.value?.profile?.userId
        })
    })

    const userLikedPlaylist = computed(() => {
        return userPlaylists.value?.playlist.filter((item) => {
            return item.creator.userId !== userAccount.value?.profile?.userId
        })
    })

    const {
        data: likedArtists,
        isLoading: isLoadingLikedArtists,
        isFetching: isFetchingLikedArtists,
        hasNextPage: likedArtistsHasNextPage,
        fetchNextPage: fetchLikedArtistsNextPage,
    } = useFetchUserLikedArtistsInfinite(
        reactive({
            limit: 90,
        }),
    )

    const {
        data: likedAlbums,
        isLoading: isLoadingLikedAlbums,
        isFetching: isFetchingLikedAlbums,
        hasNextPage: likedAlbumsHasNextPage,
        fetchNextPage: fetchLikedAlbumsNextPage,
    } = useFetchUserLikedAlbumsInfinite(
        reactive({
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
                if (isFetchingLikedArtists.value) {
                    return
                } else if (likedArtistsHasNextPage?.value && activeTab.value === 'artists') {
                    console.debug('scrolled to bottom, load more tracks!')
                    fetchLikedArtistsNextPage.value()
                }

                if (isFetchingLikedAlbums.value) {
                    return
                } else if (likedAlbumsHasNextPage?.value && activeTab.value === 'albums') {
                    console.debug('scrolled to bottom, load more tracks!')
                    fetchLikedAlbumsNextPage.value()
                }
            }
        },
    )
</script>
