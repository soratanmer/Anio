import request from '@/utils/request'

export enum AlbumApiNames {
    FETCH_ALBUM = 'fetchAlbum',
}

/**
 * 获取专辑内容
 * 说明 : 调用此接口 , 传入专辑 id, 可获得专辑内容
 * - id: 专辑 id
 */

export interface FetchAlbumParams {
    id: number | string
}

interface FetchAlbumResponse {
    code: number
    resourceState: boolean
    album: Album
    songs: Track[]
    description: string
}

export function fetchAlbum(params: FetchAlbumParams, noCache: boolean = false): Promise<FetchAlbumResponse> {
    const otherParams: { timestamp?: number } = {}
    if (noCache) {
        otherParams.timestamp = new Date().getTime()
    }
    return request({
        url: '/album',
        method: 'get',
        params: {
            ...params,
            ...otherParams,
        },
    })
}
