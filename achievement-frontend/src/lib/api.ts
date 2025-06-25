import Cookies from "js-cookie";

export const API_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:80/api";

async function fetchWithErrorHandling<T = any>(
    url: string,
    options: RequestInit
): Promise<T> {
    // Fire the request
    console.log(`Fetching ${url} with ${JSON.stringify(options)}`);
    const res = await fetch(url, {
        credentials: "include",
        mode: "cors",
        ...options,
    });

    if (!res.ok) {
        let errMsg = res.statusText;
        try {
            const json = await res.json();
            errMsg = JSON.stringify(json) || errMsg;
        } catch {}
        throw new Error(res.status + " " + errMsg);
    }

    if (res.status === 204 || options.method === "DELETE") {
        // no content
        return null as any;
    }
    return (await res.json()) as T;
}

// Server-side API fetch (uses next/headers)
export async function apiFetch<T = any>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const { cookies: nextCookies } = await import("next/headers");
    const token = (await nextCookies()).get("api_token")?.value;

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    return fetchWithErrorHandling<T>(`${API_URL}${path}`, {
        ...options,
        headers,
    });
}

// Client-side API fetch (uses js-cookie)
export async function apiFetchClient<T = any>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = Cookies.get("api_token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    return fetchWithErrorHandling<T>(`${API_URL}${path}`, {
        ...options,
        headers,
    });
}
