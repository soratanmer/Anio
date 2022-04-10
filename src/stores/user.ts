import { defineStore } from 'pinia'
import { fetchUserAccount, fetchUserLikedSongsIDs } from '@/api/user'
import type { FetchUserAccountResponse } from '@/api/user'

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            userAccount: {} as FetchUserAccountResponse | null,
            likedList: [] as number[] | undefined,
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
            this.likedList = data.value?.ids
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
