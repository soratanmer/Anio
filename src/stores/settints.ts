import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
    state: () => {
        return {
            showSidebar: true,
            recentSongsLimit: 300,
        }
    },
    actions: {
        updateRecentSongsLimit(limit: 100 | 200 | 300) {
            this.recentSongsLimit = limit
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'settings',
                storage: localStorage,
            },
        ],
    },
})
