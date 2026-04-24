import { notFound } from 'next/navigation';

import { PageRenderer } from '../components/PageRenderer';
import { publicApi } from '../lib/publicApi';

export default async function DynamicPage({
  params
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = await params;
  const path = resolvedParams.slug?.length ? `/${resolvedParams.slug.join('/')}` : '/';
  const page = await publicApi.pageByPath(path);

  if (!page) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{page.path}</p>
        <h1 className="text-4xl font-semibold text-zinc-950">{page.title}</h1>
      </div>
      <PageRenderer sections={page.sections} children={page.children} />
    </div>
  );
}
