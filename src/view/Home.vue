<template>
    <div>
        <CoverRow
            title="推荐歌单"
            :playlists="recommendedPlaylists?.result.slice(0, 12) ?? []"
            :isSkeleton="isLoadingRecommendedPlaylists"
        ></CoverRow>

        <div class="mt-10 mb-4 text-[28px] font-bold text-black">For You</div>
        <div class="grid grid-cols-2 gap-6">
            <DailyTracksCard></DailyTracksCard>
            <FMCard></FMCard>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router'

    import useRecommendedPlaylists from '@/hooks/useRecommendedPlaylists'

    import CoverRow from '@/components/CoverRow.vue'
    import FMCard from '@/components/FMCard.vue'
    import DailyTracksCard from '@/components/DailyTracksCard.vue'

    const router = useRouter()

    const { data: recommendedPlaylists, isLoading: isLoadingRecommendedPlaylists } = useRecommendedPlaylists()
</script>
