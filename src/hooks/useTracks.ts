import { computed, reactive } from 'vue'
import { useQuery } from 'vue-query'

import { fetchTracks, TrackApiNames } from '@/api/track'
import type { FetchTracksParams } from '@/api/track'

export default function useTracks(params: FetchTracksParams) {
    console.debug('useTrack', params)

    const enabled = computed(() => {
        return params.ids.length !== 0
    })

    return useQuery(
        reactive([TrackApiNames.FETCH_TRACKS, params]),
        async () => {
            const data = fetchTracks(params)
            return data
        },
        reactive({ enabled }),
    )
}
