import { computed, reactive } from 'vue'
import { useQuery } from 'vue-query'

import { fetchArtist, ArtistApiNames } from '@/api/artist'
import type { FetchArtistParams } from '@/api/artist'

export default function useArtist(params: FetchArtistParams, noCache: boolean = false) {
    console.debug('useArtist', params)

    const enabled = computed(() => {
        return !!params.id && params.id > 0 && !isNaN(Number(params.id))
    })

    return useQuery(
        reactive([ArtistApiNames.FETCH_ARTIST, params]),
        async () => {
            const data = await fetchArtist(params, noCache)
            return data
        },
        reactive({ enabled }),
    )
}
