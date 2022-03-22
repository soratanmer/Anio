declare interface Playlist {
    id: number
    name: string
    highQuality: boolean
    playCount: number
    trackCount: number
    trackNumberUpdateTime: number

    // 非必有

    adType?: number
    alg?: string
    anonimous?: boolean
    artists?: []
    backgroundCoverId?: number
    backgroundCoverUrl?: string | null
    creator: User
    canDislike?: boolean
    cloudTrackCount?: number
    commentThreadId?: string
    copywriter?: string
    coverImgId_str?: string
    coverImgId?: number
    coverImgUrl?: string
    createTime?: number
    description?: string | null
    englishTitle?: string | null
    historySharedUsers: null
    newImported?: boolean
    officialPlaylistType: null
    opRecommend?: boolean
    ordered?: boolean
    picUrl?: string
    privacy?: number
    recommendInfo?: null
    remixVideo?: null
    sharedUsers?: null
    shareStatus?: null
    shareCount?: number
    specialType?: number
    status?: number
    subscribed?: boolean
    subscribedCount?: number
    subscribers?: []
    tags?: []
    titleImage?: number
    titleImageUrl?: string | null
    totalDuration?: number
    trackIds?: {
        alg: null
        at: number
        id: number
        rcmdReason: string
        t: number
        uid: number
        v: number
    }[]
    trackUpdateTime?: number
    tracks?: Track[]
    type?: number
    updateFrequency?: null
    updateTime?: number
    userId?: number
    videoIds: null //  TODO: unknown type
    videos?: null
}

declare interface Track {
    id: number
    a: null
    al: Album
    alia: string[]
    ar: Artist[]
    cd: string
    cf?: string
    copyright: number
    cp: number
    crbt: null
    djId: number
    dt: number
    fee: number
    ftype: number
    [key in ('h' | 'm' | 'l')]: {
        br: number
        fid: number
        size: number
        vd: number
    }
    mark: number
    mst: number
    mv: number
    name: string
    no: number
    noCopyrightRcmd: null
    originCoverType: number
    originSongSimpleData: null
    pop: number
    pst: number
    publishTime: number
    resourceState: boolean
    rt: string
    rtUrl: string | null
    rtUrls: (string | null)[]
    rtType: number
    rurl: null
    s_id: number
    single: number
    songJumpInfo: null
    st: number
    t: number
    tagPicList: null
    v: number
    version: number
}

declare interface Artist {
    alias: unknown[]
    id: number
    name: string
    tns: string[]
    picUrl: string
    albumSize: number
    picId: string
    img1v1Url: string
    accountId: number
    img1v1: number
    identityIconUrl: string
    mvSize: number
    followed: boolean
    alg: string
    trans: unknown
    cover?: string
    musicSize?: number
    img1v1Id?: number
    topicPerson?: number
    briefDesc?: string
    publishTime?: number
    picId_str?: string
    img1v1Id_str?: string
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
    pic_str: string
    pic: number
    picId_str: string
    picId: number
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
    defaultAvatar: boolean
    province: number
    authStatus: number
    followed: boolean
    avatarUrl: string
    accountStatus: number
    gender: number
    city: number
    birthday: number
    userId: number
    userType: number
    nickname: string
    signature: string
    description: string
    detailDescription: string
    avatarImgId: number
    backgroundImgId: number
    backgroundUrl: string
    authority: number
    mutual: boolean
    expertTags: null
    experts: null
    djStatus: number
    vipType: number
    remarkName: null
    authenticationTypes: number
    avatarDetail: null
    avatarImgIdStr: string
    backgroundImgIdStr: string
    anchor: boolean
    avatarImgId_str: string
}

declare interface FMTrack {
    name: string
    id: number
    position: number
    alias: unknown[]
    status: number
    fee: number
    copyrightId: number
    disc: string
    no: number
    artists: Artist[]
    album: Album
    starred: boolean
    popularity: number
    score: number
    starredNum: number
    duration: number
    playedNum: number
    dayPlays: number
    hearTime: number
    ringtong: null
    crbt: null
    audition: null
    copyFrom: string
    commentThreadId: string
    rtUrl: null
    ftype: number
    rtUrls: unknown[]
    copyright: number
    transName: null
    sign: null
    mark: number
    originCoverType: number
    originSongSimpleData: null
    single: number
    noCopyrightRcmd: null
    rtype: number
    rurl: null
    mvid: number
    bMusic: {
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
    mp3Url: null
    hMusic: {
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
    mMusic: {
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
    lMusic: {
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
    reason: string
    privilege: {
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
        chargeInfoList: unknown[]
    }
    alg: string
    s_ctrp: string
}
