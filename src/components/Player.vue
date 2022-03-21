<template>
    <div
        id="player"
        class="sticky bottom-0 grid h-16 w-full grid-cols-3 grid-rows-1 bg-white bg-opacity-[0.86] py-2.5 px-5 backdrop-blur-xl backdrop-saturate-[1.8]"
    >
        <!-- mock slider -->
        <div class="absolute h-[2px] w-full bg-black bg-opacity-5"></div>

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
                v-if="player?.track && !cover"
                class="flex aspect-square h-full items-center justify-center rounded-md shadow-md bg-black/[0.04]"
            >
                <SvgIcon class="h-6 w-6 text-gray-300" name="music-note"></SvgIcon>
            </div>

            <div class="flex flex-col justify-center leading-tight">
                <!-- Track name -->
                <div v-if="player?.track" class="line-clamp-1 font-semibold text-black"> {{ trackName }} </div>

                <!-- Artists -->
                <div v-if="player?.track" class="mt-0.5 text-xs text-gray-500">
                    <ArtistInline :artists="player.track.ar ?? []"></ArtistInline>
                </div>
            </div>

            <ButtonIcon v-show="player?.track">
                <SvgIcon class="h-4 w-4 text-black" :name="isLiked ? 'heart' : 'heart-outline'"></SvgIcon>
            </ButtonIcon>
        </div>

        <!-- Middle part -->
        <div class="flex items-center justify-center gap-2">
            <!-- Previous -->
            <ButtonIcon :disabled="!player?.track" @click="player?.previousTrack"
                ><SvgIcon class="h-4 w-4 text-black" name="previous"></SvgIcon
            ></ButtonIcon>

            <!-- Play / Pause -->
            <ButtonIcon :disabled="!player?.track" @click="player?.playOrPause">
                <SvgIcon class="h-5 w-5 text-black" :name="player?.state === 'playing' ? 'pause' : 'play'"></SvgIcon>
            </ButtonIcon>

            <!-- Next -->
            <ButtonIcon :disabled="!player?.track" @click="player?.nextTrack">
                <SvgIcon class="h-4 w-4 text-black" name="next"></SvgIcon>
            </ButtonIcon>
        </div>

        <!-- Right part -->
        <div class="flex items-center justify-end gap-2 pr-2">
            <ButtonIcon>
                <SvgIcon class="h-4 w-4 text-black" name="repeat"></SvgIcon>
            </ButtonIcon>
            <ButtonIcon>
                <SvgIcon class="h-4 w-4 text-black" name="shuffle"></SvgIcon>
            </ButtonIcon>
            <ButtonIcon>
                <SvgIcon class="h-4 w-4 text-black" name="volume"></SvgIcon>
            </ButtonIcon>
            <ButtonIcon>
                <SvgIcon class="h-4 w-4 text-black" name="arrow-up"></SvgIcon>
            </ButtonIcon>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue'
    import { useRouter } from 'vue-router'

    import usePlayer from '@/hooks/usePlayer'
    import { resizeImage } from '@/utils/common'
    import useUserLikedSongsIDs from '@/hooks/useUserLikedSongsIDs'
    import useUserAccount from '@/hooks/useUserAccount'

    import ArtistInline from '@/components/ArtistInline.vue'
    import ButtonIcon from './ButtonIcon.vue'
    import SvgIcon from './SvgIcon.vue'

    const router = useRouter()
    const player = usePlayer()

    // Current playing track
    const cover = computed(() => {
        const cover = player?.track?.al.picUrl
        return cover ? resizeImage(cover, 'sm') : null
    })

    const trackName = computed(() => {
        return player?.track?.name
    })

    // Is track liked by user
    const { data: userAccount } = useUserAccount()
    const uid = computed(() => {
        return userAccount.value?.account?.id ?? 0
    })

    const { data: userLikedSongs } = useUserLikedSongsIDs({
        uid: uid.value,
    })

    const isLiked = computed(() => {
        return userLikedSongs.value?.ids.includes(Number(player?.track?.id))
    })
</script>
