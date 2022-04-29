<template>
    <div class="mt-10">
        <div class="mb-10 grid grid-cols-[16rem_auto] items-center gap-9">
            <!-- Cover -->
            <div class="relative z-0 aspect-square self-start">
                <div
                    v-if="!isFetchingRecommendTracks"
                    class="absolute top-3.5 z-[-1] h-full w-full scale-x-[.92] scale-y-[.96] rounded-lg bg-cover opacity-40 blur-lg filter"
                    :style="{
                        backgroundImage: `url(&quot;${coverUrl}&quot;)`,
                    }"
                >
                </div>

                <img
                    v-if="!isFetchingRecommendTracks"
                    class="rounded-lg border border-black border-opacity-5"
                    :src="coverUrl"
                    alt="cover"
                />
                <Skeleton v-else class="h-full w-full rounded-lg"></Skeleton>
            </div>

            <!-- DailyTracks Info -->
            <div class="z-10">
                <div v-if="!isFetchingRecommendTracks" class="text-4xl font-bold text-black dark:text-white">
                    每日歌曲推荐
                </div>
                <Skeleton v-else class="w-3/4 text-4xl">PLACEHOLDER</Skeleton>

                <!-- DailyTracks description -->
                <div
                    v-if="!isFetchingRecommendTracks"
                    class="line-clamp-2 min-h-10 mt-5 text-sm text-black dark:text-white"
                >
                    根据你的音乐口味生成，每天 6:00 更新
                </div>
                <Skeleton v-else class="min-h-10 mt-5 w-1/2 text-sm">PLACEHOLDER</Skeleton>

                <!-- Buttons -->
                <div class="mt-5 flex gap-4">
                    <ButtonIcon @click="play">
                        <SvgIcon class="h-5 w-5 text-black dark:text-white" name="play"></SvgIcon>
                    </ButtonIcon>
                </div>
            </div>
        </div>

        <TrackList
            :tracks="recommendTracks?.data.dailySongs || []"
            layout="list"
            :is-loading="isFetchingRecommendTracks"
        ></TrackList>
    </div>
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
