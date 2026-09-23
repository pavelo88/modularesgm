'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition } from 'react';

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
import { Loader2 } from 'lucide-react';

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
    <div className="flex h-full flex-col rounded-[2rem] border border-white/20 bg-white/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl dark:border-white/10 dark:bg-black/40 md:p-10 lg:p-12">
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-6"
          data-webmcp-name="ContactForm"
          data-webmcp-description="Formulario oficial de cotización para cocinas modulares, cuarzos, clósets y remodelación integral en Ecuador"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Nombre Completo</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ej. Ana María Pérez" 
                    className="h-14 rounded-xl border-zinc-200 bg-white/50 px-4 text-zinc-900 transition-all focus-visible:border-primary focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-primary dark:border-zinc-800 dark:bg-black/50 dark:text-white dark:focus-visible:border-secondary dark:focus-visible:bg-black dark:focus-visible:ring-secondary" 
                    data-webmcp-input="fullName" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="tu@correo.com" 
                      className="h-14 rounded-xl border-zinc-200 bg-white/50 px-4 text-zinc-900 transition-all focus-visible:border-primary focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-primary dark:border-zinc-800 dark:bg-black/50 dark:text-white dark:focus-visible:border-secondary dark:focus-visible:bg-black dark:focus-visible:ring-secondary" 
                      data-webmcp-input="emailAddress" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Teléfono o WhatsApp</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="099 123 4567" 
                      className="h-14 rounded-xl border-zinc-200 bg-white/50 px-4 text-zinc-900 transition-all focus-visible:border-primary focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-primary dark:border-zinc-800 dark:bg-black/50 dark:text-white dark:focus-visible:border-secondary dark:focus-visible:bg-black dark:focus-visible:ring-secondary" 
                      data-webmcp-input="phoneNumber" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Detalle su Proyecto</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Ej. Me gustaría remodelar la cocina de mi departamento. Necesito mesones de cuarzo y cajones amplios..." 
                    className="min-h-[120px] resize-none rounded-xl border-zinc-200 bg-white/50 p-4 text-zinc-900 transition-all focus-visible:border-primary focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-primary dark:border-zinc-800 dark:bg-black/50 dark:text-white dark:focus-visible:border-secondary dark:focus-visible:bg-black dark:focus-visible:ring-secondary" 
                    data-webmcp-input="projectDetails" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <div className="pt-2">
            <Button 
              type="submit" 
              disabled={isPending} 
              className="h-14 w-full rounded-xl bg-primary text-base font-bold text-white shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl active:scale-[0.98] dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/90"
            >
              {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isPending ? 'Enviando solicitud...' : 'Solicitar Cotización sin Costo'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

