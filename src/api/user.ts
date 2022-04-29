import { useGet, usePost } from '@/hooks/useFetchNetEase'
import { UseFetchReturn } from '@vueuse/core'

export enum UserApiNames {
    FETCH_USER_DETAIL = 'fetchUserDetail',
    FETCH_USER_ACCOUNT = 'fetchUserAccount',
    FETCH_USER_LIKED_SONGS_IDS = 'fetchUserLikedSongsIds',
    FETCH_USER_PLAYLISTS = 'fetchUserPlaylists',
    FETCH_USER_DAILY_SIGN_IN = 'fetchUserDailySignIn',
    FETCH_USER_LIKED_ALBUMS = 'fetchUserLikedAlbums',
    FETCH_USER_LIKED_ARTISTS = 'fetchUserLikedArtists',
    FETCH_PURCHASED_ALBUMS = 'fetchPurchasedAlbums',
    FETCH_PURCHASED_SONGS = 'fetchPurchasedSongs',
    FETCH_RECENT_SONGS = 'fetchRecentSongs',
}

/**
 * 获取用户详情
 * 说明 : 登录后调用此接口 , 传入用户 id, 可以获取用户详情
 * - uid : 用户 id
 */

export interface FetchUserDetailParams {
    uid: number
}

export function fetchUserDetail(params: FetchUserDetailParams) {
    return useGet('/user/detail', {
        uid: params.uid,
        timestamp: new Date().getTime(),
    })
}

/**
 * 获取账号详情
 * 说明 : 登录后调用此接口 ,可获取用户账号信息
 */

export interface FetchUserAccountResponse {
    code: number
    account: {
        anonimousUser: boolean
        ban: number
        baoyueVersion: number
        createTime: number
        donateVersion: number
        id: number
        paidFee: boolean
        status: number
        tokenVersion: number
        type: number
        userName: string
        vipType: number
        whitelistAuthority: number
    } | null
    profile: {
        userId: number
        userType: number
        nickname: string
        avatarImgId: number
        avatarUrl: string
        backgroundImgId: number
        backgroundUrl: string
        signature: string
        createTime: number
        userName: string
        accountType: number
        shortUserName: string
        birthday: number
        authority: number
        gender: number
        accountStatus: number
        province: number
        city: number
        authStatus: number
        description: string | null
        detailDescription: string | null
        defaultAvatar: boolean
        expertTags: [] | null
        experts: [] | null
        djStatus: number
        locationStatus: number
        vipType: number
        followed: boolean
        mutual: boolean
        authenticated: boolean
        lastLoginTime: number
        lastLoginIP: string
        remarkName: string | null
        viptypeVersion: number
        authenticationTypes: number
        avatarDetail: string | null
        anchor: boolean
    } | null
}

export function fetchUserAccount(): UseFetchReturn<FetchUserAccountResponse> {
    return useGet('/user/account', {
        timestamp: new Date().getTime(),
    })
}

/**
 * 获取用户歌单
 * 说明 : 登录后调用此接口 , 传入用户 id, 可以获取用户歌单
 * - uid : 用户 id
 * - offset : 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * - limit : 返回数量 , 默认为 30
 */

export interface FetchUserPlaylistsParams {
    uid: number
    offset: number
    limit?: number
}

export interface FetchUserPlaylistsResponse {
    code: number
    more: false
    version: string
    playlist: Playlist[]
}

export function fetchUserPlaylists(params: FetchUserPlaylistsParams): UseFetchReturn<FetchUserPlaylistsResponse> {
    // return request({
    //     url: '/user/playlist',
    //     method: 'get',
    //     params,
    // })
    return useGet('/user/playlist', params)
}

/**
 * 喜欢音乐列表（需要登录）
 * 说明 : 调用此接口 , 传入用户 id, 可获取已喜欢音乐id列表(id数组)
 * - uid: 用户 id
 */

export interface FetchUserLikedSongsIdsParams {
    uid: number
}

export interface FetchUserLikedSongsIdsResponse {
    code: number
    checkPoint: number
    ids: number[]
}

export function fetchUserLikedSongsIDs(
    params: FetchUserLikedSongsIdsParams,
): UseFetchReturn<FetchUserLikedSongsIdsResponse> {
    return useGet('/likelist', {
        uid: params.uid,
        timestamp: new Date().getTime(),
    })
}

