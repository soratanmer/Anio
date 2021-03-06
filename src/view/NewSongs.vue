<template>
    <div class="mt-10">
        <div class="mb-10 grid grid-cols-[16rem_auto] items-center gap-9">
            <!-- Cover -->
            <div class="relative z-0 aspect-square self-start">
                <div
                    v-if="!isFetchingNewSongs"
                    class="absolute top-3.5 z-[-1] h-full w-full scale-x-[.92] scale-y-[.96] rounded-lg bg-cover opacity-40 blur-lg filter"
                    :style="{
                        backgroundImage: `url(&quot;${coverUrl}&quot;)`,
                    }"
                >
                </div>

                <img
                    v-if="!isFetchingNewSongs"
                    class="rounded-lg border border-black border-opacity-5"
                    :src="coverUrl"
                    alt="cover"
                />
                <Skeleton v-else class="h-full w-full rounded-lg"></Skeleton>
            </div>

            <!-- DailyTracks Info -->
            <div class="z-10">
                <div v-if="!isFetchingNewSongs" class="text-4xl font-bold"> 新歌速递 </div>
                <Skeleton v-else class="w-3/4 text-4xl">PLACEHOLDER</Skeleton>

                <!-- DailyTracks description -->
                <div v-if="!isFetchingNewSongs" class="line-clamp-2 min-h-10 mt-5 text-sm">
                    开启最强新歌雷达，为你带来专属新歌能量！
                </div>
                <Skeleton v-else class="min-h-10 mt-5 w-1/2 text-sm">PLACEHOLDER</Skeleton>

                <!-- Buttons -->
                <div class="mt-5 flex gap-4">
                    <ButtonIcon @click="play">
                        <SvgIcon class="h-5 w-5" name="play"></SvgIcon>
                    </ButtonIcon>
                </div>
            </div>
        </div>

        <TrackList :tracks="newSongs?.data || []" layout="list" :is-loading="isFetchingNewSongs"></TrackList>
    </div>
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
