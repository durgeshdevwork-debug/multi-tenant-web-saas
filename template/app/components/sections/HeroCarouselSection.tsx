'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { PublicSection } from '@/app/lib/publicApi';

export default function HeroCarouselSection({ section }: { section: PublicSection }) {
  const slides = section.content.carouselItems ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex] ?? slides[0];

  if (!activeSlide) return null;

  const goTo = (index: number) => {
    const nextIndex = (index + slides.length) % slides.length;
    setActiveIndex(nextIndex);
  };

  return (
    <section className="overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-background via-background to-muted/40 shadow-sm">
      <div className="grid items-stretch lg:grid-cols-[1.05fr,0.95fr]">
        <div className="flex flex-col justify-between gap-8 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div className="space-y-6">
            {section.content.eyebrow ? (
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
                {section.content.eyebrow}
              </p>
            ) : null}
            {activeSlide.title || section.content.heading ? (
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {activeSlide.title || section.content.heading}
              </h1>
            ) : null}
            {activeSlide.description || section.content.body ? (
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {activeSlide.description || section.content.body}
              </p>
            ) : null}
            {(activeSlide.buttonUrl || section.content.buttonUrl) ? (
              <div className="pt-2">
                <Link
                  href={activeSlide.buttonUrl || section.content.buttonUrl || '#'}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0"
                >
                  {activeSlide.buttonLabel || section.content.buttonLabel || 'Learn more'}
                </Link>
              </div>
            ) : null}
          </div>

          {slides.length > 1 ? (
            <div className="flex flex-wrap items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={`${section.id}-dot-${index}`}
                  type="button"
                  onClick={() => goTo(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeIndex ? 'w-10 bg-primary' : 'w-2.5 bg-border hover:bg-muted-foreground/40'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="relative min-h-[340px] overflow-hidden lg:min-h-[520px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(10,45,20,0.18),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
          {activeSlide.imageUrl ? (
            <Image
              src={activeSlide.imageUrl}
              alt={activeSlide.title || section.content.heading || 'Hero slide'}
              fill
              className="object-cover"
              priority={activeIndex === 0}
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-muted-foreground">
              Add slide imagery in the CMS to complete the carousel.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
