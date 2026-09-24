'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RailItem {
  id: string;
  title: string;
  image: string;
  caption: string;
  href?: string;
  cta?: string;
}

/**
 * Estado compartido de un hero con tarjetas: índice activo + autoplay que arranca a los 3 s.
 * No se pausa por hover (el cursor suele quedar sobre el hero); tras una acción manual
 * espera 10 s antes de retomar.
 */
export function useRail(length: number, { startAfter = 3000, every = 5500, holdMs = 10000 } = {}) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [armed, setArmed] = useState(false);
  const holdUntil = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setArmed(true), startAfter);
    return () => clearTimeout(t);
  }, [startAfter]);

  useEffect(() => {
    if (!armed || !playing) return;
    const t = setInterval(() => {
      if (Date.now() < holdUntil.current) return;
      setActive((i) => (i + 1) % length);
    }, every);
    return () => clearInterval(t);
  }, [armed, playing, length, every]);

  const manual = (fn: (i: number) => number) => {
    holdUntil.current = Date.now() + holdMs;
    setActive(fn);
  };

  return {
    active,
    setActive: (i: number) => manual(() => i),
    playing,
    togglePlay: () => setPlaying((p) => !p),
    next: () => manual((i) => (i + 1) % length),
    prev: () => manual((i) => (i - 1 + length) % length),
  };
}

interface RailProps {
  items: RailItem[];
  active: number;
  onSelect: (index: number) => void;
  className?: string;
}

/**
 * Tarjetas de lo que viene: nunca repite la imagen que ya se ve de fondo.
 * La primera (la próxima en mostrarse) es más grande; el resto, más pequeñas.
 * Solo escritorio: en celulares no se renderiza.
 */
export function HeroCardRail({ items, active, onSelect, className }: RailProps) {
  const upcoming = Array.from({ length: Math.min(items.length - 1, 4) }, (_, k) => (active + 1 + k) % items.length);

  return (
    <ul className={cn('hidden items-end justify-end gap-2 md:flex', className)} aria-label="Próximos servicios">
      {upcoming.map((index, pos) => {
        const item = items[index];
        const isNext = pos === 0;
        return (
          <li
            key={item.id}
            className={cn(
              'relative shrink-0 overflow-hidden rounded-2xl border shadow-xl transition-all duration-700 ease-out animate-in fade-in slide-in-from-right-4',
              isNext ? 'h-[110px] w-[190px] border-secondary/70 lg:h-[130px] lg:w-[230px]' : 'h-[70px] w-[60px] border-white/20 opacity-80 hover:opacity-100 lg:h-[80px] lg:w-[70px]'
            )}
          >
            <button type="button" onClick={() => onSelect(index)} aria-label={`Ver ${item.title}`} className="absolute inset-0 z-10 h-full w-full cursor-pointer" />
            <Image src={item.image} alt="" fill sizes={isNext ? '230px' : '70px'} className="object-cover transition-transform duration-700 hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
            {isNext && (
              <span className="absolute left-2.5 top-2.5 rounded-full border border-white/20 bg-black/45 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-secondary backdrop-blur-md">
                Siguiente
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 p-2 text-white">
              <p className={cn('font-headline font-bold leading-tight', isNext ? 'text-sm' : 'hidden text-[10px] group-hover:block')}>{item.title}</p>
              {isNext && <p className="mt-0.5 line-clamp-1 text-[10px] text-white/75">{item.caption}</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

interface ControlsProps {
  active: number;
  total: number;
  playing: boolean;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  label?: string;
}

export function RailControls({ active, total, playing, onToggle, onPrev, onNext, label = 'Servicio' }: ControlsProps) {
  return (
    <div className="hidden w-full max-w-[440px] items-center justify-between gap-4 rounded-2xl border border-white/15 bg-black/45 p-2.5 backdrop-blur-md md:flex">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onToggle} aria-label={playing ? 'Pausar' : 'Reproducir'} className="rounded-xl bg-white/10 p-2.5 text-white transition hover:bg-secondary">
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">
            {label} {active + 1} / {total}
          </p>
          <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-full origin-left bg-secondary transition-transform duration-500" style={{ transform: `scaleX(${(active + 1) / total})` }} />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onPrev} aria-label="Anterior" className="rounded-xl bg-white/10 p-2.5 text-white transition hover:bg-secondary active:scale-95">
          <ChevronLeft size={18} />
        </button>
        <button type="button" onClick={onNext} aria-label="Siguiente" className="rounded-xl bg-white/10 p-2.5 text-white transition hover:bg-secondary active:scale-95">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
