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
            :id="id"
            :track="track"
            :trackIDs="trackIDs"
            :dbclickTrackFunc="dbclickTrackFunc"
            :layout="layout"
            :isLiked="userStore.likedList.includes(track.id)"
        ></TrackListItem>
    </div>

    <div v-else class="grid w-full gap-1">
        <TrackListItem
            v-for="track in skeletonTracks"
            :id="id"
            :track="track"
            :trackIDs="trackIDs"
            :layout="layout"
            :dbclickTrackFunc="dbclickTrackFunc"
            :is-skeleton="true"
        ></TrackListItem>
    </div>
</template>

<script setup lang="ts">
    import type { PropType } from 'vue'

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

    // 用于填充 Skeleton 的假数据
    const skeletonTracks: Track[] = new Array(props.layout === 'list' ? 7 : 8).fill({})

    const trackIDs = computed(() => {
        return props.tracks.map((t) => t.id)
    })
</script>
