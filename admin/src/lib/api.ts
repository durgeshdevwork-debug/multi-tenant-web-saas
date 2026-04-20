import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for cross-origin cookies if backend and frontend are on different ports
});

// Optional: Add response interceptors to handle global errors like 401
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error.response?.data || error);
  }
);

export type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  statusCode?: number;
  data?: T;
};

const unwrap = <T>(payload: ApiEnvelope<T> | T): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiEnvelope<T>).data as T;
  }
  return payload as T;
};

export type Template = {
  _id: string;
  name: string;
  identifier: string;
  modules: string[];
};

export type Tenant = {
  _id: string;
  name: string;
  slug: string;
  primaryDomain?: string;
  templateId?: Template | string;
  truncatedApiKey?: string;
  status: 'active' | 'inactive' | 'pending';
  businessDetails?: {
    name?: string;
    address?: string;
    phone?: string;
  };
};

export type LandingContent = {
  _id?: string;
  heroTitle: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  primaryCtaText?: string;
  primaryCtaUrl?: string;
  highlights: { title: string; description: string }[];
};

export type AboutContent = {
  _id?: string;
  heading: string;
  description: string;
  showTeam?: boolean;
  teamMembers?: { name: string; role?: string; imageUrl?: string }[];
};

export type ContactContent = {
  _id?: string;
  address?: string;
  phone?: string;
  email?: string;
  introText?: string;
};

export type PageKey = 'landing' | 'about' | 'services' | 'blog' | 'contact';

export type SiteSettings = {
  _id?: string;
  siteName: string;
  domain?: string;
  logo?: {
    url: string;
    alt?: string;
  };
  favicon?: string;
  business: {
    email?: string;
    phone?: string;
    address?: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  seo: {
    defaultTitle?: string;
    defaultDescription?: string;
    ogImage?: string;
  };
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
  };
};

export type NavigationItem = {
  label: string;
  pageKey?: PageKey;
  url?: string;
  newTab?: boolean;
  children?: NavigationItem[];
  href?: string;
};

export type FooterSection = {
  title: string;
  links: NavigationItem[];
};

export type NavigationConfig = {
  header: NavigationItem[];
  footer: FooterSection[];
  copyright?: string;
};

export type ServiceItem = {
  _id?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  priceLabel?: string;
  isActive?: boolean;
};

export type BlogPost = {
  _id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  body?: string;
  coverImageUrl?: string;
  publishedAt?: string;
  isPublished?: boolean;
};

export type MediaAsset = {
  _id: string;
  url: string;
  key: string;
  originalName: string;
  mimeType: string;
  size: number;
  altText?: string;
  createdAt: string;
  updatedAt: string;
};

// ----------------------
// Admin APIs
// ----------------------

export async function getTemplates() {
  const res = await apiClient.get<ApiEnvelope<Template[]>>('/admin/templates');
  return unwrap(res);
}

export async function createTemplate(payload: { name: string; identifier: string; modules: string[] }) {
  const res = await apiClient.post<ApiEnvelope<Template>>('/admin/templates', payload);
  return unwrap(res);
}

export async function getClients() {
  const res = await apiClient.get<ApiEnvelope<Tenant[]>>('/admin/clients');
  return unwrap(res);
}

export async function getClient(id: string) {
  const res = await apiClient.get<ApiEnvelope<Tenant>>(`/admin/clients/${id}`);
  return unwrap(res);
}

export async function createClient(payload: {
  clientName: string;
  slug: string;
  primaryDomain?: string;
  templateId: string;
  businessDetails?: { name?: string; address?: string; phone?: string };
  email: string;
  password: string;
}) {
  return await apiClient.post('/admin/clients', payload);
}

export async function updateClient(id: string, payload: Partial<Tenant>) {
  const res = await apiClient.patch<ApiEnvelope<Tenant>>(`/admin/clients/${id}`, payload);
  return unwrap(res);
}

