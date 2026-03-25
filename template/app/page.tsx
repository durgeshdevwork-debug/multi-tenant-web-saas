import Image from "next/image";
import Link from "next/link";
import { publicApi } from "./lib/publicApi";

export default async function Home() {
  const landing = await publicApi.landing();

  return (
    <section className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr] items-center">
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          Business Landing
        </p>
        <h1 className="text-4xl font-semibold leading-tight text-zinc-900">
          {landing?.heroTitle ?? "Welcome to our studio"}
        </h1>
        <p className="text-lg text-zinc-600">
          {landing?.heroSubtitle ?? "Use this area to highlight the primary value of the business."}
        </p>
        <div className="flex flex-wrap gap-3">
          {landing?.primaryCtaUrl ? (
            <Link
              href={landing.primaryCtaUrl}
              className="rounded-full bg-zinc-900 px-6 py-2 text-sm font-semibold text-white"
            >
              {landing.primaryCtaText ?? "Get Started"}
            </Link>
          ) : (
            <span className="rounded-full border px-6 py-2 text-sm font-semibold text-zinc-900">
              {landing?.primaryCtaText ?? "Get Started"}
            </span>
          )}
          <Link href="/services" className="rounded-full border px-6 py-2 text-sm font-semibold text-zinc-900">
            View services
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {(landing?.highlights ?? []).map((highlight) => (
            <div key={highlight.title} className="rounded-lg border p-4">
              <div className="font-semibold">{highlight.title}</div>
              <div className="text-sm text-zinc-600">{highlight.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border bg-zinc-100">
        {landing?.heroImageUrl ? (
          <Image
            src={landing.heroImageUrl}
            alt={landing.heroTitle ?? "Hero"}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            Add a hero image URL in the admin portal.
          </div>
        )}
      </div>
    </section>
  );
}
