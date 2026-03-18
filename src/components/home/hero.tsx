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
    <section className="relative min-h-[90vh] pt-20 pb-20 flex flex-col justify-center overflow-hidden z-10">
      {/* Contenedor Casi Totalmente Transparente en Claro */}
      <div className={cn(
        "max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 w-full grid lg:grid-cols-2 gap-16 items-center rounded-[2.5rem] transition-all duration-500",
        "bg-transparent backdrop-blur-none border-none shadow-none",
        "dark:bg-transparent dark:border-transparent dark:backdrop-blur-none dark:shadow-none"
      )}>
        <div className="flex flex-col items-start text-left">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold mb-8 transition-all",
            "bg-primary/40 backdrop-blur-2xl border-primary/50 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]",
            "dark:bg-white/10 dark:border-white/20 dark:text-white"
          )}>
            <Activity size={16} />
            Muebles Modulares y Acabados Premium
          </div>
          
          <h1 className={cn(
            "text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-6 tracking-tight leading-[1.1] transition-all",
            "text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]", 
            "dark:text-white dark:drop-shadow-none"
          )}>
            {heroTitle.split(' ').map((word, i) => (
              <span key={i} className={i % 3 === 0 ? 'opacity-100' : 'dark:text-primary'}>
                {word}{' '}
              </span>
            ))}
          </h1>
          
          <p className={cn(
            "text-base md:text-lg font-headline max-w-xl mb-10 leading-relaxed font-bold transition-all",
            "text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]", 
            "dark:text-muted-foreground/90 dark:drop-shadow-none"
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
                "h-14 px-8 text-base backdrop-blur-md transition-all border-2",
                "bg-white/40 text-white border-white/60 hover:bg-primary hover:text-white drop-shadow-md",
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
                "p-4 rounded-3xl flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-all duration-300 group w-full max-w-[224px] h-[176px] mx-auto border",
                "bg-primary/5 backdrop-blur-sm border-white/10 shadow-xl",
                "dark:bg-[#19242D] dark:border-[#B88E44]/30 dark:backdrop-blur-none dark:shadow-none"
              )}
            >
              <CardContent className="p-0 flex flex-col items-center justify-center">
                <div className={cn(
                  "w-12 h-12 md:w-14 md:h-14 rounded-full border flex items-center justify-center mb-2 transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white",
                  "bg-white/20 border-white/30 text-white",
                  "dark:bg-white/20 dark:border-primary/30 dark:text-primary"
                )}>
                  {getIconComponent(stat.icon as any, { size: 24 })}
                </div>
                {/* VALORES GRANDES CON SOMBRA DE ALTO CONTRASTE */}
                <h3 className={cn(
                  "text-3xl md:text-4xl font-bold font-sans mb-1 transition-all",
                  "text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]",
                  "dark:text-primary dark:drop-shadow-none"
                )}>
                  {stat.value}
                </h3>
                {/* ETIQUETAS EN BLANCO INTENSO */}
                <p className={cn(
                  "text-[10px] md:text-xs font-bold tracking-wide uppercase transition-all",
                  "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]",
                  "dark:text-primary dark:drop-shadow-none"
                )}>
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
