import { defineStore } from 'pinia'

import { RepeatMode, PlayerMode, PlaylistSource } from '@/hooks/usePlayer'

type TrackID = number

export const usePlayerStore = defineStore('player', {
    state: () => {
        return {
            history: [] as TrackID[], // 播放历史
            playlist: [] as TrackID[], // 正序播放列表
            shufflePlaylist: [] as TrackID[], // 被随机打乱的播放列表，随机播放模式下会使用此播放列表
            track: {} as Track, // 当前播放歌曲的详细信息
            personalFMTrack: {} as Track, // 私人FM当前歌曲
            trackIndex: 0, // 当前播放歌曲在 playlist 里的index
            shuffleTrackIndex: 0, // 随机模式下，当前播放歌曲在 playlist 里的index
            volume: 0.1, // 音量：0 to 1， 默认为 0.1
            volumeBeforeMuted: 0.1, // 用于保存静音前的音量
            progress: 0, // 当前播放歌曲的进度
            shuffle: false, // 是否随机播放
            repeatMode: RepeatMode.ON, //循环播放模式
            mode: PlayerMode.PLAYLIST, // 播放模式：播放列表 / 私人MF
            playlistSource: {} as PlaylistSource, // 当前播放列表的信息
        }
    },
    getters: {},
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
        updatePersonalFMTrack(track: Track) {
            this.personalFMTrack = track
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
        updatePlaylistSource(source: PlaylistSource) {
            this.playlistSource = source
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
