import axios from "axios"
import type { ApiEnvelope } from "@/features/content/types"

export const API_BASE_URL = (() => {
  const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  return rawApiUrl.endsWith("/api")
    ? rawApiUrl
    : `${rawApiUrl.replace(/\/$/, "")}/api`
})()

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data || error)
)

export function unwrapEnvelope<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data as T
  }

  return payload as T
}
