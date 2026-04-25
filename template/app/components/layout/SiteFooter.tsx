import Link from 'next/link';
import type { ReactNode } from 'react';

import type { PublicPage } from '@/app/lib/publicApi';

type SocialLink = {
  label: string;
  href: string;
};

type SiteFooterProps = {
  siteName?: string;
  siteDescription?: string;
  business?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  navigation: PublicPage[];
  socialLinks: SocialLink[];
};

const getFooterGroups = (navigation: PublicPage[]) => {
  const pages = navigation.slice(0, 3);
  const pageLinks = pages.flatMap((item) => [
    {
      href: item.path,
      label: item.navigationLabel || item.title,
    },
    ...(item.children ?? []).map((child) => ({
      href: child.path,
      label: child.navigationLabel || child.title,
    })),
  ]);

  return { pages, pageLinks };
};

export default function SiteFooter({
  siteName,
  siteDescription,
  business,
  navigation,
  socialLinks,
}: SiteFooterProps) {
  const displayName = siteName || 'Omega';
  const { pages, pageLinks } = getFooterGroups(navigation);
  const legalLinks = [
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ];

  return (
    <footer className="bg-[#03290f] text-white border-t border-white/10">
  <div className="mx-auto max-w-6xl px-6 py-16">

    {/* 4 Column Grid */}
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

      {/* Column 1 — Business */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">
          {siteName || "Omega"}
        </h2>

        <p className="text-sm text-white/70 leading-relaxed">
          {siteDescription ||
            "We help businesses grow with modern digital solutions and marketing strategies."}
        </p>

        <div className="text-sm text-white/70 space-y-1">
          {business?.email && <p>{business.email}</p>}
          {business?.phone && <p>{business.phone}</p>}
          {business?.address && <p>{business.address}</p>}
        </div>
      </div>

      {/* Column 2 — Pages */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Pages</h3>
        <div className="flex flex-col gap-2 text-sm text-white/70">
          {navigation?.slice(0, 5).map((item) => (
            <Link key={item.id} href={item.path} className="hover:text-white">
              {item.navigationLabel || item.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Column 3 — Company */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Company</h3>
        <div className="flex flex-col gap-2 text-sm text-white/70">
          <Link href="/about" className="hover:text-white">About Us</Link>
          <Link href="/services" className="hover:text-white">Services</Link>
          <Link href="/blogs" className="hover:text-white">Blog</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </div>
      </div>

      {/* Column 4 — Social / Legal */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Follow Us</h3>

        <div className="flex flex-col gap-2 text-sm text-white/70">
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2 text-sm text-white/70">
          <Link href="/privacy" className="hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white">
            Terms of Service
          </Link>
        </div>
      </div>

    </div>
  </div>

  {/* Bottom Bar */}
  <div className="border-t border-white/10">
    <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-white/50 flex flex-col md:flex-row justify-between gap-2">
      <p>
        © {new Date().getFullYear()} {siteName || "Omega"}. All rights reserved.
      </p>
    </div>
  </div>
</footer>
  );
}

function FooterColumn({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.55)]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/80">{title}</h3>
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.7rem] font-medium text-white/50">
          {String(count).padStart(2, '0')}
        </span>
      </div>

      <div className="mt-4 space-y-2">{children}</div>
    </div>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm text-white/72 transition-all duration-200 hover:bg-white/10 hover:text-white"
    >
      <span>{label}</span>
      <svg className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 18 6-6-6-6" />
      </svg>
    </Link>
  );
}

function FooterEmptyState({ label }: { label: string }) {
  return <div className="rounded-2xl border border-dashed border-white/10 px-3 py-3 text-sm text-white/45">{label}</div>;
}
