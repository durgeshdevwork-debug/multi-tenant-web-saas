import Link from 'next/link';
import type { PublicSection } from '@/app/lib/publicApi';

export default function CtaSection({ section }: { section: PublicSection }) {
  return (
    <section className="rounded-2xl border border-primary/10 bg-primary px-8 py-16 text-primary-foreground md:py-24 md:px-16 text-center flex flex-col items-center">
      <div className="max-w-3xl space-y-6">
        {section.content.heading ? (
          <h2 className="text-4xl font-semibold tracking-tight lg:text-5xl">{section.content.heading}</h2>
        ) : null}
        {section.content.body ? (
          <p className="text-lg leading-relaxed text-primary-foreground/80 max-w-2xl mx-auto">{section.content.body}</p>
        ) : null}
        {section.content.buttonUrl ? (
          <div className="pt-6">
            <Link 
              href={section.content.buttonUrl} 
              className="inline-flex rounded-full bg-background px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-secondary transition-transform hover:scale-105 active:scale-95"
            >
              {section.content.buttonLabel || 'Get started'}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
