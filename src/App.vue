<template>
    <div id="layout" class="grid select-none grid-cols-[13rem_auto]">
        <Sidebar></Sidebar>
        <div
            id="mainContainer"
            ref="mainContainer"
            class="relative flex h-screen max-h-screen flex-grow flex-col overflow-y-auto bg-white"
        >
            <Topbar></Topbar>
            <main id="main" class="mb-10 flex-grow px-8">
                <router-view :key="route.fullPath"> </router-view>
            </main>
            <Player></Player>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useQueryProvider } from 'vue-query'
    import { usePlayerProvider } from '@/hooks/usePlayer'

    const route = useRoute()

    useQueryProvider()
    usePlayerProvider()
</script>

<style lang="scss">
    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        -webkit-border-radius: 10px;
        border-radius: 10px;
        background: rgba(128, 128, 128, 0.38);
    }
</style>
