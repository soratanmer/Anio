import request from '@/utils/request'

export enum PlaylistApiNames {
    FETCH_PLAYLIST = 'fetchPlaylist',
    FETCH_RECOMMENDED_PLAYLISTS = 'fetchRecommendedPlaylists',
}

/**
 * 获取歌单详情
 * 说明 : 歌单能看到歌单名字, 但看不到具体歌单内容 , 调用此接口 , 传入歌单 id, 可以获取对应歌单内的所有的音乐(未登录状态只能获取不完整的歌单,登录后是完整的)，
 * 但是返回的trackIds是完整的，tracks 则是不完整的，可拿全部 trackIds 请求一次 song/detail 接口
 * 获取所有歌曲的详情 (https://github.com/Binaryify/NeteaseCloudMusicApi/issues/452)
 * - id : 歌单 id
 * - s : 歌单最近的 s 个收藏者, 默认为8
 * - noCache
 */

export interface FetchPlaylistParams {
    id: number | string
    s?: number
}

interface FetchPlaylistResponse {
    code: number
    playlist: Playlist
    relatedVideos: null
    resEntrance: null
    sharedPrivilege: null
    urls: null
}

export function fetchPlaylist(params: FetchPlaylistParams, noCache: boolean = false): Promise<FetchPlaylistResponse> {
    const otherParams: { timestamp?: number } = {}
    if (noCache) {
        otherParams.timestamp = new Date().getTime()
    }
    if (!params.s) {
        params.s = 0
    }

    return request({
        url: '/playlist/detail',
        method: 'get',
        params: {
            ...params,
            ...otherParams,
        },
    })
}

/**
 * 推荐歌单
 * 说明 : 调用此接口 , 可获取推荐歌单
 * - limit: 取出数量 , 默认为 30 (不支持 offset)
 * - 调用例子 : /personalized?limit=1
 */

export interface FetchRecommendedPlaylistsParams {
    limit?: number
}

interface FetchRecommendedPlaylistsResponse {
    code: number
    category: number
    hasTaste: boolean
    result: Playlist[]
}

export function fetchRecommendedPlaylists(
    params: FetchRecommendedPlaylistsParams,
): Promise<FetchRecommendedPlaylistsResponse> {
    return request({
        url: '/personalized',
        method: 'get',
        params,
    })
}
