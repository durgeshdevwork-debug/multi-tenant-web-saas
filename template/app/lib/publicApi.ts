type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
};

const rawPublicUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/public';
const API_BASE_URL = rawPublicUrl.includes('/api/public')
  ? rawPublicUrl
  : `${rawPublicUrl.replace(/\/$/, '')}/api/public`;
const API_KEY = process.env.NEXT_PUBLIC_TENANT_API_KEY || '';

const fetchJson = async <T>(path: string): Promise<T | null> => {
  if (!API_KEY) return null;
  const response = await fetch(`${API_BASE_URL}/${API_KEY}${path}`, { cache: 'no-store' });
  if (!response.ok) return null;
  const payload = (await response.json()) as ApiEnvelope<T>;
  return payload?.data ?? null;
};

export type PublicSectionItem = {
  title?: string;
  description?: string;
  imageUrl?: string;
  label?: string;
  url?: string;
};

export type PublicSection = {
  id: string;
  type: 'hero' | 'richText' | 'features' | 'cta' | 'gallery';
  name?: string;
  content: {
    eyebrow?: string;
    heading?: string;
    body?: string;
    imageUrl?: string;
    buttonLabel?: string;
    buttonUrl?: string;
    items?: PublicSectionItem[];
  };
};

export type PublicPage = {
  id: string;
  title: string;
  slug: string;
  path: string;
  navigationLabel?: string;
  showInHeader: boolean;
  showInFooter: boolean;
  showHeader: boolean;
  showFooter: boolean;
  isHomePage: boolean;
  sections: PublicSection[];
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
  children?: PublicPage[];
};

export const publicApi = {
  site: () =>
    fetchJson<{
      name: string;
      businessDetails?: { name?: string; address?: string; phone?: string; email?: string };
      logo?: { url: string; alt?: string };
      seo?: { defaultTitle?: string; defaultDescription?: string; ogImage?: string };
      theme?: { primaryColor?: string; secondaryColor?: string; fontFamily?: string };
    }>('/site'),
  layout: () =>
    fetchJson<{
      siteSettings: {
        siteName: string;
        domain?: string;
        logo?: { url: string; alt?: string };
        favicon?: string;
        business?: {
          email?: string;
          phone?: string;
          address?: string;
        };
        social?: {
          facebook?: string;
          instagram?: string;
          linkedin?: string;
          twitter?: string;
        };
        seo?: {
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
      navigation: {
        header: PublicPage[];
        footer: PublicPage[];
      };
    }>('/layout'),
  pages: () => fetchJson<PublicPage[]>('/pages'),
  pageByPath: (path: string) => fetchJson<PublicPage>(`/page?path=${encodeURIComponent(path)}`)
};

export const publicApiConfig = { API_BASE_URL, API_KEY };
