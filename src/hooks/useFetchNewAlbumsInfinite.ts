import { fetchNewAlbums, AlbumApiNames, NewAlbumsArea } from '@/api/album'
import { FetchNewAlbumsParams, FetchNewAlbumsResponse } from '@/api/album'

export default function useFetchNewAlbumsInfinite(params: FetchNewAlbumsParams) {
    console.debug('useFetchNewAlbumsInfinite', params)

    const enabled = computed(() => {
        return params.limit !== 0
    })

    return useInfiniteQuery(
        reactive([AlbumApiNames.FETCH_NEW_ALBUMS, params]),
        ({ pageParam = 0 }) => {
            return fetchNewAlbums({
                limit: params.limit,
                offset: pageParam * params.limit,
                area: params.area,
            }).data.value
        },
        reactive({
            enabled,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchInterval: 0,
            getNextPageParam: (lastPage: FetchNewAlbumsResponse, pages: FetchNewAlbumsResponse[]) => {
                return params.limit === lastPage.albums.length ? pages.length : undefined
            },
        }),
    )
}
