import request from '@/utils/request'

export enum TrackApiNames {
    FETCH_TRACKS = 'fetchTracks',
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
