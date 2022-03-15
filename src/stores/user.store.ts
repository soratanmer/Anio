import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => {
        return { name: 'Nanami' }
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
