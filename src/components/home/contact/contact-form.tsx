'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleLeadSubmit } from '@/lib/actions';
import { Info, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  name: z.string().min(2, { message: 'El nombre es requerido.' }),
  email: z.string().email({ message: 'Correo electrónico inválido.' }),
  phone: z.string().min(7, { message: 'El teléfono es requerido.' }),
  message: z.string().min(10, { message: 'Por favor, detalle su proyecto.' }),
});

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await handleLeadSubmit(values);
      if (result.success) {
        toast({
          title: '¡Solicitud Enviada!',
          description: 'Gracias, hemos recibido su solicitud. Nos contactaremos pronto.',
        });
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error de Envío',
          description: result.error,
        });
      }
    });
  }

  return (
    <div className="bg-background/50 backdrop-blur-xl h-full flex flex-col rounded-2xl p-6 md:p-8 shadow-xl border">
      <Alert className="bg-secondary/10 border-secondary/30 text-secondary-foreground mb-6">
        <Info className="h-4 w-4 text-secondary" />
        <AlertTitle className="font-headline font-bold text-secondary">Visita Técnica</AlertTitle>
        <AlertDescription className="font-headline text-sm leading-relaxed">
          Las valoraciones en sitio tienen un costo de $20. Si concretamos el trabajo, este valor formará parte del anticipo.
        </AlertDescription>
      </Alert>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider">Nombre Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Tu nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider">Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="tu@correo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider">Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu número de teléfono" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider">Detalle su Proyecto</FormLabel>
                <FormControl>
                  <Textarea placeholder="Ej: Necesito remodelar mi cocina..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="w-full" size="lg">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Procesando...' : 'Solicitar Cotización'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
