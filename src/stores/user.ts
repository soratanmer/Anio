import { defineStore } from 'pinia'
import { fetchUserAccount, fetchUserLikedSongsIDs, fetchUserPlaylists } from '@/api/user'
import type { FetchUserAccountResponse, FetchUserPlaylistsResponse } from '@/api/user'
import { update } from 'lodash'

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            userAccount: {} as FetchUserAccountResponse | null,
            likedList: [0],
            userLikedSongListID: 0,
            userPlaylists: {} as FetchUserPlaylistsResponse | null,
        }
    },
    getters: {},
    actions: {
        async updateUserAccount() {
            const { data } = await fetchUserAccount()
            this.userAccount = data.value
        },
        async updateLikedList() {
            const { data } = await fetchUserLikedSongsIDs({
                uid: this.userAccount?.account?.id ?? 0,
            })
            if (data.value?.ids?.length) {
                this.likedList = data.value?.ids
            } else {
                this.likedList = [0]
            }
        },
        updateUserLikedSongListID(id: number) {
            this.userLikedSongListID = id
        },
        async updateUserPlaylists() {
            const { data: userPlaylists } = await fetchUserPlaylists({
                uid: this.userAccount?.account?.id ?? 0,
                offset: 0,
            })

            this.userPlaylists = userPlaylists.value

            await this.updateUserLikedSongListID(userPlaylists.value?.playlist[0].id || 0)
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'user',
                storage: localStorage,
            },
        ],
    },
})
