import { Howler, Howl } from 'howler'
import shuffle from 'lodash/shuffle'

import { fetchTracks, fetchAudioSource, scrobble } from '@/api/track'
import { fetchPersonalFM, FMTrash } from '@/api/FM'
import { fetchPlaylist } from '@/api/playlist'
import { fetchAlbum } from '@/api/album'
import { fetchArtistSongs, OrderType } from '@/api/artist'

import { usePlayerStore } from '@/stores/player'

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

export interface PlayerPublic {
    state: PlayerState
    playlistSource: PlaylistSource | null
    mode: PlayerMode
    currentPlaylist: TrackID[]
    track: Track | null
    personalFMTrack: Track | null
    currentTrackDuration: number
    progress: number
    repeatMode: RepeatMode
    volume: number
    isPlaying: boolean
    isPersonalFM: boolean
    isMute: boolean
    isShuffle: boolean
    switchRepeatMode: () => void
    switchShuffle: () => void
    mute: () => void
    moveToFMTrash: () => void
    play: () => void
    pause: () => void
    playOrPause: () => void
    previousTrack: () => void
    nextTrack: () => void
    replacePlaylist: (trackIDs: TrackID[], playlistSource: PlaylistSource, trackID?: TrackID) => void
    playPlaylistByID: (playlistID: number, trackID?: TrackID) => void
    playAlbumByID: (albumID: number, trackID?: TrackID) => void
    playArtistByID: (artistID: number, trackID?: TrackID) => void
    playTrackOnListByID: (trackID: TrackID) => void
}

