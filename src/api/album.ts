import { useGet, usePost } from '@/hooks/useFetchNetEase'
import { UseFetchReturn } from '@vueuse/core'

export enum AlbumApiNames {
    FETCH_ALBUM = 'fetchAlbum',
    FETCH_NEW_ALBUMS = 'fetchNewAlbums',
    FETCH_ALBUM_DYNAMIC_DETAIL = 'fetchAlbumDynamicDetail',
    LIKE_A_ALBUM = 'likeAAlbum',
}

/**
 * 获取专辑内容
 * 说明 : 调用此接口 , 传入专辑 id, 可获得专辑内容
 * - id: 专辑 id
 */

export interface FetchAlbumParams {
    id: number
}

export interface FetchAlbumResponse {
    code: number
    resourceState: boolean
    album: Album
    songs: Track[]
    description: string
}

export function fetchAlbum(params: FetchAlbumParams, noCache = false): UseFetchReturn<FetchAlbumResponse> {
    const otherParams: { timestamp?: number } = {}
    if (noCache) {
        otherParams.timestamp = new Date().getTime()
    }
    return useGet('/album', {
        ...params,
        ...otherParams,
    })
}

/**
 * 全部新碟
 * 说明 : 登录后调用此接口 ,可获取全部新碟
 * - limit - 返回数量 , 默认为 30
 * - offset - 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * - area - ALL:全部,ZH:华语,EA:欧美,KR:韩国,JP:日本
 */

export enum NewAlbumsArea {
    ALL = 'ALL',
    ZH = 'ZH',
    EA = 'EA',
    JP = 'JP',
    KR = 'KR',
}

export interface FetchNewAlbumsParams {
    limit: number
    offset: number
    area: NewAlbumsArea
}

export interface FetchNewAlbumsResponse {
    total: number
    albums: Album[]
    code: number
}

export function fetchNewAlbums(params: FetchNewAlbumsParams): UseFetchReturn<FetchNewAlbumsResponse> {
    return useGet('/album/new', params)
}

/**
 * 专辑动态信息
 * 说明 : 调用此接口 , 传入专辑 id, 可获得专辑动态信息,如是否收藏,收藏数,评论数,分享数
 * - id - 专辑id
 */

export interface FetchAlbumDynamicDetailParams {
    id: number
}

export interface FetchAlbumDynamicDetailResponse {
    onSale: boolean
    albumGameInfo: null
    commentCount: number
    likedCount: number
    shareCount: number
    isSub: boolean
    subTime: number
    subCount: number
    code: number
}

export function fetchAlbumDynamicDetail(
    params: FetchAlbumDynamicDetailParams,
): UseFetchReturn<FetchAlbumDynamicDetailResponse> {
    return useGet('/album/detail/dynamic', {
        ...params,
        timestamp: new Date().getTime(),
    })
}

/**
 * 收藏/取消收藏专辑
 * 说明 : 调用此接口,可收藏/取消收藏专辑
 * - id - 返专辑 id
 * - t - 1 为收藏,其他为取消收藏
 */

export enum IsSubAlbum {
    LIKE = 1,
    DISLIKED = 0,
}

export interface SubScribeAlbumParams {
    id: number
    t: IsSubAlbum
}

export interface SubScribeALbumResponse {
    code: number
    time: number
}

export function SubScribeAlbum(params: SubScribeAlbumParams): UseFetchReturn<SubScribeALbumResponse> {
    return usePost('/album/sub', params)
}
