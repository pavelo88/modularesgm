'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { catalogSections } from '@/lib/catalog-data';
import { Button } from '@/components/ui/button';

export default function CatalogIndexPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="font-headline text-5xl font-bold mb-4">Catálogo de Productos</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explora nuestras colecciones de muebles modulares, cocinas, closets y más.
            Cada sección contiene diseños personalizados fabricados en nuestro taller.
          </p>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogSections.map((section) => (
            <Link
              key={section.id}
              href={`/catalogo/${section.id}`}
              className="group relative overflow-hidden rounded-2xl border bg-card p-8 transition-all hover:shadow-lg hover:border-secondary"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <span className="text-xl">📦</span>
                </div>

                <h2 className="font-headline text-2xl font-bold mb-3">{section.label}</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Descubre nuestros diseños exclusivos en esta categoría.
                </p>

                <div className="inline-flex items-center gap-2 text-sm font-bold text-secondary group-hover:gap-3 transition-all">
                  Ver catálogo <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="font-headline text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Todos nuestros productos son personalizables. Contacta con nuestro equipo para diseños a medida.
          </p>
          <Button asChild size="lg">
            <Link href="/contacto">Solicitar Cotización Personalizada</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
