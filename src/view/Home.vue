<template>
    <div>
        <div class="mt-10 mb-4 text-3xl font-bold text-black dark:text-white">For You</div>
        <div class="grid grid-cols-2 gap-6">
            <FMCard></FMCard>
            <DailyTracksCard></DailyTracksCard>
        </div>

        <CoverRow
            title="推荐歌单"
            :playlists="recommendedPlaylists?.result.slice(0, 12) ?? []"
            :is-skeleton="isLoadingRecommendedPlaylists"
        ></CoverRow>
    </div>
</template>

<script setup lang="ts">
    import useFetchRecommendedPlaylists from '@/hooks/useFetchRecommendedPlaylists'

    const router = useRouter()

    const { data: recommendedPlaylists, isLoading: isLoadingRecommendedPlaylists } = useFetchRecommendedPlaylists(
        reactive({
            limit: 30,
        }),
    )
</script>
