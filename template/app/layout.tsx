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

const renderNavigation = (items: Awaited<ReturnType<typeof publicApi.layout>>['navigation']['header'] = []) =>
  items.map((item) => (
    <div key={item.id} className="group relative">
      <Link href={item.path} className="font-medium text-zinc-700 transition-colors hover:text-zinc-950">
        {item.navigationLabel || item.title}
      </Link>
      {item.children?.length ? (
        <div className="pointer-events-none absolute left-0 top-full z-20 mt-3 hidden min-w-52 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl group-hover:block group-hover:pointer-events-auto">
          <div className="flex flex-col gap-2">
            {item.children.map((child) => (
              <Link key={child.id} href={child.path} className="rounded-xl px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950">
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
        className="min-h-full flex flex-col bg-white text-zinc-900"
        style={{
          fontFamily: siteSettings?.theme?.fontFamily || 'var(--font-geist-sans)'
        }}
      >
        <header className="border-b border-zinc-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="flex items-center gap-3">
              {siteSettings?.logo?.url ? (
                <div className="relative h-11 w-11 overflow-hidden rounded-full border border-zinc-200 bg-zinc-50">
                  <Image src={siteSettings.logo.url} alt={siteSettings.logo.alt ?? siteSettings.siteName ?? 'Site logo'} fill className="object-cover" unoptimized />
                </div>
              ) : null}
              <div>
                <div className="text-lg font-semibold">{siteSettings?.siteName ?? site?.name ?? 'Client Website'}</div>
                {siteSettings?.domain ? <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">{siteSettings.domain}</div> : null}
              </div>
            </Link>

            <nav className="flex flex-wrap items-center gap-5 text-sm">{renderNavigation(navigation?.header ?? [])}</nav>
          </div>
        </header>

        {!publicApiConfig.API_KEY ? (
          <div className="mx-auto w-full max-w-4xl px-6 py-6 text-sm text-red-600">
            Missing `NEXT_PUBLIC_TENANT_API_KEY` in the template environment. Add it to load public content.
          </div>
        ) : null}

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10">{children}</main>

        <footer className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 md:grid-cols-[1.2fr,1fr]">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">{siteSettings?.siteName ?? site?.name ?? 'Client Website'}</h2>
                {siteSettings?.seo?.defaultDescription ? <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">{siteSettings.seo.defaultDescription}</p> : null}
              </div>

              <div className="grid gap-2 text-sm text-zinc-600">
                {siteSettings?.business?.email ? <div>{siteSettings.business.email}</div> : null}
                {siteSettings?.business?.phone ? <div>{siteSettings.business.phone}</div> : null}
                {siteSettings?.business?.address ? <div>{siteSettings.business.address}</div> : null}
              </div>

              {socialLinks.length > 0 ? (
                <div className="flex flex-wrap gap-4 text-sm font-medium">
                  {socialLinks.map((link) => (
                    <Link key={link.label} href={link.href as string} target="_blank" rel="noreferrer" className="text-zinc-700 hover:text-zinc-950">
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {(navigation?.footer ?? []).map((item) => (
                <div key={item.id} className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">{item.navigationLabel || item.title}</h3>
                  <div className="flex flex-col gap-2 text-sm">
                    <Link href={item.path} className="text-zinc-700 transition-colors hover:text-zinc-950">
                      Visit page
                    </Link>
                    {item.children?.map((child) => (
                      <Link key={child.id} href={child.path} className="text-zinc-600 transition-colors hover:text-zinc-950">
                        {child.navigationLabel || child.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-200 px-6 py-4 text-center text-xs text-zinc-500">
            {(siteSettings?.siteName ?? site?.name ?? 'Client Website')} dynamic CMS experience
          </div>
        </footer>
      </body>
    </html>
  );
}
