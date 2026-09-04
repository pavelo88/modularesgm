'use client';

import type { Stat } from '@/lib/types';
import { HeroSlider } from './hero-slider/hero-slider';

interface HeroProps {
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  stats: Stat[];
}

export function Hero({ heroTitle, heroSubtitle, ctaText, stats }: HeroProps) {
  return (
    <HeroSlider 
      heroTitle={heroTitle}
      heroSubtitle={heroSubtitle}
      ctaText={ctaText}
      stats={stats}
    />
  );
}

