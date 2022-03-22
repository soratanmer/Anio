import { PlaylistApiNames, fetchRecommendedPlaylists } from '@/api/playlist'

export default function useRecommendedPlaylists() {
    console.debug('useRecommendedPlaylists')
    return useQuery(PlaylistApiNames.FETCH_RECOMMENDED_PLAYLISTS, async () => {
        const data = await fetchRecommendedPlaylists({})
        return data
    })
}
