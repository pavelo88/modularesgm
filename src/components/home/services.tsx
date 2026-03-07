'use client';
import type { Service } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { getIconComponent, IconName } from '@/lib/icons';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function Services({ services }: { services: Service[] }) {
  const { toast } = useToast();

  const handleServiceClick = (service: Service) => {
    toast({
      title: 'Función en desarrollo',
      description: `La interacción con el chatbot para "${service.title}" estará disponible pronto.`,
    })
  }

  return (
    <section id="soluciones" className="px-6 py-24 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-headline font-bold mb-6">
          Diseños a <span className="text-primary">Medida</span>
        </h2>
        <p className="text-muted-foreground font-headline text-lg max-w-2xl mx-auto">
          Proyectos personalizados para transformar espacios vacíos en ambientes funcionales y llenos de estilo.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((service, index) => {
          const isLarge = index === 0 || index === 3 || index === 6;
          return (
            <Card
              key={service.id}
              onClick={() => handleServiceClick(service)}
              className={cn(
                'group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 h-[320px]',
                isLarge ? 'lg:col-span-2' : 'col-span-1'
              )}
            >
              <Image
                src={service.imgUrl}
                alt={service.title}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105 opacity-50 group-hover:opacity-100"
                data-ai-hint="interior design"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
              <CardContent className="relative z-10 p-6 h-full flex flex-col justify-end">
                <div className="w-12 h-12 rounded-lg bg-card shadow-md border border-secondary/50 flex items-center justify-center mb-4 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                  {getIconComponent(service.icon as IconName, { size: 24 })}
                </div>
                <h3
                  className={cn(
                    'font-bold mb-2 group-hover:text-primary transition-colors text-card-foreground',
                    isLarge ? 'text-3xl font-headline' : 'text-xl font-headline'
                  )}
                >
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm font-headline line-clamp-3 group-hover:text-primary transition-colors">
                  {service.desc}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
