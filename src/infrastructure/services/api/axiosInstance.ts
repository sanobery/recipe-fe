import axios from 'axios'
import tokenService from './token/tokenInstance'
import { getApiUrl } from './config'

const baseURL = getApiUrl()

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
    withCredentials: true,
})

axiosInstance.interceptors.request.use(
    (config) => {      
        const storedAuth = localStorage.getItem("persist:auth")
        if (storedAuth) {
            const parsedAuth = JSON.parse(storedAuth)
            
            const token = parsedAuth?.token?.replace(/^"|"$/g, '')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    }, 
    (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        const prevRequest = error?.config

        if (error?.response?.status === 403 && !prevRequest?.sent) {
            prevRequest.sent = true // Mark this request to prevent infinite loop
            const newAccessToken = await tokenService.refresh()

            if (!newAccessToken) {
                return Promise.reject(error) // Reject if refresh fails
            }

            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
            return axiosInstance(prevRequest) // Retry the request with new token
        }

        return Promise.reject(error)
    }
)

export default axiosInstance
