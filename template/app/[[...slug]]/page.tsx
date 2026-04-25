import { notFound } from "next/navigation";

import { PageRenderer } from "../components/PageRenderer";
import { publicApi } from "../lib/publicApi";

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = await params;
  const path = resolvedParams.slug?.length
    ? `/${resolvedParams.slug.join("/")}`
    : "/";
  const page = await publicApi.pageByPath(path);

  if (!page) {
    notFound();
  }

  return (
    <div className="space-y-12">
      <PageRenderer sections={page.sections} />
    </div>
  );
}
