import Image from 'next/image';
import Link from 'next/link';

export type PageCardItem = {
  title?: string;
  description?: string;
  imageUrl?: string;
  url?: string;
};

export default function PageCard({ item }: { item: PageCardItem }) {
  return (
    <Link 
      href={item.url || '#'}
      className="group flex flex-col overflow-hidden rounded-2xl bg-secondary/30 transition-all duration-300 hover:-translate-y-1 hover:bg-secondary/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted p-4">
        {item.imageUrl ? (
          <Image 
            src={item.imageUrl} 
            alt={item.title || 'Collection item'} 
            fill 
            className="object-cover rounded-xl transition-transform duration-700 ease-out group-hover:scale-105" 
            unoptimized 
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-background rounded-xl p-8 text-muted-foreground/50">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="space-y-2">
          {item.title ? (
            <h3 className="text-xl font-medium tracking-tight text-foreground transition-colors">
              {item.title}
            </h3>
          ) : null}
          {item.description ? (
            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          ) : null}
        </div>
        <div className="mt-6 flex items-center justify-between text-sm font-semibold text-foreground">
          <span className="text-muted-foreground font-normal">
            {/* usually date or read more goes here */}
            Read more
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-110">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
