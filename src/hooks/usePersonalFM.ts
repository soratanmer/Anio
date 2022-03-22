import { fetchPersonalFM, FMApiNames } from '@/api/FM'

export default function usePersonalFM() {
    console.debug('usePersonalFM')

    return useQuery(FMApiNames.FETCH_PERSONAL_FM, async () => {
        const data = await fetchPersonalFM()
        return data
    })
}
