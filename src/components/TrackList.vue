<template>
    <div
        v-if="!isLoading"
        class="grid w-full gap-1"
        :class="{
            'gap-0': layout === 'album',
        }"
    >
        <TrackListItem
            v-for="(track, index) in tracks"
            :track="track"
            :layout="layout"
            :isLiked="userStore.likedList.includes(track.id)"
            @dblclick="playThisList(track.id)"
            @click.right="showContext($event, track.id, index)"
        ></TrackListItem>
    </div>

    <div v-else class="grid w-full gap-1">
        <TrackListItem
            v-for="track in skeletonTracks"
            :track="track"
            :layout="layout"
            :is-skeleton="true"
        ></TrackListItem>
    </div>

    <ContextMenu ref="menuRef">
        <div class="py-2.5 px-3.5 rounded-lg cursor-default hover:bg-green-500" @click="playThisList(rightTrack.id)"
            >播放</div
        >
        <div
            v-if="!player?.currentPlaylist.includes(rightTrack.id)"
            class="py-2.5 px-3.5 rounded-lg cursor-default hover:bg-green-500"
            @click="player?.addToQueue(rightTrack.id)"
            >下一首播放</div
        >
        <div
            v-else
            class="py-2.5 px-3.5 rounded-lg cursor-default hover:bg-green-500"
            @click="player?.removeToQueue(rightTrack.id)"
            >从列表中删除</div
        >
        <div
            v-if="!userStore.likedList.includes(rightTrack.id)"
            class="py-2.5 px-3.5 rounded-lg cursor-default hover:bg-green-500"
            @click="likeTrack(rightTrack.id, true)"
            >保存到我喜欢的音乐</div
        >
        <div
            v-else
            class="py-2.5 px-3.5 rounded-lg cursor-default hover:bg-green-500"
            @click="likeTrack(rightTrack.id, false)"
            >从我喜欢的音乐中删除</div
        >
        <div
            v-if="isLoggedIn()"
            class="py-2.5 px-3.5 rounded-lg cursor-default hover:bg-green-500"
            @click="addTrackToPlaylist"
        >
            保存到歌单
        </div>
        <div
            v-if="isUserOwnPlaylist"
            class="py-2.5 px-3.5 rounded-lg cursor-default hover:bg-green-500"
            @click="removeTrackFromPlaylist(rightTrack.id)"
            >从歌单中删除</div
        >
    </ContextMenu>
</template>

<script setup lang="ts">
    import type { PropType } from 'vue'

    import { likeATrack } from '@/api/track'
    import { addOrRemoveTrackFromPlaylist } from '@/api/playlist'
    import usePlayer from '@/hooks/usePlayer'
    import { PlayerMode, PlaylistSourceType } from '@/hooks/usePlayer'
    import { useUserStore } from '@/stores/user'
    import { useUiStore } from '@/stores/ui'
    import { isLoggedIn } from '@/utils/user'

    const props = defineProps({
        id: {
            type: Number,
            default: 0,
        },
        // 歌曲列表
        tracks: {
            type: Array as PropType<Track[]>,
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
        // 是否正在加载数据中（加载中时会显示 Skeleton ）
        isLoading: {
            type: Boolean,
            default: false,
        },
        isUserOwnPlaylist: {
            type: Boolean,
            default: false,
        },
    })

    const userStore = useUserStore()
    const UiStore = useUiStore()
    const player = usePlayer()

    // 用于填充 Skeleton 的假数据
    const skeletonTracks: Track[] = new Array(props.layout === 'list' ? 7 : 8).fill({})

    const trackIDs = computed(() => {
        return props.tracks.map((t) => t.id)
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
                trackIDs.value,
                {
                    type: PlaylistSourceType.TRACK,
                    id: PlaylistSourceType.TRACK,
                },
                trackID,
            )
        } else if (props.dbclickTrackFunc === 'dailyTracks') {
            player!.mode = PlayerMode.PLAYLIST
            player?.replacePlaylist(
                trackIDs.value,
                {
                    type: PlaylistSourceType.DAILYTRACKS,
                    id: PlaylistSourceType.DAILYTRACKS,
                },
                trackID,
            )
        } else if (props.dbclickTrackFunc === 'playTrackOnListByID') {
            player?.playTrackOnListByID(trackID)
        }
    }

    const rightTrack = reactive({
        id: 0,
        index: 0,
    })

    const menuRef = ref()

    const showContext = (e: MouseEvent, trackID: number, index: number) => {
        menuRef.value.openMenu(e)
        rightTrack.id = trackID
        rightTrack.index = index
    }

    const likeTrack = async (id: number, like: boolean) => {
        await likeATrack({
            id,
            like,
        })
        await userStore.updateLikedList()
    }

    const removeTrackFromPlaylist = async (id: number) => {
        if (!isLoggedIn()) {
            return
        }
        await addOrRemoveTrackFromPlaylist({
            tracks: [id],
            op: 'del',
            pid: props.id,
        })
    }

    const addTrackToPlaylist = () => {
        if (!isLoggedIn()) {
            return
        }

        UiStore.updateAddTrackToPlaylistModal(true, rightTrack.id)
    }
</script>
