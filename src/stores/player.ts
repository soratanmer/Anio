import { defineStore } from 'pinia'

import { RepeatMode, PlayerMode } from '@/hooks/usePlayer'

type TrackID = number

export const usePlayerStore = defineStore('player', {
    state: () => {
        return {
            history: [] as TrackID[],
            playlist: [] as TrackID[],
            shufflePlaylist: [] as TrackID[],
            track: {} as Track,
            trackIndex: 0,
            shuffleTrackIndex: 0,
            volume: 0.1,
            volumeBeforeMuted: 0.1,
            progress: 0,
            shuffle: false,
            repeatMode: RepeatMode.ON,
            mode: PlayerMode.PLAYLIST,
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
        updateTrack(track: Track) {
            this.track = track
        },
        updateTrackIndex(index: number) {
            this.trackIndex = index
        },
        updateShuffleTrackIndex(index: number) {
            this.shuffleTrackIndex = index
        },
        updateVolume(volume: number) {
            this.volume = volume
        },
        updateVolumeBeforeMuted(volume: number) {
            this.volumeBeforeMuted = volume
        },
        updateProgress(progress: number) {
            this.progress = progress
        },
        updateShuffle() {
            this.shuffle = !this.shuffle
        },
        updateRepeatMode(mode: RepeatMode) {
            this.repeatMode = mode
        },
        updatePlayerMode(mode: PlayerMode) {
            this.mode = mode
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
