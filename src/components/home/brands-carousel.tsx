'use client';

import type { Brand } from '@/lib/types';
import Image from 'next/image';

export function BrandsCarousel({ brands }: { brands: Brand[] }) {
  if (!brands || brands.length === 0) return null;

  const allBrands = [...brands, ...brands, ...brands, ...brands];

  return (
    <section className="py-12 border-y border-white/5 bg-[#19242D] relative z-10 flex flex-col gap-6">
      <div className="text-center px-6">
        <p className="text-xs font-bold tracking-widest text-[#F5F1E5]/60 uppercase">
          Materiales y Herrajes de Calidad Certificada
        </p>
      </div>
      <div className="relative w-full overflow-hidden max-w-7xl mx-auto py-4">
        {/* Degradados laterales */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-[#19242D] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-[#19242D] to-transparent z-10 pointer-events-none"></div>
        <div className="brand-carousel-track items-center">
          {allBrands.map((brand, idx) => (
            <div
              key={idx}
              className="brand-item w-[200px] flex-shrink-0 flex items-center justify-center p-4 transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-105"
            >
              {brand.url ? (
                <Image
                  src={brand.url}
                  alt={brand.name}
                  width={140}
                  height={48}
                  className="max-h-12 object-contain filter brightness-0 invert opacity-80"
                />
              ) : (
                <span className="text-[#F5F1E5]/70 font-bold tracking-widest text-xl font-headline">
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

