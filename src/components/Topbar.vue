<template>
    <div
        id="topbar"
        class="app-region-drag sticky top-0 z-30 flex h-16 min-h-[4rem] w-full cursor-default items-center justify-between px-8 transition duration-300"
        :class="{
            'bg-white bg-opacity-[0.86] backdrop-blur-xl backdrop-saturate-[1.8]':
                !mainContainerScroll.arrivedState.top,
        }"
    >
        <!-- Left part -->
        <div class="flex gap-2">
            <!-- Navigation buttons -->
            <div class="flex gap-1">
                <div
                    v-for="action in ['arrow-left', 'arrow-right']"
                    class="app-region-no-drag btn-hover-animation rounded-lg p-2.5 text-gray-500 transition duration-300 after:rounded-lg after:bg-black/[0.06] hover:text-gray-900"
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
                    class="mr-2 h-4 w-4 text-gray-400 transition duration-300 group-hover:text-gray-600"
                    name="search"
                ></SvgIcon>
                <input
                    v-model="uiStore.searchKeywords"
                    class="w-full bg-transparent"
                    type="text"
                    placeholder="Search"
                    @keydown.enter="doSearch"
                />
            </div>
        </div>

        <!-- Right part -->
        <div class="flex items-center gap-3">
            <div
                class="app-region-no-drag btn-hover-animation rounded-lg p-2.5 text-gray-500 transition duration-300 after:rounded-lg after:bg-black/[0.06] hover:text-gray-900"
            >
                <SvgIcon class="w-5 h-5" name="settings"></SvgIcon>
            </div>
            <img
                class="app-region-no-drag h-9 w-9 rounded-lg bg-gray-100"
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
    import { resizeImage } from '@/utils/common'
    import { isLoggedIn } from '@/utils/user'
    import useUserAccount from '@/hooks/useUserAccount'
    import { useUiStore } from '@/stores/ui'

    const router = useRouter()
    const uiStore = useUiStore()

    const { data: userAccount } = useUserAccount()

    const mainContainerRef = ref<HTMLElement | null>(document.getElementById('mainContainer'))

    const mainContainerScroll = useScroll(mainContainerRef)

    const doSearch = () => {
        router.push({
            name: 'search',
        })
    }

    onMounted(() => {
        mainContainerRef.value = document.getElementById('mainContainer')
    })
</script>
