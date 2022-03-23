import request from '@/utils/request'

export enum ArtistApiNames {
    FETCH_ARTIST = 'fetchArtist',
    FETCH_ARTIST_ALBUMS = 'fetchArtistAlbums',
    FETCH_TOPLIST_OF_ARTISTS = 'fetchToplistOfArtists',
    FOLLOW_A_ARTIST = 'followAArtist',
    FETCH_SIMILAR_ARTISTS = 'fetchSimilarArtists',
}

/**
 * 获取歌手单曲
 * 说明 : 调用此接口 , 传入歌手 id, 可获得歌手部分信息和热门歌曲
 * - 歌手 id, 可由搜索接口获得
 */

export interface FetchArtistParams {
    id: number | string
}

interface FetchArtistResponse {
    code: number
    more: boolean
    artist: Artist
    hotSongs: Track[]
}

export function fetchArtist(params: FetchArtistParams, noCache: boolean = false): Promise<FetchArtistResponse> {
    const otherParams: { timestamp?: number } = {}
    if (noCache) {
        otherParams.timestamp = new Date().getTime()
    }
    return request({
        url: '/artists',
        method: 'get',
        params: {
            ...params,
            ...otherParams,
        },
    })
}

/**
 * 获取歌手专辑
 * 说明 : 调用此接口 , 传入歌手 id, 可获得歌手专辑内容
 * - id: 歌手 id
 * - limit: 取出数量 , 默认为 50
 * - offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认为 0
 */

export interface FetchArtistAlbumsParams {
    id: number | string
    limit?: number
    offset?: number
}

interface FetchArtistAlbumsResponse {
    code: number
    hotAlbums: Album[]
    more: boolean
    artist: Artist
}

export function fetchArtistAlbums(params: FetchArtistAlbumsParams): Promise<FetchArtistAlbumsResponse> {
    return request({
        url: '/artist/album',
        method: 'get',
        params,
    })
}

/**
 * 歌手榜
 * 说明 : 调用此接口 , 可获取排行榜中的歌手榜
 * - type : 地区
 * 1: 华语
 * 2: 欧美
 * 3: 韩国
 * 4: 日本
 */

export enum ToplistOfArtists{
    ZH = 1,
    EA = 2,
    KR = 3,
    JP = 4
}

export interface FetchToplistOfArtistsParams {
    type: ToplistOfArtists
}

interface FetchToplistOfArtistsResponse {
    list: {
        artists: Artist[]
        updateTime: number
        type: number
    }
    code: number
}

export function fetchToplistOfArtists(params: FetchToplistOfArtistsParams): Promise<FetchToplistOfArtistsResponse> {
    return request({
        url: '/toplist/artist',
        method: 'get',
        params,
    })
}

/**
 * 收藏歌手
 * 说明 : 调用此接口 , 传入歌手 id, 可收藏歌手
 * - id: 歌手 id
 * - t: 操作,1 为收藏,其他为取消收藏
 */

export enum AArtist {
    LIKE = 1,
    DISLIKE = 0
}

export interface FollowAArtistParams {
    id: number
    t: AArtist
}

interface FollowAArtistResponse {
    code: number
    message: string
    data: null
}

export function followAArtist(params: FollowAArtistParams): Promise<FollowAArtistResponse> {
    return request({
        url: '/artist/sub',
        method: 'post',
        params,
    })
}

/**
 * 相似歌手
 * 说明 : 调用此接口 , 传入歌手 id, 可获得相似歌手
 * - id: 歌手 id
 */

export interface FetchSimilarArtistsParams {
    id: number
}

interface FetchSimilarArtistsResponse {
    artists: Artist[]
    code: number
}

export function fetchSimilarArtists(params: FetchSimilarArtistsParams): Promise<FetchSimilarArtistsResponse> {
    return request({
        url: '/simi/artist',
        method: 'post',
        params,
    })
}
