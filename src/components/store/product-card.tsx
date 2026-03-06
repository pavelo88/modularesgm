'use client';

import Image from 'next/image';
import { Plus } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/cart-provider';
import { Badge } from '@/components/ui/badge';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <Card className="group rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 flex flex-col h-full border-transparent hover:border-primary/30">
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
            OFERTA
          </Badge>
        )}
        <Badge className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white">
          {product.category}
        </Badge>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col">
        <CardTitle className="text-lg mb-2 line-clamp-2">{product.title}</CardTitle>
        <p className="text-xs text-muted-foreground font-headline mb-6 flex-1 line-clamp-3">
          {product.desc}
        </p>
      </CardContent>
      <CardFooter className="flex items-end justify-between mt-auto pt-4 border-t">
        <div>
          {product.discountPrice ? (
            <>
              <p className="text-[10px] text-muted-foreground line-through">${product.price}</p>
              <p className="text-xl font-bold text-primary">${product.discountPrice}</p>
            </>
          ) : (
            <p className="text-xl font-bold text-primary">${product.price}</p>
          )}
        </div>
        <Button
          size="icon"
          className="shrink-0 bg-foreground text-background hover:bg-primary"
          onClick={() => addToCart(product)}
          aria-label={`Add ${product.title} to cart`}
        >
          <Plus size={18} />
        </Button>
      </CardFooter>
    </Card>
  );
}
