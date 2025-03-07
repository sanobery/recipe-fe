export const fetchData = async (
    url: string, 
    method: string = "GET", 
    body?: Record<string, unknown> | FormData, // Specify type here
    includeCredentials: boolean = true, 
    isFormData: boolean = false 
) => {
    try {
        const options: RequestInit = {
            method,
            credentials: includeCredentials ? "include" : "same-origin",
        };

        // Set headers only if body is JSON (not for FormData)
        if (!isFormData) {
            options.headers = {
                "Content-Type": "application/json",
            };
        }

        // Handle body based on type
        if (body) {
            options.body = isFormData ? (body as FormData) : JSON.stringify(body);
        }

        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || "Something went wrong");
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Fetch error:", error.message);
        }
        throw error;
    }
};
