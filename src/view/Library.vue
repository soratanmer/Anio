<template>
    <div class="mt-10">
        <!-- XXX's Library -->
        <div class="grid grid-cols-[17rem_auto] items-center gap-10">
            <!-- Cover -->
            <div class="relative aspect-square self-start">
                <img class="rounded-lg border border-black border-opacity-5" :src="coverUrl" alt="cover" />
            </div>

            <!-- User info -->
            <div>
                <!-- User name -->
                <div class="text-6xl font-bold text-black dark:text-white">
                    {{ userAccount?.profile?.nickname }}
                    <span class="pb-1">的音乐库</span>
                </div>

                <!-- User ID -->
                <div class="mt-5 text-sm font-thin text-black dark:text-white">
                    ID:
                    <span class="font-semibold decoration-2">
                        {{ userAccount?.profile?.userId }}
                    </span>
                </div>

                <!-- Create time -->
                <div class="mt-5 text-sm font-thin text-black dark:text-white">
                    注册时间: {{ formatDate(Number(userAccount?.profile?.createTime), 'zh-CN') }}
                </div>

                <!-- Signature -->
                <div class="mt-5 text-sm font-thin text-black dark:text-white">
                    {{ userAccount?.profile?.signature }}
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="mt-8 mb-4 flex gap-3.5">
            <div
                v-for="tab in tabs"
                class="btn-hover-animation rounded-lg px-3.5 py-1.5 text-lg font-semibold text-black dark:text-white after:bg-green-400"
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
            v-if="activeTab === 'albums'"
            v-for="page in likedAlbums?.pages"
            :albums="page?.data || []"
            type="album"
            subtitle="artist"
            :is-skeleton="isFetchingLikedAlbums"
        ></CoverRow>

        <CoverRow
            v-if="activeTab === 'artists'"
            v-for="page in likedArtists?.pages"
            :artists="page?.data || []"
            type="artist"
            :is-skeleton="isFetchingLikedArtists"
        ></CoverRow>
    </div>
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

    const activeTab = ref<string>('MyPlaylists')

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

    const updateTabs = (tab: Tab) => {
        activeTab.value = tab.id
    }

    const userAccount = computed(() => {
        return userStore.userAccount
    })

    const coverUrl = computed(() => {
        return userAccount.value?.profile?.avatarUrl ? resizeImage(userAccount.value?.profile?.avatarUrl, 'sm') : ''
    })

    const userPlaylists = computed(()=>{
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
            if (!isScrolledToBottom && isFetchingLikedArtists.value && !likedArtistsHasNextPage?.value) {
                return
            } else {
                console.debug('scrolled to bottom, load more tracks!')
                fetchLikedArtistsNextPage.value()
            }

            if (!isScrolledToBottom && isFetchingLikedAlbums.value && !likedAlbumsHasNextPage?.value) {
                return
            } else {
                console.debug('scrolled to bottom, load more tracks!')
                fetchLikedAlbumsNextPage.value()
            }
        },
    )
</script>
