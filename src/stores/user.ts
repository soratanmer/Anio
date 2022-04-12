import { defineStore } from 'pinia'
import { fetchUserAccount, fetchUserLikedSongsIDs } from '@/api/user'
import type { FetchUserAccountResponse } from '@/api/user'

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            userAccount: {} as FetchUserAccountResponse | null,
            likedList: [0],
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
