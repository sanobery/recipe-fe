import { AxiosError } from "axios"

const processApi = async <T>(apiCall: () => Promise<{ status: number; data: T }>) => {
    try {
        const { status, data } = await apiCall()
        if (status === 200 || status === 201) {
            return { success: data, error: null }
        }
        return { success: null, error: data }
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return {
                success: null,
                error: error.response?.data || error.message || "An unexpected error occurred",
            }
        }
        return { success: null, error: "An unexpected error occurred" }
    }
}

export default processApi
