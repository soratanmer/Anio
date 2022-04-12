<template>
    <div class="grid grid-cols-3 gap-6">
        <!-- cover -->
        <div
            class="relative flex overflow-hidden rounded-lg col-span-1"
            @click="
                router.push({
                    name: 'album',
                    params: {
                        id: player?.personalFMTrack?.album.id,
                    },
                })
            "
        >
            <img class="box-content aspect-square h-full w-full" :src="albumUrl" alt="cover" />
        </div>

        <!-- track info  -->
        <div class="flex flex-col justify-between text-white relative p-4 col-span-2 overflow-hidden rounded-lg">
            <!-- Background -->
            <img class="absolute top-0 left-0 w-full blur opacity-80" :src="albumUrl" alt="cover" />

            <div class="z-10">
                <div class="text-xl font-semibold">{{ trackName }}</div>

                <ArtistInline :artists="artists"></ArtistInline>
            </div>
            <div class="flex items-center justify-between">
                <!-- buttons -->
                <div>
                    <button
                        class="btn-pressed-animation btn-hover-animation mr-1 cursor-default rounded-lg p-2 transition duration-200 after:bg-white/10"
                        @click="player?.moveToFMTrash()"
                        ><SvgIcon name="dislike" class="h-5 w-5"
                    /></button>
                    <button
                        class="btn-pressed-animation btn-hover-animation mr-1 cursor-default rounded-lg p-2 transition duration-200 after:bg-white/10"
                        @click="play"
                        ><SvgIcon :name="player?.isPersonalFM && player?.isPlaying ? 'pause' : 'play'" class="h-5 w-5"
                    /></button>
                    <button
                        class="btn-pressed-animation btn-hover-animation mr-1 cursor-default rounded-lg p-2 transition duration-200 after:bg-white/10"
                        @click="player?.nextTrack()"
                        ><SvgIcon name="next" class="h-5 w-5"
                    /></button>
                </div>

                <!-- fm symbol  -->
                <div class="right-5 bottom-5 flex text-white opacity-60">
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
    const router = useRouter()

    const albumUrl = computed(() => {
        return resizeImage(player?.personalFMTrack?.album?.picUrl || '', 'lg')
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
        if (player?.personalFMTrack?.id !== player?.track?.id) {
            player?.replacePlaylist([personalFMTrackID.value], {
                type: PlaylistSourceType.FM,
                id: PlaylistSourceType.FM,
            })
        } else {
            player?.playOrPause()
        }
    }
</script>
