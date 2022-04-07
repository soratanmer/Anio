import { fetchArtistSongs, OrderType, ArtistApiNames } from '@/api/artist'
import type { FetchArtistSongsParams, FetchArtistSongsResponse } from '@/api/artist'

export default function useFetchArtistSongs(params: FetchArtistSongsParams) {
    console.debug('useFetchArtistSongs', params)

    return useInfiniteQuery(
        reactive([ArtistApiNames.FETCH_ARTIST_SONGS, params]),
        ({ pageParam = 0 }) => {
            return fetchArtistSongs({
                id: params.id,
                order: OrderType.time,
                limit: params.limit,
                offset: pageParam * Number(params.limit),
            })
        },
        reactive({
            enabled: true,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchInterval: 0,
            getNextPageParam: (lastPage: FetchArtistSongsResponse, pages: FetchArtistSongsResponse[]) => {
                return params.limit === lastPage.songs.length ? pages.length : undefined
            },
        }),
    )
}
