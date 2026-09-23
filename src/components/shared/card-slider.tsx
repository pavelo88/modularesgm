'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardSliderProps {
  label: string;
  children: React.ReactNode[];
  /** Tamaño de cada tarjeta según el ancho de pantalla. */
  slideClassName?: string;
  autoplay?: boolean;
  className?: string;
}

/**
 * Carrusel de tarjetas (Embla): arrastre, flechas, puntos y pausa al interactuar.
 * El autoplay arranca tras la carga para no afectar el rendimiento inicial.
 */
export function CardSlider({
  label,
  children,
  slideClassName = 'basis-[82%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4',
  autoplay = true,
  className,
}: CardSliderProps) {
  const [plugins, setPlugins] = useState<ReturnType<typeof Autoplay>[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', skipSnaps: false }, plugins);
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(
      () => setPlugins([Autoplay({ delay: 4500, stopOnInteraction: true, stopOnMouseEnter: true })]),
      6000
    );
    return () => clearTimeout(t);
  }, [autoplay]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on('select', onSelect).on('reInit', () => {
      setSnaps(emblaApi.scrollSnapList());
      onSelect();
    });
  }, [emblaApi, onSelect]);

  return (
    <div className={cn('relative', className)} role="region" aria-roledescription="carrusel" aria-label={label}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4 touch-pan-y">
          {children.map((child, i) => (
            <div key={i} className={cn('min-w-0 shrink-0 grow-0 pl-4', slideClassName)}>
              {child}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2" aria-hidden>
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn('h-1.5 rounded-full transition-all duration-300', i === selected ? 'w-8 bg-secondary' : 'w-3 bg-foreground/20')}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Anterior"
            className="grid h-11 w-11 place-items-center rounded-xl border border-foreground/10 bg-background/70 backdrop-blur-md transition hover:bg-secondary hover:text-secondary-foreground active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Siguiente"
            className="grid h-11 w-11 place-items-center rounded-xl border border-foreground/10 bg-background/70 backdrop-blur-md transition hover:bg-secondary hover:text-secondary-foreground active:scale-95"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

interface MediaCardProps {
  image: string;
  title: string;
  eyebrow?: string;
  description?: string;
  href: string;
  cta?: string;
  onClick?: () => void;
  aspect?: string;
}

/** Tarjeta con el mismo lenguaje visual del hero: foto completa, degradado y etiqueta de cristal. */
export function MediaCard({ image, title, eyebrow, description, href, cta = 'Ver más', onClick, aspect = 'aspect-[4/5]' }: MediaCardProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn('group relative block overflow-hidden rounded-3xl bg-muted ring-1 ring-foreground/10 shadow-lg', aspect)}
    >
      {image && (
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width:640px) 82vw, (max-width:1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      {eyebrow && (
        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
          {eyebrow}
        </span>
      )}
      <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-md transition-all group-hover:bg-secondary group-hover:opacity-100">
        <ArrowUpRight size={18} />
      </span>
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <p className="font-headline text-xl font-bold leading-tight">{title}</p>
        {description && <p className="mt-2 line-clamp-2 text-sm text-white/75">{description}</p>}
        <p className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-secondary">
          {cta}
        </p>
      </div>
    </Link>
  );
}
