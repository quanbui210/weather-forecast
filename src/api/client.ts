export type QueryValue = string | number | boolean | undefined | null;

export const buildQueryParams = (params: Record<string, QueryValue>) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, value.toString())
        }
    })
    return searchParams.toString()
}



export const generalFetcher = async <T>(baseUrl: string, params = {}, signal): Promise<T> => {
    const url = params ? `${baseUrl}?${buildQueryParams(params).toString()}` : baseUrl
    const response = await fetch (url, {
        headers: {
            'Content-Type': 'application/json',
        },
        signal,
    })
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
    }
    const rawResponse = await response.json() as Promise<T>
    return rawResponse
}  