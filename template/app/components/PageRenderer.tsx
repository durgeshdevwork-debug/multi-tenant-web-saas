import Image from 'next/image';
import Link from 'next/link';

import type { PublicSection } from '../lib/publicApi';

export function PageRenderer({ sections }: { sections: PublicSection[] }) {
  return (
    <div className="flex flex-col gap-12">
      {sections.map((section) => {
        if (section.type === 'hero') {
          return (
            <section key={section.id} className="grid items-center gap-8 rounded-[2rem] border border-zinc-200 bg-zinc-50 p-8 lg:grid-cols-[1.1fr,0.9fr]">
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
                  <Image src={section.content.imageUrl} alt={section.content.heading || 'Section image'} fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-zinc-400">Add an image URL in the CMS for this hero block.</div>
                )}
              </div>
            </section>
          );
        }

        if (section.type === 'features' || section.type === 'gallery') {
          return (
            <section key={section.id} className="space-y-6">
              {section.content.heading ? <h2 className="text-3xl font-semibold text-zinc-950">{section.content.heading}</h2> : null}
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {(section.content.items ?? []).map((item, index) => (
                  <div key={`${section.id}-${index}`} className="overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white">
                    <div className="relative h-48 bg-zinc-100">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.title || 'Gallery image'} fill className="object-cover" unoptimized />
                      ) : null}
                    </div>
                    <div className="space-y-2 p-5">
                      {item.title ? <h3 className="text-xl font-semibold text-zinc-950">{item.title}</h3> : null}
                      {item.description ? <p className="text-sm leading-6 text-zinc-600">{item.description}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === 'cta') {
          return (
            <section key={section.id} className="rounded-[2rem] border border-zinc-200 bg-zinc-950 px-8 py-10 text-white">
              <div className="max-w-3xl space-y-4">
                {section.content.heading ? <h2 className="text-3xl font-semibold">{section.content.heading}</h2> : null}
                {section.content.body ? <p className="text-base leading-7 text-zinc-200">{section.content.body}</p> : null}
                {section.content.buttonUrl ? (
                  <Link href={section.content.buttonUrl} className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950">
                    {section.content.buttonLabel || 'Get started'}
                  </Link>
                ) : null}
              </div>
            </section>
          );
        }

        return (
          <section key={section.id} className="space-y-4">
            {section.content.heading ? <h2 className="text-3xl font-semibold text-zinc-950">{section.content.heading}</h2> : null}
            {section.content.body ? <div className="max-w-4xl whitespace-pre-line text-base leading-8 text-zinc-600">{section.content.body}</div> : null}
          </section>
        );
      })}
    </div>
  );
}
