import { Howler, Howl } from 'howler'
import shuffle from 'lodash/shuffle'

import { fetchTracks, fetchAudioSource, scrobble } from '@/api/track'
import { fetchPersonalFM, FMTrash } from '@/api/FM'
import { FMTrashParams } from '@/api/FM'

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
    mode: PlayerMode = PlayerMode.PLAYLIST // 播放模式：播放列表 / 私人MF
    state: PlayerState = PlayerState.INITIALIZING // 播放器状态
    playlistSource: PlaylistSource | null = null // 当前播放列表的信息

    private _playlist: TrackID[] = [] // 播放列表
    private _shufflePlaylist: TrackID[] = [] // 被随机打乱的播放列表，随机播放模式下会使用此播放列表
    private _track: Track | null = null // 当前播放歌曲的详细信息
    private _trackIndex: number = 0 // 当前播放歌曲在播放列表里的index
    private _shuffleTrackIndex: number = 0 // 随机模式下，当前播放歌曲在播放列表里的index
    private _personalTrack: Track | null = null // 私人FM当前歌曲
    private _personalNextTrack: Track | null = null // 私人FM下一首歌曲信息（为了快速加载下一首）
    private _volume: number = 0.05 // 0 to 1
    private _volumeBeforeMuted: number = 0.05 // 用于保存静音前的音量
    private _shuffle: boolean = false // 是否随机播放
    private _repeatMode: RepeatMode = RepeatMode.ON //循环播放模式
    private _progress: number = 0 // 当前播放歌曲的进度
    private _progressInterval: ReturnType<typeof setInterval> | undefined
    private _howler: Howl = new Howl({
        src: [''],
        format: ['mp3', 'flac'],
    })

    constructor() {}

    /**
     * 是否正在播放
     */

    get isPlaying(): boolean {
        return this.state === PlayerState.PLAYING
    }

    /**
     * 是否 私人FM 模式
     */

    get isPersonalFM(): boolean {
        return this.mode === PlayerMode.FM
    }

    /**
     * 当前正在播放的歌曲
     */

    get track(): Track | null {
        return this._track
    }

    /**
     * 当前播放歌曲的进度条
     */

    get progress(): number {
        return this._progress
    }

    /**
     * 设置当前播放歌曲的进度条
     */

    set progress(value: number) {
        if (this._howler) {
            this._howler.seek(value)
        }
        this._progress = value
    }

    /**
     * 获取当天播放歌曲的时长
     */

    get trackDuration() {
        const trackDT = this._track?.dt || 1000
        let duration = ~~(trackDT / 1000)
        return duration > 1 ? duration - 1 : duration
    }

    /**
     * 获取循环播放状态
     */

    get repeatMode(): RepeatMode {
        return this._repeatMode
    }

    /**
     * 是否随机播放
     */

    get shuffle(): boolean {
        return this._shuffle
    }

    /**
     * 获取播放音量
     */

    get volume(): number {
        return this._volume
    }

    /**
     * 设置播放音量
     */

    set volume(volume) {
        this._volume = volume
        Howler.volume(volume)
    }

    /**
     * 获取私人FM当前歌曲
     */

    get personalFMTrack(): Track | null {
        return this._personalTrack
    }

    /**
     * 设置私人FM当前歌曲
     */

    set PersonalFMtrack(track: Track) {
        this._personalTrack = track
    }

    /**
     * 获取当前播放列表
     */

    private get _currentPlaylist() {
        if (this._shuffle) {
            return this._shufflePlaylist
        } else {
            return this._playlist
        }
    }

    /**
     * 上一首的歌曲ID
     * @returns {[number, number]} [上一首的歌曲ID, 上一首歌曲在歌曲列表里 index]
     */

    private get _previousTrackID(): number[] {
        if (this._trackIndex === 0 && this._repeatMode === RepeatMode.ON) {
            return [this._currentPlaylist[this._currentPlaylist.length - 1], this._currentPlaylist.length - 1]
        } else {
            return [this._currentPlaylist[this._trackIndex - 1], this._trackIndex - 1]
        }
    }

    /**
     * 下一首的歌曲ID
     * @returns {[number, number]} [下一首的歌曲ID, 下一首歌曲在歌曲列表里 index]
     */

    private get _nextTrackID(): number[] {
        if (this._currentPlaylist.length === this._trackIndex + 1 && this._repeatMode === RepeatMode.ON) {
            return [this._currentPlaylist[0], 0]
        } else {
            return [this._currentPlaylist[this._trackIndex + 1], this._trackIndex + 1]
        }
    }

    private async _fetchPersonalFM() {
        const { data } = await fetchPersonalFM()
        this._personalTrack = data[0]
        this._personalNextTrack = data[1]
    }

    /**
     * 打乱播放列表
     */

    private _shuffleTheList() {
        let list = this._playlist.filter((tid) => tid !== this._track?.id)

        if (this._trackIndex === 0) {
            list = this._playlist
        }
        this._shufflePlaylist = shuffle(list)

        if (this._trackIndex !== 0) {
            this._shufflePlaylist.unshift(Number(this._track?.id))
        }
    }

    /**
     * 听歌打卡，更新听歌排行数据
     * @param track
     */

    private _scrobble(track: Track) {
        scrobble({
            id: track.id,
            sourceid: Number(this.playlistSource?.id),
            time: ~~(track.dt / 1000),
        })
    }

    /**
     * 使用Howler播放歌曲
     * @param audioSource 歌曲的音频源链接
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
        this.play()

        document.title = `${this._track?.name} · ${this._track?.ar[0].name} - Anio Music`

        if (!this._progressInterval) {
            this._setupProgressInterval()
        }
    }

    /**
     * 同步进度条
     */

    private _setupProgressInterval() {
        this._progressInterval = setInterval(() => {
            if (this.isPlaying) {
                this._progress = this._howler.seek()
            }
        }, 1000)
    }

    /**
     * 获取音源
     * @returns {Promise<void>}
     */

    private async _fetchAudioSource(): Promise<void> {
        if (!this._track) {
            return Promise.reject()
        }
        const { data } = await fetchAudioSource({
            id: this._track.id,
            br: 128000,
        })
        this._playTrack(String(data[0].url))
    }

    /**
     * 替换当前正在播放的歌曲
     * @param trackID 歌曲ID
     * @param index 歌曲在播放列表里的index
     * @returns {Promise<void>}
     */

    private async _replaceTrack(trackID: TrackID, index: number): Promise<void> {
        const { songs } = await fetchTracks({
            ids: [trackID],
        })
        this._track = songs[0]
        this._trackIndex = index

        this._scrobble(this._track)

        return this._fetchAudioSource()
    }

    /**
     * 切换循环播放模式
     */

    switchRepeatMode() {
        if (this.isPersonalFM) {
            return
        }
        if (this._repeatMode === RepeatMode.ON) {
            this._repeatMode = RepeatMode.ONE
        } else if (this._repeatMode === RepeatMode.ONE) {
            this._repeatMode = RepeatMode.OFF
        } else {
            this._repeatMode = RepeatMode.ON
        }
    }

    /**
     * 切换随机播放模式
     */

    switchShuffle() {
        if (this.isPersonalFM) {
            return
        }
        this._shuffle = !this._shuffle
        if (this._shuffle) {
            this._shuffleTheList()
        } else {
            this._shufflePlaylist = []
        }
    }

    /**
     * 切换静音模式
     */

    mute() {
        if (this._volume === 0) {
            this._volume = this._volumeBeforeMuted
        } else {
            this._volumeBeforeMuted = this._volume
            this._volume = 0
        }
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

    async nextTrack() {
        if (this.isPersonalFM) {
            await this._fetchPersonalFM()
            await this._replaceTrack(this.personalFMTrack?.id || 0, 0)
        } else {
            const [id, index] = this._nextTrackID
            await this._replaceTrack(id, index)
        }
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

    replacePlaylist(trackIDs: TrackID[], source: PlaylistSource) {
        this._playlist = trackIDs
        this.playlistSource = source

        if (this._shuffle) {
            this._shuffleTheList()
        }

        this._replaceTrack(this._currentPlaylist[0], 0)
    }
}

export const player = reactive(new Player())
