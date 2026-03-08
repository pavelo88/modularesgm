'use client';

import { useState } from 'react';
import { LayoutGrid, Store as StoreIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/store/product-card';
import { CartSidebar } from '@/components/store/cart-sidebar';
import { useCart } from '@/context/cart-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useSiteContent } from '@/context/site-content-provider';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export default function StorePage() {
  const { siteContent, loading } = useSiteContent();
  const { selectedCategory, setSelectedCategory } = useCart();
  
  const products = siteContent?.products || [];
  
  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <>
      <div id="top" className="h-0 pt-20"></div>
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <aside className="md:col-span-1 hidden md:block">
            <Card className="p-4 sticky top-24">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 px-2">
                <LayoutGrid size={20} className="text-primary"/>
                Categorías
              </h3>
              <div className="flex flex-col items-start gap-1">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
                ) : (
                  categories.map(category => (
                    <Button
                      key={category}
                      variant="ghost"
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "w-full justify-start text-base",
                        selectedCategory === category && "bg-muted font-bold text-primary"
                      )}
                    >
                      {category}
                    </Button>
                  ))
                )}
              </div>
            </Card>
          </aside>

          <main className="md:col-span-3">
            <div className="mb-12 border-b border-border pb-6">
              <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4">
                Nuestra <span className="text-primary">Tienda</span>
              </h2>
              <p className="text-muted-foreground font-headline text-lg max-w-2xl">
                Descubre nuestra selección de muebles modulares listos para instalar, fabricados con precisión y materiales premium.
              </p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-[224px] w-full rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                    <div className="flex justify-between items-center pt-4">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-10 w-10 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts && filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-muted-foreground">
                <StoreIcon size={48} className="mx-auto mb-4 opacity-20" />
                <p>No hay productos en esta categoría.</p>
              </div>
            )}
          </main>
        </div>
      </div>
      <CartSidebar />
    </>
  );
}
