import { createFetch, isObject, MaybeRef, UseFetchReturn } from '@vueuse/core'
import { stringifyQuery, LocationQueryRaw } from 'vue-router'

let baseURL = String(import.meta.env.VITE_APP_NETEASE_API_URL)

export const useRequest = createFetch({
    baseUrl: '/api', // 基础路由
    options: {
        timeout: 30000, // 请求过期时间
        refetch: true,
        // 在请求前修改配置，如：注入 token 值
        async beforeFetch({ options }) {
            return { options }
        },
        // 在请求后处理数据，如：拦截错误、处理过期
        afterFetch({ data, response }) {
            // code...
            return { data, response }
        },
        // 请求错误
        onFetchError({ data, error }) {
            console.error(error)
            return { data, error }
        },
    },
    fetchOptions: {
        mode: 'cors',
        cache: 'no-store',
    },
})

/**
 * 封装 get 请求
 * @param url 请求地址
 * @param query 请求参数
 */
export function useGet<T = unknown>(url: MaybeRef<string>, query?: MaybeRef<unknown>): UseFetchReturn<T> {
    const _url = computed(() => {
        const _url = unref(url)
        const _query = unref(query)
        const queryString = isObject(_query) ? stringifyQuery(_query as LocationQueryRaw) : _query || ''
        return `${_url}${queryString ? '?' : ''}${queryString}`
    })

    return useRequest<T>(_url).json()
}

/**
 * 封装 post 请求
 * @param url 请求地址
 * @param payload 请求参数
 */
export function usePost<T = unknown>(url: MaybeRef<string>, payload?: MaybeRef<unknown>): UseFetchReturn<T> {
    return useRequest<T>(url).post(payload).json()
}

/**
 * 封装 put 请求
 * @param url 请求地址
 * @param payload 请求参数
 */
export function usePut<T = unknown>(url: MaybeRef<string>, payload?: MaybeRef<unknown>): UseFetchReturn<T> {
    return useRequest<T>(url).put(payload).json()
}

/**
 * 封装 delete 请求
 * @param url 请求地址
 * @param payload 请求参数
 */
export function useDelete<T = unknown>(url: MaybeRef<string>, payload?: MaybeRef<unknown>): UseFetchReturn<T> {
    return useRequest<T>(url).delete(payload).json()
}

/**
 * 封装获取Blob进行下载
 * @param url 请求地址
 */
export function useBlob(url: MaybeRef<string>): UseFetchReturn<Blob> {
    return useRequest(url).blob()
}
