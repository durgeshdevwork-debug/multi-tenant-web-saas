import { useQuery } from "@tanstack/react-query"
import { apiClient, unwrapEnvelope } from "./api"

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
    const res = await apiClient.post("/auth/login", payload)
    return { data: { user: unwrapEnvelope<{ user: SessionUser }>(res).user ?? unwrapEnvelope<SessionUser>(res) } }
  } catch (error: unknown) {
    return {
      error: {
        message:
          error instanceof Error ? error.message : "Login failed",
      },
    }
  }
}

export const signInAdminEmail = async (payload: {
  email: string
  password: string
  rememberMe?: boolean
}) => {
  try {
    const res = await apiClient.post("/auth/admin/login", payload)
    return { data: { user: unwrapEnvelope<{ user: SessionUser }>(res).user ?? unwrapEnvelope<SessionUser>(res) } }
  } catch (error: unknown) {
    return {
      error: {
        message:
          error instanceof Error ? error.message : "Login failed",
      },
    }
  }
}

export const signOut = async () => {
  try {
    await apiClient.post("/auth/logout")
  } catch (error) {
    console.error("Sign out failed", error)
  }
}

export const resetPassword = async (payload: {
  newPassword: string
  token: string
}) => {
  void payload
  return {
    error: {
      message:
        "Password reset is not yet implemented in the new authentication flow.",
    },
  }
}

export function useSession() {
  const query = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/auth/profile")
        const payload = unwrapEnvelope<{ user: SessionUser } | SessionUser>(res)
        return {
          user:
            "user" in payload ? payload.user : (payload as SessionUser),
        }
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
