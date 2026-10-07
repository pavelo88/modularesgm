'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Filter, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface CatalogProduct {
  id: string;
  sku: string;
  nombre: string;
  descripcion?: string;
  precio?: number;
  precioDescuento?: number;
  dimensiones?: string;
  categoria?: string;
  imagen: string;
  imagenBlurred?: boolean; // true = aplicar blur al fondo
  disponible: boolean;
}

interface CatalogPageProps {
  title: string;
  description: string;
  products: CatalogProduct[];
  backHref?: string;
}

export function CatalogPage({ title, description, products, backHref = '/catalogo' }: CatalogPageProps) {
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  useMemo(() => {
    const filtered = products.filter(p =>
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.descripcion?.toLowerCase().includes(search.toLowerCase()) ?? false)
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex-1">
            <Link href={backHref} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft size={16} /> Volver
            </Link>
            <h1 className="font-headline text-3xl font-bold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex-1 max-w-xs">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por SKU o nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-lg font-semibold text-muted-foreground">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group rounded-2xl overflow-hidden border bg-card shadow-sm hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="relative w-full aspect-square bg-muted overflow-hidden">
                  <Image
                    src={product.imagen}
                    alt={product.nombre}
                    fill
                    className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                      product.imagenBlurred ? 'blur-sm' : ''
                    }`}
                  />
                  {!product.disponible && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">Agotado</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">{product.sku}</p>
                  <h3 className="font-headline font-bold text-sm leading-tight mb-1">{product.nombre}</h3>
                  {product.descripcion && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{product.descripcion}</p>
                  )}

                  {/* Dimensiones */}
                  {product.dimensiones && (
                    <p className="text-xs text-muted-foreground mb-3">📐 {product.dimensiones}</p>
                  )}

                  {/* Precio */}
                  {product.precio && (
                    <div className="flex items-baseline gap-2 mb-4">
                      {product.precioDescuento ? (
                        <>
                          <span className="text-lg font-bold text-secondary">${product.precioDescuento}</span>
                          <span className="text-sm line-through text-muted-foreground">${product.precio}</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold">${product.precio}</span>
                      )}
                    </div>
                  )}

                  <Button variant="outline" size="sm" className="w-full" disabled={!product.disponible}>
                    Consultar Precio
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
