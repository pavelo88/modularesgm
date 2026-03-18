'use client';
import type { Service } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { getIconComponent, IconName } from '@/lib/icons';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export function Services({ services }: { services: Service[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 2500, stopOnInteraction: true }),
  ]);

  const ServiceCard = ({ service }: { service: Service }) => (
    <Card
      className={cn(
        'group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 h-[320px]',
        'bg-[#19242D] border-white/5 shadow-2xl'
      )}
    >
      <Image
        src={service.imgUrl}
        alt={service.title}
        fill
        className="object-cover transition-all duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-80"
        data-ai-hint="interior design"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#19242D] via-[#19242D]/40 to-transparent"></div>
      <CardContent className="relative z-10 p-6 h-full flex flex-col justify-end">
        <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-md shadow-md border border-secondary/50 flex items-center justify-center mb-4 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
          {getIconComponent(service.icon as IconName, { size: 24 })}
        </div>
        <h3 className='font-bold mb-2 group-hover:text-secondary transition-colors text-[#F5F1E5] text-xl font-headline'>
          {service.title}
        </h3>
        <p className="text-[#F5F1E5]/70 text-sm font-headline line-clamp-3 transition-colors">
          {service.desc}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <section id="soluciones" className="py-20 relative z-10 px-4 md:px-0">
      {/* Contenedor de Cristal Azul Suave para la sección */}
      <div className={cn(
        "max-w-7xl mx-auto rounded-[2.5rem] py-16 border transition-all duration-500",
        "bg-primary/10 backdrop-blur-xl border-white/20 shadow-2xl",
        "dark:bg-transparent dark:border-transparent dark:backdrop-blur-none dark:shadow-none"
      )}>
        <div className="text-center mb-12 px-6">
          <h2 className={cn(
            "text-4xl md:text-5xl font-headline font-bold mb-6 transition-all",
            "text-primary drop-shadow-xl",
            "dark:text-white"
          )}>
            Diseños a <span className="dark:text-primary">Medida</span>
          </h2>
          <p className={cn(
            "font-headline text-lg max-w-2xl mx-auto font-bold transition-all",
            "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]",
            "dark:text-muted-foreground dark:drop-shadow-none"
          )}>
            Proyectos personalizados para transformar espacios vacíos en ambientes funcionales y llenos de estilo.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 lg:px-12">
          {services.map((service) => (
            <Link href="/store" key={service.id}>
              <ServiceCard service={service} />
            </Link>
          ))}
        </div>
        
        {/* Mobile Carousel */}
        <div className="md:hidden overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {services.map((service) => (
              <div key={service.id} className="flex-grow-0 flex-shrink-0 basis-[85%] min-w-0 pl-4">
                <Link href="/store">
                  <ServiceCard service={service} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
