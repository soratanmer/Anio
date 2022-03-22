<template>
    <div
        class="group grid w-full rounded-xl after:scale-[.98] after:rounded-xl"
        :class="{
            'grid-cols-1 py-1.5 px-2': isGrid,
            'grid-cols-12 p-2 pr-4': isList,
            'grid-cols-12 py-2.5 px-4': isAlbum,
            'btn-hover-animation after:bg-gray-100': !isSkeleton && !isHighLight,
            'bg-brand-100': !isSkeleton && isHighLight,
        }"
    >
        <!-- Track info -->
        <div
            class="grid"
            :class="{
                'grid-cols-[3rem_auto] items-center': isGrid,
                'col-span-6 grid-cols-[4.2rem_auto] pr-8': isList,
                'col-span-6 grid-cols-[2rem_auto] pr-8': isAlbum,
            }"
        >
            <!-- Cover -->
            <div v-if="!isAlbum">
                <img
                    v-if="!isSkeleton"
                    class="box-content rounded-md border border-black border-opacity-[.03]"
                    :class="{
                        'h-12 w-12': fullWidth,
                        'h-9 w-9': !fullWidth,
                    }"
                    :src="resizeImage(track.al.picUrl, 'xs')"
                    alt="cover"
                />

                <Skeleton
                    v-else
                    class="mr-4 rounded-md border border-gray-100"
                    :class="{
                        'h-12 w-12': fullWidth,
                        'h-9 w-9': !fullWidth,
                    }"
                ></Skeleton>
            </div>

            <!-- Track number -->
            <div
                v-if="isAlbum && !isHighLight"
                class="self-center group-hover:hidden"
                :class="{
                    'text-gray-500': !isHighLight,
                    'text-brand-500': isHighLight,
                }"
            >
                {{ track.no }}
            </div>

            <!-- Pause button -->
            <div v-if="isAlbum && isHighLight" class="self-center" @click="player?.playOrPause()">
                <SvgIcon class="h-3.5 w-3.5 text-brand-500" :name="player?.isPlaying ? 'pause' : 'play'"></SvgIcon>
            </div>

            <!-- Pause button -->
            <div v-if="isAlbum && !isHighLight" class="self-center hidden group-hover:block">
                <SvgIcon class="h-3.5 w-3.5 text-brand-500" name="play"></SvgIcon>
            </div>

            <!-- Track name & Artists -->
            <div class="flex flex-col justify-center">
                <div
                    v-if="!isSkeleton"
                    class="line-clamp-1 break-all font-semibold"
                    :class="{
                        'text-lg': fullWidth,
                        'text-base': !fullWidth,
                        'text-black': !isHighLight,
                        'text-brand-500': isHighLight,
                    }"
                >
                    {{ track.name }}
                </div>
                <Skeleton
                    v-else
                    :class="{
                        'text-lg': fullWidth,
                        'text-base': !fullWidth,
                    }"
                    >PLACEHOLDER12345</Skeleton
                >
                <div
                    v-if="!isAlbum"
                    :class="{
                        'text-sm': fullWidth,
                        'text-xs': !fullWidth,
                        'text-gray-500': !isHighLight,
                        'text-brand-500': isHighLight,
                    }"
                >
                    <ArtistInline v-if="!isSkeleton" :artists="track.ar"></ArtistInline>
                    <Skeleton v-else class="w-2/3 translate-y-px">PLACE</Skeleton>
                </div>
            </div>
        </div>

        <!-- Album name (playlist page only) -->
        <div
            v-if="isList && !isSkeleton"
            class="col-span-4 flex items-center"
            :class="{
                'text-gray-900': !isHighLight,
                'text-brand-500': isHighLight,
            }"
        >
            <span
                @click="router.push({ name: 'album', params: { id: track.al.id } })"
                class="decoration-2 hover:underline"
                :class="{
                    'decoration-gray-600': !isHighLight,
                }"
                >{{ track.al.name }}</span
            ><span class="flex-grow"></span>
        </div>

        <div v-else-if="isList && isSkeleton" class="col-span-5 flex items-center text-gray-900">
            <Skeleton>PLACEHOLDER1234567890</Skeleton>
        </div>

        <!-- Artists (album page only) -->
        <div
            v-if="isAlbum"
            class="col-span-4"
            :class="{
                'text-gray-600 ': !isHighLight,
                'text-brand-500': isHighLight,
            }"
        >
            <ArtistInline v-if="!isSkeleton" :artists="track.ar" />
            <Skeleton v-else class="w-2/3 translate-y-px">PLACE</Skeleton>
        </div>

        <!-- Actions & Track duration -->
        <div v-if="fullWidth" class="col-span-2 flex items-center justify-end">
            <!-- Like button -->
            <button
                class="mr-5 cursor-default transition duration-300 hover:scale-[1.2]"
                :class="{
                    'opacity-0': !isLiked,
                    'group-hover:opacity-100': !isSkeleton,
                }"
                ><SvgIcon :name="isLiked ? 'heart' : 'heart-outline'" class="h-4 w-4 text-brand-500"
            /></button>

            <!-- Track duration -->
            <div v-if="!isSkeleton">{{ formatDuration(track.dt, 'zh-CN', 'hh:mm:ss') }}</div>
            <Skeleton v-else>0:00</Skeleton>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { PropType } from 'vue'

    import { formatDuration, resizeImage } from '@/utils/common'
    import usePlayer from '@/hooks/usePlayer'

    const props = defineProps({
        // 歌曲
        track: {
            type: Object as PropType<Track>,
            required: true,
        },
        // 布局类型
        layout: {
            type: String as PropType<'grid' | 'list' | 'album'>,
            default: 'grid',
        },
        // 是否已经收藏此歌曲
        isLiked: {
            type: Boolean,
            default: false,
        },
        // 是否显示骨架 （加载状态）
        isSkeleton: {
            type: Boolean,
            default: false,
        },
    })

    const player = usePlayer()
    const router = useRouter()

    const isAlbum = computed(() => {
        return props.layout === 'album'
    })

    const isGrid = computed(() => {
        return props.layout === 'grid'
    })

    const isList = computed(() => {
        return props.layout === 'list'
    })

    const fullWidth = computed(() => {
        return props.layout !== 'grid'
    })

    const isHighLight = computed(() => {
        return player?.track?.id === props.track.id
    })
</script>