export async function regenerateApiKey(id: string) {
  return await apiClient.post(`/admin/clients/${id}/refresh-key`);
}

// ----------------------
// Content APIs (Tenant/User)
// ----------------------

export async function getLanding() {
  const res = await apiClient.get<ApiEnvelope<LandingContent>>('/content/landing');
  return unwrap(res);
}

export async function updateLanding(payload: LandingContent) {
  const res = await apiClient.put<ApiEnvelope<LandingContent>>('/content/landing', payload);
  return unwrap(res);
}

export async function getAbout() {
  const res = await apiClient.get<ApiEnvelope<AboutContent>>('/content/about');
  return unwrap(res);
}

export async function updateAbout(payload: AboutContent) {
  const res = await apiClient.put<ApiEnvelope<AboutContent>>('/content/about', payload);
  return unwrap(res);
}

export async function getContact() {
  const res = await apiClient.get<ApiEnvelope<ContactContent>>('/content/contact');
  return unwrap(res);
}

export async function updateContact(payload: ContactContent) {
  const res = await apiClient.put<ApiEnvelope<ContactContent>>('/content/contact', payload);
  return unwrap(res);
}

export async function getSiteSettings() {
  const res = await apiClient.get<ApiEnvelope<SiteSettings>>('/content/site-settings');
  return unwrap(res);
}

export async function updateSiteSettings(payload: SiteSettings) {
  const res = await apiClient.put<ApiEnvelope<SiteSettings>>('/content/site-settings', payload);
  return unwrap(res);
}

export async function getNavigation() {
  const res = await apiClient.get<ApiEnvelope<NavigationConfig>>('/content/navigation');
  return unwrap(res);
}

export async function updateNavigation(payload: NavigationConfig) {
  const res = await apiClient.put<ApiEnvelope<NavigationConfig>>('/content/navigation', payload);
  return unwrap(res);
}

export async function listServices() {
  const res = await apiClient.get<ApiEnvelope<ServiceItem[]>>('/content/services');
  return unwrap(res);
}

export async function createService(payload: ServiceItem) {
  const res = await apiClient.post('/content/services', payload);
  return unwrap(res);
}

export async function updateService(id: string, payload: ServiceItem) {
  const res = await apiClient.put(`/content/services/${id}`, payload);
  return unwrap(res);
}

export async function deleteService(id: string) {
  const res = await apiClient.delete(`/content/services/${id}`);
  return unwrap(res);
}

export async function listBlogPosts() {
  const res = await apiClient.get<ApiEnvelope<BlogPost[]>>('/content/blog');
  return unwrap(res);
}

export async function createBlogPost(payload: BlogPost) {
  const res = await apiClient.post('/content/blog', payload);
  return unwrap(res);
}

export async function updateBlogPost(id: string, payload: BlogPost) {
  const res = await apiClient.put(`/content/blog/${id}`, payload);
  return unwrap(res);
}

export async function deleteBlogPost(id: string) {
  const res = await apiClient.delete(`/content/blog/${id}`);
  return unwrap(res);
}

export async function listMediaAssets(): Promise<MediaAsset[]> {
  const res = await apiClient.get<ApiEnvelope<MediaAsset[]>>('/content/media');
  return unwrap(res) as MediaAsset[];
}

export async function uploadMediaAsset(payload: { file: File; altText?: string }): Promise<MediaAsset> {
  const formData = new FormData();
  formData.append('file', payload.file);
  if (payload.altText) {
    formData.append('altText', payload.altText);
  }

  const res = await apiClient.post<ApiEnvelope<MediaAsset>>('/content/media', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return unwrap(res) as MediaAsset;
}

export async function deleteMediaAsset(id: string): Promise<{ message: string }> {
  const res = await apiClient.delete<ApiEnvelope<{ message: string }>>(`/content/media/${id}`);
  return unwrap(res) as { message: string };
}
