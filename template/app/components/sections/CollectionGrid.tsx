import type { PublicSection, PublicPage } from '@/app/lib/publicApi';
import PageCard from './PageCard';

export default function CollectionGrid({ 
  section, 
}: { 
  section: PublicSection; 
  children?: PublicPage[] 
}) {
  // Items are now pre-populated by the backend (ContentService) 
  // whether they are manually selected or auto-listed children.
  const items = section.content.items ?? [];

  return (
    <section className="space-y-8 py-4">
      <div className="flex flex-col gap-3">
        {section.content.heading ? (
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 lg:text-4xl">
            {section.content.heading}
          </h2>
        ) : null}
        <div className="h-1.5 w-12 rounded-full bg-zinc-950" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <PageCard key={`${section.id}-${index}`} item={item} />
        ))}
        
        {items.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-20 text-center">
            <div className="mb-4 rounded-full bg-white p-4 shadow-sm ring-1 ring-zinc-950/5">
              <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-zinc-950">No sub-pages found here yet</p>
            <p className="mt-1 text-sm text-zinc-500">Edit this section in the CMS to select pages or add child pages.</p>
          </div>
        )}
      </div>
    </section>
  );
}
