import { fetchToplistOfArtists, ArtistApiNames } from '@/api/artist'
import { FetchToplistOfArtistsParams } from '@/api/artist'

export default function useFetchToplistArtists(params: FetchToplistOfArtistsParams) {
    return useQuery(
        reactive([ArtistApiNames.FETCH_TOPLIST_OF_ARTISTS]),
        () => {
            return fetchToplistOfArtists({
                type: params.type,
            })
        },
        reactive({
            refetchOnWindowFocus: false,
        }),
    )
}
