import { fetchTracks, TrackApiNames } from '@/api/track'
import type { FetchTracksParams,FetchTracksResponse } from '@/api/track'

export default function useFetchTracksInfinite(params: FetchTracksParams) {
    console.debug('useFetchTracksInfinite', params.ids)
    const enabled = computed(() => params.ids.length !== 0)

    // 20 tracks each page
    const offset = 50

    return useInfiniteQuery(
        reactive([TrackApiNames.FETCH_TRACKS, params]),
        async ({ pageParam = 0 }) => {
            const cursorStart = pageParam * offset
            const cursorEnd = cursorStart + offset
            const ids = params.ids.slice(cursorStart, cursorEnd)

            const { data } = await fetchTracks({ ids })

            return data.value as FetchTracksResponse
        },
        reactive({
            enabled,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchInterval: 0,
            getNextPageParam: (lastPage:FetchTracksResponse, pages:FetchTracksResponse[]) => {
                // 判断是否还有下一页
                // 当 return undefined 时，hasNextPage会等于false
                // 当 return 非 undefined 时，return 的数据会传入上面的fetchTracks函数中
                return pages.length * offset < params.ids.length ? pages.length : undefined
            },
        }),
    )
}
