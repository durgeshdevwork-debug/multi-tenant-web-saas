import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import './globals.css';
import { publicApi, publicApiConfig } from './lib/publicApi';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Dynamic CMS Website',
  description: 'A dynamic multi-tenant website rendered from CMS pages.'
};

import type { PublicPage } from './lib/publicApi';

const renderNavigation = (items: PublicPage[] = []) =>
  items.map((item) => (
    <div key={item.id} className="group relative">
      <Link href={item.path} className="font-medium text-foreground/80 transition-colors hover:text-foreground">
        {item.navigationLabel || item.title}
      </Link>
      {item.children?.length ? (
        <div className="pointer-events-none absolute left-0 top-full z-20 mt-3 hidden min-w-52 rounded-2xl border border-border bg-background p-3 shadow-xl group-hover:block group-hover:pointer-events-auto">
          <div className="flex flex-col gap-2">
            {item.children.map((child: PublicPage) => (
              <Link key={child.id} href={child.path} className="rounded-xl px-3 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-foreground">
                {child.navigationLabel || child.title}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  ));


export default async function RootLayout({
  children
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
    { label: 'Twitter', href: siteSettings?.social?.twitter }
  ].filter((item) => Boolean(item.href));

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col bg-background text-foreground"
        style={{
          fontFamily: siteSettings?.theme?.fontFamily || 'var(--font-sans)'
        }}
      >
        <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="flex items-center gap-3">
              {siteSettings?.logo?.url ? (
                <div className="relative h-11 w-11 overflow-hidden rounded-full border border-border bg-muted">
                  <Image src={siteSettings.logo.url} alt={siteSettings.logo.alt ?? siteSettings.siteName ?? 'Site logo'} fill className="object-cover" unoptimized />
                </div>
              ) : null}
              <div>
                <div className="text-xl tracking-tight font-semibold">{siteSettings?.siteName ?? site?.name ?? 'omega'}</div>
                {siteSettings?.domain ? <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground hidden">{siteSettings.domain}</div> : null}
              </div>
            </Link>

            <nav className="flex flex-wrap items-center gap-6 text-sm">{renderNavigation(navigation?.header ?? [])}</nav>
          </div>
        </header>

        {!publicApiConfig.API_KEY ? (
          <div className="mx-auto w-full max-w-4xl px-6 py-6 text-sm text-red-600">
            Missing `NEXT_PUBLIC_TENANT_API_KEY` in the template environment. Add it to load public content.
          </div>
        ) : null}

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10 lg:py-16">{children}</main>

        <footer className="bg-primary text-primary-foreground border-t border-primary/20">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.2fr,1fr]">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl tracking-tight font-semibold text-primary-foreground">{siteSettings?.siteName ?? site?.name ?? 'omega'}</h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/70">
                  {siteSettings?.seo?.defaultDescription || 'A bold, modern template built to help agencies launch fast, showcase their services, and convert more clients.'}
                </p>
              </div>

              <div className="grid gap-3 text-sm text-primary-foreground/80">
                {siteSettings?.business?.email ? <div>{siteSettings.business.email}</div> : null}
                {siteSettings?.business?.phone ? <div>{siteSettings.business.phone}</div> : null}
                {siteSettings?.business?.address ? <div>{siteSettings.business.address}</div> : null}
              </div>

              {socialLinks.length > 0 ? (
                <div className="flex flex-wrap gap-6 text-sm font-medium">
                  {socialLinks.map((link) => (
                    <Link key={link.label} href={link.href as string} target="_blank" rel="noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {(navigation?.footer ?? []).map((item) => (
                <div key={item.id} className="space-y-4">
                  <h3 className="text-sm font-semibold text-primary-foreground">{item.navigationLabel || item.title}</h3>
                  <div className="flex flex-col gap-3 text-sm">
                    <Link href={item.path} className="text-primary-foreground/70 transition-colors hover:text-primary-foreground">
                      Visit page
                    </Link>
                    {item.children?.map((child) => (
                      <Link key={child.id} href={child.path} className="text-primary-foreground/70 transition-colors hover:text-primary-foreground">
                        {child.navigationLabel || child.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-6xl px-6 pb-8">
            <div className="text-sm text-primary-foreground/50">
              © {new Date().getFullYear()} {siteSettings?.siteName ?? site?.name ?? 'Omega'}. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
