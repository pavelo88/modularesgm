'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Banknote, CreditCard, Loader2, Lock, MapPin, Package, Users, Wallet, ChevronLeft } from 'lucide-react';

import { useCart } from '@/context/cart-provider';
import { useSiteContent } from '@/context/site-content-provider';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { handleCheckout } from '@/lib/actions';
import { Alert } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProductCard } from '@/components/store/product-card';
import { Separator } from '@/components/ui/separator';

const checkoutSchema = z.object({
  name: z.string().min(2, { message: 'Nombre es requerido' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(7, { message: 'Teléfono es requerido' }),
  address: z.string().min(5, { message: 'Dirección es requerida' }),
  paymentMethod: z.enum(['transferencia', 'tarjeta', 'efectivo'], {
    required_error: 'Debe seleccionar un método de pago',
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { siteContent } = useSiteContent();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { name: '', email: '', phone: '', address: '', paymentMethod: 'transferencia' },
  });

  const onSubmit = (data: CheckoutFormValues) => {
    startTransition(async () => {
      const result = await handleCheckout(data, cart);
      if (result.success) {
        toast({
          title: '¡Pedido Registrado!',
          description: 'Gracias por tu compra. Nos contactaremos pronto.',
        });
        clearCart();
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error en el Pedido',
          description: result.error || 'Hubo un problema al procesar tu pedido.',
        });
      }
    });
  };

  const paymentMethod = form.watch('paymentMethod');
  const suggestedProducts = siteContent?.products
    .filter(p => !cart.some(item => item.product.id === p.id))
    .slice(0, 3) || [];

  if (cart.length === 0 && !isPending) {
    return (
        <div className="max-w-2xl mx-auto px-6 py-20 text-center flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
            <Package size={64} className="text-muted-foreground/50 mb-6"/>
            <h2 className="text-3xl font-bold mb-4">Tu carrito está vacío</h2>
            <p className="text-muted-foreground mb-6">Parece que no has añadido nada a tu carrito todavía.</p>
            <Button asChild>
                <Link href="/store">Volver a la Tienda</Link>
            </Button>
        </div>
    )
  }

  return (
    <>
    <div id="top" className="h-0 pt-20"></div>
    <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <Button asChild variant="link" className="p-0 text-primary mb-6">
            <Link href="/store">
            <ChevronLeft size={16} /> Volver a la Tienda
            </Link>
        </Button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold mb-8">Finalizar Compra</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="font-bold flex items-center gap-2"><Users size={18} /> Datos de Facturación y Envío</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold uppercase">Nombre Completo</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold uppercase">Teléfono (WhatsApp)</FormLabel>
                                <FormControl><Input type="tel" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        </div>
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-xs font-bold uppercase">Correo Electrónico</FormLabel>
                            <FormControl><Input type="email" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-xs font-bold uppercase">Dirección de Entrega</FormLabel>
                            <FormControl><Input placeholder="Calle, Ciudad, Provincia..." {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>

                    <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="font-bold flex items-center gap-2"><Wallet size={18} /> Método de Pago</FormLabel>
                            <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 gap-3">
                                <Label className={`flex flex-col border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'transferencia' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="transferencia" id="transferencia" />
                                    <span className="font-bold flex items-center gap-2"><Banknote size={16} className="text-primary" /> Transferencia o Depósito</span>
                                </div>
                                {paymentMethod === 'transferencia' && (
                                    <Alert variant="default" className="mt-3 ml-7 p-3 bg-secondary/10 border-secondary/30 text-sm font-headline">
                                    <p><strong>Banco:</strong> Pichincha</p><p><strong>Titular:</strong> Pablo García</p><p><strong>Cuenta Ahorros:</strong> 2204511945</p>
                                    <p className="text-xs text-muted-foreground mt-2">Un asesor te contactará para validar el comprobante.</p>
                                    </Alert>
                                )}
                                </Label>
                                <Label className={`flex flex-col border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'tarjeta' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="tarjeta" id="tarjeta" />
                                    <span className="font-bold flex items-center gap-2"><CreditCard size={16} className="text-primary" /> Tarjeta de Crédito / Débito</span>
                                </div>
                                {paymentMethod === 'tarjeta' && <p className="mt-2 ml-7 text-xs text-muted-foreground">Un asesor te enviará un Link de Pagos Seguro por WhatsApp.</p>}
                                </Label>
                                <Label className={`flex flex-col border rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'efectivo' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="efectivo" id="efectivo" />
                                    <span className="font-bold flex items-center gap-2"><MapPin size={16} className="text-primary" /> Pago Contra Entrega</span>
                                </div>
                                {paymentMethod === 'efectivo' && <p className="mt-2 ml-7 text-xs text-muted-foreground">Pagas al recibir el producto o en la instalación.</p>}
                                </Label>
                            </RadioGroup>
                            </FormControl>
                        </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isPending || cart.length === 0} className="w-full text-lg" size="lg">
                        {isPending ? (<Loader2 className="mr-2 h-5 w-5 animate-spin" />) : (<Lock size={18} className="mr-2" />)}
                        {isPending ? 'Procesando...' : `Confirmar Pedido de $${getCartTotal().toFixed(2)}`}
                    </Button>
                    </form>
                </Form>
            </div>
            <aside className="lg:col-span-1 space-y-8">
                <div className="p-6 rounded-2xl border bg-card sticky top-24">
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
                    <Package size={18} /> Resumen del Pedido
                    </h3>
                    <ScrollArea className="h-64 pr-3">
                        <div className="space-y-4">
                        {cart.map(item => {
                            const price = item.product.discountPrice || item.product.price;
                            return (
                                <div key={item.product.id} className="flex gap-4">
                                    <Image src={item.product.imgUrl} alt={item.product.title} width={64} height={64} className="w-16 h-16 object-cover rounded-lg border"/>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold leading-tight">{item.product.title}</p>
                                        <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-bold">${(price * item.quantity).toFixed(2)}</p>
                                </div>
                            )
                        })}
                        </div>
                    </ScrollArea>
                    <div className="flex justify-between items-center text-xl font-bold text-primary mt-4 pt-4 border-t">
                        <span>Total:</span>
                        <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                </div>

                {suggestedProducts.length > 0 && (
                    <div className="space-y-4 mt-8">
                        <h3 className="text-lg font-bold">También te podría interesar</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {suggestedProducts.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </aside>
        </div>
    </div>
    </>
  );
}
