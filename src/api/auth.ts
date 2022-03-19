import request from '@/utils/request'
import type { FetchUserAccountResponse } from '@/api/user'

export enum AuthApiNames {
    LOGIN_WITH_PHONE = 'loginWithPhone',
    LOGIN_WITH_EMAIL = 'loginWithEmail',
    REFRESH_COOKIE = 'refreshCookie',
    LOGOUT = 'logout',
}

/**
 * 手机登录
 * - phone: 手机号码
 * - password: 密码
 * - countrycode: 国家码，用于国外手机号登录，例如美国传入：1
 * - md5_password: md5加密后的密码,传入后 password 将失效
 * - captcha: 验证码,使用 /captcha/sent 接口传入手机号获取验证码,调用此接口传入验证码,可使用验证码登录,传入后 password 参数将失效
 */

export interface LoginWithPhoneParams {
    countrycode: number | string
    phone: string
    password?: string
    md5_password?: string
    captcha?: string | number
}

export function loginWithPhone(params: LoginWithPhoneParams) {
    return request({
        url: '/login/cellphone',
        method: 'post',
        params,
    })
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

export function loginWithEmail(params: LoginWithEmailParams) {
    return request({
        url: '/login',
        method: 'post',
        params,
    })
}

/**
 * 刷新登录
 * 说明 : 调用此接口 , 可刷新登录状态
 * - 调用例子 : /login/refresh
 */

export function refreshCookie() {
    return request({
        url: '/login/refresh',
        method: 'post',
    })
}

/**
 * 退出登录
 * 说明 : 调用此接口 , 可退出登录
 */

export function logout() {
    return request({
        url: '/logout',
        method: 'post',
    })
}
