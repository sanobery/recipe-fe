import processApi from "../../utils/processApi"
import axiosInstance from "../axiosInstance"

interface QueryParams {
    [key: string]: string | number | boolean | null | undefined| FormData
}

const userService = {
    base: 'auth/',

    login: async (queryParams: QueryParams) => {

        const apiCall = async function (queryParams: QueryParams) {
            queryParams = queryParams ? queryParams : {}
            const response = await axiosInstance.post(userService.base,queryParams)

            return response
        }

        const response = await processApi(apiCall.bind(null, queryParams))
        return response
    },

    logout: async () => {
        const apiCall = async function () {
            const response = await axiosInstance.post(userService.base+'logout')  

            return response
        }
        const response = await processApi(apiCall)
    
        return response
    },

    userManagement: async (param:string,queryParams: QueryParams) => {
        const apiCall = async function (queryParams: QueryParams) {            
            const response = await axiosInstance.post(userService.base+param, queryParams)

            return response
        }
        const response = await processApi(apiCall.bind(null, queryParams))
        return response
    },

    getUserDetail: async () => {
        const apiCall = async function () {
            const response = await axiosInstance.get(userService.base+'profile')
    
            return response
        }
    
        const response = await processApi(apiCall)
        return response
    },
}

export default userService
