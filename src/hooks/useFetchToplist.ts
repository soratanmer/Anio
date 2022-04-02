import { fetchToplist, PlaylistApiNames } from '@/api/playlist'

export default function useFetchToplist() {
    console.debug('useToplist')

    return useQuery(
        reactive([PlaylistApiNames.FETCH_TOPLIST]),
        () => {
            return fetchToplist()
        },
        reactive({
            refetchOnWindowFocus: false,
        }),
    )
}
