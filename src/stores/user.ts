import { defineStore } from 'pinia'

interface UserState {
    cookies: {
        [key: string]: string
    }
}

export const useUserStore = defineStore('user', {
    state: (): UserState => {
        return {
            cookies: {},
        }
    },
    getters: {
        isLoggedIn: (state) => {
            return [null, undefined, ''].includes(state.cookies.MUSIC_U)
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
