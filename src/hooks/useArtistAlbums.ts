import { fetchArtistAlbums, ArtistApiNames } from '@/api/artist'
import { FetchArtistAlbumsParams } from '@/api/artist'

export default function useArtistAlbums(params: FetchArtistAlbumsParams) {
    console.debug('useArtistAlbums', params)

    const enabled = computed(() => {
        return !!params.id && params.id !== 0
    })

    return useQuery(
        reactive([ArtistApiNames.FETCH_ARTIST_ALBUMS, params]),
        async () => {
            const data = await fetchArtistAlbums(params)
            return data
        },
        reactive({
            enabled,
        }),
    )
}
