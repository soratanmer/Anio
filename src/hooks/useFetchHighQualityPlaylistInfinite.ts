import { fetchHighQualityPlaylist, PlaylistApiNames } from '@/api/playlist'
import { FetchHighQualityPlaylistParams } from '@/api/playlist'

export default function useFetchHighQualityPlaylistInfinite(params: FetchHighQualityPlaylistParams) {
    console.debug('useFetchHighQualityPlaylistInfinite', params)

    return useInfiniteQuery(
        reactive([PlaylistApiNames.FETCH_HIGH_QUALITY_PLAYLIST, params]),
        ({ pageParam = 0 }) => {
            return fetchHighQualityPlaylist({
                cat: params.cat,
                limit: params.limit,
                before: pageParam,
            }).data.value
        },
        reactive({
            enabled: true,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchInterval: 0,
            getNextPageParam: (lastPage, pages) => {
                return params.limit === lastPage.playlists.length
                    ? lastPage.playlists[lastPage.playlists.length - 1].updateTime
                    : undefined
            },
        }),
    )
}
