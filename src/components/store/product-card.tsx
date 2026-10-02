'use client';

import Image from 'next/image';
import { Plus, Ruler, Package } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/cart-provider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const PRICE_UNIT_LABEL: Record<string, string> = {
  metro_lineal: '/ m. lineal',
  metro_cuadrado: '/ m²',
  unidad: '',
};

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const unitLabel = product.priceUnit ? (PRICE_UNIT_LABEL[product.priceUnit] ?? '') : '';
  const isOutOfStock = product.inStock === false;

  return (
    <Card className={cn(
      "group rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 flex flex-col h-full border-transparent hover:border-primary/30",
      isOutOfStock && "opacity-60"
    )}>
      <CardHeader className="p-0 relative h-56">
        <Image
          src={product.imgUrl}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          data-ai-hint={product.category}
        />
        {product.discountPrice && (
          <Badge variant="destructive" className="absolute top-4 right-4 shadow-lg">
            -{Math.round((1 - product.discountPrice / product.price) * 100)}%
          </Badge>
        )}
        <Badge className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white">
          {product.category}
        </Badge>
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge variant="outline" className="text-white border-white text-xs font-bold">
              Sin stock
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-6 flex-1 flex flex-col gap-2">
        <CardTitle className="text-lg mb-1 line-clamp-2">{product.title}</CardTitle>
        {product.subcategory && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary/70">{product.subcategory}</p>
        )}
        <p className="text-xs text-muted-foreground font-headline flex-1 line-clamp-3">
          {product.desc}
        </p>
        <div className="flex flex-col gap-1 mt-2">
          {product.dimensions && (
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Ruler size={11} className="text-primary/60 shrink-0" />
              {product.dimensions}
            </p>
          )}
          {product.material && (
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Package size={11} className="text-primary/60 shrink-0" />
              {product.material}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-end justify-between mt-auto pt-4 border-t">
        <div>
          {product.discountPrice ? (
            <>
              <p className="text-[10px] text-muted-foreground line-through">
                ${product.price}{unitLabel}
              </p>
              <p className="text-xl font-bold text-primary">
                ${product.discountPrice}
                {unitLabel && <span className="text-xs font-normal ml-0.5">{unitLabel}</span>}
              </p>
            </>
          ) : (
            <p className="text-xl font-bold text-primary">
              {product.price > 0 ? (
                <>
                  ${product.price}
                  {unitLabel && <span className="text-xs font-normal ml-0.5">{unitLabel}</span>}
                </>
              ) : (
                <span className="text-base">Consultar precio</span>
              )}
            </p>
          )}
        </div>
        <Button
          size="icon"
          className="shrink-0 bg-foreground text-background hover:bg-primary active:scale-95 transition-all"
          onClick={() => addToCart(product)}
          aria-label={`Agregar ${product.title} al carrito`}
          disabled={isOutOfStock}
        >
          <Plus size={18} />
        </Button>
      </CardFooter>
    </Card>
  );
}
