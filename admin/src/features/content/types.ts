export type ApiEnvelope<T> = {
  success?: boolean
  message?: string
  statusCode?: number
  data?: T
}

export type Template = {
  _id: string
  name: string
  identifier: string
  modules: string[]
}

export type TenantStatus = "active" | "inactive" | "pending"

export type Tenant = {
  _id: string
  name: string
  slug: string
  primaryDomain?: string
  templateId?: Template | string
  truncatedApiKey?: string
  status: TenantStatus
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
  | "stats"
  | "faq"
  | "testimonials"
  | "split"

export type PageSectionItem = {
  title?: string
  description?: string
  imageUrl?: string
  label?: string
  url?: string
  value?: string
  icon?: string
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

