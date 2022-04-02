import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            account:{},
            likeList:[]
        }
    },
    getters: {},
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
