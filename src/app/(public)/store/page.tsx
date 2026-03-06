'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ShoppingCart, Store as StoreIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/store/product-card';
import { CartSidebar } from '@/components/store/cart-sidebar';
import { CheckoutModal } from '@/components/store/checkout-modal';
import type { Product } from '@/lib/types';
import { useCart } from '@/context/cart-provider';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { appId } from '@/lib/config';
import { defaultSiteContent } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { getCartCount, setIsCartOpen } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const cartCount = getCartCount();

  useEffect(() => {
    const contentRef = doc(db, 'artifacts', appId, 'public', 'data', 'siteContent', 'mainGM_v3');
    const unsubscribe = onSnapshot(contentRef, (docSnap) => {
      if (docSnap.exists()) {
        setProducts(docSnap.data().products || defaultSiteContent.products);
      } else {
        setProducts(defaultSiteContent.products);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div id="top" className="h-0 pt-28"></div>
      <section className="px-6 py-12 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-border pb-6">
          <div>
            <Button asChild variant="link" className="p-0 text-primary mb-4">
              <Link href="/">
                <ChevronLeft size={16} /> Volver al Inicio
              </Link>
            </Button>
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4">
              Nuestra <span className="text-primary">Tienda</span>
            </h2>
            <p className="text-muted-foreground font-headline text-lg max-w-2xl">
              Descubre nuestra selección de muebles modulares listos para instalar, fabricados con precisión y materiales premium.
            </p>
          </div>
          <Button
            onClick={() => setIsCartOpen(true)}
            variant="outline"
            className="mt-6 md:mt-0 font-bold py-3 px-6 rounded-lg hover:border-primary transition-all flex items-center gap-2 group"
          >
            <ShoppingCart size={18} className="text-primary group-hover:scale-110 transition-transform" />
            Ver Carrito ({cartCount})
          </Button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
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
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-muted-foreground">
            <StoreIcon size={48} className="mx-auto mb-4 opacity-20" />
            <p>No hay productos disponibles por el momento.</p>
          </div>
        )}
      </section>
      <CartSidebar onCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal isOpen={isCheckoutOpen} onOpenChange={setIsCheckoutOpen} />
    </>
  );
}
