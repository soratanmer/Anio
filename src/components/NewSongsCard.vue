<template>
    <div
        v-if="!isLoadingNewSongs"
        class="relative h-64 cursor-pointer overflow-hidden rounded-lg"
        @click="
            router.push({
                name: 'newSongs',
            })
        "
    >
        <!-- Cover -->
        <img class="absolute top-0 left-0 w-full" :src="coverUrl" alt="cover" />

        <!-- 新歌速递 -->
        <div class="absolute flex h-full w-1/2 items-center bg-gradient-to-r from-[#0000004d] to-transparent pl-8">
            <div
                class="grid grid-cols-2 grid-rows-2 gap-2 text-[64px] font-semibold leading-[64px] text-white opacity-[96]"
            >
                <div v-for="word in Array.from('新歌速递')">{{ word }}</div>
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
    import useFetchTopSongs from '@/hooks/useFetchTopSongs'
    import usePlayer from '@/hooks/usePlayer'
    import { PlaylistSourceType, PlayerMode } from '@/hooks/usePlayer'
    import { TopSongsType } from '@/api/track'
    import { resizeImage } from '@/utils/common'

    const router = useRouter()
    const player = usePlayer()

    const { data: newSongs, isLoading: isLoadingNewSongs } = useFetchTopSongs(
        reactive({
            type: TopSongsType.JP,
        }),
    )

    const coverUrl = computed(() => {
        return resizeImage(newSongs.value?.data[0].album.picUrl || '', 'lg')
    })

    const trackIDs = computed(() => {
        return newSongs.value?.data.map((item) => item.id) || []
    })

    const play = () => {
        player!.mode = PlayerMode.PLAYLIST
        player?.replacePlaylist(trackIDs.value, {
            type: PlaylistSourceType.PLAYLIST,
            id: Number(newSongs.value?.data[0].id),
        })
    }
</script>
