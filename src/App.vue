<template>
    <div id="layout" class="grid select-none grid-cols-[13rem_auto]">
        <Sidebar></Sidebar>
        <div class="relative flex h-screen max-h-screen flex-grow flex-col bg-white dark:bg-black">
            <Topbar></Topbar>
            <main id="mainContainer" ref="mainContainer" class="pb-10 overflow-y-auto flex-grow px-8">
                <router-view v-slot="{ Component }">
                    <keep-alive>
                        <component :is="Component" :key="route.fullPath"></component>
                    </keep-alive>
                </router-view>
            </main>
            <Player></Player>
        </div>
    </div>
    <!-- <transition name="slide-up">
        <Lyrics v-show="showLyrics" />
    </transition> -->
    <Lyrics v-show="showLyrics" />
</template>

<script setup lang="ts">
    import { useQueryProvider } from 'vue-query'

    import { usePlayerProvider } from '@/hooks/usePlayer'
    import { useUserStore } from '@/stores/user'
    import { useUiStore } from '@/stores/ui'

    const route = useRoute()
    const userStore = useUserStore()
    const uiStore = useUiStore()

    const showLyrics = computed(() => {
        return uiStore.showLyrics
    })

    userStore.updateUserAccount()
    userStore.updateLikedList()

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

    // .slide-up-enter-active,
    // .slide-up-leave-active {
    //     transition: transform 0.4s;
    // }
    // .slide-up-enter,
    // .slide-up-leave-to {
    //     transform: translateY(100%);
    // }
</style>
