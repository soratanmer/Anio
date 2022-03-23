declare interface Playlist {
    // 非必有
    adType?: number

    alg?: string

    anonimous?: boolean

    artists?: []

    backgroundCoverId?: number

    backgroundCoverUrl?: string | null

    canDislike?: boolean

    cloudTrackCount?: number

    commentThreadId?: string

    copywriter?: string

    coverImgId?: number

    coverImgId_str?: string

    coverImgUrl?: string

    createTime?: number

    creator: User

    description?: string | null

    englishTitle?: string | null

    highQuality: boolean

    historySharedUsers: null

    id: number

    name: string

    newImported?: boolean

    officialPlaylistType: null

    opRecommend?: boolean

    ordered?: boolean

    picUrl?: string

    playCount: number

    privacy?: number

    recommendInfo?: null

    remixVideo?: null

    shareCount?: number

    sharedUsers?: null

    shareStatus?: null

    specialType?: number

    status?: number

    subscribed?: boolean

    subscribedCount?: number

    subscribers?: []

    tags?: []

    titleImage?: number

    titleImageUrl?: string | null

    totalDuration?: number

    trackCount: number

    trackIds?: {
        alg: null
        at: number
        id: number
        rcmdReason: string
        t: number
        uid: number
        v: number
    }[]

    trackNumberUpdateTime: number

    tracks?: Track[]

    trackUpdateTime?: number

    type?: number

    ToplistType?: string

    updateFrequency?: null

    updateTime?: number

    userId?: number

    videoIds: null //  TODO: unknown type

    videos?: null
}

declare interface Track {
    [key in ('h' | 'm' | 'l')]: {
        br: number
        fid: number
        size: number
        vd: number
    }

    [key in ('bMusic' | 'hMusic' | 'lMusic' | 'mMusic')]?: {
        name: null
        id: number
        size: number
        extension: string
        sr: number
        dfsId: number
        bitrate: number
        playTime: number
        volumeDelta: number
    }

    a?: null

    al?: Album

    album?: Album

    alg?: string

    alia?: string[]

    ar?: Artist[]

    artists?: Artist[]

    audition?: null

    cd?: string

    cf?: string

    commentThreadId?: string

    copyFrom?: string

    copyright?: number

    copyrightId?: number

    cp?: number

    crbt?: null

    dayPlays?: number

    disc?: string

    djId?: number

    dt?: number

    duration?: number

    exclusive?: boolean

    fee?: number

    ftype?: number

    hearTime?: number

    id: number

    mark?: number

    mp3Url?: null

    mst?: number

    mv?: number

    mvid?: number

    name: string

    no?: number

    noCopyrightRcmd?: null

    originCoverType?: number

    originSongSimpleData?: null

    playedNum?: number

    pop?: number

    popularity?: number

    position?: number

    privilege?: {
        id: number
        fee: number
        payed: number
        st: number
        pl: number
        dl: number
        sp: number
        cp: number
        subp: number
        cs: boolean
        maxbr: number
        fl: number
        toast: boolean
        flag: number
        preSell: boolean
        playMaxbr: number
        downloadMaxbr: number
        rscl: null
        freeTrialPrivilege: {
            resConsumable: boolean
            userConsumable: boolean
        }
        chargeInfoList: {
            rate: number
            chargeUrl: null
            chargeMessage: null
            chareTpe: number
        }[]
    }

    pst?: number

    publishTime?: number

    reason?: string

    resourceState?: boolean

    ringtong?: null

    rt?: string

    rtType?: number

    rtUrl?: string | null

    rtUrls?: (string | null)[]

    rurl?: null

    s_ctrp?: string

    s_id?: number

    score?: number

    sign?: null

    single?: number

    songJumpInfo?: null

    st?: number

    starred?: boolean

    starredNum?: number

    status?: number

    t?: number

    tagPicList?: null

    transName?: null

    trUrls?: unknown[]

    v?: number

    version?: number
}

declare interface Artist {
    accountId: number

    albumSize: number

    alg: string

    alias: unknown[]

    briefDesc?: string

    cover?: string

    followed: boolean

    id: number

    identityIconUrl: string

    img1v1: number

    img1v1Id?: number

    img1v1Id_str?: string

    img1v1Url: string

    musicSize?: number

    mvSize: number

    name: string

    picId: string

    picId_str?: string

    picUrl: string

    publishTime?: number

    tns: string[]

    topicPerson?: number

    trans: unknown

    transNames: unknown[]
}

declare interface Album {
    alias: unknown[]

    artist: Artist

    artists: Artist[]

    blurPicUrl: string

    briefDesc: string

    commentThreadId: string

    company: string

    companyId: string

    copyrightId: number

    description: string

    id: number

    info: {
        commentThread: unknown
    }

    mark: number

    name: string

    onSale: boolean

    paid: boolean

    pic: number

    pic_str: string

    picId: number

    picId_str: string

    picUrl: string

    publishTime: number

    size: number

    songs: Track[]

    status: number

    subType: string

    tags: string

    tns: unknown[]

    type: '专辑' | 'Single' | 'EP/Single' | 'EP' | '精选集'
}

declare interface User {
    accountStatus: number

    anchor: boolean

    authenticationTypes: number

    authority: number

    authStatus: number

    avatarDetail: null

    avatarImgId: number

    avatarImgId_str: string

    avatarImgIdStr: string

    avatarUrl: string

    backgroundImgId: number

    backgroundImgIdStr: string

    backgroundUrl: string

    birthday: number

    city: number

    defaultAvatar: boolean

    description: string

    detailDescription: string

    djStatus: number

    experts: null

    expertTags: null

    followed: boolean

    gender: number

    mutual: boolean

    nickname: string

    province: number

    remarkName: null

    signature: string

    userId: number

    userType: number

    vipType: number
}

declare interface PlaylistCategory {
    name: string
    resourceCount: number
    imgId: number
    imgUrl: null
    type: number
    category: number
    resourceType: number
    hot: boolean
    activity: boolean
}
