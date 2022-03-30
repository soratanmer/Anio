import { Howler, Howl } from 'howler'

import { fetchTracks, fetchAudioSource } from '@/api/track'
import type { FetchTracksParams, FetchAudioSourceParams } from '@/api/track'

import { fetchPersonalFM, FMTrash } from '@/api/FM'
import { FMTrashParams } from '@/api/FM'
import { fa } from 'element-plus/es/locale'

type TrackID = number

export enum PlaylistSourceType {
    ALBUM = 'album',
    PLAYLIST = 'playlist',
    FM = 'fm',
}

interface PlaylistSource {
    type: PlaylistSourceType
    id: number | string
}

export enum PlayerMode {
    PLAYLIST = 'playlist',
    FM = 'fm',
}

export enum RepeatMode {
    ON = 'on',
    OFF = 'off',
    ONE = 'one',
}

export enum PlayerState {
    INITIALIZING = 'initializing',
    PLAYING = 'playing',
    PAUSED = 'paused',
    LOADING = 'loading',
    READY = 'ready',
}

export class Player {
    mode: PlayerMode = PlayerMode.PLAYLIST
    state: PlayerState = PlayerState.INITIALIZING
    playlistSource: PlaylistSource | null = null

    private _playlist: TrackID[] = []
    private _shufflePlaylist: TrackID[] = []
    private _track: Track | null = null
    private _trackIndex: number = 0
    private _shuffleTrackIndex: number = 0
    private _personalTrack: Track | null = null
    private _personalNextTrack: Track | null = null
    private _volume: number = 0.1
    private _volumeBeforeMuted: number = 0.1
    private _shuffle: boolean = false
    private _repeatMode: RepeatMode = RepeatMode.ON
    private _progress: number = 0
    private _howler: Howl = new Howl({
        src: [''],
        format: ['mp3', 'flac'],
    })

    constructor() {}

    /**
     * 是否正在播放
     * @type {boolean}
     */

    get isPlaying(): boolean {
        return this.state === PlayerState.PLAYING
    }

    /**
     * 当前正在播放的歌曲
     * @type {Track}
     */

    get track(): Track | null {
        return this._track
    }

    /**
     * 上一首的歌曲ID
     * @returns {[number, number]} [上一首的歌曲ID, 上一首歌曲在歌曲列表里 index]
     */

    private get _previousTrackID(): number[] {
        const previousTrackIndex = this._trackIndex - 1
        return [this._playlist[previousTrackIndex], previousTrackIndex]
    }

    /**
     * 下一首的歌曲ID
     * @returns {[number, number]} [下一首的歌曲ID, 下一首歌曲在歌曲列表里 index]
     */

    private get _nextTrackID(): number[] {
        console.log(this._playlist)

        const nextTrackIndex = this._trackIndex + 1
        return [this._playlist[nextTrackIndex], nextTrackIndex]
    }

    /**
     * (内部方法) 使用Howler播放歌曲
     * @param audioSource 歌曲的音频源链接
     * @private
     */

    private _playTrack(audioSource: string) {
        Howler.unload()
        this._howler = new Howl({
            src: [audioSource],
            format: ['mp3', 'flac'],
            autoplay: true,
            volume: this._volume,
            onend: () => this.nextTrack(),
        })
        this._howler.play()
        this.state = PlayerState.PLAYING
    }

    /**
     * (内部方法) 获取音源
     * @returns {Promise<void>}
     * @private
     */

    private async _fetchAudioSource(): Promise<void> {
        if (!this._track) {
            return Promise.reject()
        }
        const { data } = await fetchAudioSource({
            id: this._track.id,
            br: 128000,
        })
        return this._playTrack(data[0].url as string)
    }

    /**
     * (内部方法) 替换当前正在播放的歌曲
     * @param trackID 歌曲ID
     * @param index 歌曲在播放列表里的index
     * @returns {Promise<void>}
     * @private
     */

    private async _replaceTrack(trackID: TrackID, index: number): Promise<void> {
        const { songs } = await fetchTracks({
            ids: [trackID],
        })
        this._track = songs[0]
        this._trackIndex = index

        return this._fetchAudioSource()
    }

    /**
     * 播放当前歌曲
     */

    play() {
        this._howler.play()
        this.state = PlayerState.PLAYING
    }

    /**
     * 暂停当前歌曲
     */

    pause() {
        this._howler.pause()
        this.state = PlayerState.PAUSED
    }

    /**
     * 播放上一首歌曲
     */

    previousTrack() {
        const [id, index] = this._previousTrackID
        this._replaceTrack(id, index)
    }

    /**
     * 播放下一首歌曲
     */

    nextTrack() {
        const [id, index] = this._nextTrackID
        this._replaceTrack(id, index)
    }

    /**
     * 暂停或播放（如果当前正在播放，则暂停，否则播放）
     */

    playOrPause() {
        if (this.state === PlayerState.PLAYING) {
            this.pause()
        } else if ([PlayerState.PAUSED, PlayerState.LOADING].includes(this.state)) {
            this.play()
        }
    }

    /**
     * 替换当前歌曲列表
     * @param trackIDs 歌曲ID列表
     * @param source 列表来源
     * @param autoPlayTrackID 替换完歌曲列表后要自动播放的歌曲ID
     */

    replacePlaylist(trackIDs: TrackID[], source: PlaylistSource, autoPlayTrackID: number | string = 'first') {
        this.mode = PlayerMode.FM
        this._playlist = trackIDs
        this.playlistSource = source
        if (autoPlayTrackID === 'first') {
            this._replaceTrack(this._playlist[0], 0)
        } else {
            this._replaceTrack(autoPlayTrackID as number, trackIDs.indexOf(autoPlayTrackID as number))
        }
    }
}

export const player = new Player()
