'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import type { PublicPage } from '@/app/lib/publicApi';

type SiteHeaderProps = {
  siteName?: string;
  siteLogo?: { url: string; alt?: string };
  domain?: string;
  navigation: PublicPage[];
};

const MENU_ANIMATION_MS = 220;

const renderDesktopNavigation = (items: PublicPage[] = []) =>
  items.map((item) => (
    <div key={item.id} className="group relative">
      <Link
        href={item.path}
        className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-foreground/75 transition-all duration-200 hover:bg-foreground/5 hover:text-foreground"
      >
        {item.navigationLabel || item.title}
        {item.children?.length ? (
          <svg
            className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
          </svg>
        ) : null}
      </Link>

      {item.children?.length ? (
        <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-3 hidden w-64 -translate-x-1/2 rounded-3xl border border-border bg-background/95 p-3 shadow-2xl backdrop-blur group-hover:block group-hover:pointer-events-auto">
          <div className="flex flex-col gap-1">
            {item.children.map((child) => (
              <Link
                key={child.id}
                href={child.path}
                className="rounded-2xl px-4 py-3 text-sm text-foreground/75 transition-colors hover:bg-muted hover:text-foreground"
              >
                {child.navigationLabel || child.title}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  ));

const flattenNavigation = (items: PublicPage[] = []) =>
  items.flatMap((item) => [
    { id: item.id, label: item.navigationLabel || item.title, href: item.path, depth: 0 },
    ...(item.children ?? []).map((child) => ({
      id: child.id,
      label: child.navigationLabel || child.title,
      href: child.path,
      depth: 1,
    })),
  ]);

export default function SiteHeader({ siteName, siteLogo, domain, navigation }: SiteHeaderProps) {
  const displayName = siteName || 'omega';
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [menuState, setMenuState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (menuState === 'opening' && !dialog.open) {
      dialog.showModal();
      const frame = window.requestAnimationFrame(() => {
        setMenuState('open');
      });
      return () => window.cancelAnimationFrame(frame);
    }

    if (menuState === 'closing') {
      const timeout = window.setTimeout(() => {
        if (dialog.open) dialog.close();
        setMenuState('closed');
      }, MENU_ANIMATION_MS);
      return () => window.clearTimeout(timeout);
    }

    return undefined;
  }, [menuState]);

  const openMenu = () => {
    if (menuState !== 'closed') return;
    setMenuState('opening');
  };

  const closeMenu = () => {
    if (menuState === 'closed' || menuState === 'closing') return;
    setMenuState('closing');
  };

  const mobileLinks = flattenNavigation(navigation);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-4 sm:py-5">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-muted to-background shadow-sm transition-transform duration-200 group-hover:scale-[1.02]">
              {siteLogo?.url ? (
                <Image src={siteLogo.url} alt={siteLogo.alt ?? displayName} fill className="object-cover" unoptimized />
              ) : (
                <span className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/70">
                  {displayName.slice(0, 2)}
                </span>
              )}
            </div>

            <div className="leading-tight">
              <div className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                {displayName}
              </div>
              {domain ? (
                <div className="mt-1 hidden text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground sm:block">
                  {domain}
                </div>
              ) : null}
            </div>
          </Link>

          <div className="hidden items-center gap-2 md:flex" aria-label="Primary navigation">
            <nav className="flex items-center gap-1">{renderDesktopNavigation(navigation)}</nav>
          </div>

          <button
            type="button"
            onClick={openMenu}
            className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md md:hidden"
            aria-haspopup="dialog"
            aria-expanded={menuState !== 'closed'}
            aria-controls="mobile-navigation-dialog"
          >
            <span className="sr-only">Open navigation menu</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {menuState !== 'closed' ? (
        <dialog
          id="mobile-navigation-dialog"
          ref={dialogRef}
          className="mobile-menu-dialog fixed inset-0 z-[60] m-0 h-full w-full max-w-none overflow-hidden border-0 bg-transparent p-0"
          onCancel={(event) => {
            event.preventDefault();
            closeMenu();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeMenu();
            }
          }}
        >
          <div className="relative flex h-full w-full items-start justify-end bg-black/40 px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-4">
            <div
              className={[
                'flex h-[calc(100vh-1.5rem)] w-full max-w-md flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#071d0f] text-white shadow-[0_35px_120px_-40px_rgba(0,0,0,0.85)]',
                menuState === 'closing'
                  ? 'animate-[mobileMenuOut_220ms_cubic-bezier(0.4,0,1,1)_forwards]'
                  : 'animate-[mobileMenuIn_220ms_cubic-bezier(0.2,0.8,0.2,1)_both]',
              ].join(' ')}
            >
              <div
                className={[
                  'flex items-center justify-between border-b border-white/10 px-5 py-5',
                  menuState === 'closing'
                    ? 'animate-[mobileBackdropOut_220ms_ease-in_forwards]'
                    : 'animate-[mobileBackdropIn_220ms_ease-out_both]',
                ].join(' ')}
              >
                <div>
                  <div className="text-lg font-semibold tracking-tight">{displayName}</div>
                  {domain ? (
                    <div className="mt-1 text-[0.7rem] uppercase tracking-[0.22em] text-white/50">
                      {domain}
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={closeMenu}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
                  aria-label="Close navigation menu"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6">
                <div className="space-y-6">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-white/45">
                      Navigation
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/70">
                      Explore the full site from this menu. Tap any item to navigate.
                    </p>
                  </div>

                  <nav className="space-y-2" aria-label="Mobile navigation">
                    {mobileLinks.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={closeMenu}
                        className={[
                          'flex items-center justify-between rounded-[1.25rem] border border-white/10 px-4 py-4 text-base font-medium transition-all duration-200',
                          item.depth === 1
                            ? 'ml-4 bg-white/5 text-white/70'
                            : 'bg-white/[0.03] text-white hover:-translate-y-0.5 hover:bg-white/10',
                        ].join(' ')}
                      >
                        <span>{item.label}</span>
                        <svg className="h-4 w-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 18 6-6-6-6" />
                        </svg>
                      </Link>
                    ))}
                  </nav>

                  <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-white/75 sm:grid-cols-2">
                    {siteLogo?.url ? (
                      <div className="flex items-center gap-3 sm:col-span-2">
                        <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                          <Image src={siteLogo.url} alt={siteLogo.alt ?? displayName} fill className="object-cover" unoptimized />
                        </div>
                        <div>
                          <div className="font-medium text-white">{displayName}</div>
                          <div className="text-xs uppercase tracking-[0.2em] text-white/40">
                            {siteDescriptionHint(displayName)}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </dialog>
      ) : null}
    </header>
  );
}

function siteDescriptionHint(displayName: string) {
  return `${displayName} navigation`;
}
