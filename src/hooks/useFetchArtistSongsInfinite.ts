import { fetchArtistSongs, OrderType, ArtistApiNames } from '@/api/artist'
import type { FetchArtistSongsParams, FetchArtistSongsResponse } from '@/api/artist'

export default function useFetchArtistSongsInfinite(params: FetchArtistSongsParams) {
    console.debug('useFetchArtistSongsInfinite', params)

    return useInfiniteQuery(
        reactive([ArtistApiNames.FETCH_ARTIST_SONGS, params]),
        ({ pageParam = 0 }) => {
            return fetchArtistSongs({
                id: params.id,
                order: OrderType.time,
                limit: params.limit,
                offset: pageParam * Number(params.limit),
            }).data.value
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
