import { fetchPersonalFM, FMApiNames } from '@/api/FM'

export default function useFetchPersonalFM() {
    console.debug('usePersonalFM')

    return useQuery(
        reactive([FMApiNames.FETCH_PERSONAL_FM]),
        () => {
            return fetchPersonalFM()
        },
        reactive({
            refetchOnWindowFocus: false,
        }),
    )
}
