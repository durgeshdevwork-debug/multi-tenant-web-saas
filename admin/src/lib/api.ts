import axios from "axios"

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
export const API_BASE_URL = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/$/, "")}/api`

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data || error)
)

export type ApiEnvelope<T> = {
  success?: boolean
  message?: string
  statusCode?: number
  data?: T
}

const unwrap = <T>(payload: ApiEnvelope<T> | T): T => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data as T
  }
  return payload as T
}

export type Template = {
  _id: string
  name: string
  identifier: string
  modules: string[]
}

export type Tenant = {
  _id: string
  name: string
  slug: string
  primaryDomain?: string
  templateId?: Template | string
  truncatedApiKey?: string
  status: "active" | "inactive" | "pending"
  businessDetails?: {
    name?: string
    address?: string
    phone?: string
  }
}

export type SiteSettings = {
  _id?: string
  siteName: string
  domain?: string
  logo?: {
    url: string
    alt?: string
  }
  favicon?: string
  business: {
    email?: string
    phone?: string
    address?: string
  }
  social: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
  }
  seo: {
    defaultTitle?: string
    defaultDescription?: string
    ogImage?: string
  }
  theme?: {
    primaryColor?: string
    secondaryColor?: string
    fontFamily?: string
  }
}

export type PageSectionType =
  | "hero"
  | "richText"
  | "features"
  | "cta"
  | "gallery"
  | "collection"

export type PageSectionItem = {
  title?: string
  description?: string
  imageUrl?: string
  label?: string
  url?: string
}

export type PageSection = {
  id: string
  type: PageSectionType
  name?: string
  content: {
    eyebrow?: string
    heading?: string
    body?: string
    imageUrl?: string
    buttonLabel?: string
    buttonUrl?: string
    items?: PageSectionItem[]
    collectionId?: string
    selectedPageIds?: string[]
  }
  styles?: Record<string, string>
}

export type Page = {
  _id?: string
  id?: string
  tenantId?: string
  parentId?: string | null
  title: string
  slug: string
  path?: string
  navigationLabel?: string
  showInHeader: boolean
  showInFooter: boolean
  showHeader: boolean
  showFooter: boolean
  isHomePage: boolean
  isPublished: boolean
  sortOrder: number
  sections: PageSection[]
  seo: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: string
  }
  children?: Page[]
}

export type MediaAsset = {
  _id: string
  url: string
  key: string
  originalName: string
  mimeType: string
  size: number
  altText?: string
  createdAt: string
  updatedAt: string
}

export async function getTemplates() {
  const res = await apiClient.get<ApiEnvelope<Template[]>>("/admin/templates")
  return unwrap(res)
}

export async function createTemplate(payload: {
  name: string
  identifier: string
  modules: string[]
}) {
  const res = await apiClient.post<ApiEnvelope<Template>>(
    "/admin/templates",
    payload
  )
  return unwrap(res)
}

export async function getClients() {
  const res = await apiClient.get<ApiEnvelope<Tenant[]>>("/admin/clients")
  return unwrap(res)
}

export async function getClient(id: string) {
  const res = await apiClient.get<ApiEnvelope<Tenant>>(`/admin/clients/${id}`)
  return unwrap(res)
}

export async function createClient(payload: {
  clientName: string
  slug: string
  primaryDomain?: string
  templateId: string
  businessDetails?: { name?: string; address?: string; phone?: string }
  email: string
  password: string
}) {
  return await apiClient.post("/admin/clients", payload)
}

export async function updateClient(id: string, payload: Partial<Tenant>) {
  const res = await apiClient.patch<ApiEnvelope<Tenant>>(
    `/admin/clients/${id}`,
    payload
  )
  return unwrap(res)
}

export async function regenerateApiKey(id: string) {
  return await apiClient.post(`/admin/clients/${id}/refresh-key`)
}

export async function getSiteSettings() {
  const res = await apiClient.get<ApiEnvelope<SiteSettings>>(
    "/content/site-settings"
  )
  return unwrap(res)
}

export async function updateSiteSettings(payload: SiteSettings) {
  const res = await apiClient.put<ApiEnvelope<SiteSettings>>(
    "/content/site-settings",
    payload
  )
  return unwrap(res)
}

export async function listPages(): Promise<Page[]> {
  const res = (await apiClient.get<ApiEnvelope<Page[]>>("/content/pages")) as any
  return unwrap<Page[]>(res)
}

export async function listPageTree(): Promise<Page[]> {
  const res = (await apiClient.get<ApiEnvelope<Page[]>>(
    "/content/pages/tree"
  )) as any
  return unwrap<Page[]>(res)
}

export async function getPage(id: string): Promise<Page> {
  const res = (await apiClient.get<ApiEnvelope<Page>>(
    `/content/pages/${id}`
  )) as any
  return unwrap<Page>(res)
}

export async function createPage(payload: Page): Promise<Page> {
  const res = (await apiClient.post<ApiEnvelope<Page>>(
    "/content/pages",
    payload
  )) as any
  return unwrap<Page>(res)
}

export async function updatePage(id: string, payload: Page): Promise<Page> {
  const res = (await apiClient.put<ApiEnvelope<Page>>(
    `/content/pages/${id}`,
    payload
  )) as any
  return unwrap<Page>(res)
}

export async function deletePage(id: string) {
  const res = await apiClient.delete<ApiEnvelope<{ deletedIds: string[] }>>(
    `/content/pages/${id}`
  )
  return unwrap(res)
}

export async function listMediaAssets(): Promise<MediaAsset[]> {
  const res = await apiClient.get<ApiEnvelope<MediaAsset[]>>("/content/media")
  return unwrap(res) as MediaAsset[]
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

  return unwrap(res) as MediaAsset
}

export async function deleteMediaAsset(
  id: string
): Promise<{ message: string }> {
  const res = await apiClient.delete<ApiEnvelope<{ message: string }>>(
    `/content/media/${id}`
  )
  return unwrap(res) as { message: string }
}
