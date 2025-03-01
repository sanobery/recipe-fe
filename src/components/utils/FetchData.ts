export const fetchData = async (
    url: string, 
    method: string = "GET", 
    body?: any, 
    includeCredentials: boolean = true, 
    isFormData: boolean = false // NEW PARAMETER
) => {
    try {
        const options: RequestInit = {
            method,
            credentials: includeCredentials ? "include" : "same-origin", // Include cookies if needed
        };

        // Set headers only if body is JSON (not for FormData)
        if (!isFormData) {
            options.headers = {
                "Content-Type": "application/json",
            };
        }

        // Handle body based on type
        if (body) {
            options.body = isFormData ? body : JSON.stringify(body);
        }

        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || "Something went wrong");
        }

        return data;
    } catch (error: any) {
        console.error("Fetch error:", error.message);
        throw error;
    }
};
