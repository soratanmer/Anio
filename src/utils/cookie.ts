import Cookies from 'js-cookie'
import { useUserStore } from '@/stores/user'
import { objectsOmit } from 'all-of-just'

const userStore = useUserStore()

export function setCookie(string: string): void {
    const cookie = string.replace('HTTPOnly', '').split(';;')

    cookie.map((cookie) => {
        const cookieKeyValue = cookie.split(';')[0].split('=')
        const [key, value] = cookieKeyValue

        userStore.cookies[key] = value

        Cookies.set(key, value, {
            expires: 3650,
        })
    })
}

export function getCookie(key: string): string {
    return Cookies.get(key) ?? userStore.cookies[key]
}

export function removeCookie(key: string) {
    Cookies.remove(key)
    objectsOmit(userStore.cookies, key)
}
