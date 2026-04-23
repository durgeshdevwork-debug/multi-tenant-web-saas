import { useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "./api"

export type SessionUser = {
  id: string
  email: string
  role: "admin" | "user"
  name?: string
}

export const signInEmail = async (payload: {
  email: string
  password: string
  rememberMe?: boolean
}) => {
  try {
    const res: any = await apiClient.post("/auth/login", payload)
    return { data: { user: res.data?.user || res.data } }
  } catch (error: any) {
    return { error: { message: error.message || "Login failed" } }
  }
}

export const signInAdminEmail = async (payload: {
  email: string
  password: string
  rememberMe?: boolean
}) => {
  try {
    const res: any = await apiClient.post("/auth/admin/login", payload)
    return { data: { user: res.data?.user || res.data } }
  } catch (error: any) {
    return { error: { message: error.message || "Login failed" } }
  }
}

export const signOut = async () => {
  try {
    await apiClient.post("/auth/logout")
  } catch (error) {
    console.error("Sign out failed", error)
  }
}

export const resetPassword = async (payload: any) => {
  return { error: { message: "Password reset is not yet implemented in the new authenticaton flow." } };
}

export function useSession() {
  const query = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const res: any = await apiClient.get("/auth/profile")
        return { user: res.data?.user || res.data }
      } catch (error) {
        return null
      }
    },
    retry: false,
  })

  return {
    data: query.data,
    isPending: query.isLoading,
    error: query.error,
  }
}
