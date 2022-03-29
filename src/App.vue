<template>
    <div id="layout" class="grid select-none grid-cols-[13rem_auto]">
        <Sidebar></Sidebar>
        <div class="relative flex h-screen max-h-screen flex-grow flex-col bg-white dark:bg-black">
            <Topbar></Topbar>
            <main id="mainContainer" ref="mainContainer" class="pb-10 overflow-y-auto flex-grow px-8">
                <router-view :key="route.fullPath"> </router-view>
            </main>
            
            <Player></Player>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useQueryProvider } from 'vue-query'
    import { usePlayerProvider } from '@/utils/player'

    const route = useRoute()

    useQueryProvider()
    usePlayerProvider()
</script>

<style lang="scss">
    ::-webkit-scrollbar {
        @apply w-2;
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
