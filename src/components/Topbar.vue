<template>
    <div
        class="app-region-drag sticky top-0 z-30 flex h-16 min-h-[4rem] w-full cursor-default items-center justify-between px-8 transition duration-300"
    >
        <!-- Left part -->
        <div class="flex gap-2">
            <!-- Navigation buttons -->
            <div class="flex gap-1">
                <div
                    class="app-region-no-drag btn-hover-animation rounded-lg p-3 text-gray-500 transition duration-300 after:rounded-full after:bg-black/[.06] hover:text-gray-900"
                    v-for="action in ['back', 'forward']"
                    @click="router[action]()"
                >
                    <SvgIcon class="h-4 w-4" :name="action"></SvgIcon>
                </div>
            </div>

            <!-- Search input -->
            <div
                class="app-region-no-drag group flex w-[16rem] cursor-text items-center rounded-full bg-gray-500 bg-opacity-[.05] px-3 transition duration-300 hover:bg-opacity-10"
            >
                <SvgIcon
                    class="mr-2 h-4 w-4 text-gray-400 transition duration-300 group-hover:text-gray-600"
                    name="search"
                ></SvgIcon>
                <input class="w-full bg-transparent" type="text" placeholder="Search" />
            </div>
        </div>

        <!-- Right part -->
        <div class="flex items-center gap-3">
            <div
                class="app-region-no-drag btn-hover-animation rounded-lg p-2.5 text-gray-500 transition duration-300 after:rounded-full after:bg-black/[.06] hover:text-gray-900"
            >
                <SvgIcon class="w-5 h-5" name="settings"></SvgIcon>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useRoute, useRouter } from 'vue-router'

    const route = useRoute()
    const router = useRouter()
</script>
