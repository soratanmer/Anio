import { fetchUserPlaylists, UserApiNames } from '@/api/user'
import type { FetchUserPlaylistsParams } from '@/api/user'

export default function useFetchUserPlayLists(params: FetchUserPlaylistsParams) {
    console.debug('useUserPlaylists', params)

    const enabled = computed(() => {
        return !!params.uid && params.uid !== 0 && params.offset !== undefined
    })

    return useQuery(
        reactive([UserApiNames.FETCH_USER_PLAYLISTS, params]),
        () => {
            return fetchUserPlaylists(params)
        },
        reactive({
            enabled,
            refetchOnWindowFocus: false,
        }),
    )
}