/**
 * 每日签到
 * 说明 : 调用此接口可签到获取积分
 * -  type: 签到类型 , 默认 0, 其中 0 为安卓端签到 ,1 为 web/PC 签到
 * @param {number} type
 */

export interface FetchUserDailySignInParams {
    type: number
}

export function fetchUserDailySignIn(type = 0) {
    return usePost('/daily_signin', {
        type,
        timestamp: new Date().getTime(),
    })
}

/**
 * 获取收藏的专辑（需要登录）
 * 说明 : 调用此接口可获取到用户收藏的专辑
 * - limit : 返回数量 , 默认为 25
 * - offset : 偏移数量，用于分页 , 如 :( 页数 -1)*25, 其中 25 为 limit 的值 , 默认为 0
 */

export interface FetchUserLikedAlbumsParams {
    limit: number
    offset?: number
}

export interface FetchUserLikedAlbumsResponse {
    data: Album[]
    count: number
    hasMore: boolean
    cover: string
    paidCount: number
    code: number
}

export function fetchUserLikedAlbums(params: FetchUserLikedAlbumsParams): UseFetchReturn<FetchUserLikedAlbumsResponse> {
    return useGet('/album/sublist', {
        ...params,
        timestamp: new Date().getTime(),
    })
}

/**
 * 获取收藏的歌手（需要登录）
 * 说明 : 调用此接口可获取到用户收藏的歌手
 * - limit : 返回数量 , 默认为 25
 * - offset : 偏移数量，用于分页 , 如 :( 页数 -1)*25, 其中 25 为 limit 的值 , 默认为 0
 */

export interface FetchUserLikedArtistsParams {
    limit: number
    offset?: number
}

export interface FetchUserLikedArtistsResponse {
    data: Artist[]
    hasMore: boolean
    code: number
}

export function fetchUserLikedArtists(
    params: FetchUserLikedArtistsParams,
): UseFetchReturn<FetchUserLikedArtistsResponse> {
    return useGet('/artist/sublist', {
        ...params,
        timestamp: new Date().getTime(),
    })
}

/**
 * 获取我的数字专辑
 * 说明 : 登录后调用此接口 ,可获取我的数字专辑
 * - limit : 返回数量 , 默认为 25
 * - offset : 偏移数量，用于分页 , 如 :( 页数 -1)*25, 其中 25 为 limit 的值 , 默认为 0
 */

export interface FetchPurchasedAlbumsParams {
    limit: number
    offset?: number
}

export interface FetchPurchasedAlbumsResponse {
    total: number
    paidAlbums: Album[]
    code: number
}

export function fetchPurchasedAlbums(params: FetchPurchasedAlbumsParams): UseFetchReturn<FetchPurchasedAlbumsResponse> {
    return useGet('/digitalAlbum/purchased', {
        ...params,
        timestamp: new Date().getTime(),
    })
}

/**
 * 获取已购单曲
 * 说明 : 登录后调用此接口可获取已购买的单曲
 * - limit : 返回数量 , 默认为 20
 * - offset : 偏移数量，用于分页 , 如 :( 页数 -1)*25, 其中 25 为 limit 的值 , 默认为 0
 */

export interface FetchPurchasedSongsParams {
    limit?: number
    offset?: number
}

export interface FetchPurchasedSongsResponse {
    code: number
    data: {
        count: number
        list: {
            songId: number
            name: string
            picUrl: string
            artistName: string
            albumName: string
            albumId: number
            only: boolean
            sq: boolean
            vip: boolean
            avaliableDonateCount: number
            boughtCount: number
            received: boolean
            donateUser: null
            canSell: boolean
        }[]
        hasMore: boolean
    }
    message: string
}

export function fetchPurchasedSongs(params: FetchPurchasedSongsParams): UseFetchReturn<FetchPurchasedSongsResponse> {
    return useGet('/song/purchased', {
        ...params,
        timestamp: new Date().getTime(),
    })
}

/**
 * 获取最近播放歌曲
 * 说明：调用此接口，可获得最近播放歌曲
 * - limit: 返回数量，默认为100
 */

export interface FetchRecentSongsParams {
    limit?: number
}

export interface FetchRecentSongsResponse {
    code: number
    data: {
        total: number
        list: {
            resourceId: string
            playTime: number
            resourceType: string
            data: Track
        }[]
    }
    message: string
}

export function fetchRecentSongs(params: FetchRecentSongsParams): UseFetchReturn<FetchRecentSongsResponse> {
    return useGet('/record/recent/song', params)
}
