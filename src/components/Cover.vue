<template>
    <div class="group relative z-0">
        <!-- The cover -->
        <img
            class="box-content aspect-square h-full w-full rounded-lg border border-black border-opacity-5"
            :src="imageUrl"
            alt="cover"
        />

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
</template>

<script setup lang="ts">
    import usePlayer from '@/hooks/usePlayer'

    const props = defineProps({
        id: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
    })

    const player = usePlayer()

    const play = () => {
        if (props.type === 'playlist') {
            player?.playPlaylistByID(props.id)
        } else if (props.type === 'album') {
            player?.playAlbumByID(props.id)
        } else if (props.type === 'artist') {
            player?.playArtistByID(props.id)
        }
    }
</script>
