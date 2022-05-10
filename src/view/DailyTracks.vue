<template>
    <div class="grid-layout-col my-10">
        <!-- Cover -->
        <div class="relative col-span-1 aspect-square self-start">
            <img v-if="!isFetchingRecommendTracks" class="rounded-lg" :src="coverUrl" alt="cover" />
            <Skeleton v-else class="h-full w-full rounded-lg"></Skeleton>
        </div>

        <!-- DailyTracks Info -->
        <div class="cols-span flex flex-col justify-between">
            <div v-if="!isFetchingRecommendTracks" class="text-xl"> 每日歌曲推荐 </div>
            <Skeleton v-else class="w-3/4 text-xl">PLACEHOLDER</Skeleton>

            <!-- DailyTracks description -->
            <div v-if="!isFetchingRecommendTracks" class="text-sm">
                根据你的音乐口味生成，每天 6:00 更新
            </div>
            <Skeleton v-else class="text-sm">PLACEHOLDER</Skeleton>

            <!-- Buttons -->
            <div class="flex gap-4">
                <ButtonIcon @click="play">
                    <SvgIcon class="h-5 w-5" name="play"></SvgIcon>
                </ButtonIcon>
            </div>
        </div>
    </div>

    <TrackList
        :tracks="recommendTracks?.data.dailySongs || []"
        layout="list"
        :is-loading="isFetchingRecommendTracks"
    ></TrackList>
</template>

<script setup lang="ts">
    import { fetchDailyRecommendTracks } from '@/api/playlist'
    import usePlayer from '@/hooks/usePlayer'
    import { PlaylistSourceType, PlayerMode } from '@/hooks/usePlayer'
    import { resizeImage } from '@/utils/common'

    const player = usePlayer()

    const { data: recommendTracks, isFetching: isFetchingRecommendTracks } = fetchDailyRecommendTracks()

    const coverUrl = computed(() => {
        return resizeImage(recommendTracks.value?.data.dailySongs[0].al?.picUrl || '', 'md')
    })

    const trackIDs = computed(() => {
        return recommendTracks.value?.data.dailySongs.map((t) => t.id) || []
    })

    const play = () => {
        player!.mode = PlayerMode.PLAYLIST
        player?.replacePlaylist(trackIDs.value, {
            type: PlaylistSourceType.DAILYTRACKS,
            id: PlaylistSourceType.DAILYTRACKS,
        })
    }
</script>
