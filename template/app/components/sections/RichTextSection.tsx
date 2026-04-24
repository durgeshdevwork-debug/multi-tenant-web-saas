import type { PublicSection } from '@/app/lib/publicApi';

export default function RichTextSection({ section }: { section: PublicSection }) {
  return (
    <section className="space-y-4">
      {section.content.heading ? (
        <h2 className="text-3xl font-bold tracking-tight text-zinc-950 lg:text-4xl">
          {section.content.heading}
        </h2>
      ) : null}
      {section.content.body ? (
        <div className="max-w-4xl whitespace-pre-line text-base leading-8 text-zinc-600">
          {section.content.body}
        </div>
      ) : null}
    </section>
  );
}
