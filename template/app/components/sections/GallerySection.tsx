import Image from 'next/image';
import Link from 'next/link';

import type { PublicSection } from '@/app/lib/publicApi';

type GalleryItem = {
  title?: string;
  description?: string;
  imageUrl?: string;
};

const columnCountClasses = 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3';

export default function GallerySection({ section }: { section: PublicSection }) {
  const items = (section.content.items ?? []) as GalleryItem[];
  const hasMainImage = Boolean(section.content.imageUrl);

  return (
    <section className="overflow-hidden rounded-[2rem] border border-border bg-gradient-to-b from-background to-muted/30 px-6 py-10 shadow-sm sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="max-w-3xl space-y-4">
          {section.content.eyebrow ? (
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
              {section.content.eyebrow}
            </p>
          ) : null}

          {section.content.heading ? (
            <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {section.content.heading}
            </h2>
          ) : null}

          {section.content.body ? (
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {section.content.body}
            </p>
          ) : null}
        </div>

        {hasMainImage ? (
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-muted shadow-[0_20px_60px_-35px_rgba(0,0,0,0.45)]">
            <div className="relative aspect-[16/8] sm:aspect-[16/7]">
              <Image
                src={section.content.imageUrl as string}
                alt={section.content.heading || 'Gallery feature image'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 92vw, 1200px"
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
              />
            </div>
          </div>
        ) : null}

        <div className={columnCountClasses}>
          {items.length > 0 ? (
            items.map((item, index) => (
              <article
                key={`${section.id}-gallery-${index}`}
                className="group overflow-hidden rounded-[1.5rem] border border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title || `Gallery item ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/60 text-muted-foreground">
                      <svg className="h-10 w-10 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-5 sm:p-6">
                  {item.title ? (
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                  ) : null}

                  {item.description ? (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full rounded-[1.5rem] border border-dashed border-border bg-background/70 px-6 py-14 text-center text-muted-foreground">
              Add gallery items in the CMS to populate this section.
            </div>
          )}
        </div>

        {section.content.buttonUrl ? (
          <div className="flex justify-center pt-2">
            <Link
              href={section.content.buttonUrl}
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0"
            >
              {section.content.buttonLabel || 'Explore gallery'}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
