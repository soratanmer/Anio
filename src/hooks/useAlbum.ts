import { computed, reactive } from 'vue'
import { useQuery } from 'vue-query'

import { fetchAlbum, AlbumApiNames } from '@/api/album'
import type { FetchAlbumParams } from '@/api/album'

export default function useAlbum(params: FetchAlbumParams, noCache: boolean = false) {
    console.debug('useAlbum', params)

    const enabled = computed(() => {
        return !!params.id && params.id > 0 && !isNaN(Number(params.id))
    })

    return useQuery(
        reactive([AlbumApiNames.FETCH_ALBUM, params]),
        async () => {
            const data = await fetchAlbum(params, noCache)
            return data
        },
        reactive({ enabled }),
    )
}
