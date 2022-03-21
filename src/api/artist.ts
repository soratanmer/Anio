import request from '@/utils/request'

export enum ArtistApiNames {
    FETCH_ARTIST = 'fetchArtist',
    FETCH_ARTIST_ALBUMS = 'fetchArtistAlbums',
}

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

export function fetchArtistAlbums(params: FetchArtistAlbumsParams):Promise<FetchArtistAlbumsResponse> {
    return request({
        url: '/artist/album',
        method: 'get',
        params,
    })
}
