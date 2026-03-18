'use client';

import Link from 'next/link';
import { Activity, Store } from 'lucide-react';
import type { Stat } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getIconComponent } from '@/lib/icons';

interface HeroProps {
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  stats: Stat[];
}

export function Hero({ heroTitle, heroSubtitle, ctaText, stats }: HeroProps) {
  return (
    <section className="relative min-h-[85vh] pt-12 pb-20 flex flex-col justify-center overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/30 backdrop-blur-2xl border border-primary/40 text-primary text-sm font-bold mb-8">
            <Activity size={16} />
            Muebles Modulares y Acabados Premium
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-6 tracking-tight leading-[1.1] drop-shadow-lg text-foreground">
            {heroTitle.split(' ').map((word, i) => (
              <span key={i} className={i % 3 === 0 ? 'text-primary' : ''}>
                {word}{' '}
              </span>
            ))}
          </h1>
          <p className="text-base md:text-lg font-headline text-primary dark:text-muted-foreground/90 max-w-xl mb-10 leading-relaxed font-bold">
            {heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button asChild size="lg" className="shadow-[0_0_20px_hsl(var(--primary)/0.4)]">
              <Link href="/#contacto">{ctaText}</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="bg-white/80 backdrop-blur-md text-primary border border-primary/30 hover:bg-accent hover:text-white">
              <Link href="/store">
                <Store size={20} /> Comprar Ahora
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 items-center">
          {stats.map((stat) => (
            <Card
              key={stat.id}
              className="p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-transform duration-300 group shadow-xl bg-primary/25 backdrop-blur-2xl border border-primary/40 w-full max-w-[224px] h-[176px] mx-auto"
            >
              <CardContent className="p-0 flex flex-col items-center justify-center">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 border border-primary/30 flex items-center justify-center mb-2 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                  {getIconComponent(stat.icon as any, { size: 24 })}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold font-sans mb-1 text-primary">
                  {stat.value}
                </h3>
                <p className="text-[10px] md:text-xs font-bold tracking-wide text-primary/80 uppercase">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
