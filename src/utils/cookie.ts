import Cookies from 'js-cookie'

export function setCookie(string: string): void {
    const cookie = string.replace('HTTPOnly', '').split(';;')

    cookie.map((cookie) => {
        const cookieKeyValue = cookie.split(';')[0].split('=')
        const [key, value] = cookieKeyValue

        Cookies.set(key, value, {
            expires: 3650,
        })
    })
}

export function getCookie(key: string): string | undefined {
    return Cookies.get(key)
}

export function removeCookie(key: string) {
    Cookies.remove(key)
}

export function isLoggedIn(): boolean {
    return getCookie('MUSIC_U') !== undefined
}
