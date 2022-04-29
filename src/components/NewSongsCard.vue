<template>
    <div
        v-if="!isFetchingNewSongs"
        class="group relative cursor-pointer overflow-hidden rounded-lg"
        @click="
            router.push({
                name: 'newSongs',
            })
        "
    >
        <!-- Cover -->
        <img class="box-content aspect-square h-full w-full" :src="coverUrl" alt="cover" />

        <!-- 新歌速递 -->
        <div class="absolute top-2 left-2 z-10 text-4xl text-white">New</div>
        <div class="absolute -top-16 -left-16 h-32 w-32 rounded-full bg-green-500"></div>

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
    import { fetchTopSongs } from '@/api/track'
    import usePlayer from '@/hooks/usePlayer'
    import { PlaylistSourceType, PlayerMode } from '@/hooks/usePlayer'
    import { resizeImage } from '@/utils/common'
    import { useSettingsStore } from '@/stores/settints'

    const router = useRouter()
    const player = usePlayer()
    const settingsStore = useSettingsStore()

    const { data: newSongs, isFetching: isFetchingNewSongs } = fetchTopSongs(
        reactive({
            type: settingsStore.area.track,
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
            type: PlaylistSourceType.NEWSONGS,
            id: PlaylistSourceType.NEWSONGS,
        })
    }
</script>
