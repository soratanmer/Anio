<template>
    <!-- Header -->
    <div class="mt-10 text-2xl">排行榜</div>

    <CoverRow :playlists="toplists?.list" type="playlist" :is-skeleton="isFetchingToplists"></CoverRow>
</template>
<script setup lang="ts">
    import { fetchToplist } from '@/api/playlist'

    const { data: toplists, isFetching: isFetchingToplists } = fetchToplist()
</script>
