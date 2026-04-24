import Link from 'next/link';
import type { PublicSection } from '@/app/lib/publicApi';

export default function CtaSection({ section }: { section: PublicSection }) {
  return (
    <section className="rounded-[2rem] border border-zinc-200 bg-zinc-950 px-8 py-12 text-white">
      <div className="max-w-3xl space-y-5">
        {section.content.heading ? (
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">{section.content.heading}</h2>
        ) : null}
        {section.content.body ? (
          <p className="text-lg leading-8 text-zinc-300">{section.content.body}</p>
        ) : null}
        {section.content.buttonUrl ? (
          <Link 
            href={section.content.buttonUrl} 
            className="inline-flex rounded-full bg-white px-8 py-3 text-sm font-bold text-zinc-950 hover:bg-zinc-100 transition-colors"
          >
            {section.content.buttonLabel || 'Get started'}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
