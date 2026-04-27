import { apiClient, unwrapEnvelope } from "@/lib/api"
import type { Page, ApiEnvelope } from "../types"

export async function listPages(): Promise<Page[]> {
  const res = await apiClient.get<ApiEnvelope<Page[]>>("/content/pages")
  return unwrapEnvelope<Page[]>(res)
}

export async function listPageTree(): Promise<Page[]> {
  const res = await apiClient.get<ApiEnvelope<Page[]>>("/content/pages/tree")
  return unwrapEnvelope<Page[]>(res)
}

export async function getPage(id: string): Promise<Page> {
  const res = await apiClient.get<ApiEnvelope<Page>>(`/content/pages/${id}`)
  return unwrapEnvelope<Page>(res)
}

export async function createPage(payload: Page): Promise<Page> {
  const res = await apiClient.post<ApiEnvelope<Page>>("/content/pages", payload)
  return unwrapEnvelope<Page>(res)
}

export async function updatePage(id: string, payload: Page): Promise<Page> {
  const res = await apiClient.put<ApiEnvelope<Page>>(`/content/pages/${id}`, payload)
  return unwrapEnvelope<Page>(res)
}

export async function deletePage(id: string): Promise<{ deletedIds: string[] }> {
  const res = await apiClient.delete<ApiEnvelope<{ deletedIds: string[] }>>(
    `/content/pages/${id}`
  )
  return unwrapEnvelope<{ deletedIds: string[] }>(res)
}
