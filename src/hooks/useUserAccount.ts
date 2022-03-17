import { useQuery } from 'vue-query'
import { fetchUserAccount, UserApiNames } from '@/api/user'

export default function useUserAccount() {
    console.debug('useUserAccount')
    return useQuery(UserApiNames.FETCH_USER_ACCOUNT, async () => {
        const data = await fetchUserAccount()
        return data
    })
}
