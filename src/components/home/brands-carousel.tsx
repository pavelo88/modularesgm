'use client';

import { useState } from 'react';
import type { Brand } from '@/lib/types';

const EXTENSIONS = ['svg', 'webp', 'png'] as const;
const slug = (name: string) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');

/**
 * Logotipo oficial de marca.
 * Carga preferentemente el asset local vectorizado o WebP, con renderizado monocromo luxury
 * que se adapta automáticamente a fondo oscuro y claro.
 */
function BrandLogo({ brand }: { brand: Brand }) {
  const localCandidates = EXTENSIONS.map((ext) => `/brands/${slug(brand.name)}.${ext}`);
  const candidates = [...localCandidates, brand.url].filter(Boolean) as string[];
  const [attempt, setAttempt] = useState(0);

  if (attempt >= candidates.length) {
    return (
      <span className="font-mono text-xs font-bold tracking-[0.2em] text-muted-foreground/70 uppercase">
        {brand.name}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={candidates[attempt]}
      alt={`Logotipo oficial ${brand.name}`}
      width={130}
      height={40}
      loading="lazy"
      decoding="async"
      onError={() => setAttempt((a) => a + 1)}
      className="max-h-9 w-auto max-w-[130px] object-contain transition-all duration-300 filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 dark:opacity-70 dark:brightness-200 dark:contrast-125 dark:hover:opacity-100 transform group-hover:scale-105"
    />
  );
}

/** Banda de marcas de calidad certificada con desplazamiento continuo y desvanecimientos cinematográficos */
export function BrandsCarousel({ brands }: { brands: Brand[] }) {
  if (!brands || brands.length === 0) return null;
  const track = [...brands, ...brands, ...brands, ...brands];

  return (
    <section 
      className="relative z-10 flex flex-col gap-5 border-y border-stone-200/70 dark:border-white/5 bg-[#FAF8F5]/80 dark:bg-[#0B0D11] py-10 transition-colors" 
      aria-labelledby="marcas-title"
    >
      <div className="px-6 text-center">
        <h2 id="marcas-title" className="text-[11px] font-mono tracking-[0.25em] uppercase text-stone-500 dark:text-stone-400 font-semibold">
          Materiales y herrajes de calidad certificada
        </h2>
      </div>

      <div className="relative mx-auto w-full max-w-7xl overflow-hidden py-2">
        {/* Máscaras de desvanecimiento lateral adaptables a dark/light mode */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#FAF8F5] dark:from-[#0B0D11] to-transparent md:w-40 transition-colors" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#FAF8F5] dark:from-[#0B0D11] to-transparent md:w-40 transition-colors" />

        <ul className="brand-carousel-track items-center">
          {track.map((brand, idx) => (
            <li 
              key={idx} 
              className="group brand-item flex w-[180px] flex-shrink-0 items-center justify-center p-3 select-none" 
              aria-hidden={idx >= brands.length ? "true" : "false"}
            >
              <BrandLogo brand={brand} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

