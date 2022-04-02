import { fetchAlbum, AlbumApiNames } from '@/api/album'
import type { FetchAlbumParams } from '@/api/album'

export default function useFetchAlbum(params: FetchAlbumParams, noCache: boolean = false) {
    console.debug('useAlbum', params)

    const enabled = computed(() => {
        return !!params.id && params.id > 0 && !isNaN(Number(params.id))
    })

    return useQuery(
        reactive([AlbumApiNames.FETCH_ALBUM, params]),
        () => {
            return fetchAlbum(params, noCache)
        },
        reactive({
            enabled,
            refetchOnWindowFocus: false,
        }),
    )
}
