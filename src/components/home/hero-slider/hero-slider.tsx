'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Store, 
  Pause, 
  Play, 
  CheckCircle2 
} from 'lucide-react';
import { HERO_SLIDES, type HeroSlide } from './hero-slider-data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Stat } from '@/lib/types';

interface HeroSliderProps {
  heroTitle?: string;
  heroSubtitle?: string;
  ctaText?: string;
  stats?: Stat[];
}

export function HeroSlider({ heroTitle, heroSubtitle, ctaText, stats }: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSlide = HERO_SLIDES[activeIndex];

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPlaying && !isHovered) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 6000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, nextSlide]);

  return (
    <section 
      className="relative w-full min-h-[92vh] lg:min-h-screen flex flex-col justify-between overflow-hidden pt-24 pb-12 select-none z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Destacados de Servicios"
    >
      {/* 1. Dynamic Background Image Cross-Fade */}
      <div className="absolute inset-0 -z-30 pointer-events-none overflow-hidden">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-all duration-1000 ease-out transform",
              idx === activeIndex
                ? "opacity-100 scale-100 z-10"
                : "opacity-0 scale-105 z-0"
            )}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-center transition-transform duration-1000 scale-100"
            />
            {/* Subtle Gradient Overlays - Optimized for image vibrancy & text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#19242D] via-[#19242D]/20 to-black/20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 tech-grid-bg-dark opacity-40 pointer-events-none -z-20" />

      {/* 2. Main Hero Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto relative z-20">
        
        {/* Left Column: Details Panel */}
        <div className="lg:col-span-7 flex flex-col items-start text-left pt-4 sm:pt-6 w-full">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border text-[11px] sm:text-sm font-bold mb-4 sm:mb-6 backdrop-blur-md bg-secondary/20 border-secondary/50 text-secondary shadow-lg animate-in fade-in slide-in-from-top-4 duration-500 max-w-full truncate">
            <Sparkles size={14} className="text-secondary animate-pulse shrink-0" />
            <span className="truncate">{currentSlide.badge}</span>
          </div>

          {/* Slide Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-3 sm:mb-4 tracking-tight leading-[1.15] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] break-words max-w-full">
            {currentSlide.title}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg lg:text-xl font-headline font-semibold text-secondary mb-3 sm:mb-4 drop-shadow-md leading-snug">
            {currentSlide.subtitle}
          </p>

          {/* Description */}
          <p className="text-xs sm:text-base lg:text-lg font-sans max-w-2xl mb-4 sm:mb-6 leading-relaxed text-zinc-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] line-clamp-3 sm:line-clamp-none">
            {currentSlide.description}
          </p>

          {/* Tag Pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
            {currentSlide.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-semibold text-white/90 shadow-md"
              >
                <CheckCircle2 size={12} className="text-secondary shrink-0" />
                {tag}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Button 
              asChild 
              size="lg" 
              className="shadow-[0_0_30px_hsl(var(--primary)/0.6)] h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold gap-2 active:scale-95 transition-all w-full sm:w-auto"
            >
              <Link href={currentSlide.ctaPrimary.href}>
                {ctaText || currentSlide.ctaPrimary.text}
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 backdrop-blur-md shadow-lg gap-2 active:scale-95 transition-all w-full sm:w-auto"
            >
              <Link href={currentSlide.ctaSecondary.href}>
                <Store size={16} />
                {currentSlide.ctaSecondary.text}
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Column: Mini Stats Grid & Quick Nav */}
        <div className="lg:col-span-5 hidden lg:grid grid-cols-2 gap-4">
          {(stats || []).map((stat) => (
            <div
              key={stat.id}
              className="p-5 rounded-2xl flex flex-col items-center justify-center text-center bg-black/40 backdrop-blur-md border border-white/15 shadow-2xl hover:border-secondary/50 transition-all duration-300 group"
            >
              <p className="text-3xl font-bold font-sans text-secondary drop-shadow-md mb-1">
                {stat.value}
              </p>
              <p className="text-xs font-bold tracking-wider uppercase text-zinc-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bottom HUD & Thumbnail Carousel */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mt-8 grid lg:grid-cols-12 items-end gap-6 relative z-20">
        
        {/* Navigation Controls HUD */}
        <div className="lg:col-span-5 flex items-center justify-between bg-black/50 backdrop-blur-md border border-white/15 p-3 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-secondary text-white transition-colors"
              aria-label={isPlaying ? "Pausar presentación" : "Reproducir presentación"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                Servicio {activeIndex + 1} / {HERO_SLIDES.length}
              </span>
              {/* Progress bar */}
              <div className="w-28 h-1.5 bg-white/20 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-secondary transition-all duration-500 ease-out"
                  style={{ width: `${((activeIndex + 1) / HERO_SLIDES.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="p-3 rounded-xl bg-white/10 hover:bg-secondary text-white transition-all active:scale-95"
              aria-label="Servicio anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="p-3 rounded-xl bg-white/10 hover:bg-secondary text-white transition-all active:scale-95"
              aria-label="Siguiente servicio"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Interactive Thumbnail Previews */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={slide.id}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "relative h-20 rounded-xl overflow-hidden text-left p-2.5 border transition-all duration-300 flex flex-col justify-end group active:scale-95",
                  isActive
                    ? "border-secondary ring-2 ring-secondary/50 shadow-xl scale-[1.02]"
                    : "border-white/15 opacity-70 hover:opacity-100 hover:border-white/40 bg-black/40"
                )}
              >
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  sizes="200px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <span className="relative z-10 text-[10px] font-bold uppercase tracking-wider text-secondary">
                  0{idx + 1}
                </span>
                <span className="relative z-10 text-xs font-bold text-white truncate font-headline">
                  {slide.title.split(' ')[0]} {slide.title.split(' ')[1] || ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
