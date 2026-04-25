import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

import SiteFooter from './components/layout/SiteFooter';
import SiteHeader from './components/layout/SiteHeader';
import { publicApi, publicApiConfig } from './lib/publicApi';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Dynamic CMS Website',
  description: 'A dynamic multi-tenant website rendered from CMS pages.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [site, layout] = await Promise.all([publicApi.site(), publicApi.layout()]);
  const siteSettings = layout?.siteSettings;
  const navigation = layout?.navigation;
  const socialLinks = [
    { label: 'Facebook', href: siteSettings?.social?.facebook },
    { label: 'Instagram', href: siteSettings?.social?.instagram },
    { label: 'LinkedIn', href: siteSettings?.social?.linkedin },
    { label: 'Twitter', href: siteSettings?.social?.twitter },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href));

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col bg-background text-foreground"
        style={{
          fontFamily: siteSettings?.theme?.fontFamily || 'var(--font-sans)',
        }}
      >
        <SiteHeader
          siteName={siteSettings?.siteName ?? site?.name}
          siteLogo={siteSettings?.logo}
          domain={siteSettings?.domain}
          navigation={navigation?.header ?? []}
        />

        {!publicApiConfig.API_KEY ? (
          <div className="mx-auto w-full max-w-4xl px-4 py-6 text-sm text-red-600 sm:px-6">
            Missing `NEXT_PUBLIC_TENANT_API_KEY` in the template environment. Add it to load public content.
          </div>
        ) : null}

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6 lg:py-16">
          {children}
        </main>

        <SiteFooter
          siteName={siteSettings?.siteName ?? site?.name}
          siteDescription={siteSettings?.seo?.defaultDescription}
          business={siteSettings?.business}
          navigation={navigation?.footer ?? []}
          socialLinks={socialLinks}
        />
      </body>
    </html>
  );
}
