<template>
    <div
        v-if="!isLoading"
        class="grid w-full gap-1"
        :class="{
            'gap-0': layout === 'album',
        }"
    >
        <TrackListItem
            v-for="track in tracks"
            :track="track"
            :layout="layout"
            :isLiked="userStore.likedList.includes(track.id)"
            @dblclick="playThisList(track.id)"
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
</template>

<script setup lang="ts">
    import type { PropType } from 'vue'

    import usePlayer from '@/hooks/usePlayer'
    import { PlayerMode, PlaylistSourceType } from '@/hooks/usePlayer'
    import { useUserStore } from '@/stores/user'

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
    })

    const userStore = useUserStore()
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
</script>
