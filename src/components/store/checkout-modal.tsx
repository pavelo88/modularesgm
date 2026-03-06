'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Banknote, CreditCard, Loader2, Lock, MapPin, Package, Users, Wallet, XCircle } from 'lucide-react';
import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { handleCheckout } from '@/lib/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '../ui/scroll-area';

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

export function CheckoutModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { cart, getCartTotal, clearCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      paymentMethod: 'transferencia',
    },
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
        onOpenChange(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Finalizar Compra</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-8">
              <div className="p-4 rounded-xl border bg-muted/50">
                <h3 className="font-bold mb-2 flex items-center gap-2 text-sm">
                  <Package size={16} /> Resumen del Pedido ({cart.length} items)
                </h3>
                <div className="flex justify-between items-center text-lg font-bold text-primary mt-2 pt-2 border-t">
                  <span>Total a Pagar:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
              </div>

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
              <Button type="submit" disabled={isPending} className="w-full text-lg" size="lg">
                {isPending ? (<Loader2 className="mr-2 h-5 w-5 animate-spin" />) : (<Lock size={18} className="mr-2" />)}
                {isPending ? 'Procesando...' : 'Confirmar Pedido Seguro'}
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
