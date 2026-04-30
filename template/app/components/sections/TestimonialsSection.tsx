import Image from "next/image";

import type { PublicSection } from "@/app/lib/publicApi";

export default function TestimonialsSection({
  section,
}: {
  section: PublicSection;
}) {
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

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <article
            key={`${section.id}-testimonial-${index}`}
            className="overflow-hidden rounded-[1.5rem] border border-border bg-background shadow-sm transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="space-y-5 p-6">
              <div className="flex items-start gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full bg-muted">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={
                        item.authorName || item.title || "Testimonial avatar"
                      }
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-base font-semibold text-foreground">
                    {item.authorName ||
                      item.title ||
                      `Testimonial ${index + 1}`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {[item.authorRole, item.company]
                      .filter(Boolean)
                      .join(" • ")}
                  </div>
                </div>
              </div>

              {item.format === "video" && item.mediaUrl ? (
                <video
                  controls
                  className="w-full rounded-[1.25rem] border border-border bg-muted"
                >
                  <source src={item.mediaUrl} />
                </video>
              ) : item.format === "audio" && item.mediaUrl ? (
                <audio controls className="w-full">
                  <source src={item.mediaUrl} />
                </audio>
              ) : null}

              {item.description ? (
                <blockquote className="border-l-4 border-primary/20 pl-4 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </blockquote>
              ) : null}

              {item.rating ? (
                <div className="text-sm font-medium text-primary">
                  {"★".repeat(
                    Math.max(0, Math.min(5, Math.round(item.rating))),
                  )}
                </div>
              ) : null}
            </div>
          </article>
        ))}

        {items.length === 0 ? (
          <div className="col-span-full rounded-[1.5rem] border border-dashed border-border bg-muted/30 p-10 text-center text-muted-foreground">
            Add testimonials to a collection in the CMS to populate this
            section.
          </div>
        ) : null}
      </div>
    </section>
  );
}
