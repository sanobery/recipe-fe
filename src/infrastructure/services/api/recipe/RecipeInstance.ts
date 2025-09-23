import processApi from "../../utils/processApi"
import axiosInstance from "../axiosInstance"
import { Recipe } from "../../../../types/RecipeAuthInterface"

interface RecipeResponse {
    recipes: Recipe[],
    total: number
}

interface QueryParams {
    [key: string]: string | number | boolean | null | undefined| FormData
}

const recipeService = {
    base: 'recipe',

    getAll: async (queryParams: QueryParams) => {
        const apiCall = async function (queryParams: QueryParams) {
            queryParams = queryParams || {}
            const response = await axiosInstance.get<RecipeResponse>(recipeService.base, {
                params: queryParams,
            })
            return response
        }

        const response = await processApi(() => apiCall(queryParams))
        return response
    },

    addRecipe: async (formData: FormData) => {
        const apiCall = async function (formData: FormData) {
            const response = await axiosInstance.post(recipeService.base, formData, {
                headers: { "Content-Type": "multipart/form-data" }, // Important for FormData
            })
            return response
        }
    
        const response = await processApi(() => apiCall(formData))
        return response
    },

    getDetail: async (param: string | undefined) => {
        const apiCall = async function (param: string | undefined) {
            const response = await axiosInstance.get(`${recipeService.base}/${param}`)
            return response
        }

        const response = await processApi(() => apiCall(param))
        return response
    },

    getUserRecipe: async (param: string, queryParams: QueryParams) => {
        const apiCall = async function (param: string, queryParams: QueryParams) {
            const response = await axiosInstance.post(`${recipeService.base}/${param}`, queryParams)
            return response
        }

        const response = await processApi(() => apiCall(param, queryParams))
        return response
    },


    feedback: async (param: string, queryParams: QueryParams) => {
        const apiCall = async function (queryParams: QueryParams) {
            const response = await axiosInstance.post(
                `${recipeService.base}/${param}`,
                queryParams)

            return response
        }

        const response = await processApi(() => apiCall(queryParams))
        return response
    },

    filter: async (queryParams: QueryParams) => {
        const apiCall = async function (queryParams: QueryParams) {
            const response = await axiosInstance.get(`${recipeService.base}/filter`, {
                params: queryParams,
            })
            return response
        }

        const response = await processApi(() => apiCall(queryParams))
        return response
    },

    search: async (queryParams: QueryParams) => {
        const apiCall = async function (queryParams: QueryParams) {
            queryParams = queryParams || {}
            const response = await axiosInstance.post(`${recipeService.base}/search/`, queryParams)
            return response
        }

        const response = await processApi(() => apiCall(queryParams))
        return response
    },

    editRecipe: async (formData: FormData) => {
        const apiCall = async function (formData: FormData) {
            const response = await axiosInstance.patch(recipeService.base, formData, {
                headers: { "Content-Type": "multipart/form-data" }, // Important for FormData
            })
            return response
        }
    
        const response = await processApi(() => apiCall(formData))
        return response
    },

}

export default recipeService
