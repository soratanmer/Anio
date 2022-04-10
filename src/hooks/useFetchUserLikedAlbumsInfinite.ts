import { fetchUserLikedAlbums, UserApiNames } from '@/api/user'
import { FetchUserLikedAlbumsParams } from '@/api/user'

export default function useFetchUserLikedAlbumsInfinite(params: FetchUserLikedAlbumsParams) {
    console.debug('useFetchUserLikedAlbumsInfinite', params)

    const enabled = computed(() => {
        return params.limit !== 0
    })

    return useInfiniteQuery(
        reactive([UserApiNames.FETCH_USER_LIKED_ALBUMS, params]),
        async ({ pageParam = 0 }) => {
            const { data } = await fetchUserLikedAlbums({
                limit: params.limit,
                offset: pageParam * params.limit,
            })
            return data.value
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
