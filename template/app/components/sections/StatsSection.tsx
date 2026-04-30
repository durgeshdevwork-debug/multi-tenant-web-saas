import type { PublicSection } from '@/app/lib/publicApi';

export default function StatsSection({ section }: { section: PublicSection }) {
  const items = section.content.items ?? [];

  return (
    <section className="space-y-8 py-6">
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <article
            key={`${section.id}-stat-${index}`}
            className="rounded-[1.5rem] border border-border bg-background p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="space-y-3">
              <div className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
                {item.title || item.label || `Stat ${index + 1}`}
              </div>
              <div className="text-4xl font-semibold tracking-tight text-foreground">
                {item.value || '0'}
              </div>
              {item.description ? (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
            </div>
          </article>
        ))}
        {items.length === 0 ? (
          <div className="col-span-full rounded-[1.5rem] border border-dashed border-border bg-muted/30 p-10 text-center text-muted-foreground">
            Add stats items in the CMS to populate this section.
          </div>
        ) : null}
      </div>
    </section>
  );
}
