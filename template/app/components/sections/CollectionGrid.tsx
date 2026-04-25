import type { PublicSection, PublicPage } from '@/app/lib/publicApi';
import PageCard from './PageCard';

export default function CollectionGrid({ 
  section, 
}: { 
  section: PublicSection; 
  children?: PublicPage[] 
}) {
  const items = section.content.items ?? [];

  return (
    <section className="space-y-12 py-10">
      <div className="flex flex-col items-center text-center gap-4">
        {section.content.eyebrow ? (
          <p className="text-sm uppercase tracking-widest text-primary font-medium">{section.content.eyebrow}</p>
        ) : null}
        {section.content.heading ? (
          <h2 className="text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
            {section.content.heading}
          </h2>
        ) : null}
        {section.content.body ? (
          <p className="text-muted-foreground mt-2 max-w-xl text-lg">{section.content.body}</p>
        ) : null}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <PageCard key={`${section.id}-${index}`} item={item} />
        ))}
        
        {items.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/50 p-20 text-center">
            <div className="mb-4 rounded-full bg-background p-4 shadow-sm ring-1 ring-border">
              <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-foreground">No sub-pages found here yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Edit this section in the CMS to select pages or add child pages.</p>
          </div>
        )}
      </div>

      {section.content.buttonUrl ? (
        <div className="flex justify-center pt-8">
          <a href={section.content.buttonUrl} className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            {section.content.buttonLabel || 'View all'}
          </a>
        </div>
      ) : null}
    </section>
  );
}
