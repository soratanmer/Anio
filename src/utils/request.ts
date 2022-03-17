import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance, AxiosError } from 'axios'
import Cookies from 'js-cookie'

let baseURL = String(import.meta.env.VITE_APP_NETEASE_API_URL)

const service: AxiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 15000,
})

service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        if (!config.params) {
            config.params = {}
        }

        config.params.Cookies = `MUSIC_U=${Cookies.get('MUSIC_U')};`
        config.params.realIP = '116.25.146.177'

        return config
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    },
)

service.interceptors.response.use(
    (response: AxiosResponse) => {
        const res = response.data
        return res
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    },
)

const request = async (config: AxiosRequestConfig) => {
    const { data } = await service.request(config)
    return data as any
}

export default request
