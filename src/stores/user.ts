import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            history: [] as number[],
        }
    },
    getters: {},
    actions: {
        updateHistory(trackID: number) {
            let history = this.history.filter((t) => t !== trackID)
            if (history.length > 1000) {
                history.pop()
            }
            history.unshift(trackID)
            this.history = history
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
