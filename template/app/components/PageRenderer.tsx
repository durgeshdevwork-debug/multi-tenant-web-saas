'use client';

import dynamic from 'next/dynamic';
import type { PublicSection } from '../lib/publicApi';

// Lazy load section components for better performance
const HeroSection = dynamic(() => import('./sections/HeroSection'), { 
  loading: () => <div className="h-[400px] animate-pulse rounded-[2rem] bg-zinc-50" />
});
const RichTextSection = dynamic(() => import('./sections/RichTextSection'));
const CtaSection = dynamic(() => import('./sections/CtaSection'));
const GallerySection = dynamic(() => import('./sections/GallerySection'), {
  loading: () => (
    <div className="space-y-6 rounded-[2rem] border border-border bg-muted/30 p-6">
      <div className="space-y-3">
        <div className="h-4 w-24 animate-pulse rounded-full bg-zinc-200" />
        <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-zinc-200" />
        <div className="h-5 w-full max-w-2xl animate-pulse rounded-full bg-zinc-200" />
      </div>
      <div className="aspect-[16/7] animate-pulse rounded-[1.75rem] bg-zinc-200" />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4 rounded-[1.5rem] border border-border bg-background p-4">
            <div className="aspect-[4/3] animate-pulse rounded-2xl bg-zinc-200" />
            <div className="space-y-2">
              <div className="h-5 w-2/3 animate-pulse rounded-full bg-zinc-200" />
              <div className="h-4 w-full animate-pulse rounded-full bg-zinc-200" />
              <div className="h-4 w-5/6 animate-pulse rounded-full bg-zinc-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
});
const CollectionGrid = dynamic(() => import('./sections/CollectionGrid'), {
  loading: () => (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="aspect-[16/10] animate-pulse rounded-[2rem] bg-zinc-50" />
      ))}
    </div>
  )
});

export function PageRenderer({ sections }: { sections: PublicSection[] }) {
  return (
    <div className="flex flex-col gap-12 lg:gap-20">
      {sections.map((section) => {
        switch (section.type) {
          case 'hero':
            return <HeroSection key={section.id} section={section} />;
          
          case 'richText':
            return <RichTextSection key={section.id} section={section} />;
          
          case 'cta':
            return <CtaSection key={section.id} section={section} />;
          
          case 'gallery':
            return <GallerySection key={section.id} section={section} />;

          case 'features':
          case 'collection':
            return <CollectionGrid key={section.id} section={section} />;
          
          default:
            return (
              <section key={section.id} className="rounded-2xl border border-dashed p-8 text-center text-zinc-400">
                Unknown section type: {section.type}
              </section>
            );
        }
      })}
    </div>
  );
}
