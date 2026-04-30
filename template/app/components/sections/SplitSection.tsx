import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import type { PublicSection } from '@/app/lib/publicApi';

export default function SplitSection({ section }: { section: PublicSection }) {
  const mediaLeft = Boolean(section.content.imageUrl);

  return (
    <section className="grid gap-8 rounded-[2rem] border border-border bg-gradient-to-b from-background to-muted/30 p-6 shadow-sm lg:grid-cols-[1fr,0.95fr] lg:p-10">
      <div className={`space-y-6 ${mediaLeft ? 'lg:order-2' : ''}`}>
        {section.content.eyebrow ? (
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            {section.content.eyebrow}
          </p>
        ) : null}
        {section.content.heading ? (
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {section.content.heading}
          </h2>
        ) : null}
        {section.content.body ? (
          <div className="prose prose-zinc max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-primary">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {section.content.body}
            </ReactMarkdown>
          </div>
        ) : null}
        {section.content.buttonUrl ? (
          <Link
            href={section.content.buttonUrl}
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95"
          >
            {section.content.buttonLabel || 'Learn more'}
          </Link>
        ) : null}
      </div>

      <div className={`relative min-h-[320px] overflow-hidden rounded-[1.75rem] border border-border bg-muted ${mediaLeft ? 'lg:order-1' : ''}`}>
        {section.content.imageUrl ? (
          <Image
            src={section.content.imageUrl}
            alt={section.content.heading || 'Split section image'}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-muted-foreground">
            Add a section image to complete the split layout.
          </div>
        )}
      </div>
    </section>
  );
}
