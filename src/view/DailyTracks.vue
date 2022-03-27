<template>
    <div class="mt-10">
        <div class="grid grid-cols-[16rem_auto] items-center gap-9">
            <!-- Cover -->
            <div class="relative z-0 aspect-square self-start">
                <div
                    v-if="!isLoadingRecommendTracks"
                    class="absolute top-3.5 z-[-1] h-full w-full scale-x-[.92] scale-y-[.96] rounded-lg bg-cover opacity-40 blur-lg filter"
                    :style="{
                        backgroundImage: `url(&quot;${coverUrl}&quot;)`,
                    }"
                >
                </div>

                <img
                    v-if="!isLoadingRecommendTracks"
                    class="rounded-lg border border-black border-opacity-5"
                    :src="coverUrl"
                    alt="cover"
                />
                <Skeleton v-else class="h-full w-full rounded-lg"></Skeleton>
            </div>

            <!-- DailyTracks Info -->
            <div class="z-10">
                <div v-if="!isLoadingRecommendTracks" class="text-4xl font-bold"> 每日歌曲推荐 </div>
                <Skeleton v-else class="w-3/4 text-4xl">PLACEHOLDER</Skeleton>

                <!-- DailyTracks description -->
                <div v-if="!isLoadingRecommendTracks" class="line-clamp-2 mt-5 min-h-10 text-sm text-gray-500">
                    根据你的音乐口味生成，每天 6:00 更新
                </div>
                <Skeleton v-else class="mt-5 min-h-10 w-1/2 text-sm">PLACEHOLDER</Skeleton>

                <!-- Buttons -->
                <div class="mt-5 flex gap-4">
                    <Button :is-skeleton="isLoadingRecommendTracks" shape="button" @click="play">
                        <SvgIcon class="h-4 w-4" name="play"></SvgIcon>
                    </Button>

                    <Button :is-skeleton="isLoadingRecommendTracks" shape="button" color="gray">
                        <SvgIcon class="h-4 w-4" name="heart"></SvgIcon>
                    </Button>

                    <Button :is-skeleton="isLoadingRecommendTracks" shape="button" color="gray" icon-color="gray">
                        <SvgIcon class="h-4 w-4" name="more"></SvgIcon>
                    </Button>
                </div>
            </div>
        </div>

        <!-- Tracks table header -->
        <div class="ml-2 mr-4 mt-10 mb-2 grid grid-cols-12 border-b border-gary-100 py-2.5 text-sm text-gray-400">
            <div class="col-span-6 grid grid-cols-[4.2rem_auto]">
                <div></div>
                <div>TITLE</div>
            </div>
            <div class="col-span-5">ALBUM</div>
            <div class="col-span-1 text-right justify-end">TIME</div>
        </div>

        <TrackList
            :tracks="recommendTracks?.data.dailySongs || []"
            layout="list"
            :is-loading="isLoadingRecommendTracks"
        ></TrackList>
    </div>
</template>

<script setup lang="ts">
    import usePlayer from '@/hooks/usePlayer'
    import useRecommendTracks from '@/hooks/useRecommendTracks'
    import { resizeImage } from '@/utils/common'

    const { data: recommendTracks, isLoading: isLoadingRecommendTracks } = useRecommendTracks()

    const coverUrl = computed(() => {
        return resizeImage(recommendTracks.value?.data.dailySongs[0].al?.picUrl || '', 'md')
    })

    const trackIDs = computed(() => {
        return recommendTracks.value?.data.dailySongs.map((t) => t.id) || []
    })

    const player = usePlayer()
    const play = () => {
        player?.replacePlaylist(trackIDs.value, {
            type: 'DailyTrack',
            id: 'DailyTrack',
        })
    }
</script>
