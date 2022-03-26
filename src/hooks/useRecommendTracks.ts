import { fetchDailyRecommendTracks, PlaylistApiNames } from '@/api/playlist'

export default function useRecommendTracks() {
    console.debug('useRecommendTracks')

    return useQuery(reactive([PlaylistApiNames.FETCH_DAILY_RECOMMENDED_TRACKS]), () => {
        return fetchDailyRecommendTracks()
    })
}
