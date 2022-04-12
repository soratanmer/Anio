<template>
    <!-- Header -->
    <div class="text-2xl font-semibold text-black dark:text-white py-2 px-4 mt-10">新专速递</div>
    <CoverRow
        :albums="newAlbums?.albums ?? []"
        type="album"
        :is-skeleton="isFetchingNewAlbums"
    ></CoverRow>
</template>

<script setup lang="ts">
    import { NewAlbumsArea, fetchNewAlbums } from '@/api/album'

    const { data: newAlbums, isFetching: isFetchingNewAlbums } = fetchNewAlbums({
        limit: 90,
        offset: 0,
        area: NewAlbumsArea.JP,
    })
</script>
