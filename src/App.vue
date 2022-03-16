<template>
    <div class="grid select-none grid-cols-[16rem_auto]">
        <Sidebar></Sidebar>
        <div class="relative flex h-screen max-h-screen flex-grow flex-col overflow-y-auto bg-white dark:bg-black">
            <main class="mb-24 flex-grow px-8">
                <router-view></router-view>
            </main>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import Sidebar from '@/components/Sidebar.vue'

    export default defineComponent({ components: { Sidebar } })
</script>
