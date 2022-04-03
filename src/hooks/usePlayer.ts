import { Howler, Howl } from 'howler'
import shuffle from 'lodash/shuffle'

import { fetchTracks, fetchAudioSource, scrobble } from '@/api/track'
import { fetchPersonalFM, FMTrash } from '@/api/FM'
import type { FMTrashParams } from '@/api/FM'

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
    mode: PlayerMode
    state: PlayerState
    playlistSource: PlaylistSource | null
    isPlaying: boolean
    isPersonalFM: boolean
    track: Track | null
    progress: number
    repeatMode: RepeatMode
    isShuffle: boolean
    volume: number
    personalFMTrack: Track | null
    switchRepeatMode: () => void
    switchShuffle: () => void
    mute: () => void
    moveToFMTrash: () => void
    play: () => void
    pause: () => void
    playOrPause: () => void
    previousTrack: () => void
    nextTrack: () => void
    replacePlaylist: (trackIDs: TrackID[], playlistSource: PlaylistSource) => void
}

export function usePlayerProvider() {
    const playerStore = usePlayerStore()

    const state = ref<PlayerState>(PlayerState.INITIALIZING) // 播放器状态
    const playlistSource = ref<PlaylistSource | null>(null) // 当前播放列表的信息

    const _mode = ref<PlayerMode>(PlayerMode.PLAYLIST) // 播放模式
    const _playlist = ref<TrackID[]>([]) // 播放列表
    const _shufflePlaylist = ref<TrackID[]>([]) // 随机播放列表
    const _track = ref<Track | null>(null) // 当前播放歌曲的详细信息
    const _trackIndex = ref<number>(0) // 当前播放歌曲在 _playlist 里的 index
    const _shuffleTrackIndex = ref<number>(0) //当前播放歌曲在 _shufflePlaylist 里的 index
    const _personalTrack = ref<Track | null>(null) // 私人FM当前歌曲
    const _personalNextTrack = ref<Track | null>(null) // 私人FM下一首歌曲信息
    const _volume = ref<number>(0.05) // 音量 0 - 1
    const _volumeBeforeMuted = ref<number>(0.05) // 用于保存静音前的音量
    const _shuffle = ref<boolean>(false) // 是否随机播放
    const _repeatMode = ref<RepeatMode>(RepeatMode.ON) // 循环播放模式
    const _progress = ref<number>(0) // 当前播放歌曲的进度
    const _progressInterval = ref<ReturnType<typeof setInterval> | undefined>(undefined)
    const _howler = ref<Howl>(
        new Howl({
            src: [''],
            format: ['mp3', 'flac'],
        }),
    ) //Howler

    const mode = computed<PlayerMode>({
        get() {
            return _mode.value
        },
        set(mode: PlayerMode) {
            _mode.value = mode
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
     * 当前正在播放的歌曲
     */

    const track = computed(() => {
        return _track.value
    })

    /**
     * 当前播放歌曲的进度条
     */

    const progress = computed<number>({
        get() {
            return _progress.value
        },
        set(value: number) {
            if (_howler) {
                _howler.value.seek(value)
            }
            _progress.value = value
        },
    })

    /**
     * 获取循环播放状态
     */

    const repeatMode = computed<RepeatMode>(() => {
        return _repeatMode.value
    })

    /**
     * 是否随机播放
     */

    const isShuffle = computed<boolean>(() => {
        return _shuffle.value
    })

    /**
     * 播放音量
     */

    const volume = computed<number>({
        get() {
            return _volume.value
        },
        set(volume: number) {
            _volume.value = volume
            Howler.volume(volume)
        },
    })

    /**
     * 私人FM当前歌曲
     */

    const personalFMTrack = computed(() => {
        return _personalTrack.value
    })

    /**
     * 获取当前播放列表
     */

    const _currentPlaylist = computed<number[]>(() => {
        if (_shuffle.value) {
            return playerStore.shufflePlaylist
        } else {
            return playerStore.playlist
        }
    })

    /**
     * 上一首的歌曲ID
     * @returns {[number, number]} [上一首的歌曲ID, 上一首歌曲在歌曲列表里 index]
     */

    const _previousTrackID = computed<number[]>(() => {
        if (_trackIndex.value === 0 && _repeatMode.value === RepeatMode.ON) {
            return [_currentPlaylist.value[_currentPlaylist.value.length - 1], _currentPlaylist.value.length - 1]
        } else {
            return [_currentPlaylist.value[_trackIndex.value - 1], _trackIndex.value - 1]
        }
    })

    /**
     * 下一首的歌曲ID
     * @returns {[number, number]} [下一首的歌曲ID, 下一首歌曲在歌曲列表里 index]
     */

    const _nextTrackID = computed<number[]>(() => {
        if (_currentPlaylist.value.length === _trackIndex.value + 1 && _repeatMode.value === RepeatMode.ON) {
            return [_currentPlaylist.value[0], 0]
        } else {
            return [_currentPlaylist.value[_trackIndex.value + 1], _trackIndex.value + 1]
        }
    })

    const _fetchPersonalFM = async () => {
        const { data } = await fetchPersonalFM()
        _personalTrack.value = data[0]
    }

    /**
     * (内部方法) 打乱播放列表
     */

    const _shuffleTheList = () => {
        let list = playerStore.playlist.filter((tid) => tid !== _track.value?.id)

        if (_trackIndex.value === 0) {
            list = playerStore.playlist
        }

        playerStore.updateShufflePlaylist(shuffle(list))

        if (_trackIndex.value !== 0) {
            list.unshift(Number(_track.value?.id))
            playerStore.updateShufflePlaylist(list)
        }
    }

    /**
     * 听歌打卡，更新听歌排行数据
     * @param track
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
     * @private
     */

    const _playTrack = async (audioSource: string) => {
        Howler.unload()
        _howler.value = new Howl({
            src: [audioSource],
            format: ['mp3', 'flac'],
            autoplay: true,
            volume: _volume.value,
            onend: () => nextTrack(),
        })
        play()

        document.title = `${_track.value?.name} · ${_track.value?.ar[0].name} - Anio Music`

        if (!_progressInterval.value) {
            _setupProgressInterval()
        }
    }

    /**
     * (内部方法) 同步进度条
     */

    const _setupProgressInterval = () => {
        _progressInterval.value = setInterval(() => {
            if (isPlaying.value) {
                _progress.value = _howler.value.seek()
            }
        }, 1000)
    }

    /**
     * (内部方法) 获取音源
     */

    const _fetchAudioSource = async (): Promise<void> => {
        if (!_track.value) {
            return Promise.reject()
        }
        const { data: neteaseSource } = await fetchAudioSource({
            id: _track.value.id,
            br: 128000,
        })
        _playTrack(neteaseSource[0].url as string)
    }

    /**
     * (内部方法) 替换当前正在播放的歌曲
     * @param trackID 歌曲ID
     * @param index 歌曲在播放列表里的index
     * @returns {Promise<void>}
     * @private
     */

    const _replaceTrack = async (trackID: TrackID, index: number) => {
        const { songs } = await fetchTracks({ ids: [trackID] })
        _track.value = songs[0]
        _trackIndex.value = index

        _scrobble(_track.value)

        playerStore.updateHistory(_track.value.id)

        return _fetchAudioSource()
    }

    /**
     * 切换循环播放模式
     */

    const switchRepeatMode = () => {
        if (isPersonalFM.value) {
            return
        }
        if (_repeatMode.value === RepeatMode.ON) {
            _repeatMode.value = RepeatMode.ONE
        } else if (_repeatMode.value === RepeatMode.ONE) {
            _repeatMode.value = RepeatMode.OFF
        } else {
            _repeatMode.value = RepeatMode.ON
        }
    }

    /**
     * 切换随机播放模式
     */

    const switchShuffle = () => {
        if (isPersonalFM.value) {
            return
        }
        _shuffle.value = !_shuffle.value
        if (isShuffle.value) {
            _shuffleTheList()
        }else{
            playerStore.updateShufflePlaylist([])
        }
    }

    /**
     * 切换静音模式
     */

    const mute = () => {
        if (_volume.value === 0) {
            _volume.value = _volumeBeforeMuted.value
        } else {
            _volumeBeforeMuted.value = _volume.value
            _volume.value = 0
        }
    }

    const moveToFMTrash = () => {
        nextTrack()
        FMTrash({
            id: Number(_personalTrack.value?.id),
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
        } else if ([PlayerState.PAUSED, PlayerState.LOADING].includes(state.value)) {
            play()
        }
    }

    /**
     * 播放上一首歌曲
     */

    const previousTrack = () => {
        const [id, index] = _previousTrackID.value
        _replaceTrack(id, index)
    }

    /**
     * 播放下一首歌曲
     */
    const nextTrack = async () => {
        if (isPersonalFM.value) {
            await _fetchPersonalFM()
            await _replaceTrack(_personalTrack.value?.id || 0, 0)
        } else {
            const [id, index] = _nextTrackID.value
            _replaceTrack(id, index)
        }
    }

    /**
     * 替换当前歌曲列表
     * @param trackIDs 歌曲ID列表
     * @param source 列表来源
     * @param autoPlayTrackID 替换完歌曲列表后要自动播放的歌曲ID
     */

    const replacePlaylist = (trackIDs: TrackID[], source: PlaylistSource) => {
        playerStore.updatePlaylist(trackIDs)
        playlistSource.value = source

        if (isShuffle.value) {
            _shuffleTheList()
        }

        _replaceTrack(_currentPlaylist.value[0], 0)
    }

    const player = reactive({
        mode,
        state,
        playlistSource,
        isPlaying,
        isPersonalFM,
        track,
        progress,
        repeatMode,
        isShuffle,
        volume,
        personalFMTrack,
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
    })

    _fetchPersonalFM()

    provide('player', player)
}

export default function usePlayer() {
    return inject<PlayerPublic>('player')
}
