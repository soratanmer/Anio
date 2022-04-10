import { fetchUserLikedAlbums, UserApiNames } from '@/api/user'
import { FetchUserLikedAlbumsParams } from '@/api/user'

export default function useFetchUserLikedAlbumsInfinite(params: FetchUserLikedAlbumsParams) {
    console.debug('useFetchUserLikedAlbumsInfinite', params)

    const enabled = computed(() => {
        return params.limit !== 0
    })

    return useInfiniteQuery(
        reactive([UserApiNames.FETCH_USER_LIKED_ALBUMS, params]),
        ({ pageParam = 0 }) => {
            return fetchUserLikedAlbums({
                limit: params.limit,
                offset: pageParam * params.limit,
            }).data.value
        },
        reactive({
            enabled,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchInterval: 0,
            getNextPageParam: (lastPage, pages) => {
                return params.limit === lastPage.data.length ? pages.length : undefined
            },
        }),
    )
}
