<template>
    <div
        class="grid w-full grid-cols-12 p-2 px-4 rounded-lg after:scale-[.98]"
        :class="{
            'btn-hover-animation after:bg-green-400': !isSkeleton && !isHighLight,
            'bg-green-500': !isSkeleton && isHighLight,
        }"
        @dblclick="playThisList(track.id)"
    >
        <!-- Track info -->
        <div class="flex col-span-6 pr-8">
            <div class="flex items-center">
                <!-- Track number -->
                <div v-if="isAlbum" class="self-center mr-5 text-black dark:text-white">
                    {{ track.no }}
                </div>

                <!-- Pause button -->
                <div v-if="isHighLight" class="self-center mr-5" @click="player?.playOrPause()">
                    <SvgIcon
                        class="h-3.5 w-3.5 text-black dark:text-white"
                        :name="player?.isPlaying ? 'pause' : 'play'"
                    ></SvgIcon>
                </div>

                <!-- Play button -->
                <div v-if="!isHighLight" class="self-center mr-5" @click="playThisList(track.id)">
                    <SvgIcon class="h-3.5 w-3.5 text-black dark:text-white" name="play"></SvgIcon>
                </div>

                <button
                    class="mr-5 cursor-default transition duration-300 hover:scale-[1.2]"
                    :class="{
                        'group-hover:opacity-100': !isSkeleton,
                    }"
                    @click="likeTrack"
                    ><SvgIcon :name="isLiked ? 'heart' : 'heart-outline'" class="h-4 w-4 text-black dark:text-white"
                /></button>
            </div>
            <!-- Track name & Artists -->
            <div class="flex flex-col justify-center">
                <div v-if="!isSkeleton" class="line-clamp-1 break-all text-lg font-semibold text-black dark:text-white">
                    {{ track.name }}
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
                @click="router.push({ name: 'album', params: { id: albumID } })"
                class="decoration-2 hover:underline"
                :class="{
                    'decoration-gray-600': !isHighLight,
                }"
                >{{ albumName }}</span
            ><span class="flex-grow"></span>
        </div>

        <div v-else-if="isList && isSkeleton" class="col-span-5 flex items-center text-gray-900">
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
            <div class="mr-5 cursor-default transition duration-300 hover:scale-[1.2]">
                <SvgIcon name="more" class="h-4 w-4 text-black dark:text-white" />
            </div>

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
    import { PlayerMode, PlaylistSourceType } from '@/hooks/usePlayer'
    import { formatDuration } from '@/utils/common'
    import { likeATrack } from '@/api/track'
    import { useUserStore } from '@/stores/user'

    const props = defineProps({
        id: {
            type: Number,
            default: 0,
        },
        // 歌曲
        track: {
            type: Object as PropType<Track>,
            required: true,
        },
        trackIDs: {
            type: Array as PropType<number[]>,
            required: true,
        },
        // 布局类型
        layout: {
            type: String as PropType<'list' | 'album'>,
            default: 'list',
        },
        dbclickTrackFunc: {
            type: String as PropType<
                | 'playPlaylistByID'
                | 'playAlbumByID'
                | 'playArtistByID'
                | 'playTrackOnListByID'
                | 'playAList'
                | 'dailyTracks'
            >,
            default: 'playAList',
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

    const playThisList = (trackID: number) => {
        if (props.dbclickTrackFunc === 'playPlaylistByID') {
            player?.playPlaylistByID(props.id, trackID)
        } else if (props.dbclickTrackFunc === 'playAlbumByID') {
            player?.playAlbumByID(props.id, trackID)
        } else if (props.dbclickTrackFunc === 'playArtistByID') {
            player?.playArtistByID(props.id, trackID)
        } else if (props.dbclickTrackFunc === 'playAList') {
            player!.mode = PlayerMode.PLAYLIST
            player?.replacePlaylist(
                props.trackIDs,
                {
                    type: PlaylistSourceType.PLAYLIST,
                    id: props.id,
                },
                trackID,
            )
        } else if (props.dbclickTrackFunc === 'dailyTracks') {
            player!.mode = PlayerMode.PLAYLIST
            player?.replacePlaylist(
                props.trackIDs,
                {
                    type: PlaylistSourceType.PLAYLIST,
                    id: props.id,
                },
                trackID,
            )
        } else if (props.dbclickTrackFunc === 'playTrackOnListByID') {
            player?.playTrackOnListByID(trackID)
        }
    }

    const likeTrack = async () => {
        await likeATrack({
            id: props.track.id,
            like: props.isLiked ? false : true,
        })
        await userStore.updateLikedList()
    }
</script>
