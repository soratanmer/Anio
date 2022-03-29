<template>
    <div v-if="!isLoadingPersonalFM" class="relative h-64 flex overflow-hidden rounded-lg p-4" :style="{ background }">
        <!-- cover -->
        <img class="rounded-lg shadow-2xl" :src="albumUrl" />

        <!-- track info  -->
        <div class="ml-5 flex w-full flex-col justify-between text-white">
            <div v-if="!isLoadingPersonalFM">
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
                        ><SvgIcon name="play" class="h-5 w-5"
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
    <Skeleton v-else class="relative h-64 rounded-lg"></Skeleton>
</template>

<script setup lang="ts">
    import usePersonalFM from '@/hooks/usePersonalFM'
    import usePlayer from '@/utils/player'
    import { resizeImage } from '@/utils/common'
    import { average } from 'color.js'
    import { colord } from 'colord'

    const { data: personalFM, isLoading: isLoadingPersonalFM, isFetching: isFetchingPersonalFM } = usePersonalFM()

    const background = ref<string>('')

    const albumUrl = computed(() => {
        return resizeImage(personalFM.value?.data[0].album.picUrl || '', 'sm')
    })

    watch(isLoadingPersonalFM, () => {
        average(albumUrl.value, { amount: 1, format: 'hex', sample: 1 }).then((color) => {
            const to = colord(color as string)
                .darken(0.15)
                .rotate(-5)
                .toHex()
            background.value = `linear-gradient(to bottom right, ${color}, ${to})`
        })
    })

    const trackName = computed(() => {
        return personalFM.value?.data[0].name || ''
    })

    const artists = computed(() => {
        return personalFM.value?.data[0].artists
    })

    const player = usePlayer()
</script>
