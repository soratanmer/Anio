<template>
    <div class="grid-layout-col my-10">
        <!-- Cover -->
        <div class="relative col-span-1 aspect-square self-start">
            <img v-if="!isFetchingNewSongs" class="rounded-lg" :src="coverUrl" alt="cover" />
            <Skeleton v-else class="h-full w-full rounded-lg"></Skeleton>
        </div>

        <div class="cols-span flex flex-col justify-between">
            <div v-if="!isFetchingNewSongs" class="text-xl"> 新歌速递 </div>
            <Skeleton v-else class="w-3/4 text-xl">PLACEHOLDER</Skeleton>

            <!-- DailyTracks description -->
            <div v-if="!isFetchingNewSongs" class="text-sm"> 开启最强新歌雷达，为你带来专属新歌能量！ </div>
            <Skeleton v-else class="text-sm">PLACEHOLDER</Skeleton>

            <!-- Buttons -->
            <div class="flex gap-4">
                <ButtonIcon @click="play">
                    <SvgIcon class="h-5 w-5" name="play"></SvgIcon>
                </ButtonIcon>
            </div>
        </div>
    </div>

    <TrackList :tracks="newSongs?.data || []" layout="list" :is-loading="isFetchingNewSongs"></TrackList>
</template>

<script setup lang="ts">
    import { fetchTopSongs } from '@/api/track'
    import usePlayer from '@/hooks/usePlayer'
    import { PlaylistSourceType, PlayerMode } from '@/hooks/usePlayer'
    import { resizeImage } from '@/utils/common'
    import { useSettingsStore } from '@/stores/settints'

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
