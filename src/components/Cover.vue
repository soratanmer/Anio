<template>
    <div class="group relative z-0">
        <!-- Neon shadow -->
        <div
            class="absolute top-2 z-[-1] h-full w-full scale-x-[.92] scale-y-[.96] rounded-xl bg-cover opacity-0 blur-lg filter transition duration-300 group-hover:opacity-60"
            :style="shadowStyles"
        >
        </div>

        <!-- The cover -->
        <img
            class="box-content aspect-square h-full w-full rounded-xl border border-black border-opacity-5"
            :src="imageUrl"
            alt="cover"
        />

        <!-- Play button -->
        <div class="absolute top-0 hidden h-full w-full place-content-center group-hover:grid">
            <button
                class="btn-pressed-animation grid h-11 w-11 cursor-default place-content-center rounded-full border border-white border-opacity-[.08] bg-white bg-opacity-[.14] text-white backdrop-blur backdrop-filter transition-all hover:bg-opacity-[.44]"
                @click.stop=""
            >
                <SvgIcon class="ml-1 h-4 w-4 text-green-500" name="play"></SvgIcon>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        imageUrl: {
            type: String,
            required: true,
        },
    })

    const shadowStyles = {
        backgroundImage: `url("${props.imageUrl}")`,
    }
</script>
