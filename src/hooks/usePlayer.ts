import { Howler, Howl } from 'howler'
import shuffle from 'lodash/shuffle'

import { toHttps } from '@/utils/common'

import { fetchTracks, fetchAudioSource, scrobble, fetchLyric } from '@/api/track'
import { fetchPersonalFM, FMTrash } from '@/api/FM'
import { fetchPlaylist } from '@/api/playlist'
import { fetchAlbum } from '@/api/album'
import { fetchArtist } from '@/api/artist'
import { likeATrack } from '@/api/track'

import { usePlayerStore } from '@/stores/player'
import { useUserStore } from '@/stores/user'

type TrackID = number

export enum PlaylistSourceType {
    TRACK = 'track',
    ALBUM = 'album',
    ARTIST = 'artist',
    PLAYLIST = 'playlist',
    DAILYTRACKS = 'dailyTrack',
    NEWSONGS = 'newSongs',
    FM = 'fm',
}

export interface PlaylistSource {
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
    lyrics: {
        lyric: string
        tlyric: string
    }
    mode: PlayerMode
    currentPlaylist: TrackID[]
    track: Track | null
    personalFMTrack: Track | null
    currentTrackDuration: number
    progress: number
    repeatMode: RepeatMode
    volume: number
    translate: string
    isTranslate: boolean
    isPlaying: boolean
    isPersonalFM: boolean
    isMute: boolean
    isShuffle: boolean
    isLiked: boolean
    goToPlaylistSource: () => void
    switchRepeatMode: () => void
    switchShuffle: () => void
    mute: () => void
    likeTrack: () => void
    moveToFMTrash: () => void
    play: () => void
    pause: () => void
    playOrPause: () => void
    previousTrack: () => void
    nextTrack: () => void
    addToQueue: (trackID: number) => void
    removeToQueue: (trackID: number) => void
    replacePlaylist: (trackIDs: TrackID[], playlistSource: PlaylistSource, trackID?: TrackID) => void
    playPlaylistByID: (playlistID: number, trackID?: TrackID) => void
    playAlbumByID: (albumID: number, trackID?: TrackID) => void
    playArtistByID: (artistID: number, trackID?: TrackID) => void
    playTrackOnListByID: (trackID: TrackID) => void
}

