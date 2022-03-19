import { computed, reactive } from 'vue'
import { useQuery } from 'vue-query'
import { fetchUserLikedSongsIDs, UserApiNames } from '@/api/user'
import type { FetchUserLikedSongsIdsParams } from '@/api/user'

export default function useUserLikedSongsIDs(params: FetchUserLikedSongsIdsParams) {
    const enabled = computed(() => {
        return !!params.uid && params.uid !== 0
    })
    return useQuery(
        reactive([UserApiNames.FETCH_USER_LIKED_SONGS_IDS, params]),
        () => {
            return fetchUserLikedSongsIDs(params)
        },
        reactive({ enabled }),
    )
}