import { fetchTopPlaylist, PlaylistApiNames } from '@/api/playlist'
import type { FetchTopPlaylistParams } from '@/api/playlist'

export default function useTopPlaylists(params: FetchTopPlaylistParams) {
    console.debug('useTopPlaylists', params)

    const enabled = computed(() => {
        return params.limit !== 0
    })

    return useInfiniteQuery(
        reactive([PlaylistApiNames.FETCH_TOP_PLAYLIST, params]),
        ({ pageParam = 0 }) => {
            return fetchTopPlaylist({
                order: params.order,
                cat: params.cat,
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
                return params.limit === lastPage.playlists.length ? pages.length : undefined
            },
        }),
    )
}
