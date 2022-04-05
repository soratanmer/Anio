<template>
    <div>
        <div class="mt-10 mb-4 text-3xl font-bold text-black dark:text-white">For You</div>
        <div class="grid grid-cols-6 gap-6 mt-10 mb-4">
            <FMCard class="col-span-3"></FMCard>
            <DailyTracksCard class="col-span-1"></DailyTracksCard>
            <NewSongsCard class="col-span-1"></NewSongsCard>
        </div>

        <CoverRow
            title="推荐歌单"
            :playlists="recommendedPlaylists?.result.slice(0, 12) ?? []"
            :is-skeleton="isLoadingRecommendedPlaylists"
        ></CoverRow>

        <CoverRow
            title="新专速递"
            :albums="newAlbums?.pages[0].albums ?? []"
            :is-skeleton="isLoadingNewAlbums"
        ></CoverRow>

        <CoverRow
            title="推荐艺人"
            :artists="shuffle(toplistArtists?.list.artists).slice(0, 6) || []"
            :is-skeleton="isLoadingToplistArtists"
        ></CoverRow>
    </div>
</template>

<script setup lang="ts">
    import { shuffle } from 'lodash'

    import useFetchRecommendedPlaylists from '@/hooks/useFetchRecommendedPlaylists'
    import useFetchNewAlbums from '@/hooks/useFetchNewAlbums'
    import useFetchToplistArtists from '@/hooks/useFetchToplistArtists'
    import { NewAlbumsArea } from '@/api/album'
    import { ToplistOfArtists } from '@/api/artist'

    const router = useRouter()

    const { data: recommendedPlaylists, isLoading: isLoadingRecommendedPlaylists } = useFetchRecommendedPlaylists(
        reactive({
            limit: 30,
        }),
    )

    const { data: newAlbums, isLoading: isLoadingNewAlbums } = useFetchNewAlbums(
        reactive({
            limit: 12,
            offset: 0,
            area: NewAlbumsArea.JP,
        }),
    )

    const { data: toplistArtists, isLoading: isLoadingToplistArtists } = useFetchToplistArtists(
        reactive({
            type: ToplistOfArtists.JP,
        }),
    )
</script>
