import { getCookie } from '@/utils/cookie'
import { logout } from '@/api/auth'

export function isLoggedIn(): boolean {
    return getCookie('MUSIC_U') !== undefined
}

export function doLogout() {
    logout()
    sessionStorage.clear()
    localStorage.clear()
}
