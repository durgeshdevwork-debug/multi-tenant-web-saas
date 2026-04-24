'use client';

import dynamic from 'next/dynamic';
import type { PublicSection, PublicPage } from '../lib/publicApi';

// Lazy load section components for better performance
const HeroSection = dynamic(() => import('./sections/HeroSection'), { 
  loading: () => <div className="h-[400px] animate-pulse rounded-[2rem] bg-zinc-50" />
});
const RichTextSection = dynamic(() => import('./sections/RichTextSection'));
const CtaSection = dynamic(() => import('./sections/CtaSection'));
const CollectionGrid = dynamic(() => import('./sections/CollectionGrid'), {
  loading: () => (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="aspect-[16/10] animate-pulse rounded-[2rem] bg-zinc-50" />
      ))}
    </div>
  )
});

export function PageRenderer({ sections, children }: { sections: PublicSection[]; children?: PublicPage[] }) {
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
          
          case 'features':
          case 'gallery':
          case 'collection':
            return <CollectionGrid key={section.id} section={section} children={children} />;
          
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
