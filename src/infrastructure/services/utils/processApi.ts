const processApi = async <T>(apiCall: () => Promise<{ status: number; data: T }>) => {
    try {
        const { status, data } = await apiCall();
        if (status === 200 || status === 201) {
            return { success: data, error: null };
        }
        return { success: null, error: data };
    } catch (error) {
        if (error instanceof Error) {
            // Handle known Error types
            return {
                success: null,
                error: error.message,
            };
        } else {
            // Handle unknown error structures
            return {
                success: null,
                error: "An unexpected error occurred",
            };
        }
    }
}

export default processApi 