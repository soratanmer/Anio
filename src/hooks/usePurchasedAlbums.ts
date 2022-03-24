import { fetchPurchasedAlbums, UserApiNames } from '@/api/user'
import type { FetchPurchasedAlbumsParams } from '@/api/user'

export default function usePurchasedAlbums(params: FetchPurchasedAlbumsParams) {
    console.debug('usePurchasedAlbums', params)

    const enabled = computed(() => {
        return params.limit !== 0
    })

    return useInfiniteQuery(
        reactive([UserApiNames.FETCH_PURCHASED_ALBUMS, params]),
        ({ pageParam = 0 }) => {
            return fetchPurchasedAlbums({
                limit: params.limit,
                offset: pageParam * params.limit,
            })
        },
        reactive({
            enabled,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchInterval: 0,
            getNextPageParam: (lastPage, pages) => {
                return params.limit === lastPage.paidAlbums.length ? pages.length : undefined
            },
        }),
    )
}
