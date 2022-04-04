<template>
    <div>
        <div class="mt-10 mb-4 text-3xl font-bold text-black dark:text-white">For You</div>
        <div class="grid grid-cols-6 gap-6">
            <FMCard class="col-span-2"></FMCard>
            <DailyTracksCard class="col-span-2"></DailyTracksCard>
            <NewSongsCard class="col-span-2"></NewSongsCard>
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
