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

export type PublicNavigationItem = {
  label: string;
  pageKey?: 'landing' | 'about' | 'services' | 'blog' | 'contact';
  url?: string;
  href: string;
  newTab?: boolean;
  children?: PublicNavigationItem[];
};

export const publicApi = {
  site: () => fetchJson<{ name: string; businessDetails?: { name?: string; address?: string; phone?: string } }>('/site'),
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
        header: PublicNavigationItem[];
        footer: { title: string; links: PublicNavigationItem[] }[];
        copyright?: string;
      };
    }>('/layout'),
  landing: () =>
    fetchJson<{
      heroTitle: string;
      heroSubtitle?: string;
      heroImageUrl?: string;
      primaryCtaText?: string;
      primaryCtaUrl?: string;
      highlights?: { title: string; description: string }[];
    }>('/landing'),
  about: () =>
    fetchJson<{
      heading: string;
      description: string;
      showTeam?: boolean;
      teamMembers?: { name: string; role?: string; imageUrl?: string }[];
    }>('/about'),
  services: () =>
    fetchJson<
      {
        title: string;
        description?: string;
        imageUrl?: string;
        priceLabel?: string;
      }[]
    >('/services'),
  blog: () =>
    fetchJson<
      {
        title: string;
        slug: string;
        excerpt?: string;
        coverImageUrl?: string;
        publishedAt?: string;
      }[]
    >('/blog'),
  blogPost: (slug: string) =>
    fetchJson<{
      title: string;
      slug: string;
      excerpt?: string;
      body?: string;
      coverImageUrl?: string;
      publishedAt?: string;
    }>(`/blog/${slug}`),
  contact: () =>
    fetchJson<{
      address?: string;
      phone?: string;
      email?: string;
      introText?: string;
    }>('/contact')
};

export const publicApiConfig = { API_BASE_URL, API_KEY };
