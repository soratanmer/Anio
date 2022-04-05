import { fetchTopSongs, TrackApiNames } from '@/api/track'
import { FetchTopSongsParams } from '@/api/track'

export default function useFetchTopSongs(params: FetchTopSongsParams) {
    console.debug('useFetchTopSongs', params)

    return useQuery(
        reactive([TrackApiNames.FETCH_TOP_SONGS, params]),
        () => {
            return fetchTopSongs(params)
        },
        reactive({
            enable: true,
            refetchOnWindowFocus: false,
        }),
    )
}
