import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import type { PublicSection } from '@/app/lib/publicApi';

export default function FaqSection({ section }: { section: PublicSection }) {
  const items = section.content.items ?? [];

  return (
    <section className="space-y-8 py-8">
      <div className="max-w-3xl space-y-4">
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
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            {section.content.body}
          </p>
        ) : null}
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <details
            key={`${section.id}-faq-${index}`}
            className="group overflow-hidden rounded-[1.5rem] border border-border bg-background shadow-sm"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left">
              <span className="text-lg font-medium text-foreground">
                {item.question || item.title || `Question ${index + 1}`}
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Open
              </span>
            </summary>
            <div className="grid gap-6 border-t border-border px-6 py-6 lg:grid-cols-[1fr,320px]">
              <div className="prose prose-zinc max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-primary">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {item.answer || item.description || ''}
                </ReactMarkdown>
              </div>
              {item.imageUrl ? (
                <div className="relative min-h-[220px] overflow-hidden rounded-[1.25rem] border border-border bg-muted">
                  <Image
                    src={item.imageUrl}
                    alt={item.question || item.title || 'FAQ image'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null}
            </div>
          </details>
        ))}
        {items.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-border bg-muted/30 p-10 text-center text-muted-foreground">
            Add FAQ items in the CMS to populate this section.
          </div>
        ) : null}
      </div>
    </section>
  );
}
