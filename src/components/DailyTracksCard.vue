<template>
    <div
        v-if="!isFetchingRecommendTracks"
        class="group relative cursor-pointer overflow-hidden rounded-lg"
        @click="
            router.push({
                name: 'dailyTrack',
            })
        "
    >
        <!-- cover  -->
        <img class="box-content aspect-square h-full w-full" :src="coverUrl" />

        <!-- 每日推荐 -->
        <div class="absolute top-2 right-2 z-10 text-4xl text-white">Daily</div>
        <div class="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-blue-500"></div>

        <!-- Play button -->
        <div class="absolute top-0 hidden h-full w-full place-content-center group-hover:grid">
            <button
                class="btn-pressed-animation grid h-11 w-11 cursor-default place-content-center rounded-lg border border-white border-opacity-[.08] bg-white bg-opacity-[.14] text-white backdrop-blur backdrop-filter transition-all hover:bg-opacity-[.44]"
                @click.stop="play"
            >
                <SvgIcon class="ml-1 h-4 w-4 text-green-500" name="play"></SvgIcon>
            </button>
        </div>
    </div>
    <Skeleton v-else class="relative rounded-lg"></Skeleton>
</template>

<script setup lang="ts">
    import { fetchDailyRecommendTracks } from '@/api/playlist'
    import usePlayer from '@/hooks/usePlayer'
    import { PlaylistSourceType, PlayerMode } from '@/hooks/usePlayer'
    import { resizeImage } from '@/utils/common'

    const router = useRouter()
    const player = usePlayer()

    const { data: recommendTracks, isFetching: isFetchingRecommendTracks } = fetchDailyRecommendTracks()

    const coverUrl = computed(() => {
        return resizeImage(recommendTracks.value?.data.dailySongs[0].al?.picUrl || '', 'lg')
    })

    const trackIDs = computed(() => {
        return recommendTracks.value?.data.dailySongs.map((item) => item.id) || []
    })

    const play = () => {
        player!.mode = PlayerMode.PLAYLIST
        player?.replacePlaylist(trackIDs.value, {
            type: PlaylistSourceType.DAILYTRACKS,
            id: PlaylistSourceType.DAILYTRACKS,
        })
    }
</script>
