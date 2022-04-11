<template>
    <div>
        <div class="mt-10 mb-4 text-3xl font-bold text-black dark:text-white">Hi {{ userName }} 今日为你推荐</div>
        <div class="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mt-10 mb-4">
            <FMCard class="col-span-3"></FMCard>
            <DailyTracksCard v-if="isLoggedIn()" class="col-span-1"></DailyTracksCard>
            <NewSongsCard class="col-span-1"></NewSongsCard>
        </div>

        <CoverRow
            title="推荐歌单"
            :playlists="shuffle(recommendedPlaylists?.result).slice(0, 12) ?? []"
            type="playlist"
            :is-skeleton="isFetchingRecommendedPlaylists"
        ></CoverRow>

        <CoverRow
            title="新专速递"
            :albums="newAlbums?.albums ?? []"
            type="album"
            :is-skeleton="isFetchingNewAlbums"
        ></CoverRow>

        <CoverRow
            title="推荐艺人"
            :artists="shuffle(toplistArtists?.list.artists).slice(0, 12) || []"
            type="artist"
            :is-skeleton="isFetchingToplistArtists"
        ></CoverRow>
    </div>
</template>

<script setup lang="ts">
    import { shuffle } from 'lodash'

    import { fetchRecommendedPlaylists } from "@/api/playlist";
    import { fetchNewAlbums } from "@/api/album";
    import { fetchToplistOfArtists } from "@/api/artist";
    import { NewAlbumsArea } from '@/api/album'
    import { ToplistOfArtists } from '@/api/artist'
    import { useUserStore } from '@/stores/user'

    import { isLoggedIn } from '@/utils/user'

    const router = useRouter()
    const userStore = useUserStore()

    const userName = computed(() => {
        return userStore.userAccount?.profile?.nickname
    })

    const { data: recommendedPlaylists, isFetching: isFetchingRecommendedPlaylists } = fetchRecommendedPlaylists(
        reactive({
            limit: 30,
        }),
    )

    const { data: newAlbums, isFetching: isFetchingNewAlbums } = fetchNewAlbums(
        reactive({
            limit: 12,
            offset: 0,
            area: NewAlbumsArea.JP,
        }),
    )

    const { data: toplistArtists, isFetching: isFetchingToplistArtists } = fetchToplistOfArtists(
        reactive({
            type: ToplistOfArtists.JP,
        }),
    )
</script>
