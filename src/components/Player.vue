<template>
    <div
        id="player"
        class="sticky bottom-0 grid h-16 w-full grid-cols-3 grid-rows-1 bg-opacity-[0.86] py-2.5 px-5 backdrop-blur-xl backdrop-saturate-[1.8]"
    >
        <!-- mock slider -->
        <div class="absolute -top-1 w-full bg-black bg-opacity-5">
            <input
                v-model.number="player!.progress"
                type="range"
                min="0"
                :max="player?.currentTrackDuration"
                class="range-slider absolute w-full"
            />
        </div>

        <!-- Left part -->
        <div class="flex items-center gap-3">
            <!-- Cover -->
            <img
                v-if="cover"
                class="aspect-square h-full rounded-md shadow-md"
                :src="cover"
                alt="Cover"
                @click="player?.goToPlaylistSource()"
            />

            <!-- Cover placeholder -->
            <div
                v-if="player?.track?.id && !cover"
                class="flex aspect-square h-full items-center justify-center rounded-md bg-black/[0.04] shadow-md"
            >
                <SvgIcon class="h-6 w-6 text-gray-300" name="music-note"></SvgIcon>
            </div>

            <div class="flex max-w-full flex-col justify-center leading-tight">
                <!-- Track name -->
                <div v-if="player?.track?.id" class="line-clamp-1 font-semibold">
                    {{ trackName }}
                    <span v-if="player.isTranslate" class="ml-1 opacity-50"> ( {{ player.translate }} )</span>
                </div>

                <!-- Artists -->
                <div v-if="player?.track?.id" class="mt-0.5 text-xs">
                    <ArtistInline :artists="player?.track.ar ?? player?.track?.artists ?? []"></ArtistInline>
                </div>
            </div>

            <ButtonIcon v-show="player?.track?.id" @click="player?.likeTrack()">
                <SvgIcon class="h-4 w-4" :name="player?.isLiked ? 'heart' : 'heart-outline'"></SvgIcon>
            </ButtonIcon>
        </div>

        <!-- Middle part -->
        <div class="flex items-center justify-center gap-2">
            <!-- Previous -->
            <ButtonIcon v-if="!player?.isPersonalFM" :disabled="!player?.track?.id" @click="player?.previousTrack()"
                ><SvgIcon class="h-4 w-4" name="previous"></SvgIcon
            ></ButtonIcon>

            <!-- Dislike -->
            <ButtonIcon v-if="player?.isPersonalFM" :disabled="!player?.track?.id" @click="player?.moveToFMTrash()">
                <SvgIcon class="h-4 w-4" name="dislike"></SvgIcon>
            </ButtonIcon>

            <!-- Play / Pause -->
            <ButtonIcon :disabled="!player?.track?.id" @click="player?.playOrPause()">
                <SvgIcon class="h-5 w-5" :name="player?.isPlaying ? 'pause' : 'play'"></SvgIcon>
            </ButtonIcon>

            <!-- Next -->
            <ButtonIcon :disabled="!player?.track?.id" @click="player?.nextTrack()">
                <SvgIcon class="h-4 w-4" name="next"></SvgIcon>
            </ButtonIcon>
        </div>

        <!-- Right part -->
        <div class="flex items-center justify-end gap-2 pr-2">
            <ButtonIcon :disabled="player?.isPersonalFM" @click="player?.switchRepeatMode()">
                <SvgIcon
                    v-show="player?.repeatMode === RepeatMode.ON || player?.repeatMode === RepeatMode.OFF"
                    class="h-4 w-4"
                    :class="{
                        'opacity-30': player?.isPersonalFM || player?.repeatMode === RepeatMode.OFF,
                    }"
                    name="repeat"
                ></SvgIcon>
                <SvgIcon v-show="player?.repeatMode === RepeatMode.ONE" class="h-4 w-4" name="repeat-1"></SvgIcon>
            </ButtonIcon>
            <ButtonIcon :disabled="player?.isPersonalFM" @click="player?.switchShuffle()">
                <SvgIcon
                    class="h-4 w-4"
                    :class="{
                        'opacity-30': player?.isPersonalFM || !player?.isShuffle,
                    }"
                    name="shuffle"
                ></SvgIcon>
            </ButtonIcon>
            <div class="ml-1 flex items-center">
                <ButtonIcon @click="player?.mute()">
                    <SvgIcon v-show="player?.volume === 0" class="h-4 w-4" name="volume-mute"></SvgIcon>
                    <SvgIcon
                        v-show="player!.volume <= 0.5 && player?.volume !== 0"
                        class="h-4 w-4"
                        name="volume-half"
                    ></SvgIcon>
                    <SvgIcon v-show="player!.volume > 0.5" class="h-4 w-4" name="volume"></SvgIcon>
                </ButtonIcon>
                <div class="flex w-20 items-center">
                    <input
                        v-model.number="player!.volume"
                        type="range"
                        :min="0"
                        :max="1"
                        :step="0.01"
                        class="range-slider w-full"
                    />
                </div>
            </div>
            <ButtonIcon @click="toggleLyrics">
                <SvgIcon class="h-4 w-4" name="arrow-up"></SvgIcon>
            </ButtonIcon>
        </div>
    </div>
</template>

<script setup lang="ts">
    import usePlayer from '@/hooks/usePlayer'
    import { RepeatMode } from '@/hooks/usePlayer'
    import { resizeImage } from '@/utils/common'
    import { useUiStore } from '@/stores/ui'

    const player = usePlayer()
    const uiStore = useUiStore()

    const cover = computed(() => {
        const cover = player?.track?.al?.picUrl || ''
        return cover ? resizeImage(cover, 'sm') : null
    })

    const trackName = computed(() => {
        return player?.track?.name
    })

    const toggleLyrics = () => {
        if (player?.track?.id) {
            uiStore.updateShowLyrics(true)
        }
    }
</script>
