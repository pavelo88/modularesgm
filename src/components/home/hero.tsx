'use client';

import Link from 'next/link';
import { Activity, Store } from 'lucide-react';
import type { Stat } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getIconComponent } from '@/lib/icons';
import { cn } from '@/lib/utils';

interface HeroProps {
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  stats: Stat[];
}

export function Hero({ heroTitle, heroSubtitle, ctaText, stats }: HeroProps) {
  return (
    <section className="relative min-h-[85vh] pt-24 pb-20 flex flex-col justify-center overflow-hidden z-10">
      {/* Contenedor de Cristal para el Hero en Modo Claro */}
      <div className={cn(
        "max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 w-full grid lg:grid-cols-2 gap-16 items-center rounded-[2.5rem] border transition-all duration-500",
        "bg-primary/20 backdrop-blur-2xl border-white/30 shadow-2xl",
        "dark:bg-transparent dark:border-transparent dark:backdrop-blur-none dark:shadow-none"
      )}>
        <div className="flex flex-col items-start text-left">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold mb-8 transition-all",
            "bg-primary/30 backdrop-blur-2xl border-primary/40 text-primary",
            "dark:bg-white/10 dark:border-white/20 dark:text-white"
          )}>
            <Activity size={16} />
            Muebles Modulares y Acabados Premium
          </div>
          
          <h1 className={cn(
            "text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-6 tracking-tight leading-[1.1] transition-all",
            "text-primary drop-shadow-xl", // Azul Teal Intenso en Claro
            "dark:text-white dark:drop-shadow-none"
          )}>
            {heroTitle.split(' ').map((word, i) => (
              <span key={i} className={i % 3 === 0 ? 'opacity-90' : 'dark:text-primary'}>
                {word}{' '}
              </span>
            ))}
          </h1>
          
          <p className={cn(
            "text-base md:text-lg font-headline max-w-xl mb-10 leading-relaxed font-bold transition-all",
            "text-primary/90", // Texto Teal oscuro para legibilidad
            "dark:text-muted-foreground/90"
          )}>
            {heroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button asChild size="lg" className="shadow-[0_0_25px_hsl(var(--primary)/0.5)] h-14 px-8 text-base">
              <Link href="/#contacto">{ctaText}</Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="secondary" 
              className={cn(
                "h-14 px-8 text-base backdrop-blur-md transition-all",
                "bg-white/40 text-primary border-primary/50 hover:bg-primary hover:text-white",
                "dark:bg-white/80 dark:text-primary dark:border-primary/30 dark:hover:bg-accent dark:hover:text-white"
              )}
            >
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
              className={cn(
                "p-4 rounded-3xl flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-all duration-300 group shadow-xl w-full max-w-[224px] h-[176px] mx-auto border",
                "bg-primary/20 backdrop-blur-xl border-white/40",
                "dark:bg-[#19242D] dark:border-[#B88E44]/30 dark:backdrop-blur-none"
              )}
            >
              <CardContent className="p-0 flex flex-col items-center justify-center">
                <div className={cn(
                  "w-12 h-12 md:w-14 md:h-14 rounded-full border flex items-center justify-center mb-2 transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white",
                  "bg-white/30 border-primary/30 text-primary",
                  "dark:bg-white/20 dark:border-primary/30 dark:text-primary"
                )}>
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
