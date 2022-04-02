import { fetchUserLikedSongsIDs, UserApiNames } from '@/api/user'
import type { FetchUserLikedSongsIdsParams } from '@/api/user'

export default function useFetchUserLikedSongsIDs(params: FetchUserLikedSongsIdsParams) {
    const enabled = computed(() => {
        return !!params.uid && params.uid !== 0
    })
    return useQuery(
        reactive([UserApiNames.FETCH_USER_LIKED_SONGS_IDS, params]),
        () => {
            return fetchUserLikedSongsIDs(params)
        },
        reactive({
            enabled,
            refetchOnWindowFocus: false,
        }),
    )
}
