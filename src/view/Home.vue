<template>
    <div>
        <CoverRow
            title="推荐歌单"
            :playlists="recommendedPlaylists?.result.slice(0, 12) ?? []"
            :isSkeleton="isLoadingRecommendedPlaylists"
        ></CoverRow>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router'

    import useRecommendedPlaylists from '@/hooks/useRecommendedPlaylists'

    import CoverRow from '@/components/CoverRow.vue'

    const router = useRouter()

    const { data: recommendedPlaylists, isLoading: isLoadingRecommendedPlaylists } = useRecommendedPlaylists()
</script>
