import Image from 'next/image';
import Link from 'next/link';
import type { PublicSection } from '@/app/lib/publicApi';

export default function HeroSection({ section }: { section: PublicSection }) {
  return (
    <section className="grid items-center gap-8 rounded-[2rem] border border-zinc-200 bg-zinc-50 p-8 lg:grid-cols-[1.1fr,0.9fr]">
      <div className="space-y-5">
        {section.content.eyebrow ? (
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{section.content.eyebrow}</p>
        ) : null}
        <h1 className="text-4xl font-semibold leading-tight text-zinc-950 lg:text-5xl">
          {section.content.heading}
        </h1>
        {section.content.body ? <p className="text-lg leading-8 text-zinc-600">{section.content.body}</p> : null}
        {section.content.buttonUrl ? (
          <Link href={section.content.buttonUrl} className="inline-flex rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white">
            {section.content.buttonLabel || 'Learn more'}
          </Link>
        ) : null}
      </div>
      <div className="relative min-h-[320px] overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white">
        {section.content.imageUrl ? (
          <Image 
            src={section.content.imageUrl} 
            alt={section.content.heading || 'Hero image'} 
            fill 
            className="object-cover" 
            unoptimized 
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">Add an image URL in the CMS for this hero block.</div>
        )}
      </div>
    </section>
  );
}
