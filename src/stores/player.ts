import { defineStore } from 'pinia'

type TrackID = number

export const usePlayerStore = defineStore('player', {
    state: () => {
        return {
            history: [] as TrackID[],
            playlist: [] as TrackID[],
            shufflePlaylist: [] as TrackID[],
            shuffle: false,
        }
    },
    getters: {
        currentPlaylist(): TrackID[] {
            if (this.shuffle) {
                return this.shufflePlaylist
            } else {
                return this.playlist
            }
        },
    },
    actions: {
        updateHistory(trackID: TrackID) {
            let history = this.history.filter((t) => t !== trackID)
            if (history.length > 1000) {
                history.pop()
            }
            history.unshift(trackID)
            this.history = history
        },
        updatePlaylist(list: TrackID[]) {
            this.playlist = list
        },
        updateShufflePlaylist(list: TrackID[]) {
            this.shufflePlaylist = list
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'player',
                storage: localStorage,
            },
        ],
    },
})
