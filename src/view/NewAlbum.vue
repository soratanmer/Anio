<template>
    <!-- Header -->
    <div class="text-2xl font-semibold text-black dark:text-white py-2 px-4 mt-10">新专速递</div>
    <CoverRow :albums="newAlbums?.albums ?? []" type="album" :is-skeleton="isFetchingNewAlbums"></CoverRow>
</template>

<script setup lang="ts">
    import { fetchNewAlbums } from '@/api/album'
    import { useSettingsStore } from '@/stores/settints'

    const settingsStore = useSettingsStore()

    const { data: newAlbums, isFetching: isFetchingNewAlbums } = fetchNewAlbums({
        limit: 90,
        offset: 0,
        area: settingsStore.area.album,
    })
</script>
