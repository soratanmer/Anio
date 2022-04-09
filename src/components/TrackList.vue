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

    import { useUserStore } from "@/stores/user";

    const props = defineProps({
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
        // 是否正在加载数据中（加载中时会显示 Skeleton ）
        isLoading: {
            type: Boolean,
            default: false,
        },
    })

    const userStore = useUserStore()


    // 用于填充 Skeleton 的假数据
    const skeletonTracks: Track[] = new Array(props.layout === 'list' ? 7 : 8).fill({})
</script>
