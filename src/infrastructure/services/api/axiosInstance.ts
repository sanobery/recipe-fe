import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL

const _axios = axios.create({
    baseURL: baseURL
})

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
    withCredentials: true,
})

const refresh = async () => {
    try {
        const response = await _axios.post('/auth/refresh', null, { withCredentials: true })

        const newAccessToken = response?.data?.accessToken
        if (newAccessToken) {
            // ✅ Store new token in localStorage for future requests
            const storedAuth = localStorage.getItem("persist:auth")
            if (storedAuth) {
                const parsedAuth = JSON.parse(storedAuth)
                parsedAuth.token = newAccessToken
                localStorage.setItem("persist:auth", JSON.stringify(parsedAuth))
            }
        }

        return newAccessToken
    } catch (err) {
        return null // Return null if refresh fails
    }
}

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
            const newAccessToken = await refresh()

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
