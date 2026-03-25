import Image from "next/image";
import Link from "next/link";
import { publicApi } from "../../lib/publicApi";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await publicApi.blogPost(params.slug);

  if (!post) {
    return (
      <section className="space-y-4">
        <Link href="/blog" className="text-sm font-semibold">
          ← Back to Blog
        </Link>
        <h1 className="text-2xl font-semibold">Post not found</h1>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <Link href="/blog" className="text-sm font-semibold">
        ← Back to Blog
      </Link>
      <div className="space-y-2">
        <div className="text-xs uppercase text-zinc-500">
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Draft"}
        </div>
        <h1 className="text-3xl font-semibold">{post.title}</h1>
        <p className="text-sm text-zinc-600">{post.excerpt}</p>
      </div>
      {post.coverImageUrl ? (
        <div className="relative h-72 w-full overflow-hidden rounded-2xl border bg-zinc-100">
          <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" unoptimized />
        </div>
      ) : null}
      <article className="space-y-4 text-base leading-7 text-zinc-700">
        {post.body ? post.body.split("\n").map((line, idx) => <p key={idx}>{line}</p>) : null}
      </article>
    </section>
  );
}
