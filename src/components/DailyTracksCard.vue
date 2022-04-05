<template>
    <div
        v-if="!isLoadingRecommendTracks"
        class="relative h-64 cursor-pointer overflow-hidden rounded-lg group"
        @click="
            router.push({
                name: 'dailyTrack',
            })
        "
    >
        <!-- cover  -->
        <img class="absolute top-0 left-0 h-full w-full" :src="coverUrl" />

        <!-- 每日推荐 -->
        <div class="absolute z-10 text-white text-4xl top-2 right-2">Daily</div>
        <div class="absolute h-32 w-32 bg-blue-500 rounded-full -top-16 -right-16"></div>

        <!-- Play button -->
        <div class="absolute top-0 hidden h-full w-full place-content-center group-hover:grid">
            <button
                class="btn-pressed-animation grid h-11 w-11 cursor-default place-content-center rounded-lg border border-white border-opacity-[.08] bg-white bg-opacity-[.14] text-white backdrop-blur backdrop-filter transition-all hover:bg-opacity-[.44]"
                @click.stop="play"
            >
                <SvgIcon class="ml-1 h-4 w-4 text-black dark:text-white" name="play"></SvgIcon>
            </button>
        </div>
    </div>
    <Skeleton v-else class="relative h-64 rounded-lg"></Skeleton>
</template>

<script setup lang="ts">
    import useFetchRecommendTracks from '@/hooks/useFetchRecommendTracks'
    import usePlayer from '@/hooks/usePlayer'
    import { PlaylistSourceType, PlayerMode } from '@/hooks/usePlayer'
    import { resizeImage } from '@/utils/common'

    const router = useRouter()
    const player = usePlayer()

    const { data: recommendTracks, isLoading: isLoadingRecommendTracks } = useFetchRecommendTracks()

    const coverUrl = computed(() => {
        return resizeImage(recommendTracks.value?.data.dailySongs[0].al?.picUrl || '', 'lg')
    })

    const trackIDs = computed(() => {
        return recommendTracks.value?.data.dailySongs.map((item) => item.id) || []
    })

    const play = () => {
        player!.mode = PlayerMode.PLAYLIST
        player?.replacePlaylist(trackIDs.value, {
            type: PlaylistSourceType.PLAYLIST,
            id: Number(recommendTracks.value?.data.dailySongs[0].id),
        })
    }
</script>
