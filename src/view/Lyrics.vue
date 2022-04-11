<template>
    <transition name="slide-up">
        <!-- lyrics page -->
        <div class="fixed top-0 right-0 left-0 bottom-0 z-50 flex bg-gray-100">
            <!-- Background -->
            <div class="absolute h-screen w-screen blur-3xl contrast-75 brightness-125">
                <div
                    class="z-0 w-[140vw] h-[140vw] opacity-60 absolute bg-cover right-0 top-0 mix-blend-luminosity"
                    :style="{ backgroundImage: `url(${coverURL})` }"
                ></div>
                <div
                    class="z-0 w-[140vw] h-[140vw] opacity-60 absolute bg-cover left-0 bottom-0"
                    :style="{ backgroundImage: `url(${coverURL})` }"
                ></div>
            </div>

            <!-- Left part -->
            <div
                class="z-10 flex flex-1 items-center justify-end transition-all duration-500"
                :class="{
                    'translate-x-[27vh]': noLyric,
                }"
            >
                <div>
                    <!-- Cover -->
                    <div class="relative">
                        <img
                            class="rounded-lg h-[50vh] w-[50vh] select-none object-cover"
                            :src="coverURL"
                            alt="cover"
                        />
                    </div>

                    <!-- Controls -->
                    <div class="max-w-[50vh] mt-6 text-black dark:text-white">
                        <!-- Top part -->
                        <div class="flex justify-between items-center">
                            <!-- Track info -->
                            <div>
                                <!-- Title -->
                                <div class="mt-2 text-2xl font-semibold line-clamp-1 overflow-hidden">{{
                                    player?.track?.name
                                }}</div>
                                <!-- Subtitle -->
                                <div class="mt-1 text-base line-clamp-1 overflow-hidden">
                                    <span>{{ artist }}</span> - <span>{{ album?.name }}</span>
                                </div>
                            </div>
                            <!-- Liked -->
                            <ButtonIcon class="flex items-center ml-1">
                                <SvgIcon class="h-4 w-4 text-black dark:text-white" name="heart"></SvgIcon>
                            </ButtonIcon>
                        </div>

                        <!-- Progress -->
                        <div class="mt-6 flex items-center justify-between">
                            <span class="min-w-7">{{ formatTrackTime(player?.progress) }}</span>
                            <div class="grow px-2 w-full">
                                <!-- <input
                                type="range"
                                min="0"
                                :max="player?.currentTrackDuration"
                                v-model.number="player!.progress"
                                class="range-slider w-full absolute"
                            /> -->
                            </div>
                            <span class="min-w-7">{{ formatTrackTime(player?.currentTrackDuration) }}</span>
                        </div>

                        <!-- Media controls -->
                        <div class="flex justify-center items-center mt-5">
                            <!-- Repeat mode -->
                            <ButtonIcon :disabled="player?.isPersonalFM" @click="player?.switchRepeatMode()">
                                <SvgIcon
                                    v-show="
                                        player?.repeatMode === RepeatMode.ON || player?.repeatMode === RepeatMode.OFF
                                    "
                                    class="h-4 w-4 text-black dark:text-white"
                                    :class="{
                                        'opacity-30': player?.isPersonalFM || player?.repeatMode === RepeatMode.OFF,
                                    }"
                                    name="repeat"
                                ></SvgIcon>
                                <SvgIcon
                                    v-show="player?.repeatMode === RepeatMode.ONE"
                                    class="h-4 w-4 text-black dark:text-white"
                                    name="repeat-1"
                                ></SvgIcon>
                            </ButtonIcon>

                            <!-- Middle -->
                            <div class="flex items-center px-4">
                                <!-- Previous -->
                                <ButtonIcon
                                    v-if="!player?.isPersonalFM"
                                    class="mx-2"
                                    :disabled="!player?.track?.id"
                                    @click="player?.previousTrack()"
                                    ><SvgIcon class="h-4 w-4 text-black dark:text-white" name="previous"></SvgIcon
                                ></ButtonIcon>

                                <!-- Dislike -->
                                <ButtonIcon
                                    v-if="player?.isPersonalFM"
                                    class="mx-2"
                                    :disabled="!player?.track?.id"
                                    @click="player?.moveToFMTrash()"
                                >
                                    <SvgIcon class="h-4 w-4 text-black dark:text-white" name="dislike"></SvgIcon>
                                </ButtonIcon>

                                <!-- Play / Pause -->
                                <ButtonIcon class="mx-2" :disabled="!player?.track?.id" @click="player?.playOrPause()">
                                    <SvgIcon
                                        class="h-7 w-7 text-black dark:text-white"
                                        :name="player?.isPlaying ? 'pause' : 'play'"
                                    ></SvgIcon>
                                </ButtonIcon>

                                <!-- Next -->
                                <ButtonIcon class="mx-2" :disabled="!player?.track?.id" @click="player?.nextTrack()">
                                    <SvgIcon class="h-4 w-4 text-black dark:text-white" name="next"></SvgIcon>
                                </ButtonIcon>
                            </div>

                            <!-- Shuffle -->
                            <ButtonIcon :disabled="player?.isPersonalFM" @click="player?.switchShuffle()">
                                <SvgIcon
                                    class="h-4 w-4 text-black dark:text-white"
                                    :class="{
                                        'opacity-30': player?.isPersonalFM || !player?.isShuffle,
                                    }"
                                    name="shuffle"
                                ></SvgIcon>
                            </ButtonIcon>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right page -->
            <div class="flex flex-1 font-semibold mr-6 z-0">
                <transition name="slide-fade">
                    <div
                        v-show="!noLyric"
                        class="text-2xl h-full flex pl-20 flex-col max-w-lg overflow-y-auto duration-500"
                        ref="lyricsContainer"
                    >
                        <div class="mt-[50vh]"></div>
                        <div
                            v-for="(line, index) in lyricWithTranslation"
                            class="p-4 duration-200 rounded-lg hover:bg-gray-200/50"
                            :id="`line${index}`"
                            @click="clickLyricLine(line.time)"
                            @dblclick="clickLyricLine(line.time, true)"
                        >
                            <span
                                v-html="formatLine(line)"
                                class="opacity-30 cursor-default text-black dark:text-white"
                                :class="{
                                    'opacity-95': highlightLyricIndex === index,
                                }"
                            ></span>
                        </div>
                        <div class="mb-[50vh]"></div>
                    </div>
                </transition>
            </div>

            <!-- Close button -->
            <div class="fixed top-6 right-6 z-50" @click="toggleLyrics">
                <ButtonIcon>
                    <SvgIcon class="h-4 w-4 text-black dark:text-white" name="arrow-down"></SvgIcon>
                </ButtonIcon>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
    import { parseLyric } from '@/utils/lyrics'
    import usePlayer from '@/hooks/usePlayer'
    import { RepeatMode } from '@/hooks/usePlayer'
    import { resizeImage, formatTrackTime } from '@/utils/common'
    import { fetchLyric } from '@/api/track'
    import { useUiStore } from '@/stores/ui'

    interface LyricItem {
        time: number
        content: string
        contents: string[]
    }

    const player = usePlayer()
    const uiStore = useUiStore()

    const lyricsInterval = ref<ReturnType<typeof setInterval> | undefined>(undefined)
    const highlightLyricIndex = ref(1)
    const minimize = ref<boolean>(true)

    const showLyrics = computed<boolean>({
        get() {
            return uiStore.showLyrics
        },
        set(value) {
            uiStore.updateShowLyrics(value)
        },
    })

    const toggleLyrics = () => {
        showLyrics.value = !showLyrics.value
    }

    const trackID = computed(() => {
        return player?.track?.id || 0
    })

    const { data: lyricRaw, isFetching: isFetchingLyric } = fetchLyric({
        id: trackID.value,
    })

    const lyrics = computed(() => {
        return parseLyric(lyricRaw.value?.lrc.lyric || '')
    })

    const tlyrics = computed(() => {
        return parseLyric(lyricRaw.value?.tlyric.lyric || '')
    })

    const noLyric = computed(() => {
        return lyrics.value.length === 0
    })

    const coverURL = computed(() => {
        return resizeImage(player?.track?.al?.picUrl || player?.track?.album.picUrl || '', 'lg')
    })

    const artist = computed(() => {
        return player?.track?.ar[0].name || player?.track?.artists[0].name || ''
    })

    const album = computed(() => {
        return player?.track?.al || player?.track?.album
    })

    const lyricWithTranslation = computed(() => {
        let ret: LyricItem[] = []

        // 去除空内容
        const lyricFiltered = lyrics.value.filter(({ content }) => Boolean(content))

        // content 统一转换为数组形式
        if (lyricFiltered.length) {
            lyricFiltered.forEach((l) => {
                const { rawTime, time, content } = l
                const lyricItem: LyricItem = {
                    time,
                    content,
                    contents: [content],
                }
                const sameTimeLyric = tlyrics.value.find(({ rawTime: tlyricRawTime }) => rawTime === tlyricRawTime)

                if (sameTimeLyric) {
                    const { content: tlyricContent } = sameTimeLyric
                    if (content) {
                        lyricItem.contents.push(tlyricContent)
                    }
                }
                ret.push(lyricItem)
            })
        } else {
            ret = lyricFiltered.map(({ time, content }) => ({ time, content, contents: [content] }))
        }
        return ret
    })

    const clickLyricLine = (value: number, startPlay = false) => {
        player!.progress = value
        if (startPlay === true && player?.isPlaying === false) {
            player?.play()
        }
    }

    const setLyricsInterval = () => {
        lyricsInterval.value = setInterval(() => {
            let oldHighlightLyricIndex = highlightLyricIndex.value
            highlightLyricIndex.value = lyrics.value.findIndex((l, index) => {
                const nextLyric = lyrics.value[index + 1]
                return player!.progress >= l.time && (nextLyric ? player!.progress < nextLyric.time : true)
            })
            if (oldHighlightLyricIndex !== highlightLyricIndex.value) {
                const el = document.getElementById(`line${highlightLyricIndex.value}`)
                if (el) {
                    el.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                    })
                }
            }
        }, 10)
    }

    const formatLine = (line: LyricItem) => {
        if (line.contents[1]) {
            return `${line.contents[0]}<br/>${line.contents[1]}`
        } else if (line.contents[0] !== undefined) {
            return `${line.contents[0]}`
        }
        return 'unknown'
    }

    // watch(showLyrics, (show) => {
    //     if (show) {
    //         setLyricsInterval()
    //     } else {
    //         clearInterval(lyricsInterval.value)
    //     }
    // })

    setLyricsInterval()

    onUnmounted(() => {
        clearInterval(lyricsInterval.value)
    })
</script>

<style lang="scss">
    ::-webkit-scrollbar {
        display: none;
    }

    .slide-up-enter-active,
    .slide-up-leave-active {
        transition: all 0.4s;
    }

    .slide-up-enter, .slide-up-leave-to /* .fade-leave-active below version 2.1.8 */ {
        transform: translateY(100%);
    }

    .slide-fade-enter-active {
        transition: all 0.5s ease;
    }

    .slide-fade-leave-active {
        transition: all 0.5s cubic-bezier(0.2, 0.2, 0, 1);
    }

    .slide-fade-enter,
    .slide-fade-leave-to {
        transform: translateX(27vh);
        opacity: 0;
    }
</style>
