<template>
    <div class="grid h-screen max-w-sm border-r border-gray-300/10 bg-gray-50 dark:bg-gray-900 bg-opacity-[0.85]">
        <div>
            <div class="app-region-drag h-14">
                <div
                    class="btn-hover-animation mx-3 flex items-center rounded-lg px-3 py-2 transition-colors duration-200 after:scale-[0.97] after:bg-black/[0.06]"
                    :class="{
                        'text-gray-700 dark:text-white': route.path !== tab.route,
                        'text-brand-500': route.path === tab.route,
                    }"
                    v-for="tab in primaryTabs"
                    @click="router.push(tab.route)"
                >
                    <span class="font-semibold">{{ tab.name }}</span>
                </div>
                <div class="mx-5 my-2 h-px bg-black opacity-5"></div>
            </div>

            <div class="overflow-auto pb-[4.6rem]">
                <div
                    class="btn-hover-animation line-clamp-1 my-px mx-3 flex items-center rounded-lg px-3 py-[0.38rem] text-sm text-black opacity-70 transition-colors duration-200 after:scale-[0.97] after:bg-black/[0.06]"
                >
                    <span class="line-clamp-1">playlist</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useRoute, useRouter } from 'vue-router'

    interface Tab {
        name: string
        route: string
    }

    const route = useRoute()
    const router = useRouter()

    const primaryTabs: Tab[] = [
        {
            name: 'home',
            route: '/',
        },
        {
            name: 'explore',
            route: '/explore',
        },
        {
            name: 'library',
            route: '/library',
        },
    ]
</script>
