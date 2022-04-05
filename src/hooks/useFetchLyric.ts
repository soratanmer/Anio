import { fetchLyric, TrackApiNames } from '@/api/track'
import { FetchLyricParams } from '@/api/track'

export default function useFetchLyric(params: FetchLyricParams) {
    return useQuery(reactive([TrackApiNames.FETCH_LYRIC, params]), () => {
        return fetchLyric(params)
    })
}
