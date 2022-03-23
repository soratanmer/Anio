import request from '@/utils/request'

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

interface FetchTracksResponse {
    code: number
    songs: Track[]
    privileges: {
        [key: string]: unknown
    }
}

export function fetchTracks(params: FetchTracksParams): Promise<FetchTracksResponse> {
    return request({
        url: '/song/detail',
        method: 'get',
        params: {
            ids: params.ids.join(','),
        },
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

interface FetchAudioSourceResponse {
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
    }
}

export function fetchAudioSource(params: FetchAudioSourceParams): Promise<FetchAudioSourceResponse> {
    return request({
        url: '/song/url',
        method: 'get',
        params,
    })
}

/**
 * 获取歌词
 * 说明 : 调用此接口 , 传入音乐 id 可获得对应音乐的歌词 ( 不需要登录 )
 * - 音乐 id
 */

export interface FetchLyricParams {
    id: number
}

interface FetchLyricResponse {
    sgc: boolean
    sfy: boolean
    qfy: boolean
    [key in ('lrc' | 'klyric' | 'tlyric')]: {
        version: number
        lyric: string
    }
    code: number
}

export function fetchLyric(params: FetchLyricParams): Promise<FetchLyricResponse> {
    return request({
        url: '/lyric',
        method: 'get',
        params,
    })
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

interface FetchTopSongsResponse {
    code: number
    data: Track[]
}

export function fetchTopSongs(params: FetchTopSongsParams): Promise<FetchTopSongsResponse> {
    return request({
        url: '/top/song',
        method: 'get',
        params,
    })
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

interface LikeATrackResponse {
    songs: []
    playlistId: number
    code: number
}

export function likeATrack(params: LikeATrackParams): Promise<LikeATrackResponse> {
    return request({
        url: '/like',
        method: 'post',
        params: {
            ...params,
            timestamp: new Date().getTime(),
        },
    })
}

/**
 * 听歌打卡
 * 说明 : 调用此接口 , 传入音乐 id, 来源 id，歌曲时间 time，更新听歌排行数据
 * - id - 歌曲 id
 * - sourceid - 歌单或专辑 id
 * - time - 歌曲播放时间,单位为秒
 * @param {Object} params
 * @param {number} params.id
 * @param {number} params.sourceid
 * @param {number=} params.time
 */

export interface ScrobbleParams {
    id: number
    sourceid: number
    time: number
}

interface ScrobbleResponse {
    code:number
    data:string
    message:string
}

export function scrobble(params: ScrobbleParams):Promise<ScrobbleResponse> {
    return request({
        url: '/scrobble',
        method: 'get',
        params: {
            ...params,
            timestamp: new Date().getTime(),
        },
    })
}
