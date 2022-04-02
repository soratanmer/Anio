import { fetchArtist, ArtistApiNames } from '@/api/artist'
import type { FetchArtistParams } from '@/api/artist'

export default function useFetchArtist(params: FetchArtistParams, noCache: boolean = false) {
    console.debug('useArtist', params)

    const enabled = computed(() => {
        return !!params.id && params.id > 0 && !isNaN(Number(params.id))
    })

    return useQuery(
        reactive([ArtistApiNames.FETCH_ARTIST, params]),
        () => {
            return fetchArtist(params, noCache)
        },
        reactive({
            enabled,
            refetchOnWindowFocus: false,
        }),
    )
}
