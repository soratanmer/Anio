<template>
    <div
        id="player"
        class="sticky bottom-0 grid h-16 w-full grid-cols-3 grid-rows-1 bg-opacity-[0.86] py-2.5 px-5 backdrop-blur-xl backdrop-saturate-[1.8]"
    >
        <!-- mock slider -->
        <div class="absolute h-[2px] w-full bg-black bg-opacity-5">
            <input
                type="range"
                min="0"
                :max="player?.currentTrackDuration"
                v-model="player.progress"
                class="h-0.5 w-full absolute"
            />
        </div>

        <!-- Left part -->
        <div class="flex items-center gap-3">
            <!-- Cover -->
            <img
                v-if="cover"
                class="aspect-square h-full rounded-md shadow-md"
                @click="
                    router.push({
                        name: 'album',
                        params: {
                            id: player?.playlistSource?.id,
                        },
                    })
                "
                :src="cover"
                alt="Cover"
            />

            <!-- Cover placeholder -->
            <div
                v-if="player?.track?.id && !cover"
                class="flex aspect-square h-full items-center justify-center rounded-md shadow-md bg-black/[0.04]"
            >
                <SvgIcon class="h-6 w-6 text-gray-300" name="music-note"></SvgIcon>
            </div>

            <div class="flex flex-col justify-center leading-tight">
                <!-- Track name -->
                <div v-if="player?.track?.id" class="line-clamp-1 font-semibold text-black dark:text-white">
                    {{ trackName }}
                </div>

                <!-- Artists -->
                <div v-if="player?.track?.id" class="mt-0.5 text-xs text-black dark:text-white">
                    <ArtistInline :artists="player?.track.ar ?? []"></ArtistInline>
                </div>
            </div>

            <ButtonIcon v-show="player?.track?.id" @click="likeTrack">
                <SvgIcon
                    class="h-4 w-4 text-black dark:text-white"
                    :name="isLiked ? 'heart' : 'heart-outline'"
                ></SvgIcon>
            </ButtonIcon>
        </div>

        <!-- Middle part -->
        <div class="flex items-center justify-center gap-2">
            <!-- Previous -->
            <ButtonIcon v-if="!player?.isPersonalFM" :disabled="!player?.track?.id" @click="player?.previousTrack()"
                ><SvgIcon class="h-4 w-4 text-black dark:text-white" name="previous"></SvgIcon
            ></ButtonIcon>

            <!-- Dislike -->
            <ButtonIcon v-if="player?.isPersonalFM" :disabled="!player?.track?.id" @click="player?.moveToFMTrash()">
                <SvgIcon class="h-4 w-4 text-black dark:text-white" name="dislike"></SvgIcon>
            </ButtonIcon>

            <!-- Play / Pause -->
            <ButtonIcon :disabled="!player?.track?.id" @click="player?.playOrPause()">
                <SvgIcon
                    class="h-5 w-5 text-black dark:text-white"
                    :name="player?.isPlaying ? 'pause' : 'play'"
                ></SvgIcon>
            </ButtonIcon>

            <!-- Next -->
            <ButtonIcon :disabled="!player?.track?.id" @click="player?.nextTrack()">
                <SvgIcon class="h-4 w-4 text-black dark:text-white" name="next"></SvgIcon>
            </ButtonIcon>
        </div>

        <!-- Right part -->
        <div class="flex items-center justify-end gap-2 pr-2">
            <ButtonIcon
                :disabled="player?.isPersonalFM || player?.repeatMode === RepeatMode.OFF"
                @click="player?.switchRepeatMode()"
            >
                <SvgIcon
                    v-show="player?.repeatMode === RepeatMode.ON || player?.repeatMode === RepeatMode.OFF"
                    class="h-4 w-4 text-black dark:text-white"
                    name="repeat"
                ></SvgIcon>
                <SvgIcon
                    v-show="player?.repeatMode === RepeatMode.ONE"
                    class="h-4 w-4 text-black dark:text-white"
                    name="repeat-1"
                ></SvgIcon>
            </ButtonIcon>
            <ButtonIcon :disabled="!player?.isShuffle" @click="player?.switchShuffle()">
                <SvgIcon class="h-4 w-4 text-black dark:text-white" name="shuffle"></SvgIcon>
            </ButtonIcon>
            <div class="ml-1 flex items-center">
                <ButtonIcon @click="player?.mute()">
                    <SvgIcon
                        class="h-4 w-4 text-black dark:text-white"
                        :name="player?.isMute ? 'volume-mute' : 'volume'"
                    ></SvgIcon>
                </ButtonIcon>
                <div class="w-20 flex items-center">
                    <input type="range" min="0" max="1" step="0.01" v-model="player.volume" class="h-0.5 w-full">
                </div>
            </div>
            <!-- <ButtonIcon>
                <SvgIcon class="h-4 w-4 text-black dark:text-white" name="arrow-up"></SvgIcon>
            </ButtonIcon> -->
        </div>
    </div>
</template>

<script setup lang="ts">
    import usePlayer from '@/hooks/usePlayer'
    import { RepeatMode } from '@/hooks/usePlayer'
    import useUserLikedSongsIDs from '@/hooks/useFetchUserLikedSongsIDs'
    import useUserAccount from '@/hooks/useFetchUserAccount'
    import { likeATrack } from '@/api/track'
    import { resizeImage } from '@/utils/common'

    const router = useRouter()
    const player = usePlayer()

    // Is track liked by user
    const { data: userAccount } = useUserAccount()

    const { data: userLikedSongs } = useUserLikedSongsIDs({
        uid: userAccount.value?.account?.id ?? 0,
    })

    const isLiked = computed(() => {
        return userLikedSongs.value?.ids.includes(Number(player?.track?.id))
    })

    // Current playing track
    const cover = computed(() => {
        const cover = player?.track?.al?.picUrl || ''
        return cover ? resizeImage(cover, 'sm') : null
    })

    const trackName = computed(() => {
        return player?.track?.name
    })

    const likeTrack = () => {
        likeATrack({
            id: Number(player?.track?.id),
            like: isLiked.value ? false : true,
        })
    }
</script>
