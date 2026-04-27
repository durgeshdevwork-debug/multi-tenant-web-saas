import { apiClient, unwrapEnvelope } from "@/lib/api"
import type { ApiEnvelope, Template } from "../../content/types"

export async function getTemplates(): Promise<Template[]> {
  const res = await apiClient.get<ApiEnvelope<Template[]>>("/admin/templates")
  return unwrapEnvelope<Template[]>(res)
}

export async function createTemplate(payload: {
  name: string
  identifier: string
  modules: string[]
}): Promise<Template> {
  const res = await apiClient.post<ApiEnvelope<Template>>("/admin/templates", payload)
  return unwrapEnvelope<Template>(res)
}