export function usePlayerProvider() {
    const playerStore = usePlayerStore()

    const state = ref<PlayerState>(PlayerState.INITIALIZING) // 播放器状态
    const playlistSource = ref<PlaylistSource | null>(null) // 当前播放列表的信息

    const _progressInterval = ref<ReturnType<typeof setInterval> | undefined>(undefined)
    const _howler = ref<Howl>(
        new Howl({
            src: [''],
            format: ['mp3', 'flac'],
        }),
    ) //Howler

    /**
     * 播放模式
     */

    const mode = computed<PlayerMode>({
        get() {
            return playerStore.mode
        },
        set(mode: PlayerMode) {
            playerStore.updatePlayerMode(mode)
        },
    })

    /**
     * 获取当前播放列表
     */

    const currentPlaylist = computed<number[]>(() => {
        return isShuffle.value ? playerStore.shufflePlaylist : playerStore.playlist
    })

    /**
     * 当前正在播放的歌曲
     */

    const track = computed<Track>({
        get() {
            return playerStore.track
        },
        set(track) {
            playerStore.updateTrack(track)
        },
    })

    /**
     * 私人FM当前歌曲
     */

    const personalFMTrack = computed<Track>({
        get() {
            return playerStore.personalFMTrack
        },
        set(track) {
            playerStore.updatePersonalFMTrack(track)
        },
    })

    /**
     * 当前歌曲时长
     */

    const currentTrackDuration = computed(() => {
        return track.value.dt / 1000
    })

    /**
     * 当前播放歌曲的进度条
     */

    const progress = computed<number>({
        get() {
            return playerStore.progress
        },
        set(value: number) {
            if (_howler) {
                _howler.value.seek(value)
            }
            playerStore.updateProgress(value)
        },
    })

    /**
     * 获取循环播放状态
     */

    const repeatMode = computed<RepeatMode>({
        get() {
            return playerStore.repeatMode
        },
        set(repeatMode) {
            playerStore.updateRepeatMode(repeatMode)
        },
    })

    /**
     * 播放音量
     */

    const volume = computed<number>({
        get() {
            return playerStore.volume
        },
        set(volume: number) {
            playerStore.updateVolume(volume)
            Howler.volume(volume)
        },
    })

    /**
     * 是否正在播放
     */

    const isPlaying = computed<boolean>(() => {
        return state.value === PlayerState.PLAYING
    })

    /**
     * 是否 私人FM 模式
     */

    const isPersonalFM = computed<boolean>(() => {
        return mode.value === PlayerMode.FM
    })

    /**
     * 是否静音
     */

    const isMute = computed(() => {
        return volume.value === 0
    })

    /**
     * 是否随机播放
     */

    const isShuffle = computed<boolean>(() => {
        return playerStore.shuffle
    })

    /**
     * 当前播放歌曲在 playlist 里的index
     * @private
     */

    const _trackIndex = computed<number>({
        get() {
            return playerStore.trackIndex
        },
        set(index) {
            playerStore.updateTrackIndex(index)
        },
    })

    /**
     * 上一首的歌曲ID
     * @returns {[number, number]} [上一首的歌曲ID, 上一首歌曲在歌曲列表里 index]
     * @private
     */

    const _previousTrackID = computed<number[]>(() => {
        if (_trackIndex.value === 0 && repeatMode.value === RepeatMode.ON) {
            return [currentPlaylist.value[currentPlaylist.value.length - 1], currentPlaylist.value.length - 1]
        } else {
            return [currentPlaylist.value[_trackIndex.value - 1], _trackIndex.value - 1]
        }
    })

    /**
     * 下一首的歌曲ID
     * @returns {[number, number]} [下一首的歌曲ID, 下一首歌曲在歌曲列表里 index]
     * @private
     */

    const _nextTrackID = computed<number[]>(() => {
        if (currentPlaylist.value.length === _trackIndex.value + 1 && repeatMode.value === RepeatMode.ON) {
            return [currentPlaylist.value[0], 0]
        } else {
            return [currentPlaylist.value[_trackIndex.value + 1], _trackIndex.value + 1]
        }
    })

    /**
     * （内部方法）初始化
     * @private
     */

    const _initPlayer = () => {
        if (!personalFMTrack.value.id) {
            _fetchPersonalFM()
        }

        if (track.value.id) {
            const autoplay = false
            _replaceTrack(track.value.id, _trackIndex.value, autoplay)
            _howler.value.seek(playerStore.progress)
        }
    }

    /**
     * （内部方法）获取 私人FM 里的第一首曲子
     * @private
     */

    const _fetchPersonalFM = async () => {
        const { data } = await fetchPersonalFM()
        personalFMTrack.value = data[0]
    }

    /**
     * (内部方法) 打乱播放列表
     * @private
     */

    const _shuffleTheList = (trackID?: TrackID) => {
        let list = playerStore.playlist.filter((tid) => tid !== trackID)

        if (!trackID) {
            list = playerStore.playlist
        }

        list = shuffle(list)

        if (trackID) {
            list.unshift(trackID)
        }

        playerStore.updateShufflePlaylist(list)
    }

    /**
     * （内部方法）听歌打卡，更新听歌排行数据
     * @param track
     * @private
     */

    const _scrobble = async (track: Track) => {
        await scrobble({
            id: track.id,
            sourceid: Number(playlistSource.value?.id),
            time: ~~(track.dt / 1000),
        })
    }

    /**
     * (内部方法) 使用Howler播放歌曲
     * @param audioSource 歌曲的音频源链接
     * @param autoplay 是否自动播放
     * @private
     */

    const _playTrack = async (audioSource: string, autoplay: boolean) => {
        Howler.unload()
        _howler.value = new Howl({
            src: [audioSource],
            format: ['mp3', 'flac'],
            volume: volume.value,
            onend: () => nextTrack(),
        })

        if (autoplay) {
            play()
            document.title = `${track.value.name} · ${track.value.ar[0].name} - Anio Music`
        }

        if (!_progressInterval.value) {
            _setupProgressInterval()
        }
    }

    /**
     * (内部方法) 同步进度条
     * @private
     */

    const _setupProgressInterval = () => {
        _progressInterval.value = setInterval(() => {
            if (isPlaying.value) {
                progress.value = _howler.value.seek()
            }
        }, 1000)
    }

    /**
     * (内部方法) 获取音源
     * @param autoplay 是否自动播放
     * @returns {Promise<void>}
     * @private
     */

    const _fetchAudioSource = async (autoplay: boolean): Promise<void> => {
        if (!track.value) {
            return Promise.reject()
        }
        const { data: neteaseSource } = await fetchAudioSource({
            id: track.value.id,
            br: 128000,
        })

        if (neteaseSource[0].url) {
            _playTrack(neteaseSource[0].url as string, autoplay)
        } else {
            nextTrack()
        }
    }

    /**
     * (内部方法) 替换当前正在播放的歌曲
     * @param trackID 歌曲ID
     * @param index 歌曲在播放列表里的index
     * @returns {Promise<void>}
     * @private
     */

    const _replaceTrack = async (trackID: TrackID, index: number, autoplay = true) => {
        const { songs } = await fetchTracks({ ids: [trackID] })
        track.value = songs[0]
        _trackIndex.value = index

        _scrobble(track.value)

        playerStore.updateHistory(track.value.id)

        playerStore.updateShuffleTrackIndex(playerStore.playlist.indexOf(track.value.id))

        return _fetchAudioSource(autoplay)
    }

    /**
     * 切换循环播放模式
     */

    const switchRepeatMode = () => {
        if (isPersonalFM.value) {
            return
        }
        if (repeatMode.value === RepeatMode.ON) {
            repeatMode.value = RepeatMode.ONE
        } else if (repeatMode.value === RepeatMode.ONE) {
            repeatMode.value = RepeatMode.OFF
        } else {
            repeatMode.value = RepeatMode.ON
        }
    }

    /**
     * 切换随机播放模式
     */

    const switchShuffle = () => {
        if (isPersonalFM.value) {
            return
        }
        playerStore.updateShuffle()
        if (isShuffle.value) {
            _shuffleTheList()
        } else {
            playerStore.updateShufflePlaylist([])
        }
    }

    /**
     * 切换静音模式
     */

    const mute = () => {
        if (volume.value === 0) {
            volume.value = playerStore.volumeBeforeMuted
        } else {
            playerStore.updateVolumeBeforeMuted(volume.value)
            volume.value = 0
        }
    }

    /**
     * 将当前播放的私人FM曲子以至垃圾桶
     */

    const moveToFMTrash = () => {
        nextTrack()
        FMTrash({
            id: Number(personalFMTrack.value.id),
        })
    }

    /**
     * 播放当前歌曲
     */

    const play = () => {
        _howler.value.play()
        state.value = PlayerState.PLAYING
    }

    /**
     * 暂停当前歌曲
     */

    const pause = () => {
        _howler.value.pause()
        state.value = PlayerState.PAUSED
    }

    /**
     * 暂停或播放（如果当前正在播放，则暂停，否则播放）
     */

    const playOrPause = () => {
        if (state.value === PlayerState.PLAYING) {
            pause()
        } else if ([PlayerState.PAUSED, PlayerState.LOADING, PlayerState.INITIALIZING].includes(state.value)) {
            play()
        }
    }

    /**
     * 播放上一首歌曲
     */

    const previousTrack = () => {
        const [id, index] = _previousTrackID.value
        if (id === undefined) {
            _howler.value.stop()
            state.value = PlayerState.PAUSED
        } else {
            _replaceTrack(id, index)
        }
    }

    /**
     * 播放下一首歌曲
     */
    const nextTrack = async () => {
        if (isPersonalFM.value) {
            await _fetchPersonalFM()
            await _replaceTrack(personalFMTrack.value.id || 0, 0)
        } else {
            const [id, index] = _nextTrackID.value
            if (id === undefined) {
                _howler.value.stop()
                state.value = PlayerState.PAUSED
            } else {
                _replaceTrack(id, index)
            }
        }
    }

    /**
     * 替换当前歌曲列表
     * @param trackIDs 歌曲ID列表
     * @param source 列表来源
     */

    const replacePlaylist = (trackIDs: TrackID[], source: PlaylistSource, trackID?: TrackID) => {
        playerStore.updatePlaylist(trackIDs)
        playlistSource.value = source

        if (isShuffle.value) {
            _shuffleTheList(trackID)
        }

        if (!trackID) {
            _replaceTrack(currentPlaylist.value[0], 0)
        } else {
            _trackIndex.value = trackIDs.indexOf(trackID)
            _replaceTrack(currentPlaylist.value[_trackIndex.value], _trackIndex.value)
        }
    }

    const playPlaylistByID = async (playlistID: number, trackID?: TrackID) => {
        mode.value = PlayerMode.PLAYLIST
        const res = await fetchPlaylist({
            id: playlistID,
            s: 0,
        })
        const trackIDs = computed(() => {
            return res.playlist.trackIds.map((item) => item.id) || []
        })
        replacePlaylist(
            trackIDs.value,
            {
                type: PlaylistSourceType.PLAYLIST,
                id: playlistID,
            },
            trackID,
        )
    }

    const playAlbumByID = async (albumID: number, trackID?: TrackID) => {
        mode.value = PlayerMode.PLAYLIST
        const res = await fetchAlbum({
            id: albumID,
        })
        const trackIDs = computed(() => {
            return res.songs.map((item) => item.id)
        })
        replacePlaylist(
            trackIDs.value,
            {
                type: PlaylistSourceType.PLAYLIST,
                id: albumID,
            },
            trackID,
        )
    }

    const playArtistByID = async (artistID: number, trackID?: TrackID) => {
        mode.value = PlayerMode.PLAYLIST
        const res = await fetchArtistSongs({
            id: artistID,
            order: OrderType.hot,
        })
        const trackIDs = computed(() => {
            return res.songs.map((item) => item.id)
        })
        replacePlaylist(
            trackIDs.value,
            {
                type: PlaylistSourceType.PLAYLIST,
                id: artistID,
            },
            trackID,
        )
    }

    const playTrackOnListByID = (trackID: TrackID) => {
        mode.value = PlayerMode.PLAYLIST
        _trackIndex.value = currentPlaylist.value.indexOf(trackID)
        _replaceTrack(currentPlaylist.value[_trackIndex.value], _trackIndex.value)
    }

    const player = reactive({
        state,
        playlistSource,
        mode,
        currentPlaylist,
        track,
        personalFMTrack,
        currentTrackDuration,
        progress,
        repeatMode,
        volume,
        isPlaying,
        isPersonalFM,
        isMute,
        isShuffle,
        switchRepeatMode,
        switchShuffle,
        mute,
        moveToFMTrash,
        play,
        pause,
        playOrPause,
        previousTrack,
        nextTrack,
        replacePlaylist,
        playPlaylistByID,
        playAlbumByID,
        playArtistByID,
        playTrackOnListByID,
    })

    _initPlayer()

    provide('player', player)
}

export default function usePlayer() {
    return inject<PlayerPublic>('player')
}
