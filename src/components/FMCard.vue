<template>
    <div v-if="!isLoadingPersonalFM" class="relative flex h-[198px] overflow-hidden rounded-2xl p-4 bg-green-500">
        <!-- cover -->
        <img class="rounded-xl shadow-2xl" :src="resizeImage(albumUrl, 'xs')" />

        <!-- track info  -->
        <div class="ml-5 flex w-full flex-col justify-between text-white">
            <div>
                <div class="text-xl font-semibold">{{ trackName }}</div>

                <ArtistInline :artists="(artists as Artist[])"></ArtistInline>
            </div>
            <div class="flex items-center justify-between">
                <!-- buttons -->
                <div>
                    <button
                        v-for="action in ['dislike', 'play', 'next']"
                        class="btn-pressed-animation btn-hover-animation mr-1 cursor-default rounded-lg p-2 transition duration-200 after:bg-white/10"
                        ><SvgIcon :name="action" class="h-5 w-5"
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
    <Skeleton v-else class="relative h-[198px] rounded-2xl"></Skeleton>
</template>

<script setup lang="ts">
    import usePersonalFM from '@/hooks/usePersonalFM'
    import usePlayer from '@/hooks/usePlayer'
    import { resizeImage } from '@/utils/common'

    const { data: personalFM, isLoading: isLoadingPersonalFM } = usePersonalFM()

    const trackIDs = computed(() => {
        return personalFM.value?.data.map((t) => t.id) || []
    })

    const albumUrl = computed(() => {
        return personalFM.value?.data[0].album.picUrl || ''
    })

    const trackName = computed(() => {
        return personalFM.value?.data[0].name || ''
    })

    const artists = computed(() => {
        return personalFM.value?.data[0].artists
    })

    const player = usePlayer()
</script>
