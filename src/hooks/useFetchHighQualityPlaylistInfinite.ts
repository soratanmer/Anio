import { fetchHighQualityPlaylist, PlaylistApiNames } from '@/api/playlist'
import { FetchHighQualityPlaylistParams, FetchHighQualityPlaylistResponse } from '@/api/playlist'

export default function useFetchHighQualityPlaylistInfinite(params: FetchHighQualityPlaylistParams) {
    console.debug('useFetchHighQualityPlaylistInfinite', params)

    return useInfiniteQuery(
        reactive([PlaylistApiNames.FETCH_HIGH_QUALITY_PLAYLIST, params]),
        async ({ pageParam = 0 }) => {
            const { data } = await fetchHighQualityPlaylist({
                cat: params.cat,
                limit: params.limit,
                before: pageParam,
            })
            return data.value as FetchHighQualityPlaylistResponse
        },
        reactive({
            enabled: true,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchInterval: 0,
            getNextPageParam: (lastPage: FetchHighQualityPlaylistResponse) => {
                return params.limit === lastPage.playlists.length
                    ? lastPage.playlists[lastPage.playlists.length - 1].updateTime
                    : undefined
            },
        }),
    )
}
