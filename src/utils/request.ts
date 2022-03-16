import axios from 'axios'
import Cookies from 'js-cookie'

let baseURL = import.meta.env.VITE_APP_NETEASE_API_URL as string

const service = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 15000,
})

service.interceptors.request.use(
    (config) => {
        if (!config.params) {
            config.params = {}
        }

        config.params.Cookies = `MUSIC_U=${Cookies.get('MUSIC_U')};`
        config.params.realIP = '116.25.146.177'

        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

service.interceptors.response.use(
    (response) => {
        const res = response.data
        return res
    },
    (error) => {
        return Promise.reject(error)
    },
)

export default service
