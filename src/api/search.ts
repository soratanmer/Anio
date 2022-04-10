import { useGet } from '@/hooks/useFetchNetEase'
import { UseFetchReturn } from '@vueuse/core'

export enum SearchApiName {
    SEARCH = 'search',
    MULTI_MATCH_SEARCH = 'multiMatchSearch',
}

/**
 * 搜索
 * 说明 : 调用此接口 , 传入搜索关键词可以搜索该音乐 / 专辑 / 歌手 / 歌单 / 用户 , 关键词可以多个 , 以空格隔开 ,
 * 如 " 周杰伦 搁浅 "( 不需要登录 ), 搜索获取的 mp3url 不能直接用 , 可通过 /song/url 接口传入歌曲 id 获取具体的播放链接
 * - keywords : 关键词
 * - limit : 返回数量 , 默认为 30
 * - offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * - type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
 * - 调用例子 : /search?keywords=海阔天空 /cloudsearch?keywords=海阔天空(更全)
 */

export enum SearchTypes {
    SINGLE = 1,
    ALBUM = 10,
    ARTIST = 100,
    PLAYLIST = 1000,
    USER = 1002,
    MV = 1004,
    LYRICS = 1006,
    RADIO = 1009,
    VIDEO = 1014,
    ALL = 1018,
}

export interface SearchParams {
    keywords: string
    limit?: number
    offset?: number
    type?: SearchTypes
}

interface SearchResponse {
    code: number
    result: {
        album: {
            albums: Album[]
            more: boolean
            moreText: string
            resourceIds: number[]
        }
        artist: {
            artists: Artist[]
            more: boolean
            moreText: string
            resourceIds: number[]
        }
        playList: {
            playLists: Playlist[]
            more: boolean
            moreText: string
            resourceIds: number[]
        }
        song: {
            songs: Track[]
            more: boolean
            moreText: string
            resourceIds: number[]
        }
        user: {
            users: User[]
            more: boolean
            moreText: string
            resourceIds: number[]
        }
        circle: unknown
        new_mlog: unknown
        order: string[]
        rec_type: null
        rec_query: null[]
        sim_query: unknown
        voice: unknown
        voiceList: unknown
    }
}

export function search(params: SearchParams): UseFetchReturn<SearchResponse> {
    return useGet('/search', params)
}

/**
 * 搜索多重匹配
 * 说明：调用此接口，传入搜索关键词可获得搜索结果
 * - keywords：关键词
 */

export interface MultiMatchSearchParams {
    keywords: string
}

interface MultiMatchSearchResponse {
    code: number
    result: {
        album: Album[]
        artist: Artist[]
        playlist: Playlist[]
        orpheus: unknown
        orders: Array<'artist' | 'album'>
    }
}

export function multiMatchSearch(params: MultiMatchSearchParams): UseFetchReturn<MultiMatchSearchResponse> {
    return useGet('/search/multimatch', params)
}
