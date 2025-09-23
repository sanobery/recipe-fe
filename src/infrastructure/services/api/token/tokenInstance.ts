import axios from 'axios'
import { getApiUrl } from '../config'

const baseURL = getApiUrl()

const _axios = axios.create({
    baseURL: baseURL
})

const tokenService = {
    refresh : async () => {
        try {
            const response = await _axios.post('/auth/refresh', null, { withCredentials: true })
    
            const newAccessToken = response?.data?.accessToken
            if (newAccessToken) {
                const storedAuth = localStorage.getItem("persist:auth")
                if (storedAuth) {
                    const parsedAuth = JSON.parse(storedAuth)
                    parsedAuth.token = newAccessToken
                    localStorage.setItem("persist:auth", JSON.stringify(parsedAuth))
                }
            }
    
            return newAccessToken
        } catch {
            return null // Return null if refresh fails
        }
    }
}

export default tokenService
