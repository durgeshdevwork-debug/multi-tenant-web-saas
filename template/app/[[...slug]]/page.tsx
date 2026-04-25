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
    <div className="space-y-12">
      <div className="space-y-3 flex flex-col items-center text-center">
        <p className="text-sm uppercase tracking-widest text-primary font-medium">{page.path}</p>
        <h1 className="text-5xl font-semibold tracking-tight text-foreground lg:text-6xl">{page.title}</h1>
      </div>
      <PageRenderer sections={page.sections} children={page.children} />
    </div>
  );
}
