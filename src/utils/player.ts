import { Howler, Howl } from 'howler'

import { fetchTracks, fetchAudioSource } from '@/api/track'

type TrackID = number

enum PlaylistSourceType {
    ALBUM = 'album',
    PLAYLIST = 'playlist',
    FM = 'fm',
}

interface PlaylistSource {
    type: PlaylistSourceType
    id: number | string
}

export enum Mode {
    PLAYLIST = 'playlist',
    FM = 'fm',
}

export enum RepeatMode {
    ON = 'on',
    OFF = 'off',
    ONE = 'one',
}

export enum State {
    INITIALIZING = 'initializing',
    PLAYING = 'playing',
    PAUSED = 'paused',
    LOADING = 'loading',
    READY = 'ready',
}

let _howler = new Howl({
    src: [''],
    format: ['mp3', 'flac'],
})

export class Player {
    private _track: Track | null = null
    private _trackIndex: number = 0
    private _progress: number = 0
    private _progressInterval: ReturnType<typeof setInterval> | undefined

    state: State = State.INITIALIZING
    mode: Mode = Mode.PLAYLIST
    playlist: TrackID[] = [] //
    playlistSource: PlaylistSource | null = null
    shuffle: boolean = false
    repeatMode: RepeatMode = RepeatMode.OFF

    constructor() {}

    /**
     * Get prev track index
     */

    get _prevTrackIndex(): number | undefined {
        switch (this.repeatMode) {
            case RepeatMode.ONE:
                return this._trackIndex
            case RepeatMode.ON:
                if (this._trackIndex - 1 < 0) {
                    return this.playlist.length - 1
                }
                return this._trackIndex - 1
            case RepeatMode.OFF:
                if (this._trackIndex === 0) {
                    return 0
                }
                return this._trackIndex - 1
        }
    }

    /**
     * Get next track index
     */

    get _nextTrackIndex(): number | undefined {
        switch (this.repeatMode) {
            case RepeatMode.ONE:
                return this._trackIndex
            case RepeatMode.ON:
                if (this._trackIndex + 1 >= this.playlist.length) {
                    return 0
                }
                return this._trackIndex + 1
            case RepeatMode.OFF:
                if (this._trackIndex + 1 >= this.playlist.length) {
                    return
                }
                return this._trackIndex + 1
        }
    }

    /**
     * Cet current playing track ID
     */

    get trackID(): TrackID {
        const { playlist, _trackIndex } = this
        return playlist[_trackIndex] ?? 0
    }

    /**
     * Get current playing track
     */

    public get track(): Track | null {
        return this._track ?? null
    }

    /**
     * Get / Set progress of current track
     */

    get progress(): number {
        return this._progress
    }

    set progress(value) {
        this._progress = value
        _howler.seek(value)
    }

    private _setupProgressInterval() {
        this._progressInterval = setInterval(() => {
            if (this.state === State.PLAYING) {
                this._progress = _howler.seek()
            }
        }, 1000)
    }

    /**
     * Fetch track details
     */

    private async _fetchTrack(trackID: TrackID) {
        this.state = State.LOADING
        const response = await fetchTracks({ ids: [trackID] })
        if (response.songs.length) {
            return response.songs[0]
        }
    }

    /**
     * Fetch track audio source url
     */

    private async _fetchAudioSource(trackID: TrackID) {
        const response = await fetchAudioSource({ id: trackID })
        if (response.data?.[0]?.url) {
            return response.data[0].url
        }
    }

    /**
     * Play a track
     */

    private async _playTrack() {
        const track = await this._fetchTrack(this.trackID)
        if (track) {
            this._track = track
            this._PlayAudio()
        }
    }

    /**
     * Play audio via howler
     */

    private async _PlayAudio() {
        const audio = await this._fetchAudioSource(this.trackID)

        if (!audio) {
            console.log('error')
            return
        }
        Howler.unload()

        const howler = new Howl({
            src: [audio],
            format: ['mp2', 'flac'],
            html5: true,
            autoplay: true,
            volume: 1,
            onend: () => {
                return this._howlerOnEndCallback()
            },
        })

        _howler = howler

        this.play()

        this.state = State.PLAYING

        if (!this._progressInterval) {
            this._setupProgressInterval()
        }
    }

    private _howlerOnEndCallback() {
        console.debug('_howlerOnEndCallback')

        if (this.repeatMode === RepeatMode.ONE) {
            _howler.seek(0)
            _howler.play()
        } else {
            this.nextTrack()
        }
    }
    /**
     * 播放当前歌曲
     */

    play() {
        if (_howler.playing()) {
            return
        }
        _howler.play()
        this.state = State.PLAYING
        this._progress = _howler.seek()
    }

    /**
     * 暂停播放当前歌曲
     */

    pause() {
        _howler.pause()
        this.state === State.PAUSED
    }

    /**
     * 播放或暂停
     */

    playOrPause() {
        this.state === State.PLAYING ? this.pause() : this.play()
    }

    /**
     * 播放上一首歌曲
     */

    prevTrack() {
        if (this._prevTrackIndex === undefined) {
            // no track
            return
        }
        this._trackIndex = this._prevTrackIndex
        this._playTrack()
    }

    /**
     * 播放下一首歌曲
     */

    nextTrack() {
        if (this._nextTrackIndex === undefined) {
            // no track
            return
        }
        this._trackIndex = this._nextTrackIndex
        this._playTrack()
    }

    /**
     * Play a playlist
     */

    async playPlaylist(playlist: Playlist, autoPlayTrackID?: null | number) {
        if (!playlist.trackIds?.length) {
            return
        }
        this.playlistSource = {
            type: PlaylistSourceType.PLAYLIST,
            id: playlist.id,
        }
        this.mode = Mode.PLAYLIST
        this.playlist = playlist.trackIds.map((t) => t.id)
        this._trackIndex = autoPlayTrackID ? playlist.trackIds.findIndex((t) => t.id === autoPlayTrackID) : 0
        this._playTrack()
    }

    /**
     * Play a Album
     */

    async playAlbum(album: Album, autoPlayTrackID?: null | number) {
        if (!album.songs.length) {
            return
        }
        this.playlistSource = {
            type: PlaylistSourceType.ALBUM,
            id: album.id,
        }
        this.mode = Mode.PLAYLIST
        this.playlist = album.songs.map((t) => t.id)
        this._trackIndex = autoPlayTrackID ? album.songs.findIndex((t) => t.id === autoPlayTrackID) : -this._playTrack()
    }

    /**
     * Play track in playlist by id
     */

    async playTrack(trackID: TrackID) {
        const index = this.playlist.findIndex((t) => t === trackID)
        if (!index) {
            // no track
            return
        }
        this._trackIndex = index
        this._playTrack()
    }
}

export const player = new Player()
