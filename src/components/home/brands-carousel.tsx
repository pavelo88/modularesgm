'use client';

import { useState } from 'react';
import type { Brand } from '@/lib/types';

const EXTENSIONS = ['webp', 'png', 'svg'] as const;
const slug = (name: string) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');

/** Logo blanco. Orden de búsqueda: URL del CMS → /brands/{marca}.webp|png|svg → nombre en texto. */
function BrandLogo({ brand }: { brand: Brand }) {
  const candidates = [brand.url, ...EXTENSIONS.map((ext) => `/brands/${slug(brand.name)}.${ext}`)].filter(Boolean) as string[];
  const [attempt, setAttempt] = useState(0);

  if (attempt >= candidates.length) {
    return <span className="font-headline text-xl font-bold tracking-widest text-primary/80">{brand.name}</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={candidates[attempt]}
      alt={brand.name}
      width={140}
      height={48}
      loading="lazy"
      decoding="async"
      onError={() => setAttempt((a) => a + 1)}
      className="max-h-12 w-auto max-w-[140px] object-contain transition-transform group-hover:scale-105"
    />
  );
}

/** Banda de marcas: fondo blanco y logos originales (modo claro y oscuro). */
export function BrandsCarousel({ brands }: { brands: Brand[] }) {
  if (!brands || brands.length === 0) return null;
  const track = [...brands, ...brands, ...brands, ...brands];

  return (
    <section className="relative z-10 flex flex-col gap-6 border-y border-zinc-200 dark:border-zinc-800 bg-white dark:bg-white py-12" aria-labelledby="marcas-title">
      <div className="px-6 text-center">
        <h2 id="marcas-title" className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Materiales y herrajes de calidad certificada
        </h2>
      </div>
      <div className="relative mx-auto w-full max-w-7xl overflow-hidden py-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent md:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent md:w-40" />
        <ul className="brand-carousel-track items-center">
          {track.map((brand, idx) => (
            <li key={idx} className="brand-item flex w-[200px] flex-shrink-0 items-center justify-center p-4 opacity-70 transition-all duration-300 hover:scale-105 hover:opacity-100" aria-hidden={idx >= brands.length ? "true" : "false"}>
              <BrandLogo brand={brand} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
