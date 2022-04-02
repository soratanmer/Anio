<template>
    <div class="relative h-64 flex overflow-hidden rounded-lg p-4">
        <!-- Background -->
        <img id="background" class="absolute top-0 left-0 w-full blur-lg opacity-75" :src="albumUrl" />

        <!-- cover -->
        <img class="z-10 rounded-lg shadow-2xl" :src="albumUrl" />

        <!-- track info  -->
        <div class="z-10 ml-5 flex w-full flex-col justify-between text-white">
            <div>
                <div class="text-xl font-semibold">{{ trackName }}</div>

                <ArtistInline :artists="(artists as Artist[])"></ArtistInline>
            </div>
            <div class="flex items-center justify-between">
                <!-- buttons -->
                <div>
                    <button
                        class="btn-pressed-animation btn-hover-animation mr-1 cursor-default rounded-lg p-2 transition duration-200 after:bg-white/10"
                        @click=""
                        ><SvgIcon name="dislike" class="h-5 w-5"
                    /></button>
                    <button
                        class="btn-pressed-animation btn-hover-animation mr-1 cursor-default rounded-lg p-2 transition duration-200 after:bg-white/10"
                        @click="play"
                        ><SvgIcon :name="player?.isPersonalFM && player?.isPlaying ? 'pause' : 'play'" class="h-5 w-5"
                    /></button>
                    <button
                        class="btn-pressed-animation btn-hover-animation mr-1 cursor-default rounded-lg p-2 transition duration-200 after:bg-white/10"
                        ><SvgIcon name="next" class="h-5 w-5"
                    /></button>
                </div>

                <!-- fm symbol  -->
                <div class="right-4 bottom-5 flex text-white opacity-20">
                    <SvgIcon name="fm" class="mr-2 h-5 w-5" />
                    <span class="font-semibold">私人FM</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import usePlayer from '@/hooks/usePlayer'
    import { PlaylistSourceType, PlayerMode } from '@/hooks/usePlayer'
    import { resizeImage } from '@/utils/common'

    const player = usePlayer()

    const albumUrl = computed(() => {
        return resizeImage(player?.personalFMTrack?.album.picUrl || '', 'sm')
    })

    const personalFMTrackID = computed(() => {
        return player?.personalFMTrack?.id || 0
    })

    const trackName = computed(() => {
        return player?.personalFMTrack?.name || ''
    })

    const artists = computed(() => {
        return player?.personalFMTrack?.artists || []
    })

    const play = () => {
        player!.mode = PlayerMode.FM
        player?.replacePlaylist([personalFMTrackID.value], {
            type: PlaylistSourceType.FM,
            id: personalFMTrackID.value,
        })
    }
</script>

<style scoped langs="scss">
    @keyframes move {
        0% {
            transform: translateY(0);
        }
        100% {
            transform: translateY(-50%);
        }
    }

    #background {
        animation: move 38s infinite;
        animation-direction: alternate;
    }
</style>
