<template>
    <div>
        <!-- XXX's Library -->
        <div class="my-6 flex items-center text-3xl font-bold">
            <img
                v-if="!isLoadingAccount"
                class="mr-3 h-9 w-9 rounded-full"
                :src="userAccount?.profile?.avatarUrl ? resizeImage(userAccount?.profile?.avatarUrl, 'md') : ''"
                alt="avatar"
            />
            <Skeleton v-else class="mr-3 h-9 w-9 rounded-full"></Skeleton>

            <span class="pb-1">'s Library</span>
        </div>

        <!-- Tabs -->
        <div class="mt-8 mb-4 flex gap-3.5">
            <div
                v-for="tab in tabs"
                class="btn-hover-animation rounded-lg px-3.5 py-1.5 text-lg font-semibold text-gray-600 after:bg-gray-100"
                :class="{
                    'bg-gray-100': tab.id === 'MyPlaylists',
                }"
            >
                {{ tab.name }}
            </div>
        </div>

        <!-- Playlist tab content -->
        <CoverRow
            :playlists="userPlaylists?.playlist || []"
            subtitle="creator"
            :is-skeleton="isLoadingAccount"
        ></CoverRow>
    </div>
</template>

<script setup lang="ts">
    import { computed, reactive } from 'vue'

    import useUserAccount from '@/hooks/useUserAccount'
    import useUserPlayLists from '@/hooks/useUserPlaylists'
    import { resizeImage } from '@/utils/common'
    import Skeleton from '@/components/Skeleton.vue'
    import CoverRow from '@/components/CoverRow.vue'

    const { data: userAccount, isLoading: isLoadingAccount } = useUserAccount()

    const { data: userPlaylists, isLoading: isLoadingPlaylists } = useUserPlayLists(
        reactive({
            uid: computed(() => {
                return userAccount.value?.account?.id ?? 0
            }),
            offset: 0,
        }),
    )

    const tabs: {
        name: string
        id: string
    }[] = [
        {
            name: 'My Playlists',
            id: 'MyPlaylists',
        },
        {
            name: 'Liked Playlists',
            id: 'LikedPlaylists',
        },
        {
            name: 'Albums',
            id: 'albums',
        },
        {
            name: 'Artists',
            id: 'artists',
        },
        {
            name: 'Videos',
            id: 'videos',
        },
    ]
</script>
