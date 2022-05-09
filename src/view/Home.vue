<template>
    <div>
        <div class="mt-10 text-2xl">Hi {{ userName }} 今日为你推荐</div>
        <div class="grid-layout-col my-6">
            <FMCard class="col-span-3"></FMCard>
            <DailyTracksCard v-if="isLoggedIn()" class="col-span-1"></DailyTracksCard>
            <NewSongsCard class="col-span-1"></NewSongsCard>
        </div>

        <CoverRow
            title="推荐艺人"
            :artists="shuffle(toplistArtists?.list.artists).slice(0, 12)"
            type="artist"
            :is-skeleton="isFetchingToplistArtists"
        ></CoverRow>

        <CoverRow
            title="推荐歌单"
            :playlists="shuffle(recommendedPlaylists?.result).slice(0, 12)"
            type="playlist"
            see-more-link="recommendedPlaylists"
            :is-skeleton="isFetchingRecommendedPlaylists"
        ></CoverRow>

        <CoverRow
            title="精品歌单"
            :playlists="shuffle(hightQualityPlaylists?.playlists).slice(0, 12)"
            type="playlist"
            subtitle="creator"
            see-more-link="hightQualityPlaylists"
            :is-skeleton="isFetchingHighQualityPlaylists"
        ></CoverRow>

        <CoverRow
            title="新专速递"
            :albums="shuffle(newAlbums?.albums).slice(0, 12)"
            type="album"
            see-more-link="newAlbums"
            :is-skeleton="isFetchingNewAlbums"
        ></CoverRow>

        <CoverRow
            title="排行榜"
            :playlists="shuffle(toplists?.list).slice(0, 12)"
            type="playlist"
            see-more-link="toplists"
            :is-skeleton="isFetchingToplists"
        ></CoverRow>
    </div>
</template>

<script setup lang="ts">
    import { shuffle } from 'lodash'

    import { fetchRecommendedPlaylists, fetchHighQualityPlaylist, fetchToplist } from '@/api/playlist'
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

    const { data: recommendedPlaylists, isFetching: isFetchingRecommendedPlaylists } = fetchRecommendedPlaylists({
        limit: 90,
    })

    const { data: newAlbums, isFetching: isFetchingNewAlbums } = fetchNewAlbums({
        limit: 90,
        offset: 0,
        area: settingsStore.area.album,
    })

    const { data: toplistArtists, isFetching: isFetchingToplistArtists } = fetchToplistOfArtists({
        type: settingsStore.area.artist as ToplistOfArtists,
    })

    const { data: toplists, isFetching: isFetchingToplists } = fetchToplist()

    const { data: hightQualityPlaylists, isFetching: isFetchingHighQualityPlaylists } = fetchHighQualityPlaylist({
        cat: '全部',
        limit: 90,
    })
</script>
