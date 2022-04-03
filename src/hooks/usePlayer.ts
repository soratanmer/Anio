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
    isMute: boolean
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

    const _personalFMTrack = ref<Track | null>(null) // 私人FM当前歌曲
    const _progressInterval = ref<ReturnType<typeof setInterval> | undefined>(undefined)
    const _howler = ref<Howl>(
        new Howl({
            src: [''],
            format: ['mp3', 'flac'],
        }),
    ) //Howler

    const mode = computed<PlayerMode>({
        get() {
            return playerStore.mode
        },
        set(mode: PlayerMode) {
            playerStore.updatePlayerMode(mode)
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
     * 是否随机播放
     */

    const isShuffle = computed<boolean>(() => {
        return playerStore.shuffle
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
     * 私人FM当前歌曲
     */

    const personalFMTrack = computed(() => {
        return _personalFMTrack.value
    })

    const _trackIndex = computed<number>({
        get() {
            return playerStore.trackIndex
        },
        set(index) {
            playerStore.updateTrackIndex(index)
        },
    })

    /**
     * 获取当前播放列表
     */

    const _currentPlaylist = computed<number[]>(() => {
        return isShuffle.value ? playerStore.shufflePlaylist : playerStore.playlist
    })

    /**
     * 上一首的歌曲ID
     * @returns {[number, number]} [上一首的歌曲ID, 上一首歌曲在歌曲列表里 index]
     */

    const _previousTrackID = computed<number[]>(() => {
        if (_trackIndex.value === 0 && repeatMode.value === RepeatMode.ON) {
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
        if (_currentPlaylist.value.length === _trackIndex.value + 1 && repeatMode.value === RepeatMode.ON) {
            return [_currentPlaylist.value[0], 0]
        } else {
            return [_currentPlaylist.value[_trackIndex.value + 1], _trackIndex.value + 1]
        }
    })

    const _fetchPersonalFM = async () => {
        const { data } = await fetchPersonalFM()
        _personalFMTrack.value = data[0]
    }

    /**
     * (内部方法) 打乱播放列表
     */

    const _shuffleTheList = () => {
        let list = playerStore.playlist.filter((tid) => tid !== track.value.id)

        if (_trackIndex.value === 0) {
            list = playerStore.playlist
        }

        list = shuffle(list)

        if (_trackIndex.value !== 0) {
            list.unshift(track.value.id)
        }

        playerStore.updateShufflePlaylist(list)
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
            volume: volume.value,
            onend: () => nextTrack(),
        })
        play()

        document.title = `${track.value.name} · ${track.value.ar[0].name} - Anio Music`

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
                progress.value = _howler.value.seek()
            }
        }, 1000)
    }

    /**
     * (内部方法) 获取音源
     */

    const _fetchAudioSource = async (): Promise<void> => {
        if (!track.value) {
            return Promise.reject()
        }
        const { data: neteaseSource } = await fetchAudioSource({
            id: track.value.id,
            br: 128000,
        })

        if (neteaseSource[0].url) {
            _playTrack(neteaseSource[0].url as string)
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

    const _replaceTrack = async (trackID: TrackID, index: number) => {
        const { songs } = await fetchTracks({ ids: [trackID] })
        track.value = songs[0]
        _trackIndex.value = index

        _scrobble(track.value)

        playerStore.updateHistory(track.value.id)

        playerStore.updateShuffleTrackIndex(playerStore.playlist.indexOf(track.value.id))

        return _fetchAudioSource()
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

    const moveToFMTrash = () => {
        nextTrack()
        FMTrash({
            id: Number(_personalFMTrack.value?.id),
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
        _replaceTrack(id, index)
    }

    /**
     * 播放下一首歌曲
     */
    const nextTrack = async () => {
        if (isPersonalFM.value) {
            await _fetchPersonalFM()
            await _replaceTrack(_personalFMTrack.value?.id || 0, 0)
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
        isMute,
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
