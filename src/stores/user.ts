import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => {
        return {}
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
