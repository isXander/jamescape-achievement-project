"use client";

import useSWR from "swr";
import Cookies from "js-cookie";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:80/api";

export async function backend<T = any>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    // Grab token from cookie (very insecure, non HttpOnly)
    const token = Cookies.get("api_token");

    // Merge headers, force JSON
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(`${API_URL}${path}`, {
        credentials: "include", // will send cookies for future HttpOnly impls
        mode: "cors", // explicitly set CORS mode
        ...options,
        headers,
    });

    if (!res.ok) {
        let errorBody: any;
        try { errorBody = await res.json(); } catch {}
        const message = errorBody?.message || res.statusText;
        throw new Error(message);
    }

    return res.status === 204 ? (undefined as any) : (await res.json() as Promise<T>);
}

export function useBackend<T = any>(path: string) {
    // GET hook
    const { data, error, isLoading, mutate } = useSWR<T>(
        () => `${API_URL}${path}`,
        backend
    );

    // Mutation helpers
    const post = (body: any) =>
        backend<T>(path, { method: "POST", body: JSON.stringify(body) });
    const put = (body: any) =>
        backend<T>(path, { method: "PUT", body: JSON.stringify(body) });
    const patch = (body: any) =>
        backend<T>(path, { method: "PATCH", body: JSON.stringify(body) });
    const del = () =>
        backend<T>(path, { method: "DELETE" });

    return {
        data,
        error,
        isLoading,
        mutate,
        get: () => backend<T>(path),
        post,
        put,
        patch,
        delete: del,
    };
}
