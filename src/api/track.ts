import { useGet, usePost } from '@/hooks/useFetchNetEase'
import { UseFetchReturn } from '@vueuse/core'

export enum TrackApiNames {
    FETCH_TRACKS = 'fetchTracks',
    FETCH_AUDIO_SOURCE = 'fetchAudioSource',
    FETCH_LYRIC = 'fetchLyric',
    FETCH_TOP_SONGS = 'fetchTopSongs',
    LIKE_A_TRACK = 'likeATrack',
    SCROBBLE = 'scrobble',
}

/**
 * 获取歌曲详情
 * 说明 : 调用此接口 , 传入音乐 id(支持多个 id, 用 , 隔开), 可获得歌曲详情(注意:歌曲封面现在需要通过专辑内容接口获取)
 * - 音乐 id, 例如 ids=405998841,33894312
 */

export interface FetchTracksParams {
    ids: number[]
}

export interface FetchTracksResponse {
    code: number
    songs: Track[]
    privileges: {
        [key: string]: unknown
    }
}

export function fetchTracks(params: FetchTracksParams): UseFetchReturn<FetchTracksResponse> {
    return useGet('/song/detail', {
        ids: params.ids.join(','),
    })
}

/**
 * 获取音乐 url
 * 说明 : 使用歌单详情接口后 , 能得到的音乐的 id, 但不能得到的音乐 url, 调用此接口, 传入的音乐 id( 可多个 , 用逗号隔开 ), 可以获取对应的音乐的 url,
 * !!!未登录状态返回试听片段(返回字段包含被截取的正常歌曲的开始时间和结束时间)
 * - 音乐的 id，例如 id=405998841,33894312
 * - br: 码率,默认设置了 999000 即最大码率,如果要 320k 则可设置为 320000,其他类推
 */

export interface FetchAudioSourceParams {
    id: number
    br?: number
}

export interface FetchAudioSourceResponse {
    code: number
    data: {
        br: number
        canExtend: boolean
        code: number
        encodeType: 'mp3' | null
        expi: number
        fee: number
        flag: number
        freeTimeTrialPrivilege: {
            [key: string]: unknown
        }
        freeTrialPrivilege: {
            [key: string]: unknown
        }
        freeTrialInfo: null
        gain: number
        id: number
        level: 'standard' | 'null'
        md5: string | null
        payed: number
        size: number
        type: 'mp3' | null
        uf: null
        url: string | null
        urlSource: number
    }[]
}

export function fetchAudioSource(params: FetchAudioSourceParams): UseFetchReturn<FetchAudioSourceResponse> {
    return useGet('/song/url', params)
}

/**
 * 获取歌词
 * 说明 : 调用此接口 , 传入音乐 id 可获得对应音乐的歌词 ( 不需要登录 )
 * - 音乐 id
 */

export interface FetchLyricParams {
    id: number
}

export interface FetchLyricResponse {
    sgc: boolean
    sfy: boolean
    qfy: boolean
    transUser: {
        id: number
        status: number
        demand: number
        userid: number
        nickname: string
        uptime: number
    }
    lyricUser: {
        id: number
        status: number
        demand: number
        userid: number
        nickname: string
        uptime: number
    }
    lrc: {
        version: number
        lyric: string
    }
    klyric: {
        version: number
        lyric: string
    }
    tlyric: {
        version: number
        lyric: string
    }
    code: number
}

export function fetchLyric(params: FetchLyricParams): UseFetchReturn<FetchLyricResponse> {
    return useGet('/lyric', params)
}

/**
 * 新歌速递
 * 说明 : 调用此接口 , 可获取新歌速递
 * - 地区类型 id, 对应以下:
 * 全部:0
 * 华语:7
 * 欧美:96
 * 日本:8
 * 韩国:16
 */

export enum TopSongsType {
    ALL = 0,
    ZH = 7,
    EA = 96,
    JP = 8,
    KR = 16,
}

export interface FetchTopSongsParams {
    type: TopSongsType
}

export interface FetchTopSongsResponse {
    code: number
    data: Track[]
}

export function fetchTopSongs(params: FetchTopSongsParams): UseFetchReturn<FetchTopSongsResponse> {
    return useGet('/top/song', params)
}

/**
 * 喜欢音乐
 * 说明 : 调用此接口 , 传入音乐 id, 可喜欢该音乐
 * - id - 歌曲 id
 * - like - 默认为 true 即喜欢 , 若传 false, 则取消喜欢
 */

export interface LikeATrackParams {
    id: number
    like: boolean
}

export interface LikeATrackResponse {
    songs: []
    playlistId: number
    code: number
}

export function likeATrack(params: LikeATrackParams): UseFetchReturn<LikeATrackResponse> {
    return usePost('/like', {
        ...params,
        timestamp: new Date().getTime(),
    })
}

/**
 * 听歌打卡
 * 说明 : 调用此接口 , 传入音乐 id, 来源 id，歌曲时间 time，更新听歌排行数据
 * - id - 歌曲 id
 * - sourceid - 歌单或专辑 id
 * - time - 歌曲播放时间,单位为秒
 */

export interface ScrobbleParams {
    id: number
    sourceid: number
    time: number
}

export interface ScrobbleResponse {
    code: number
    data: string
    message: string
}

export function scrobble(params: ScrobbleParams): UseFetchReturn<ScrobbleResponse> {
    return useGet('/scrobble', {
        ...params,
        timestamp: new Date().getTime(),
    })
}
