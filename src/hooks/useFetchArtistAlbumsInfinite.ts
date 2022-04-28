import { fetchArtistAlbums, ArtistApiNames } from '@/api/artist'
import { FetchArtistAlbumsParams, FetchArtistAlbumsResponse } from '@/api/artist'

export default function useFetchArtistAlbumsInfinite(params: FetchArtistAlbumsParams) {
    console.debug('useFetchArtistAlbumsInfinite', params)

    const enabled = computed(() => {
        return !!params.id && params.id !== 0
    })

    return useInfiniteQuery(
        reactive([ArtistApiNames.FETCH_ARTIST_ALBUMS, params]),
        async ({ pageParam = 0 }) => {
            const { data } = await fetchArtistAlbums({
                id: params.id,
                limit: params.limit,
                offset: pageParam * Number(params.limit),
            })
            return data.value as FetchArtistAlbumsResponse
        },
        reactive({
            enabled,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchInterval: 0,
            getNextPageParam: (lastPage: FetchArtistAlbumsResponse, pages: FetchArtistAlbumsResponse[]) => {
                return params.limit === lastPage.hotAlbums.length ? pages.length : undefined
            },
        }),
    )
}
