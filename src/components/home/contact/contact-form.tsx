'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const PROJECT_TYPES = [
  'Cocina Integral',
  'Mesón de Cuarzo',
  'Clóset & Vestidor',
  'Mobiliario Comercial',
  'Remodelación Total',
] as const;

const formSchema = z.object({
  name: z.string().min(2, { message: 'Por favor, ingrese su nombre completo.' }),
  email: z.string().email({ message: 'Ingrese un correo electrónico válido.' }),
  phone: z.string().min(7, { message: 'Ingrese un teléfono o WhatsApp de contacto.' }),
  projectType: z.string().optional(),
  message: z.string().min(10, { message: 'Por favor, detalle brevemente su requerimiento.' }),
});

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [selectedType, setSelectedType] = useState<string>('Cocina Integral');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      projectType: 'Cocina Integral',
      message: '',
    },
  });

  function handleTypeSelect(type: string) {
    setSelectedType(type);
    form.setValue('projectType', type);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      // Formateamos el mensaje consolidando el tipo de proyecto seleccionado
      const typePrefix = values.projectType ? `[Proyecto: ${values.projectType}]\n` : '';
      const consolidatedPayload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: `${typePrefix}${values.message}`,
      };

      const result = await handleLeadSubmit(consolidatedPayload);
      if (result.success) {
        toast({
          title: '¡Solicitud Arquitectónica Registrada!',
          description: 'Gracias. Un asesor técnico revisará sus requerimientos y se comunicará en menos de 24h.',
        });
        form.reset();
        setSelectedType('Cocina Integral');
      } else {
        toast({
          variant: 'destructive',
          title: 'Error de Envío',
          description: result.error || 'No se pudo procesar la solicitud. Intente nuevamente.',
        });
      }
    });
  }

  return (
    <div className="flex h-full flex-col justify-between rounded-[2rem] border border-stone-200/80 bg-white/90 p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.03)] backdrop-blur-xl dark:border-stone-800/80 dark:bg-stone-900/60">
      <div>
        {/* Cabecera del Formulario */}
        <div className="pb-4 border-b border-stone-200/80 dark:border-stone-800 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
              Cotización & Asesoría
            </span>
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
              Sin Costo
            </span>
          </div>
          <h3 className="font-headline text-2xl font-semibold text-stone-900 dark:text-stone-100 mt-1">
            Inicie su Proyecto
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Seleccione el tipo de proyecto y compártanos sus medidas o ideas iniciales.
          </p>
        </div>

        {/* Selector de Tipo de Proyecto (Chips interactivos) */}
        <div className="mb-6">
          <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400 mb-2.5">
            Tipo de Proyecto o Superficie
          </label>
          <div className="flex flex-wrap gap-2">
            {PROJECT_TYPES.map((type) => {
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeSelect(type)}
                  className={cn(
                    'text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all duration-200 select-none active:scale-95',
                    isSelected
                      ? 'border-secondary bg-secondary text-stone-950 font-semibold shadow-sm ring-2 ring-secondary/30'
                      : 'border-stone-200 bg-stone-50/80 text-stone-700 hover:border-stone-300 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-950/40 dark:text-stone-300 dark:hover:border-stone-700'
                  )}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Formulario */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            data-webmcp-name="ContactForm"
            data-webmcp-description="Formulario oficial de cotización arquitectónica para cocinas modulares, cuarzos, clósets y remodelación integral en Ecuador"
          >
            {/* Campo: Nombre Completo */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                    Nombre y Apellido *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej. Arq. Carolina Morales"
                      className="h-11 sm:h-12 rounded-xl border-stone-200 bg-stone-50/50 px-3.5 text-stone-900 transition-all focus-visible:border-secondary focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-secondary/50 dark:border-stone-800 dark:bg-stone-950/40 dark:text-stone-100 dark:focus-visible:border-secondary dark:focus-visible:bg-stone-950"
                      data-webmcp-input="fullName"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* Grid 2 Columnas: Email & Teléfono */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                      Correo Electrónico *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="ejemplo@correo.com"
                        className="h-11 sm:h-12 rounded-xl border-stone-200 bg-stone-50/50 px-3.5 text-stone-900 transition-all focus-visible:border-secondary focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-secondary/50 dark:border-stone-800 dark:bg-stone-950/40 dark:text-stone-100 dark:focus-visible:border-secondary dark:focus-visible:bg-stone-950"
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
                    <FormLabel className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                      Teléfono o WhatsApp *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej. 099 123 4567"
                        className="h-11 sm:h-12 rounded-xl border-stone-200 bg-stone-50/50 px-3.5 text-stone-900 transition-all focus-visible:border-secondary focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-secondary/50 dark:border-stone-800 dark:bg-stone-950/40 dark:text-stone-100 dark:focus-visible:border-secondary dark:focus-visible:bg-stone-950"
                        data-webmcp-input="phoneNumber"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            {/* Campo: Mensaje / Detalle del Proyecto */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                    Descripción del Espacio o Proyecto *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Indíquenos las dimensiones tentativas, ubicación en Ecuador, materiales de preferencia (ej. cuarzo Calacatta Gold, melamina hidrófuga) o si ya cuenta con planos arquitectónicos..."
                      className="min-h-[110px] resize-none rounded-xl border-stone-200 bg-stone-50/50 p-3.5 text-stone-900 transition-all focus-visible:border-secondary focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-secondary/50 dark:border-stone-800 dark:bg-stone-950/40 dark:text-stone-100 dark:focus-visible:border-secondary dark:focus-visible:bg-stone-950"
                      data-webmcp-input="projectDetails"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* Botón de Envío con Micro-interacción */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="h-12 sm:h-13 w-full rounded-xl bg-stone-900 text-sm font-semibold tracking-wide text-white shadow-md transition-all duration-200 hover:bg-stone-800 active:scale-[0.98] dark:bg-secondary dark:text-stone-950 dark:hover:bg-secondary/90 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Procesando requerimiento...</span>
                  </>
                ) : (
                  <>
                    <span>Solicitar Asesoría & Cotización</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Indicadores de Confianza & Compromiso al pie del formulario */}
      <div className="mt-6 pt-4 border-t border-stone-200/80 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-500 dark:text-stone-400">
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-secondary shrink-0" />
          <span>Sin compromiso comercial</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Sparkles size={13} className="text-secondary shrink-0" />
          <span>Respuesta técnica en 24h</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Atención a nivel nacional</span>
        </span>
      </div>
    </div>
  );
}
