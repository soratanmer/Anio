<template>
    <div class="mt-10">
        <!-- XXX's Library -->
        <div class="grid grid-cols-[17rem_auto] items-center gap-10">
            <!-- Cover -->
            <div class="relative z-0 aspect-square self-start">
                <img
                    v-if="!isLoadingAccount"
                    class="rounded-lg border border-black border-opacity-5"
                    :src="coverUrl"
                    alt="cover"
                />
                <Skeleton v-else class="h-full w-full rounded-lg"></Skeleton>
            </div>

            <!-- User info -->
            <div class="z-10">
                <!-- User name -->
                <div v-if="!isLoadingAccount" class="text-6xl font-bold text-black dark:text-white">
                    {{ userAccount?.profile?.nickname }}
                    <span class="pb-1">的音乐库</span>
                </div>
                <Skeleton v-else class="w-3/4 text-7xl">PLACEHOLDER</Skeleton>

                <!-- User ID -->
                <div v-if="!isLoadingAccount" class="mt-5 text-sm font-thin text-black dark:text-white">
                    ID:
                    <span class="font-semibold decoration-2">
                        {{ userAccount?.profile?.userId }}
                    </span>
                </div>
                <Skeleton v-else class="mt-5 w-64 text-lg">PLACEHOLDER</Skeleton>

                <!-- Create time -->
                <div v-if="!isLoadingAccount" class="mt-5 text-sm font-thin text-black dark:text-white">
                    创建时间: {{ formatDate(Number(userAccount?.profile?.createTime), 'zh-CN') }}
                </div>
                <Skeleton v-else class="mt-5 w-64 text-lg">PLACEHOLDER</Skeleton>

                <!-- Signature -->
                <div v-if="!isLoadingAccount" class="mt-5 text-sm font-thin text-black dark:text-white">
                    {{ userAccount?.profile?.signature }}
                </div>
                <Skeleton v-else class="mt-5 w-64 text-lg">PLACEHOLDER</Skeleton>
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
            subtitle="creator"
            :is-skeleton="isLoadingAccount"
        ></CoverRow>

        <CoverRow
            v-if="activeTab === 'LikedPlaylists'"
            :playlists="userLikedPlaylist || []"
            subtitle="creator"
            :is-skeleton="isLoadingAccount"
        ></CoverRow>

        <CoverRow
            v-if="activeTab === 'albums'"
            v-for="page in likedAlbums?.pages"
            :albums="page.data || []"
            subtitle="artist"
            :is-skeleton="isLoadingLikedAlbums"
        ></CoverRow>

        <CoverRow
            v-if="activeTab === 'artists'"
            v-for="page in likedArtists?.pages"
            :artists="page.data || []"
            :is-skeleton="isLoadingLikedArtists"
        ></CoverRow>
    </div>
</template>

<script setup lang="ts">
    import useFetchUserAccount from '@/hooks/useFetchUserAccount'
    import useFetchUserLikedAlbums from '@/hooks/useFetchUserLikedAlbums'
    import useFetchUserLikedArtist from '@/hooks/useFetchUserLikedArtists'
    import useFetchUserPlayLists from '@/hooks/useFetchUserPlaylists'
    import { formatDate, resizeImage } from '@/utils/common'

    interface Tab {
        name: string
        id: string
    }

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

    const { data: userAccount, isLoading: isLoadingAccount } = useFetchUserAccount()

    const coverUrl = computed(() => {
        return userAccount.value?.profile?.avatarUrl ? resizeImage(userAccount.value?.profile?.avatarUrl, 'sm') : ''
    })

    const { data: userPlaylists, isLoading: isLoadingPlaylists } = useFetchUserPlayLists(
        reactive({
            uid: computed(() => {
                return userAccount.value?.account?.id ?? 0
            }),
            offset: 0,
        }),
    )

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
    } = useFetchUserLikedArtist(
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
    } = useFetchUserLikedAlbums(
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
