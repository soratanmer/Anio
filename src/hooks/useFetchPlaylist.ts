import { fetchPlaylist, PlaylistApiNames } from '@/api/playlist'
import type { FetchPlaylistParams } from '@/api/playlist'

export default function useFetchPlaylist(params: FetchPlaylistParams, noCache: boolean = false) {
    console.debug('usePlaylist', params)

    const enabled = computed(() => {
        return !!params.id && params.id > 0 && !isNaN(Number(params.id))
    })

    return useQuery(
        reactive([PlaylistApiNames.FETCH_PLAYLIST, params]),
        () => {
            return fetchPlaylist(params, noCache)
        },
        reactive({
            enabled,
            refetchOnWindowFocus: false,
        }),
    )
}
