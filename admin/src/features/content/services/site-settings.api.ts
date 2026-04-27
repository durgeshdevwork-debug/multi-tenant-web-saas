import { apiClient, unwrapEnvelope } from "@/lib/api"
import type { ApiEnvelope, SiteSettings } from "../types"

export async function getSiteSettings(): Promise<SiteSettings> {
  const res = await apiClient.get<ApiEnvelope<SiteSettings>>("/content/site-settings")
  return unwrapEnvelope<SiteSettings>(res)
}

export async function updateSiteSettings(
  payload: SiteSettings
): Promise<SiteSettings> {
  const res = await apiClient.put<ApiEnvelope<SiteSettings>>(
    "/content/site-settings",
    payload
  )
  return unwrapEnvelope<SiteSettings>(res)
}
