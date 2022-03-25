<template>
    <div id="layout" class="grid select-none grid-cols-[16rem_auto]">
        <Sidebar></Sidebar>
        <div
            id="mainContainer"
            ref="mainContainer"
            class="relative flex h-screen max-h-screen flex-grow flex-col overflow-y-auto bg-white"
        >
            <Topbar></Topbar>
            <main id="main" class="mb-24 flex-grow px-8">
                <router-view :key="route.fullPath">
                </router-view>
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
        display: none;
    }
</style>
