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
      className="group flex flex-col overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm ring-1 ring-zinc-950/5 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl hover:ring-zinc-950/10"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
        {item.imageUrl ? (
          <Image 
            src={item.imageUrl} 
            alt={item.title || 'Collection item'} 
            fill 
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
            unoptimized 
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 p-8 text-zinc-300">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col justify-between p-6 lg:p-8">
        <div className="space-y-3">
          {item.title ? (
            <h3 className="text-xl font-bold tracking-tight text-zinc-950 transition-colors group-hover:text-zinc-900 lg:text-2xl">
              {item.title}
            </h3>
          ) : null}
          {item.description ? (
            <p className="text-sm leading-7 text-zinc-600 line-clamp-3">
              {item.description}
            </p>
          ) : null}
        </div>
        <div className="mt-6 flex items-center text-sm font-bold text-zinc-950">
          <span className="relative text-black">
            Learn more
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-zinc-950 transition-all duration-300 group-hover:w-full" />
          </span>
          <svg className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
