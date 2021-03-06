import { useGet, usePost } from '@/hooks/useFetchNetEase'
import { UseFetchReturn } from '@vueuse/core'

export enum PlaylistApiNames {
    FETCH_PLAYLIST = 'fetchPlaylist',
    FETCH_RECOMMENDED_PLAYLISTS = 'fetchRecommendedPlaylists',
    FETCH_DAILY_RECOMMENDED_PALYLISTS = 'fetchDailyRecommendPlaylists',
    FETCH_DAILY_RECOMMENDED_TRACKS = 'fetchDailyRecommendTracks',
    FETCH_HIGH_QUALITY_PLAYLIST = 'fetchHighQualityPlaylist',
    FETCH_TOP_PLAYLIST = 'fetchTopPlaylist',
    FETCH_PLAYLIST_CATEGORY = 'fetchPlaylistCategory',
    FETCH_TOPLIST = 'fetchToplist',
    SUBSCRIBE_PLAYLIST = 'subscribePlaylist',
    DELETE_PLAYLIST = 'deletePlaylist',
    CREATE_PLAYLIST = 'createPlaylist',
    ADD_OR_REMOVE_TRACK_FROM_PLAYLIST = 'addOrRemoveTrackFromPlaylist',
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
    id: number
    s?: number
}

export interface FetchPlaylistResponse {
    code: number
    playlist: Playlist
    relatedVideos: null
    resEntrance: null
    sharedPrivilege: null
    urls: null
}

export function fetchPlaylist(params: FetchPlaylistParams, noCache = false): UseFetchReturn<FetchPlaylistResponse> {
    const otherParams: { timestamp?: number } = {}
    if (noCache) {
        otherParams.timestamp = new Date().getTime()
    }
    if (!params.s) {
        params.s = 0
    }

    return useGet('/playlist/detail', {
        ...params,
        ...otherParams,
    })
}

/**
 * 推荐歌单
 * 说明 : 调用此接口 , 可获取推荐歌单
 * - limit: 取出数量 , 默认为 30 (不支持 offset)
 */

export interface FetchRecommendedPlaylistsParams {
    limit?: number
}

export interface FetchRecommendedPlaylistsResponse {
    code: number
    category: number
    hasTaste: boolean
    result: Playlist[]
}

export function fetchRecommendedPlaylists(
    params: FetchRecommendedPlaylistsParams,
): UseFetchReturn<FetchRecommendedPlaylistsResponse> {
    return useGet('/personalized', params)
}

/**
 * 获取每日推荐歌单
 * 说明 : 调用此接口 , 可获得每日推荐歌单 ( 需要登录 )
 */

export interface FetchDailyRecommendPlaylistsParams {
    limit?: number
}

export interface FetchDailyRecommendPlaylistsResponse {
    code: number
    featureFirst: boolean
    hoveRcmdSongs: boolean
    recommend: Playlist[]
}

export function fetchDailyRecommendPlaylists(
    params: FetchDailyRecommendPlaylistsParams,
): UseFetchReturn<FetchDailyRecommendPlaylistsResponse> {
    return useGet('/recommend/resource', params)
}

/**
 * 每日推荐歌曲
 * 说明 : 调用此接口 , 可获得每日推荐歌曲 ( 需要登录 )
 */

export interface FetchDailyRecommendTracksResponse {
    code: number
    data: {
        dailySongs: Track[]
        orderSongs: unknown[]
        recommendReasons: {
            songId: number
            reason: string
        }[]
    }
}

export function fetchDailyRecommendTracks(): UseFetchReturn<FetchDailyRecommendTracksResponse> {
    return useGet('/recommend/songs', {
        timestamp: new Date().getTime(),
    })
}

/**
 * 获取精品歌单
 * 说明 : 调用此接口 , 可获取精品歌单
 * - cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部", 可从精品歌单标签列表接口获取(/playlist/highquality/tags)
 * - limit: 取出歌单数量 , 默认为 20
 * - before: 分页参数,取上一页最后一个歌单的 updateTime 获取下一页数据
 */

export interface FetchHighQualityPlaylistParams {
    cat: string
    limit: number
    before?: number
}

export interface FetchHighQualityPlaylistResponse {
    playlists: Playlist[]
    code: number
    more: boolean
    lasttime: number
    total: number
}

export function fetchHighQualityPlaylist(
    params: FetchHighQualityPlaylistParams,
): UseFetchReturn<FetchHighQualityPlaylistResponse> {
    return useGet('/top/playlist/highquality', params)
}

/**
 * 歌单 ( 网友精选碟 )
 * 说明 : 调用此接口 , 可获取网友精选碟歌单
 * - order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
 * - cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
 * - limit: 取出歌单数量 , 默认为 50
 */

