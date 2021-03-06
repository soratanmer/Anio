<template>
    <div class="grid grid-cols-3 gap-6">
        <!-- cover -->
        <div
            class="relative col-span-1 flex overflow-hidden rounded-lg"
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
        <div class="relative col-span-2 flex flex-col justify-between overflow-hidden rounded-lg p-4 text-white">
            <!-- Background -->
            <img class="absolute top-0 left-0 w-full opacity-80 blur" :src="albumUrl" alt="cover" />

            <div class="z-10">
                <div class="text-xl font-medium">{{ trackName }}</div>

                <ArtistInline :artists="artists"></ArtistInline>
            </div>
            <div class="flex items-center justify-between">
                <!-- buttons -->
                <div class="flex items-center justify-center gap-2">
                    <ButtonIcon @click="player?.moveToFMTrash()"><SvgIcon name="dislike" class="h-5 w-5" /></ButtonIcon>
                    <ButtonIcon @click="play"
                        ><SvgIcon :name="player?.isPersonalFM && player?.isPlaying ? 'pause' : 'play'" class="h-5 w-5"
                    /></ButtonIcon>
                    <ButtonIcon @click="player?.nextTrack()"><SvgIcon name="next" class="h-5 w-5" /></ButtonIcon>
                </div>

                <!-- fm symbol  -->
                <div class="right-5 bottom-5 flex opacity-60">
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
