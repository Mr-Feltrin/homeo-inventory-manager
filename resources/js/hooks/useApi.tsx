/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";

type ApiResponse = any;
type ErrorObject = { [key: string]: string };

/* This Hook is adapted to have a similar structure to the inertia/react
form helper, but not requiring inertia to return a page object along with data.
This helps to keep a more flexible approach on data handling, relying on inertia
only to perform components rendering.
*/

const useApi = function <T>(initialData?: T) {
    const [data, setDataState] = useState<T | undefined>(initialData);

    // Get the loading state for the request
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Get the response from the request
    const [response, setResponse] = useState<ApiResponse | null>(null);
    // Error object for failed requests
    const [errors, setErrors] = useState<ErrorObject | null>(null);
    // State to check if last request has been successful
    const [recentlySuccessful, setRecentlySuccessful] = useState<boolean>(false);

    // Function to update individual properties of data
    const setData = <K extends keyof T>(key: K, value: T[K]) => {
        setDataState(prevData => (prevData ? { ...prevData, [key]: value } : { [key]: value }) as T);
    };

    const submit = useCallback(
        async (route: string, method: Method, requestData?: any, config: AxiosRequestConfig = {}) => {
            setIsLoading(true);
            setRecentlySuccessful(false);
            try {
                let finalData = requestData || data;
                // Check if data contains a File instance
                if (finalData && (finalData instanceof File || Object.values(finalData).some(value => value instanceof File))) {
                    const formData = new FormData();
                    for (const key in finalData) {
                        const value = finalData[key];
                        if (value instanceof Blob) {
                            formData.append(key, value);
                        } else if (value !== undefined) {
                            formData.append(key, String(value));
                        }
                    }
                    /*
                For multipart/form-data requests using either 'put' or 'patch',
                laravel and some browsers doesn't handle these methods quite well, 
                so this workaround allows us to mock the request as 'post' but
                allowing the server side to recognize the intended method
                */
                    if (method === "PUT" || method === "PATCH") {
                        formData.append("_method", method);
                        method = "POST";
                    }
                    finalData = formData as any;
                }
                const apiResponse = await axios.request<ApiResponse>({
                    url: route,
                    method,
                    ...(method === "GET" ? { params: finalData } : { data: finalData }),
                    timeout: 30000,
                    withCredentials: true,
                    ...config
                });
                setResponse(apiResponse.data);
                setErrors(null);
                setRecentlySuccessful(true);
                return { ...apiResponse, ok: true };
            } catch (err) {
                /*
            Every error in the API whenever is a input or something else should be passed
            inside a errors object in the response data
            */
                const errorResponse: any = (err as AxiosError).response?.data;
                if (errorResponse) {
                    setErrors((errorResponse.errors as ErrorObject) ?? errorResponse);
                }
                setRecentlySuccessful(false);
                setResponse(null);
                return { ...(err as AxiosError).response, ok: false };
            } finally {
                setIsLoading(false);
            }
        },
        [data]
    );

    return { data, setData, isLoading, response, errors, submit, recentlySuccessful };
};

export default useApi;
