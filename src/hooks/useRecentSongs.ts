import { fetchRecentSongs, UserApiNames } from '@/api/user'
import { FetchRecentSongsParams } from '@/api/user'

export default function useRecentSongs(params: FetchRecentSongsParams) {
    console.debug('useRecentSongs', params)

    return useQuery(reactive([UserApiNames.FETCH_RECENT_SONGS, params]), () => {
        return fetchRecentSongs(params)
    })
}
