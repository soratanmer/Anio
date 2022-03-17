<template>
    <div id="layout" class="grid select-none grid-cols-[16rem_auto]">
        <Sidebar></Sidebar>
        <div
            id="mainContainer"
            ref="mainContainer"
            class="relative flex h-screen max-h-screen flex-grow flex-col overflow-y-auto bg-white dark:bg-black"
        >
            <TopBar></TopBar>
            <main id="main" class="mb-24 flex-grow px-8">
                <router-view></router-view>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Sidebar from '@/components/Sidebar.vue'
    import TopBar from './components/TopBar.vue'
</script>
