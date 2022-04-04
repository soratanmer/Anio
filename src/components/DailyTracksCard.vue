<template>
    <div
        v-if="!isLoadingRecommendTracks"
        class="relative h-64 cursor-pointer overflow-hidden rounded-lg"
        @click="
            router.push({
                name: 'dailyTrack',
            })
        "
    >
        <!-- cover  -->
        <img class="absolute top-0 left-0 w-full will-change-transform" :src="coverUrl" />

        <!-- 每日推荐 -->
        <div class="absolute flex h-full w-1/2 items-center bg-gradient-to-r from-[#0000004d] to-transparent pl-8">
            <div
                class="grid grid-cols-2 grid-rows-2 gap-2 text-[64px] font-semibold leading-[64px] text-white opacity-[96]"
            >
                <div v-for="word in Array.from('每日推荐')">{{ word }}</div>
            </div>
        </div>

        <!-- play button -->
        <button
            class="btn-pressed-animation absolute right-6 bottom-6 grid h-11 w-11 cursor-default place-content-center rounded-lg border border-white border-opacity-[.08] bg-white bg-opacity-[.14] text-white backdrop-blur backdrop-filter transition-all hover:bg-opacity-[.44]"
            @click.stop="play"
        >
            <SvgIcon name="play" class="ml-1 h-4 w-4 text-green-500" />
        </button>
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

<style scoped langs="scss">
    /* @keyframes move {
        0% {
            transform: translateY(0);
        }
        100% {
            transform: translateY(-50%);
        }
    }

    img {
        animation: move 38s infinite;
        animation-direction: alternate;
    } */
</style>
