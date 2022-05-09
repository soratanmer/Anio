<template>
    <!-- Header -->
    <div class="mt-10 text-2xl">推荐歌单</div>

    <CoverRow
        :playlists="recommendedPlaylists?.result"
        type="playlist"
        :is-skeleton="isFetchingRecommendedPlaylists"
    ></CoverRow>
</template>

<script setup lang="ts">
    import { fetchRecommendedPlaylists } from '@/api/playlist'

    const { data: recommendedPlaylists, isFetching: isFetchingRecommendedPlaylists } = fetchRecommendedPlaylists({
        limit: 100,
    })
</script>
