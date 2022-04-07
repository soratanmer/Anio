import { defineStore } from 'pinia'
import { fetchUserAccount, fetchUserLikedSongsIDs } from '@/api/user'
import type { FetchUserAccountResponse } from '@/api/user'

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            userAccount: {} as FetchUserAccountResponse,
            likedList: [] as number[],
        }
    },
    getters: {},
    actions: {
        async updateUserAccount() {
            this.userAccount = await fetchUserAccount()
        },
        async updateLikedList() {
            const { ids } = await fetchUserLikedSongsIDs({
                uid: this.userAccount.account?.id ?? 0,
            })
            this.likedList = ids
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
