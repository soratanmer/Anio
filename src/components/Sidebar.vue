<template>
    <div id="sidebar" class="grid h-screen max-w-sm border-r border-gray-300/10 bg-gray-50 dark:bg-gray-900 bg-opacity-[0.85]">
        <div>
            <div class="app-region-drag h-14">
                <div
                    v-for="tab in primaryTabs"
                    class="btn-hover-animation mx-3 flex items-center rounded-lg px-3 py-2 transition-colors duration-200 after:scale-[0.97] after:bg-black/[0.06]"
                    :class="{
                        'text-gray-700 dark:text-white': route.path !== tab.route,
                        'text-brand-500': route.path === tab.route,
                    }"
                    @click="router.push(tab.route)"
                >
                    <span class="font-semibold">{{ tab.name }}</span>
                </div>
                <div class="mx-5 my-2 h-px bg-black opacity-5"></div>
            </div>
        </div>
        <div class="overflow-auto pb-[4.6rem]">
            <div
                v-for="playlist in userPlaylists?.playlist || []"
                class="btn-hover-animation line-clamp-1 my-px mx-3 flex items-center rounded-lg px-3 py-[0.38rem] text-sm text-black opacity-70 transition-colors duration-200 after:scale-[0.97] after:bg-black/[0.06]"
                :class="{
                    'after:scale-100 after:opacity-100':
                        route.name === 'playlist' && Number(route.params.id) === playlist.id,
                }"
                @click="router.push({ name: 'playlist', params: { id: playlist.id } })"
            >
                <span class="line-clamp-1">{{ playlist.name }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { reactive, computed } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
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