export function usePlayerProvider() {
    const playerStore = usePlayerStore()
    const userStore = useUserStore()
    const router = useRouter()

    const title = useTitle('Anio Music')

    const lyrics = reactive({
        lyric: '',
        tlyric: '',
    })

    const state = ref<PlayerState>(PlayerState.INITIALIZING) // ???????????????

    const _progressInterval = ref<ReturnType<typeof setInterval> | undefined>(undefined)
    const _howler = ref<Howl>(
        new Howl({
            src: [''],
            format: ['mp3', 'flac'],
        }),
    ) //Howler

    const playlistSource = computed<PlaylistSource>({
        get() {
            return playerStore.playlistSource
        },
        set(source) {
            playerStore.updatePlaylistSource(source)
        },
    })

    /**
     * ????????????
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
     * ????????????????????????
     */

    // const currentPlaylist = computed<number[]>({
    //     get() {
    //         return isShuffle.value ? playerStore.shufflePlaylist : playerStore.playlist
    //     },
    //     set(trackIDs) {
    //         if (isShuffle.value) {
    //             playerStore.updateShufflePlaylist(trackIDs)
    //         } else {
    //             playerStore.updatePlaylist(trackIDs)
    //         }
    //     },
    // })

    const currentPlaylist = computed<number[]>(() => {
        return isShuffle.value ? playerStore.shufflePlaylist : playerStore.playlist
    })

    /**
     * ???????????????????????????
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
     * ??????FM????????????
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
     * ??????????????????
     */

    const currentTrackDuration = computed(() => {
        return track.value.dt / 1000
    })

    /**
     * ??????????????????????????????
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
     * ????????????????????????
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
     * ????????????
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
     * ????????????
     */

    const translate = computed<string>(() => {
        if (track.value.tns?.length) {
            return track.value.tns[0]
        } else {
            return track.value.alia[0]
        }
    })

    /**
     * ?????????????????????
     */

    const isTranslate = computed<boolean>(() => {
        return track.value.tns?.length > 0 || track.value.alia?.length > 0
    })

    /**
     * ??????????????????
     */

    const isPlaying = computed<boolean>(() => {
        return state.value === PlayerState.PLAYING
    })

    /**
     * ?????? ??????FM ??????
     */

    const isPersonalFM = computed<boolean>(() => {
        return mode.value === PlayerMode.FM
    })

    /**
     * ????????????
     */

    const isMute = computed(() => {
        return volume.value === 0
    })

    /**
     * ??????????????????
     */

    const isShuffle = computed<boolean>(() => {
        return playerStore.shuffle
    })

    /**
     * ??????????????????????????????
     */

    const isLiked = computed<boolean | undefined>(() => {
        return userStore.likedList?.includes(track.value.id)
    })

    /**
     * ????????????????????? currentPlaylist ??????index
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
     * ?????????????????????????????????????????? playlist ??????index
     * @private
     */

    const _shuffleTrackIndex = computed<number>({
        get() {
            return playerStore.shuffleTrackIndex
        },
        set(index) {
            playerStore.updateShuffleTrackIndex(index)
        },
    })

    /**
     * ??????????????????ID
     * @returns {[number, number]} [??????????????????ID, ????????????????????????????????? index]
     * @private
     */

    const _previousTrackID = computed<number[]>(() => {
        if (_trackIndex.value === 0 && repeatMode.value === RepeatMode.ON) {
            return [currentPlaylist.value[currentPlaylist.value.length - 1], currentPlaylist.value.length - 1]
        } else if (repeatMode.value === RepeatMode.ONE) {
            return [currentPlaylist.value[_trackIndex.value], _trackIndex.value]
        } else {
            return [currentPlaylist.value[_trackIndex.value - 1], _trackIndex.value - 1]
        }
    })

    /**
     * ??????????????????ID
     * @returns {[number, number]} [??????????????????ID, ????????????????????????????????? index]
     * @private
     */

    const _nextTrackID = computed<number[]>(() => {
        if (currentPlaylist.value.length === _trackIndex.value + 1 && repeatMode.value === RepeatMode.ON) {
            return [currentPlaylist.value[0], 0]
        } else if (repeatMode.value === RepeatMode.ONE) {
            return [currentPlaylist.value[_trackIndex.value], _trackIndex.value]
        } else {
            return [currentPlaylist.value[_trackIndex.value + 1], _trackIndex.value + 1]
        }
    })

    /**
     * ???????????????????????????
     * @private
     */

    const _initPlayer = () => {
        if (!personalFMTrack.value.id) {
            _fetchPersonalFM()
        }

        if (track.value.id) {
            const autoplay = false
            _replaceTrack(track.value.id, _trackIndex.value, autoplay)
        }
    }

    /**
     * ???????????????????????? ??????FM ?????????????????????
     * @private
     */

    const _fetchPersonalFM = async () => {
        const { data } = await fetchPersonalFM()
        personalFMTrack.value = data.value?.data[0] as Track
    }

    /**
     * (????????????) ??????????????????
     * @private
     */

    const _shuffleTheList = (trackID?: TrackID) => {
        let list = playerStore.playlist.filter((tid: number) => tid !== trackID)

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
     * ?????????????????????????????????????????????????????????
     * @param track
     * @private
     */

    const _scrobble = async (track: Track) => {
        await scrobble({
            id: track.id,
            sourceid: track.id,
            time: ~~(track.dt / 1000),
        })
    }

    /**
     * (????????????) ??????Howler????????????
     * @param audioSource ????????????????????????
     * @param autoplay ??????????????????
     * @private
     */

    const _playTrack = async (audioSource: string, autoplay: boolean) => {
        Howler.unload()
        _howler.value = new Howl({
            src: [audioSource],
            format: ['mp3', 'flac'],
            volume: volume.value,
            // html5: true,
            onend: () => nextTrack(),
        })

        if (autoplay) {
            play()
        }
    }

    /**
     * (????????????) ???????????????
     * @private
     */

    const _setupProgressInterval = () => {
        _howler.value.seek(progress.value)
        _progressInterval.value = setInterval(() => {
            if (isPlaying.value) {
                progress.value = _howler.value.seek()
            }
        }, 1000)
    }

    /**
     * (????????????) ????????????
     * @param autoplay ??????????????????
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

        if (neteaseSource.value?.data[0].url) {
            _playTrack(toHttps(neteaseSource.value?.data[0].url), autoplay)
        } else {
            nextTrack()
        }
    }

    /**
     * (????????????) ?????????????????????????????????
     * @param trackID ??????ID
     * @param index ???????????????????????????index
     * @returns {Promise<void>}
     * @private
     */

    const _replaceTrack = async (trackID: TrackID, index: number, autoplay = true) => {
        const { data: trackRaw } = await fetchTracks({ ids: [trackID] })
        const { data: lyricRaw } = await fetchLyric({
            id: trackID,
        })
        track.value = trackRaw.value?.songs[0] as Track
        lyrics.lyric = lyricRaw.value?.lrc?.lyric || ''
        lyrics.tlyric = lyricRaw.value?.tlyric?.lyric || ''
        _trackIndex.value = index

        _shuffleTrackIndex.value = playerStore.playlist.indexOf(Number(trackID))

        if (isPlaying) {
            _scrobble(track.value)
        }

        playerStore.updateHistory(track.value.id)

        playerStore.updateShuffleTrackIndex(playerStore.playlist.indexOf(track.value.id))

        return _fetchAudioSource(autoplay)
    }

    /**
     * ????????????????????????
     */

    const goToPlaylistSource = () => {
        if (
            playlistSource.value?.type === PlaylistSourceType.PLAYLIST ||
            playlistSource.value?.type === PlaylistSourceType.ALBUM ||
            playlistSource.value?.type === PlaylistSourceType.ARTIST
        ) {
            router.push({
                name: playlistSource.value.type,
                params: {
                    id: playlistSource.value.id,
                },
            })
        } else if (
            playlistSource.value?.type === PlaylistSourceType.DAILYTRACKS ||
            playlistSource.value?.type === PlaylistSourceType.NEWSONGS
        ) {
            router.push({
                name: playlistSource.value.type,
            })
        } else if (
            playlistSource.value?.type === PlaylistSourceType.FM ||
            playlistSource.value?.type === PlaylistSourceType.TRACK
        ) {
            router.push({
                name: 'album',
                params: {
                    id: track.value.al.id || track.value.album.id || 0,
                },
            })
        }
    }

    /**
     * ????????????????????????
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
     * ????????????????????????
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
            _trackIndex.value = _shuffleTrackIndex.value
        }
    }

    /**
     * ??????????????????
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
     * ????????????????????????
     */

    const likeTrack = async () => {
        await likeATrack({
            id: track.value.id,
            like: isLiked.value ? false : true,
        })
        await userStore.updateLikedList()
    }

    /**
     * ????????????????????????FM?????????????????????
     */

    const moveToFMTrash = async () => {
        await nextTrack()
        await FMTrash({
            id: Number(personalFMTrack.value.id),
        })
    }

    /**
     * ??????????????????
     */

    const play = () => {
        _howler.value.play()
        state.value = PlayerState.PLAYING
        title.value = `${track.value.name} ?? ${track.value.ar[0].name} - Anio Music`
        _setupProgressInterval()
    }

    /**
     * ??????????????????
     */

    const pause = () => {
        _howler.value.pause()
        state.value = PlayerState.PAUSED
        title.value = 'Anio Music'
        clearInterval(_progressInterval.value)
    }

    /**
     * ????????????????????????????????????????????????????????????????????????
     */

    const playOrPause = () => {
        if (state.value === PlayerState.PLAYING) {
            pause()
        } else if ([PlayerState.PAUSED, PlayerState.LOADING, PlayerState.INITIALIZING].includes(state.value)) {
            play()
        }
    }

    /**
     * ?????????????????????
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
     * ?????????????????????
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
     * ???????????????
     * @param trackID
     */

    const addToQueue = (trackID: number) => {
        const normalIndex = playerStore.playlist.indexOf(track.value.id)
        const shuffleIndex = playerStore.shufflePlaylist.indexOf(track.value.id)
        const playlist = playerStore.playlist
        const shufflePlaylist = playerStore.shufflePlaylist
        playlist.splice(normalIndex + 1, 0, trackID)
        shufflePlaylist.splice(shuffleIndex + 1, 0, trackID)
        playerStore.updatePlaylist(playlist)
        playerStore.updateShufflePlaylist(shufflePlaylist)
    }

    /**
     * ??????????????????
     * @param trackID
     */

    const removeToQueue = (trackID: number) => {
        const normalIndex = playerStore.playlist.indexOf(trackID)
        const shuffleIndex = playerStore.shufflePlaylist.indexOf(trackID)
        const playlist = playerStore.playlist
        const shufflePlaylist = playerStore.shufflePlaylist
        playlist.splice(normalIndex, 1)
        shufflePlaylist.splice(shuffleIndex, 1)
        playerStore.updatePlaylist(playlist)
        playerStore.updateShufflePlaylist(shufflePlaylist)
    }

    /**
     * ????????????????????????
     * @param trackIDs ??????ID??????
     * @param source ????????????
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
            _trackIndex.value = currentPlaylist.value.indexOf(trackID)
            _replaceTrack(currentPlaylist.value[_trackIndex.value], _trackIndex.value)
        }
    }

    const playPlaylistByID = async (playlistID: number, trackID?: TrackID) => {
        mode.value = PlayerMode.PLAYLIST
        const { data } = await fetchPlaylist({
            id: playlistID,
            s: 0,
        })
        const trackIDs = computed(() => {
            return data.value?.playlist.trackIds.map((item) => item.id) || []
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
        const { data } = await fetchAlbum({
            id: albumID,
        })
        const trackIDs = computed(() => {
            return data.value?.songs.map((item: Track) => item.id) || []
        })
        replacePlaylist(
            trackIDs.value,
            {
                type: PlaylistSourceType.ALBUM,
                id: albumID,
            },
            trackID,
        )
    }

    const playArtistByID = async (artistID: number, trackID?: TrackID) => {
        mode.value = PlayerMode.PLAYLIST
        const { data } = await fetchArtist({
            id: artistID,
        })
        const trackIDs = computed(() => {
            return data.value?.hotSongs.map((item: Track) => item.id) || []
        })
        replacePlaylist(
            trackIDs.value,
            {
                type: PlaylistSourceType.ARTIST,
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
        lyrics,
        mode,
        currentPlaylist,
        track,
        personalFMTrack,
        currentTrackDuration,
        progress,
        repeatMode,
        volume,
        translate,
        isTranslate,
        isPlaying,
        isPersonalFM,
        isMute,
        isShuffle,
        isLiked,
        goToPlaylistSource,
        switchRepeatMode,
        switchShuffle,
        mute,
        likeTrack,
        moveToFMTrash,
        play,
        pause,
        playOrPause,
        previousTrack,
        nextTrack,
        addToQueue,
        removeToQueue,
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
