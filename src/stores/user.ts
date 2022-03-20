import { defineStore } from 'pinia'

interface UserState {
    cookies: {
        [key: string]: string
    }
    profile: {
        uid: number
        avatarUrl: string
    }
}

export const useUserStore = defineStore('user', {
    state: (): UserState => {
        return {
            cookies: {},
            profile: {
                uid: 0,
                avatarUrl: 'https://s4.music.126.net/style/web2/img/default/default_avatar.jpg',
            },
        }
    },
    getters: {
        isLoggedIn: (state) => {
            return ![null, undefined, ''].includes(state.cookies.MUSIC_U)
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
