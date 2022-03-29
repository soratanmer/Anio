<template>
    <div
        id="topbar"
        class="app-region-drag sticky top-0 z-30 flex h-16 min-h-[4rem] w-full cursor-default items-center justify-between px-8 transition duration-300"
    >
        <!-- Left part -->
        <div class="flex gap-2">
            <!-- Navigation buttons -->
            <div class="flex gap-1">
                <div
                    v-for="action in ['back', 'forward']"
                    class="app-region-no-drag btn-hover-animation rounded-lg p-2.5 text-black dark:text-white transition duration-300 after:rounded-lg after:bg-green-200 hover:text-gray-900"
                    @click="router[action]()"
                >
                    <SvgIcon class="h-5 w-5" :name="action"></SvgIcon>
                </div>
            </div>

            <!-- Search input -->
            <div
                class="app-region-no-drag group flex w-[16rem] cursor-text items-center rounded-lg bg-gray-500 bg-opacity-[.05] px-3 transition duration-300 hover:bg-opacity-10"
            >
                <SvgIcon
                    class="mr-2 h-4 w-4 text-black dark:text-white transition duration-300 group-hover:text-gray-600"
                    name="search"
                ></SvgIcon>
                <input
                    v-model="uiStore.searchKeywords"
                    class="w-full bg-transparent text-black dark:text-white"
                    type="text"
                    placeholder="Search"
                    @keydown.enter="doSearch"
                />
            </div>
        </div>

        <!-- Right part -->
        <div class="flex items-center gap-3">
            <div
                class="app-region-no-drag btn-hover-animation rounded-lg p-2.5 text-black dark:text-white transition duration-300 after:rounded-lg after:bg-green-200 hover:text-gray-900"
            >
                <SvgIcon class="w-5 h-5" name="settings"></SvgIcon>
            </div>
            <img
                class="app-region-no-drag h-9 w-9 rounded-lg bg-gray-500"
                :src="
                    userAccount?.profile?.avatarUrl
                        ? resizeImage(userAccount.profile.avatarUrl, 'md')
                        : resizeImage('https://s4.music.126.net/style/web2/img/default/default_avatar.jpg', 'md')
                "
                @click="
                    router.push({
                        path: isLoggedIn() ? '/library' : '/login',
                    })
                "
                alt="avatar"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import useUserAccount from '@/hooks/useUserAccount'
    import { useUiStore } from '@/stores/ui'
    import { resizeImage } from '@/utils/common'
    import { isLoggedIn } from '@/utils/user'

    const router = useRouter()
    const uiStore = useUiStore()

    const { data: userAccount } = useUserAccount()

    const doSearch = () => {
        router.push({
            name: 'search',
        })
    }
</script>
