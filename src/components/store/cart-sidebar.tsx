'use client';

import Image from 'next/image';
import { Minus, Plus, ShoppingCart, Trash2, X, Package } from 'lucide-react';
import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

export function CartSidebar({
  onCheckout,
}: {
  onCheckout: () => void;
}) {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    getCartTotal,
  } = useCart();

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    onCheckout();
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart /> Tu Carrito
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full pr-4">
            {cart.length === 0 ? (
              <div className="text-center text-muted-foreground mt-20 flex flex-col items-center gap-4">
                <Package size={48} className="opacity-20" />
                <p>Tu carrito está vacío.</p>
                <SheetClose asChild>
                  <Button asChild variant="link">
                    <Link href="/store">Ir a la Tienda</Link>
                  </Button>
                </SheetClose>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => {
                  const price = item.product.discountPrice || item.product.price;
                  return (
                    <div key={item.product.id} className="flex gap-4 items-center">
                      <Image
                        src={item.product.imgUrl}
                        alt={item.product.title}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm line-clamp-2">
                          {item.product.title}
                        </h4>
                        <p className="text-primary font-bold mt-1">${price.toFixed(2)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.product.id, -1)}
                            >
                              <Minus size={14} />
                            </Button>
                            <span className="px-3 text-xs font-bold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.product.id, 1)}
                            >
                              <Plus size={14} />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive h-7 w-7"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
        {cart.length > 0 && (
          <SheetFooter className="bg-muted/50 p-6 -m-6 mt-6">
            <div className="w-full">
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-muted-foreground">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
              <Button
                onClick={handleCheckoutClick}
                className="w-full bg-secondary text-secondary-foreground"
                size="lg"
              >
                Proceder al Pago
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
