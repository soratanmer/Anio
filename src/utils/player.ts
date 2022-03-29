import { Howler, Howl } from 'howler'

import { fetchTracks, fetchAudioSource } from '@/api/track'
import type { FetchTracksParams, FetchAudioSourceParams } from '@/api/track'

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

export interface PlayerPublic {
    mode: PlayerMode
    state: PlayerState
    playlistSource: PlaylistSource | null
    isPlaying: boolean
    track: Track | null
    replacePlaylist: (trackIDs: TrackID[], playlistSource: PlaylistSource) => void
    playOrPause: () => void
    pause: () => void
    nextTrack: () => void
    previousTrack: () => void
}

export function usePlayerProvider() {
    console.debug('Initializing usePlayerProvider')

    const mode = ref<PlayerMode>(PlayerMode.PLAYLIST)
    const state = ref<PlayerState>(PlayerState.INITIALIZING)
    const playlistSource = ref<PlaylistSource | null>(null)

    const _playlist = ref<TrackID[]>([]) // 播放列表
    const _track = ref<Track | null>(null) // 当前播放的歌曲
    const _trackIndex = ref<number>(0) // 当前播放歌曲在 _playlist 里的 index
    const _volume = ref<number>(0.1)
    const _howler = ref(new Howl({ src: [''] })) //Howler

    /**
     * 是否正在播放
     * @type {boolean}
     */

    const isPlaying = computed<boolean>(() => {
        return state.value === PlayerState.PLAYING
    })

    /**
     * 当前正在播放的歌曲
     * @type {Track}
     */

    const track = computed(() => {
        return _track.value
    })

    /**
     * 上一首的歌曲ID
     * @returns {[number, number]} [上一首的歌曲ID, 上一首歌曲在歌曲列表里 index]
     */

    const previousTrackID = computed<number[]>(() => {
        const previousTrackIndex = _trackIndex.value - 1
        return [_playlist.value[previousTrackIndex], previousTrackIndex]
    })

    /**
     * 下一首的歌曲ID
     * @returns {[number, number]} [下一首的歌曲ID, 下一首歌曲在歌曲列表里 index]
     */

    const nextTrackID = computed<number[]>(() => {
        const nextTrackIndex = _trackIndex.value + 1
        return [_playlist.value[nextTrackIndex], nextTrackIndex]
    })

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
        _howler.value.play()
        state.value = PlayerState.PLAYING
    }

    /**
     * (内部方法) 获取音源
     * @returns {Promise<void>}
     * @private
     */

    const _fetchAudioSource = async () => {
        if (!_track.value) {
            return Promise.reject()
        }
        const { data: neteaseSource } = await fetchAudioSource({
            id: _track.value.id,
            br: 128000,
        })
        return _playTrack(neteaseSource[0].url as string)
    }

    /**
     * (内部方法) 替换当前正在播放的歌曲
     * @param trackID 歌曲ID
     * @param index 歌曲在播放列表里的index
     * @returns {Promise<void>}
     * @private
     */

    const _replaceTrack = async (trackID: TrackID, index: number) => {
        const track = await fetchTracks({ ids: [trackID] })
        _track.value = track.songs[0]
        _trackIndex.value = index

        return _fetchAudioSource()
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
     * 播放上一首歌曲
     */

    const previousTrack = () => {
        const [id, index] = previousTrackID.value
        _replaceTrack(id, index)
    }

    /**
     * 播放下一首歌曲
     */
    const nextTrack = () => {
        const [id, index] = nextTrackID.value
        _replaceTrack(id, index)
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
     * 替换当前歌曲列表
     * @param trackIDs 歌曲ID列表
     * @param source 列表来源
     * @param autoPlayTrackID 替换完歌曲列表后要自动播放的歌曲ID
     */

    const replacePlaylist = (
        trackIDs: TrackID[],
        source: PlaylistSource,
        autoPlayTrackID: number | string = 'first',
    ) => {
        mode.value = PlayerMode.FM
        _playlist.value = trackIDs
        playlistSource.value = source
        if (autoPlayTrackID === 'first') {
            _replaceTrack(_playlist.value[0], 0)
        } else {
            _replaceTrack(Number(autoPlayTrackID), trackIDs.indexOf(Number(autoPlayTrackID)))
        }
    }

    const player = reactive({
        mode,
        state,
        playlistSource,
        isPlaying,
        track,
        playOrPause,
        replacePlaylist,
        pause,
        nextTrack,
        previousTrack,
    })

    provide('player', player)
}

export default function usePlayer() {
    return inject<PlayerPublic>('player')
}
