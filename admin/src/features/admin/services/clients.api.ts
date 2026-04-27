import { apiClient, unwrapEnvelope } from "@/lib/api"
import type { ApiEnvelope, Tenant } from "../../content/types"

export type CreateClientPayload = {
  clientName: string
  slug: string
  primaryDomain?: string
  templateId: string
  businessDetails?: { name?: string; address?: string; phone?: string }
  email: string
  password: string
}

export type CreateClientResponse = {
  client: Tenant
  apiKey?: string
}

export async function getClients(): Promise<Tenant[]> {
  const res = await apiClient.get<ApiEnvelope<Tenant[]>>("/admin/clients")
  return unwrapEnvelope<Tenant[]>(res)
}

export async function getClient(id: string): Promise<Tenant> {
  const res = await apiClient.get<ApiEnvelope<Tenant>>(`/admin/clients/${id}`)
  return unwrapEnvelope<Tenant>(res)
}

export async function createClient(
  payload: CreateClientPayload
): Promise<CreateClientResponse> {
  const res = await apiClient.post<ApiEnvelope<CreateClientResponse>>(
    "/admin/clients",
    payload
  )
  return unwrapEnvelope<CreateClientResponse>(res)
}

export async function updateClient(
  id: string,
  payload: Partial<Tenant>
): Promise<Tenant> {
  const res = await apiClient.patch<ApiEnvelope<Tenant>>(
    `/admin/clients/${id}`,
    payload
  )
  return unwrapEnvelope<Tenant>(res)
}

export async function regenerateApiKey(id: string): Promise<{ apiKey?: string }> {
  const res = await apiClient.post<ApiEnvelope<{ apiKey?: string }>>(
    `/admin/clients/${id}/refresh-key`
  )
  return unwrapEnvelope<{ apiKey?: string }>(res)
}
