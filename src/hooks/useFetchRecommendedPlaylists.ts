import { PlaylistApiNames, fetchRecommendedPlaylists } from '@/api/playlist'
import { FetchRecommendedPlaylistsParams } from '@/api/playlist'

export default function useFetchRecommendedPlaylists(params: FetchRecommendedPlaylistsParams) {
    console.debug('useRecommendedPlaylists', params)
    return useQuery(
        reactive([PlaylistApiNames.FETCH_RECOMMENDED_PLAYLISTS, params]),
        () => {
            return fetchRecommendedPlaylists({
                limit: params.limit,
            })
        },
        reactive({
            refetchOnWindowFocus: false,
        }),
    )
}
