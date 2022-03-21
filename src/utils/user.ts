import { getCookie } from '@/utils/cookie'

export function isLoggedIn(): boolean {
    return getCookie('MUSIC_U') !== undefined
}
