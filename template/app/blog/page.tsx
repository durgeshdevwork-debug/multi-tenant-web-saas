import Link from "next/link";
import { publicApi } from "../lib/publicApi";

export default async function BlogPage() {
  const posts = await publicApi.blog();

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold">Blog</h1>
      <div className="space-y-4">
        {(posts ?? []).map((post) => (
          <article key={post.slug} className="rounded-xl border p-4">
            <div className="text-xs uppercase text-zinc-500">
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Draft"}
            </div>
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-sm text-zinc-600">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="mt-2 inline-block text-sm font-semibold">
              Read more
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
