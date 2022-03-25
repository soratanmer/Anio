import { defineStore } from 'pinia'

export const usePlaylistsStore = defineStore('playlists', {
    state: () => {
        return {
            currentPlaylists: [0],
        }
    },
    actions: {
        updateCurrentPlaylists: function (trackIDs:number[]) {
            this.currentPlaylists = trackIDs
        },
    },
})
