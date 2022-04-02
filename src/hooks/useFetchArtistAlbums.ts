import { fetchArtistAlbums, ArtistApiNames } from '@/api/artist'
import { FetchArtistAlbumsParams } from '@/api/artist'

export default function useFetchArtistAlbums(params: FetchArtistAlbumsParams) {
    console.debug('useArtistAlbums', params)

    const enabled = computed(() => {
        return !!params.id && params.id !== 0
    })

    return useQuery(
        reactive([ArtistApiNames.FETCH_ARTIST_ALBUMS, params]),
        () => {
            return fetchArtistAlbums(params)
        },
        reactive({
            enabled,
            refetchOnWindowFocus: false,
        }),
    )
}
