import { fetchUserAccount, UserApiNames } from '@/api/user'

export default function useFetchUserAccount() {
    console.debug('useUserAccount')
    return useQuery(
        reactive([UserApiNames.FETCH_USER_ACCOUNT]),
        () => {
            return fetchUserAccount()
        },
        reactive({
            refetchOnWindowFocus: false,
        }),
    )
}
