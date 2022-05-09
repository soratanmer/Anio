<template>
    <!-- Header -->
    <div class="mt-10 text-2xl">新专速递</div>
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