export interface FetchTopPlaylistParams {
    order?: string
    cat?: string
    limit: number
    offset?: number
}

export interface FetchTopPlaylistResponse {
    playlists: Playlist[]
    total: number
    code: number
    more: boolean
    cat: string
}

export function fetchTopPlaylist(params: FetchTopPlaylistParams): UseFetchReturn<FetchTopPlaylistResponse> {
    return useGet('/top/playlist', params)
}

/**
 * 歌单分类
 * 说明 : 调用此接口,可获取歌单分类,包含 category 信息
 */

export interface FetchPlaylistCategoryResponse {
    code: number
    all: PlaylistCategory
    sub: PlaylistCategory[]
    categories: {
        0: string
        1: string
        2: string
        3: string
        4: string
    }
}

export function fetchPlaylistCategory(): UseFetchReturn<FetchPlaylistCategoryResponse> {
    return useGet('/playlist/catlist')
}

/**
 * 所有榜单
 * 说明 : 调用此接口,可获取所有榜单 接口地址 : /toplist
 */

export interface FetchToplistResponse {
    code: number
    list: Playlist[]
    artistToplist: {
        coverUrl: string
        name: string
        upateFrequency: string
        position: number
        updateFrequency: string
    }
}

export function fetchToplist(): UseFetchReturn<FetchToplistResponse> {
    return useGet('/toplist')
}

/**
 * 收藏/取消收藏歌单
 * 说明 : 调用此接口, 传入类型和歌单 id 可收藏歌单或者取消收藏歌单
 * - t : 类型,1:收藏,2:取消收藏
 * - id : 歌单 id
 */

export enum IsSubPlaylist {
    LIKE = 1,
    DISLIKED = 2,
}

export interface SubscribePlaylistParams {
    id: number
    t: IsSubPlaylist
}

export interface SubscribePlaylistResponse {
    code: number
}

export function subscribePlaylist(params: SubscribePlaylistParams): UseFetchReturn<SubscribePlaylistResponse> {
    return usePost('/playlist/subscribe', {
        ...params,
        timestamp: new Date().getTime(),
    })
}

/**
 * 删除歌单
 * 说明 : 调用此接口 , 传入歌单id可删除歌单
 * - id : 歌单id,可多个,用逗号隔开
 */

export interface DeletePlaylistParams {
    id: number[]
}

export interface DeletePlaylistResponse {
    code: number
    msg: null
    message: null
    data: null
}

export function deletePlaylist(params: DeletePlaylistParams): UseFetchReturn<DeletePlaylistResponse> {
    return usePost('/playlist/delete', {
        id: params.id.join(','),
    })
}

/**
 * 新建歌单
 * 说明 : 调用此接口 , 传入歌单名字可新建歌单
 * - name : 歌单名
 * - privacy : 是否设置为隐私歌单，默认否，传'10'则设置成隐私歌单
 * - type : 歌单类型,默认'NORMAL',传 'VIDEO'则为视频歌单,传 'SHARED'则为共享歌单
 */

export interface CreatePlaylistParams {
    name: string
    privacy?: number
    type?: 'NORMAL' | 'VIDEO' | 'SHARED'
}

export interface CreatePlaylistResponse {
    code: number
    id: number
    playlist: Playlist
}

export function createPlaylist(params: CreatePlaylistParams): UseFetchReturn<CreatePlaylistResponse> {
    return usePost('/playlist/create', {
        ...params,
        timestamp: new Date().getTime(),
    })
}

/**
 * 对歌单添加或删除歌曲
 * 说明 : 调用此接口 , 可以添加歌曲到歌单或者从歌单删除某首歌曲 ( 需要登录 )
 * - op: 从歌单增加单曲为 add, 删除为 del
 * - pid: 歌单 id
 * - tracks: 歌曲 id,可多个,用逗号隔开
 */

export interface AddOrRemoveTrackFromPlaylistParams {
    op: 'add' | 'del'
    pid: number
    tracks: number[]
}

export interface AddOrRemoveTrackFromPlaylistResponse {
    status: number
    body: {
        coverImgUrl?: string
        coverImgId?: string
        trackIds?: string
        code: number
        count: number
        cloudCount: number
    }
    cookie: unknown[]
}

export function addOrRemoveTrackFromPlaylist(
    params: AddOrRemoveTrackFromPlaylistParams,
): UseFetchReturn<AddOrRemoveTrackFromPlaylistResponse> {
    return usePost('/playlist/tracks', {
        op: params.op,
        pid: params.pid,
        tracks: params.tracks.join(','),
        timestamp: new Date().getTime(),
    })
}
