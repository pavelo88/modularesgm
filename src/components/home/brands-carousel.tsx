'use client';

import type { Brand } from '@/lib/types';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export function BrandsCarousel({ brands }: { brands: Brand[] }) {
  if (!brands || brands.length === 0) return null;

  const trackRef = useRef<HTMLDivElement>(null);
  const [erroredUrls, setErroredUrls] = useState<string[]>([]);

  useEffect(() => {
    let animationFrameId: number;
    const checkCenter = () => {
      if (!trackRef.current) return;
      const items = trackRef.current.querySelectorAll<HTMLDivElement>('.brand-item');
      const centerX = window.innerWidth / 2;
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const dist = Math.abs(centerX - itemCenter);
        if (dist < 100) {
          item.style.filter = 'grayscale(0%) opacity(1)';
          item.style.transform = 'scale(1.15)';
        } else {
          item.style.filter = 'grayscale(100%) opacity(0.3)';
          item.style.transform = 'scale(0.9)';
        }
      });
      animationFrameId = requestAnimationFrame(checkCenter);
    };

    checkCenter();

    return () => cancelAnimationFrame(animationFrameId);
  }, [brands]);

  const allBrands = [...brands, ...brands, ...brands, ...brands];

  const handleImageError = (url: string) => {
    if (!erroredUrls.includes(url)) {
      setErroredUrls(prev => [...prev, url]);
    }
  }

  return (
    <section className="py-12 border-y border-white/5 bg-[#19242D] relative z-10 flex flex-col gap-6">
      <div className="text-center px-6">
        <p className="text-xs font-bold tracking-widest text-[#F5F1E5]/60 uppercase">
          Materiales y Herrajes de Calidad Certificada
        </p>
      </div>
      <div className="relative w-full overflow-hidden max-w-7xl mx-auto py-4">
        {/* Degradados forzados a oscuro para el carrusel */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-[#19242D] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-[#19242D] to-transparent z-10 pointer-events-none"></div>
        <div className="brand-carousel-track items-center" ref={trackRef}>
          {allBrands.map((brand, idx) => (
            <div
              key={idx}
              className="brand-item w-[220px] flex-shrink-0 flex items-center justify-center p-4 transition-all duration-500 ease-out will-change-transform"
            >
              {brand.url && !erroredUrls.includes(brand.url) ? (
                <Image
                  src={brand.url}
                  alt={brand.name}
                  width={160}
                  height={56}
                  className="max-h-14 object-contain filter brightness-0 invert opacity-70 hover:opacity-100"
                  onError={() => handleImageError(brand.url)}
                />
              ) : (
                <span className="text-[#F5F1E5]/70 font-bold tracking-widest text-2xl">
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
