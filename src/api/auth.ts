import { usePost } from '@/hooks/useFetchNetEase'
import { UseFetchReturn } from '@vueuse/core'
import type { FetchUserAccountResponse } from '@/api/user'

export enum AuthApiNames {
    LOGIN_WITH_EMAIL = 'loginWithEmail',
    REFRESH_COOKIE = 'refreshCookie',
    LOGOUT = 'logout',
}

/**
 * 邮箱登录
 * - email: 163 网易邮箱
 * - password: 密码
 * - md5_password: md5加密后的密码,传入后 password 将失效
 */

export interface LoginWithEmailParams {
    email: string
    password?: string
    md5_password?: string
}

export interface LoginWithEmailResponse extends FetchUserAccountResponse {
    code: number
    cookie: string
    loginType: number
    token: string
    binding: {
        bindingTime: number
        expired: boolean
        expiresIn: number
        id: number
        refreshTime: number
        tokenJsonStr: string
        type: number
        url: string
        userId: number
    }[]
}

export function loginWithEmail(params: LoginWithEmailParams): UseFetchReturn<LoginWithEmailResponse> {
    return usePost('/login', params)
}

/**
 * 刷新登录
 * 说明 : 调用此接口 , 可刷新登录状态
 * - 调用例子 : /login/refresh
 */

export interface RefreshCookieResponse {
    code: number
}

export function refreshCookie(): UseFetchReturn<RefreshCookieResponse> {
    return usePost('/login/refresh')
}

/**
 * 退出登录
 * 说明 : 调用此接口 , 可退出登录
 */

export interface LogoutResponse {
    code: number
}

export function logout(): UseFetchReturn<LogoutResponse> {
    return usePost('/logout')
}
