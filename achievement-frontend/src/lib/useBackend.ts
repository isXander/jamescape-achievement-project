// lib/useBackend.ts
import Cookies from "js-cookie";

export const API_URL =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:80/api";

// Helper function for common fetch logic
async function fetchWithErrorHandling<T = any>(
    url: string,
    options: RequestInit
): Promise<T> {
    // Fire the request
    const res = await fetch(url, {
        credentials: "include",
        ...options,
    });

    // Error handling
    if (!res.ok) {
        let errMsg = res.statusText;
        try {
            const json = await res.json();
            errMsg = json?.message || errMsg;
        } catch {}
        throw new Error(errMsg);
    }

    // Parse
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
    // This import is dynamically loaded only on the server
    const { cookies: nextCookies } = await import("next/headers");

    // Get token from server cookies
    const token = nextCookies().get("api_token")?.value;

    // Build headers
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
    // Get token from client cookies
    const token = Cookies.get("api_token");

    // Build headers
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
