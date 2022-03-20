import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
    state: () => {
        return {
            loginPhoneCountryCode: '+86',
            searchKeywords: '',
        }
    },
})
