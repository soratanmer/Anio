<template>
    <div id="sidebar" class="grid h-screen max-w-sm bg-slate-50">
        <!-- Primary tabs -->
        <div>
            <div class="app-region-drag h-14"></div>

            <div
                v-for="tab in primaryTabs"
                class="btn-hover-animation mx-3 flex items-center rounded-lg px-3 py-2 mb-2 transition-colors duration-200 after:scale-[0.97] after:bg-green-100"
                :class="{
                    'text-gray-700 ': route.path !== tab.route,
                    'text-slate-50 bg-green-500': route.path === tab.route,
                }"
                @click="router.push(tab.route)"
            >
                <span class="font-semibold">{{ tab.name }}</span>
            </div>

            <div class="mx-5 my-2 h-px bg-black/10"></div>

            <div
                v-for="tab in secondaryTabs"
                class="btn-hover-animation mx-3 flex items-center rounded-lg px-3 py-2 mb-2 transition-colors duration-200 after:scale-[0.97] after:bg-green-100"
                :class="{
                    'text-gray-700': route.path !== tab.route,
                    'text-slate-50 bg-green-500': route.path === tab.route,
                }"
                @click="router.push(tab.route)"
            >
                <span class="font-semibold">{{ tab.name }}</span>
            </div>

            <div class="mx-5 my-2 h-px bg-black/10"></div>
        </div>

        <!-- Playlists -->
        <div class="overflow-auto">
            <div
                v-for="playlist in userPlaylists?.playlist || []"
                class="btn-hover-animation line-clamp-1 my-px mx-3 flex items-center rounded-lg px-3 py-[0.38rem] mb-2 text-sm text-black opacity-70 transition-colors duration-200 after:scale-[0.97] after:bg-green-100"
                :class="{
                    'text-slate-50 bg-green-500': route.name === 'playlist' && Number(route.params.id) === playlist.id,
                }"
                @click="router.push({ name: 'playlist', params: { id: playlist.id } })"
            >
                <span class="line-clamp-1">{{ playlist.name }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import useUserAccount from '@/hooks/useUserAccount'
    import useUserPlaylists from '@/hooks/useUserPlaylists'

    interface Tab {
        name: string
        route: string
    }

    const route = useRoute()
    const router = useRouter()

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
            route: '/next',
        },
        {
            name: '最近播放',
            route: '/history',
        },
    ]

    const { data: userAccount } = useUserAccount()
    const { data: userPlaylists } = useUserPlaylists(
        reactive({
            uid: computed(() => {
                return userAccount.value?.account?.id ?? 0
            }),
            offset: 0,
        }),
    )
</script>
