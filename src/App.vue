<template>
    <div id="layout" class="grid select-none grid-cols-[12rem_auto]">
        <Sidebar></Sidebar>
        <div class="relative flex h-screen max-h-screen flex-grow flex-col bg-slate-100 dark:bg-gray-800">
            <Topbar></Topbar>
            <main id="mainContainer" ref="mainContainer" class="flex-grow overflow-y-auto px-8 pb-10">
                <router-view :key="route.fullPath"></router-view>
            </main>
            <Player></Player>
            <ModalNewPlaylist></ModalNewPlaylist>
            <ModalAddTrackToPlaylist></ModalAddTrackToPlaylist>
        </div>
        <Lyrics v-show="showLyrics" />
    </div>
</template>

<script setup lang="ts">
    import { useQueryProvider } from 'vue-query'

    import { usePlayerProvider } from '@/hooks/usePlayer'
    import { useUserStore } from '@/stores/user'
    import { useUiStore } from '@/stores/ui'

    import { isLoggedIn } from './utils/user'

    const route = useRoute()
    const userStore = useUserStore()
    const uiStore = useUiStore()

    const showLyrics = computed(() => {
        return uiStore.showLyrics
    })

    if (isLoggedIn()) {
        userStore.updateUserAccount()
        userStore.updateLikedList()
        userStore.updateUserPlaylists()
    }

    useQueryProvider()
    usePlayerProvider()
</script>

<style lang="scss">
    ::-webkit-scrollbar {
        @apply w-1;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    :hover::-webkit-scrollbar-thumb {
        // -webkit-border-radius: 10px;
        // border-radius: 10px;
        // background: rgba(128, 128, 128, 0.38);
        @apply rounded-full bg-green-400;
    }
</style>
