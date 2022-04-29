<template>
    <div id="sidebar" class="grid h-screen max-w-sm bg-slate-50 dark:bg-gray-900">
        <!-- Primary tabs -->
        <div>
            <div class="app-region-drag h-14"></div>

            <div
                v-for="tab in primaryTabs"
                class="btn-hover-animation mx-3 mb-2 flex items-center rounded-lg px-3 py-2 text-black transition-colors duration-200 after:scale-[0.97] after:bg-green-400 dark:text-white"
                :class="{
                    'bg-green-500': route.path === tab.route,
                }"
                @click="routePush(tab)"
            >
                <span class="font-semibold">{{ tab.name }}</span>
            </div>

            <div class="mx-5 my-2 h-px bg-black/10"></div>

            <div
                v-for="tab in secondaryTabs"
                class="btn-hover-animation mx-3 mb-2 flex items-center rounded-lg px-3 py-2 text-black transition-colors duration-200 after:scale-[0.97] after:bg-green-400 dark:text-white"
                :class="{
                    'bg-green-500': route.path === tab.route,
                }"
                @click="routePush(tab)"
            >
                <span class="font-semibold">{{ tab.name }}</span>
            </div>

            <div class="mx-5 my-2 h-px bg-black/10"></div>
        </div>

        <!-- Playlists -->
        <div v-if="isLoggedIn()" class="overflow-auto">
            <div
                v-for="playlist in userPlaylists?.playlist || []"
                class="btn-hover-animation mx-3 mb-2 flex items-center rounded-lg px-3 py-2 text-black transition-colors duration-200 after:scale-[0.97] after:bg-green-400 dark:text-white"
                :class="{
                    'bg-green-500': route.name === 'playlist' && Number(route.params.id) === playlist.id,
                }"
                @click="router.push({ name: 'playlist', params: { id: playlist.id } })"
            >
                <span class="line-clamp-1">{{ playlist.name }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useUserStore } from '@/stores/user'
    import { isLoggedIn } from '@/utils/user'

    interface Tab {
        name: string
        route: string
    }

    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()

    const primaryTabs: Tab[] = [
        {
            name: '首页',
            route: '/',
        },
        {
            name: '发现',
            route: '/explore',
        },
    ]

    const secondaryTabs: Tab[] = [
        {
            name: '播放列表',
            route: '/nextSongs',
        },
        {
            name: '最近播放',
            route: '/history',
        },
    ]

    const userPlaylists = computed(() => {
        return userStore.userPlaylists
    })

    const routePush = (tab: Tab) => {
        if (tab.route === '/explore') {
            router.push({
                name: 'explore',
                query: {
                    category: '全部',
                    active: '全部',
                },
            })
        } else {
            router.push(tab.route)
        }
    }
</script>
