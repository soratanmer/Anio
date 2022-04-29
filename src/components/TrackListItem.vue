<template>
    <div
        class="grid w-full grid-cols-12 rounded-lg p-2 px-4 after:scale-[.98]"
        :class="{
            'btn-hover-animation after:bg-green-400': !isSkeleton && !isHighLight,
            'bg-green-500': !isSkeleton && isHighLight,
        }"
    >
        <!-- Track info -->
        <div class="col-span-6 flex pr-8">
            <div class="flex items-center">
                <!-- Track number -->
                <div v-if="isAlbum" class="mr-5 self-center text-black dark:text-white">
                    {{ track.no }}
                </div>
            </div>
            <!-- Track name & Artists -->
            <div class="flex max-w-full flex-col justify-center">
                <div v-if="!isSkeleton" class="line-clamp-1 break-all text-lg font-semibold text-black dark:text-white">
                    {{ track.name }}
                    <span
                        v-if="isTranslate"
                        class="ml-1 opacity-50"
                        >( {{ translate }} )</span
                    >
                </div>
                <Skeleton v-else class="text-lg">PLACEHOLDER12345</Skeleton>
                <div v-if="!isAlbum" class="text-sm text-black dark:text-white">
                    <ArtistInline v-if="!isSkeleton" :artists="artists"></ArtistInline>
                    <Skeleton v-else class="w-2/3 translate-y-px">PLACE</Skeleton>
                </div>
            </div>
        </div>

        <!-- Album name (playlist page only) -->
        <div v-if="isList && !isSkeleton" class="col-span-4 flex items-center text-black dark:text-white">
            <span
                class="decoration-2 hover:underline"
                :class="{
                    'decoration-gray-600': !isHighLight,
                }"
                @click="router.push({ name: 'album', params: { id: albumID } })"
                >{{ albumName }}</span
            ><span class="flex-grow"></span>
        </div>

        <div v-else-if="isList && isSkeleton" class="col-span-4 flex items-center text-gray-900">
            <Skeleton>PLACEHOLDER1234567890</Skeleton>
        </div>

        <!-- Artists (album page only) -->
        <div v-if="isAlbum" class="col-span-4 text-black dark:text-white">
            <ArtistInline v-if="!isSkeleton" :artists="artists" />
            <Skeleton v-else class="w-2/3 translate-y-px">PLACE</Skeleton>
        </div>

        <!-- Actions & Track duration -->
        <div class="col-span-2 flex items-center justify-end">
            <!-- Like button -->
            <button
                v-if="!isSkeleton"
                class="mr-5 cursor-default transition duration-300 hover:scale-[1.2]"
                :class="{
                    'group-hover:opacity-100': !isSkeleton,
                }"
                @click="likeTrack"
                ><SvgIcon :name="isLiked ? 'heart' : 'heart-outline'" class="h-4 w-4 text-black dark:text-white"
            /></button>

            <!-- Track duration -->
            <div v-if="!isSkeleton" class="text-black dark:text-white">{{
                formatDuration(trackDuration, 'zh-CN', 'hh:mm:ss')
            }}</div>
            <Skeleton v-else>0:00</Skeleton>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { PropType } from 'vue'

    import usePlayer from '@/hooks/usePlayer'
    import { formatDuration } from '@/utils/common'
    import { likeATrack } from '@/api/track'
    import { useUserStore } from '@/stores/user'

    const props = defineProps({
        // 歌曲
        track: {
            type: Object as PropType<Track>,
            required: true,
        },
        // 布局类型
        layout: {
            type: String as PropType<'list' | 'album'>,
            default: 'list',
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

    const router = useRouter()
    const player = usePlayer()
    const userStore = useUserStore()

    const isAlbum = computed(() => {
        return props.layout === 'album'
    })

    const isList = computed(() => {
        return props.layout === 'list'
    })

    const isHighLight = computed(() => {
        return player?.track?.id === props.track.id
    })

    const isTranslate = computed(() => {
        return props.track.tns?.length > 0 || props.track.alia?.length > 0
    })

    const translate = computed(() => {
        if (props.track.tns?.length) {
            return props.track.tns[0]
        } else {
            return props.track.alia[0]
        }
    })

    const artists = computed(() => {
        return props.track.ar || props.track.artists
    })

    const albumID = computed(() => {
        if (props.track.al) {
            return props.track.al.id
        } else if (props.track.album) {
            return props.track.album.id
        }
    })

    const albumName = computed(() => {
        if (props.track.al) {
            return props.track.al.name
        } else if (props.track.album) {
            return props.track.album.name
        }
    })

    const trackDuration = computed(() => {
        return props.track.dt || props.track.duration
    })

    const likeTrack = async () => {
        await likeATrack({
            id: props.track.id,
            like: props.isLiked ? false : true,
        })
        await userStore.updateLikedList()
    }
</script>
