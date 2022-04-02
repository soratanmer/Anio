import { fetchUserLikedArtists, UserApiNames } from '@/api/user'
import type { FetchUserLikedArtistsParams } from '@/api/user'

export default function useFetchUserLikedArtist(params: FetchUserLikedArtistsParams) {
    console.debug('useUserLikedArtist', params)

    const enabled = computed(() => {
        return params.limit !== 0
    })

    return useInfiniteQuery(
        reactive([UserApiNames.FETCH_USER_LIKED_ARTISTS, params]),
        ({ pageParam = 0 }) => {
            return fetchUserLikedArtists({
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
                return params.limit === lastPage.data.length ? pages.length : undefined
            },
        }),
    )
}