import { fetchTracks, TrackApiNames } from '@/api/track'
import type { FetchTracksParams } from '@/api/track'

export default function useFetchTracks(params: FetchTracksParams) {
    console.debug('useFetchTracks', params)

    const enabled = computed(() => {
        return params.ids.length !== 0
    })

    return useQuery(
        reactive([TrackApiNames.FETCH_TRACKS, params]),
        () => {
            return fetchTracks(params)
        },
        reactive({ enabled, refetchOnWindowFocus: false }),
    )
}
