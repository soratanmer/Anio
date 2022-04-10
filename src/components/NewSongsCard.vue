<template>
    <div
        v-if="!isFetchingNewSongs"
        class="relative cursor-pointer overflow-hidden rounded-lg group"
        @click="
            router.push({
                name: 'newSongs',
            })
        "
    >
        <!-- Cover -->
        <img class="box-content aspect-square h-full w-full" :src="coverUrl" alt="cover" />

        <!-- 新歌速递 -->
        <div class="absolute z-10 text-white text-4xl top-2 left-2">New</div>
        <div class="absolute h-32 w-32 bg-green-500 rounded-full -top-16 -left-16"></div>

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
    import { fetchTopSongs, TopSongsType } from '@/api/track'
    import usePlayer from '@/hooks/usePlayer'
    import { PlaylistSourceType, PlayerMode } from '@/hooks/usePlayer'
    import { resizeImage } from '@/utils/common'

    const router = useRouter()
    const player = usePlayer()

    const { data: newSongs, isFetching: isFetchingNewSongs } = fetchTopSongs(
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
