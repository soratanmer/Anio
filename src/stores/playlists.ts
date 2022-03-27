import { defineStore } from 'pinia'

export const usePlaylistsStore = defineStore('playlists', {
    state: () => {
        return {
            currentPlaylists: [0],
        }
    },
    actions: {
        updateCurrentPlaylists(trackIDs: number[]) {
            this.currentPlaylists = trackIDs
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'playlists',
                storage: localStorage,
            },
        ],
    },
})
