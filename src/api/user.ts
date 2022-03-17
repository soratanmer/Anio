import request from '@/utils/request'

export enum UserApiNames {
    FETCH_USER_ACCOUNT = 'fetchUserAccount',
    FETCH_USER_LIKED_SONGS_IDS = 'fetchUserLikedSongsIds',
    FETCH_USER_PLAYLISTS = 'fetchUserPlaylists',
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
    return request({
        url: '/user/detail',
        method: 'get',
        params: {
            uid: params.uid,
            timestamp: new Date().getTime(),
        },
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

export function fetchUserAccount(): Promise<FetchUserAccountResponse> {
    return request({
        url: '/user/account',
        method: 'get',
        params: {
            timestamp: new Date().getTime(),
        },
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

interface FetchUserPlaylistsResponse {
    code: number
    more: false
    version: string
    playlist: Playlist[]
}

export function fetchUserPlaylists(params: FetchUserPlaylistsParams): Promise<FetchUserPlaylistsResponse> {
    return request({
        url: '/user/playlist',
        method: 'get',
        params,
    })
}

/**
 * 喜欢音乐列表（需要登录）
 * 说明 : 调用此接口 , 传入用户 id, 可获取已喜欢音乐id列表(id数组)
 * - uid: 用户 id
 */

export interface FetchUserLikedSongsIdsParams {
    uid: number
}

interface FetchUserLikedSongsIdsResponse {
    code: number
    checkPoint: number
    ids: number[]
}

export function fetchUserLikedSongsIDs(params: FetchUserLikedSongsIdsParams): Promise<FetchUserLikedSongsIdsResponse> {
    return request({
        url: '/likelist',
        method: 'get',
        params: {
            uid: params.uid,
            timestamp: new Date().getTime(),
        },
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
    return request({
        url: '/daily_signin',
        method: 'post',
        params: {
            type,
            timestamp: new Date().getTime(),
        },
    })
}

/**
 * 获取收藏的专辑（需要登录）
 * 说明 : 调用此接口可获取到用户收藏的专辑
 * - limit : 返回数量 , 默认为 25
 * - offset : 偏移数量，用于分页 , 如 :( 页数 -1)*25, 其中 25 为 limit 的值 , 默认为 0
 * @param {Object} params
 * @param {number} params.limit
 * @param {number=} params.offset
 */

export interface FetchUserUserLikedAlbumsParams {
    limit: number
    offset?: number
}

export function fetchUserLikedAlbums(params: FetchUserUserLikedAlbumsParams) {
    return request({
        url: '/album/sublist',
        method: 'get',
        params: {
            ...params,
            timestamp: new Date().getTime(),
        },
    })
}

/**
 * 获取收藏的歌手（需要登录）
 * 说明 : 调用此接口可获取到用户收藏的歌手
 */
export function fetchUserLikedArtists() {
    return request({
        url: '/artist/sublist',
        method: 'get',
        params: {
            timestamp: new Date().getTime(),
        },
    })
}