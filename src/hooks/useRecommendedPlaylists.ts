import { PlaylistApiNames, fetchRecommendedPlaylists } from '@/api/playlist'
import { FetchRecommendedPlaylistsParams } from '@/api/playlist'

export default function useRecommendedPlaylists(params: FetchRecommendedPlaylistsParams) {
    console.debug('useRecommendedPlaylists', params)
    return useQuery(reactive([PlaylistApiNames.FETCH_RECOMMENDED_PLAYLISTS, params]), async () => {
        const data = await fetchRecommendedPlaylists({
            limit: params.limit,
        })
        return data
    })
}
