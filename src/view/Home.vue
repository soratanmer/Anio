<template>
    <div>
        <div class="mt-10 mb-4 text-3xl font-bold text-black dark:text-white">Hi {{ userName }} 今日为你推荐</div>
        <div class="grid-layout-col mt-10 mb-4">
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
            title="推荐艺人"
            :artists="shuffle(toplistArtists?.list.artists).slice(0, 12) || []"
            type="artist"
            :is-skeleton="isFetchingToplistArtists"
        ></CoverRow>

        <CoverRow
            title="新专速递"
            :albums="newAlbums?.albums ?? []"
            type="album"
            see-more-link="newAlbums"
            :is-skeleton="isFetchingNewAlbums"
        ></CoverRow>
    </div>
</template>

<script setup lang="ts">
    import { shuffle } from 'lodash'

    import { fetchRecommendedPlaylists } from '@/api/playlist'
    import { fetchNewAlbums } from '@/api/album'
    import { fetchToplistOfArtists } from '@/api/artist'
    import { ToplistOfArtists } from '@/api/artist'
    import { useUserStore } from '@/stores/user'
    import { useSettingsStore } from '@/stores/settints'

    import { isLoggedIn } from '@/utils/user'

    const userStore = useUserStore()
    const settingsStore = useSettingsStore()

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
            area: settingsStore.area.album,
        }),
    )

    const { data: toplistArtists, isFetching: isFetchingToplistArtists } = fetchToplistOfArtists(
        reactive({
            type: settingsStore.area.artist as ToplistOfArtists,
        }),
    )
</script>
