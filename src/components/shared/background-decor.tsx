'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';

export function BackgroundDecor() {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 tech-grid-bg-light dark:tech-grid-bg-dark" />
      {/* Decoración sutil de luz */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 dark:bg-primary/10 blur-[150px] rounded-full opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 dark:bg-secondary/10 blur-[150px] rounded-full opacity-50" />
    </div>
  );
}

export function HeroBackground({ heroMediaUrl }: { heroMediaUrl?: string }) {
    return (
        <div className="fixed inset-0 -z-40 pointer-events-none">
            {/* Dark gradient backdrop to prevent image flickering */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#19242D]/80 via-transparent to-[#19242D]" />
        </div>
    );
}

