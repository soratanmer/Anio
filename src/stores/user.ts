import { defineStore } from 'pinia'

import { fetchUserLikedSongsIDs, fetchUserAccount } from '@/api/user'
import type { FetchUserAccountResponse } from '@/api/user'

interface UserState {
    account: FetchUserAccountResponse | undefined
    likedSongs: number[]
}

export const useUserStore = defineStore('user', {
    state: (): UserState => {
        return {
            account: undefined,
            likedSongs: [0],
        }
    },
    getters: {},
    actions: {
        fetchUserAccount() {
            fetchUserAccount().then((result) => {
                this.account = result
            })
        },
        fetchLikedSongs() {
            fetchUserLikedSongsIDs({
                uid: Number(this.account?.profile?.userId),
            }).then((result) => {
                this.likedSongs = result.ids
            })
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
