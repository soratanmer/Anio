import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
    state: () => {
        return {
            showSidebar: true,
        }
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
