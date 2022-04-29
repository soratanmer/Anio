<template>
    <Modal :show="show" :close="close" title="新建歌单" width="25vw" :show-footer="true">
        <template #content>
            <input
                v-model="title"
                class="mb-2 w-full py-2 px-3"
                type="text"
                placeholder="请输入新歌单标题"
                maxlength="40"
            />
            <div>
                <input id="checkbox-private" v-model="privatePlaylist" type="checkbox" />
                <label for="checkbox-private">隐私歌单</label>
            </div>
        </template>
        <template #footer>
            <div @click="createPlaylists">创建</div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
    import { useUiStore } from '@/stores/ui'
    import { useUserStore } from '@/stores/user'
    import { createPlaylist, addOrRemoveTrackFromPlaylist } from '@/api/playlist'
    import type { CreatePlaylistParams } from '@/api/playlist'

    const UiStore = useUiStore()
    const userStore = useUserStore()

    const title = ref<string>('')
    const privatePlaylist = ref<boolean>(false)

    const show = computed<boolean>({
        get() {
            return UiStore.newPlaylistModal.show
        },
        set(show) {
            UiStore.updateNewPlaylistModal(show)
        },
    })

    const afterCreateAddTrackID = computed<number>(() => {
        return UiStore.newPlaylistModal.afterCreateAddTrackID
    })

    const close = () => {
        show.value = false
        title.value = ''
        privatePlaylist.value = false
        UiStore.updateNewPlaylistModal()
    }

    const createPlaylists = async () => {
        const params: CreatePlaylistParams = {
            name: title.value,
        }

        if (privatePlaylist.value) {
            params.privacy = 10
        }

        const { data: listRes } = await createPlaylist(params)

        if (listRes.value?.code === 200 && afterCreateAddTrackID.value !== 0) {
            await addOrRemoveTrackFromPlaylist({
                op: 'add',
                pid: listRes.value.id,
                tracks: [afterCreateAddTrackID.value],
            })
        }

        await close()

        await userStore.updateUserPlaylists()
    }
</script>
