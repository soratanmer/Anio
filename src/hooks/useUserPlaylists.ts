import { computed, reactive } from 'vue'
import { useQuery } from 'vue-query'

import { fetchUserPlaylists, UserApiNames } from '@/api/user'
import type { FetchUserPlaylistsParams } from '@/api/user'

export default function useUserPlayLists(params: FetchUserPlaylistsParams) {
    console.debug('useUserPlaylists', params)

    const enabled = computed(() => {
        return !!params.uid && params.uid !== 0 && params.offset !== undefined
    })

    return useQuery(
        reactive([UserApiNames.FETCH_USER_PLAYLISTS, params]),
        async () => {
            const data = await fetchUserPlaylists(params)
            return data
        },
        reactive({
            enabled,
        }),
    )
}
