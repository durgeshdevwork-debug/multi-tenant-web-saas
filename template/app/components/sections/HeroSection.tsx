import Image from 'next/image';
import Link from 'next/link';
import type { PublicSection } from '@/app/lib/publicApi';

export default function HeroSection({ section }: { section: PublicSection }) {
  return (
    <section className="grid items-center gap-12 lg:grid-cols-[1.1fr,0.9fr] py-12 lg:py-20">
      <div className="space-y-6">
        {section.content.eyebrow ? (
          <p className="text-sm uppercase tracking-widest text-muted-foreground font-medium">{section.content.eyebrow}</p>
        ) : null}
        <h1 className="text-5xl font-semibold tracking-tight leading-[1.1] text-foreground lg:text-7xl">
          {section.content.heading}
        </h1>
        {section.content.body ? (
          <p className="text-lg leading-relaxed text-muted-foreground max-w-xl">{section.content.body}</p>
        ) : null}
        {section.content.buttonUrl ? (
          <div className="pt-4 flex items-center gap-4">
            <Link href={section.content.buttonUrl} className="inline-flex rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-105 active:scale-95">
              {section.content.buttonLabel || 'Learn more'}
            </Link>
          </div>
        ) : null}
      </div>
      <div className="relative min-h-[400px] overflow-hidden rounded-2xl bg-secondary/50">
        {section.content.imageUrl ? (
          <Image 
            src={section.content.imageUrl} 
            alt={section.content.heading || 'Hero image'} 
            fill 
            className="object-cover" 
            unoptimized 
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground px-6 text-center">Add an image URL in the CMS for this hero block.</div>
        )}
      </div>
    </section>
  );
}
