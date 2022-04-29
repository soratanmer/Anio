import { fetchTopPlaylist, PlaylistApiNames } from '@/api/playlist'
import type { FetchTopPlaylistParams, FetchTopPlaylistResponse } from '@/api/playlist'

export default function useFetchTopPlaylistsInfinite(params: FetchTopPlaylistParams) {
    console.debug('useFetchTopPlaylistsInfinite', params)

    const enabled = computed(() => {
        return params.limit !== 0
    })

    return useInfiniteQuery(
        reactive([PlaylistApiNames.FETCH_TOP_PLAYLIST, params]),
        async ({ pageParam = 0 }) => {
            const { data } = await fetchTopPlaylist({
                order: params.order,
                cat: params.cat,
                limit: params.limit,
                offset: pageParam * params.limit,
            })
            return data.value as FetchTopPlaylistResponse
        },
        reactive({
            enabled,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchInterval: 0,
            getNextPageParam: (lastPage: FetchTopPlaylistResponse, pages: FetchTopPlaylistResponse[]) => {
                return params.limit === lastPage.playlists.length ? pages.length : undefined
            },
        }),
    )
}
