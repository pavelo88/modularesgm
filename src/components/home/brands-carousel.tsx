'use client';

import { useState } from 'react';
import type { Brand } from '@/lib/types';

const BRAND_LOGOS: Record<string, string> = {
  blum: '/brands/blum.webp',
  hafele: '/brands/hafele.webp',
  cosentino: '/brands/cosentino.webp',
  dekton: '/brands/dekton.webp',
  silestone: '/brands/silestone.webp',
  teka: '/brands/teka.webp',
  pelikano: '/brands/pelikano.webp',
  novopan: '/brands/novopan.webp',
  briggs: '/brands/briggs.webp',
};

function BrandLogo({ brand }: { brand: Brand }) {
  const brandKey = brand.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  const logoPath = BRAND_LOGOS[brandKey] || brand.url;

  if (!logoPath) {
    return (
      <span className="font-mono text-xs font-bold tracking-[0.2em] text-stone-700 uppercase">
        {brand.name}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoPath}
      alt={`Logotipo oficial ${brand.name}`}
      width={140}
      height={45}
      loading="lazy"
      decoding="async"
      className="max-h-9 w-auto max-w-[140px] object-contain transition-all duration-300 opacity-85 hover:opacity-100 transform group-hover:scale-105"
    />
  );
}

/** Banda de marcas con fondo blanco garantizado tanto en modo claro como en modo oscuro */
export function BrandsCarousel({ brands }: { brands: Brand[] }) {
  if (!brands || brands.length === 0) return null;
  const track = [...brands, ...brands, ...brands, ...brands];

  return (
    <section 
      className="relative z-10 flex flex-col gap-5 border-y border-stone-200 bg-white py-10 shadow-sm" 
      aria-labelledby="marcas-title"
    >
      <div className="px-6 text-center">
        <h2 id="marcas-title" className="text-[11px] font-mono tracking-[0.25em] uppercase text-stone-600 font-semibold">
          Materiales y herrajes de calidad certificada
        </h2>
      </div>

      <div className="relative mx-auto w-full max-w-7xl overflow-hidden py-2">
        {/* Máscaras de desvanecimiento lateral en blanco puro constante */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent md:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent md:w-40" />

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

