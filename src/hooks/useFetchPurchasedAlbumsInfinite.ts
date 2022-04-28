import { fetchPurchasedAlbums, UserApiNames } from '@/api/user'
import type { FetchPurchasedAlbumsParams,FetchPurchasedAlbumsResponse } from '@/api/user'

export default function useFetchPurchasedAlbumsInfinite(params: FetchPurchasedAlbumsParams) {
    console.debug('useFetchPurchasedAlbumsInfinite', params)

    const enabled = computed(() => {
        return params.limit !== 0
    })

    return useInfiniteQuery(
        reactive([UserApiNames.FETCH_PURCHASED_ALBUMS, params]),
        async ({ pageParam = 0 }) => {
            const { data } = await fetchPurchasedAlbums({
                limit: params.limit,
                offset: pageParam * params.limit,
            })
            return data.value as FetchPurchasedAlbumsResponse
        },
        reactive({
            enabled,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchInterval: 0,
            getNextPageParam: (lastPage:FetchPurchasedAlbumsResponse, pages:FetchPurchasedAlbumsResponse[]) => {
                return params.limit === lastPage.paidAlbums.length ? pages.length : undefined
            },
        }),
    )
}
