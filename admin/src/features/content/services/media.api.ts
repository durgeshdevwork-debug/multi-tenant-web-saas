import { apiClient, unwrapEnvelope } from "@/lib/api"
import type { ApiEnvelope, MediaAsset } from "../types"

export async function listMediaAssets(): Promise<MediaAsset[]> {
  const res = await apiClient.get<ApiEnvelope<MediaAsset[]>>("/content/media")
  return unwrapEnvelope<MediaAsset[]>(res)
}

export async function uploadMediaAsset(payload: {
  file: File
  altText?: string
}): Promise<MediaAsset> {
  const formData = new FormData()
  formData.append("file", payload.file)
  if (payload.altText) {
    formData.append("altText", payload.altText)
  }

  const res = await apiClient.post<ApiEnvelope<MediaAsset>>(
    "/content/media",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )

  return unwrapEnvelope<MediaAsset>(res)
}

export async function deleteMediaAsset(
  id: string
): Promise<{ message: string }> {
  const res = await apiClient.delete<ApiEnvelope<{ message: string }>>(
    `/content/media/${id}`
  )
  return unwrapEnvelope<{ message: string }>(res)
}
