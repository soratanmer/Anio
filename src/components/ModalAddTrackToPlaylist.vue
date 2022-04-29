<template>
    <Modal :show="show" width="25vw" title="添加到播放列表" :close="close">
        <template #content>
            <div
                class="mb-2 flex h-10 cursor-pointer items-center justify-between rounded-lg bg-gray-800 p-2 text-base font-medium text-white hover:bg-green-500"
            >
                <div>新建歌单</div>
                <ButtonIcon @click="newPlaylist">
                    <SvgIcon class="h-4 w-4" name="plus"></SvgIcon>
                </ButtonIcon>
            </div>
            <div
                v-for="playlist in userCreatePlaylist"
                class="mt-1 flex items-center justify-between rounded-lg bg-gray-800 p-2 text-white hover:bg-green-500"
                @click="addTrackFromPlaylist(playlist.id)"
            >
                <div>
                    {{ playlist.name }}
                </div>
                <div class="text-xs opacity-70"> {{ playlist.trackCount }} 首歌 </div>
            </div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
    import { fetchUserPlaylists } from '@/api/user'
    import { addOrRemoveTrackFromPlaylist } from '@/api/playlist'
    import { useUiStore } from '@/stores/ui'
    import { useUserStore } from '@/stores/user'

    const UiStore = useUiStore()
    const userStore = useUserStore()

    const selectedTrackID = computed(() => {
        return UiStore.addTrackToPlaylistModal.selectedTrackID
    })

    const show = computed<boolean>({
        get() {
            return UiStore.addTrackToPlaylistModal.show
        },
        set(show) {
            UiStore.updateAddTrackToPlaylistModal(show)
        },
    })

    const close = () => {
        show.value = false
    }

    const { data: userPlaylists } = fetchUserPlaylists(
        reactive({
            uid: computed(() => {
                return userStore.userAccount?.account?.id ?? 0
            }),
            offset: 0,
        }),
    )

    const userCreatePlaylist = computed(() => {
        return userPlaylists.value?.playlist.filter((item) => {
            return (
                item.creator.userId === userStore.userAccount?.profile?.userId &&
                item.id !== userStore.userLikedSongListID
            )
        })
    })

    const addTrackFromPlaylist = async (pid: number) => {
        const { data } = await addOrRemoveTrackFromPlaylist({
            tracks: [selectedTrackID.value],
            op: 'add',
            pid,
        })
        if (data.value?.body.code === 200) {
            close()
        }
    }

    const newPlaylist = () => {
        UiStore.updateNewPlaylistModal(true, selectedTrackID.value)
        close()
    }
</script>
