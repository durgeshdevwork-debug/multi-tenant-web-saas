import type { NavigationPageKey } from './models/Navigation';

export const PAGE_DEFINITIONS: Record<
  NavigationPageKey,
  { label: string; href: string }
> = {
  landing: { label: 'Home', href: '/' },
  about: { label: 'About', href: '/about' },
  services: { label: 'Services', href: '/services' },
  blog: { label: 'Blog', href: '/blog' },
  contact: { label: 'Contact', href: '/contact' }
};

export const DEFAULT_PAGE_ORDER: NavigationPageKey[] = ['landing', 'about', 'services', 'blog', 'contact'];
