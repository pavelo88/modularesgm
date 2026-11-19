'use client';

import { useState, useTransition, useContext } from 'react';
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
import { ArrowRight, CheckCircle2, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE, whatsappHref } from '@/lib/site';
import { SiteContentContext } from '@/context/site-content-provider';
import { track } from '@/lib/analytics';

const PROJECT_TYPES = [
  'Cocina Integral',
  'Mesón de Cuarzo',
  'Clóset & Vestidor',
  'Mobiliario Comercial',
  'Remodelación Total',
] as const;

const formSchema = z.object({
  name: z.string().trim().min(2, { message: 'Por favor, ingrese su nombre completo.' }).max(100, { message: 'El nombre es demasiado largo.' }),
  email: z.string().trim().email({ message: 'Ingrese un correo electrónico válido.' }).max(120, { message: 'El correo es demasiado largo.' }),
  phone: z.string().trim().min(7, { message: 'Ingrese un teléfono o WhatsApp de contacto.' }).max(30, { message: 'El teléfono es demasiado largo.' }),
  projectType: z.string().optional(),
  message: z.string().trim().min(10, { message: 'Por favor, detalle brevemente su requerimiento.' }).max(2000, { message: 'El mensaje no puede exceder los 2000 caracteres.' }),
  website_hp: z.string().optional(),
});

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [selectedType, setSelectedType] = useState<string>('Cocina Integral');
  const { toast } = useToast();
  const whatsappNumber = useContext(SiteContentContext)?.siteContent?.whatsappNumber || SITE.phone;
  const [whatsappFollowUp, setWhatsappFollowUp] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      projectType: 'Cocina Integral',
      message: '',
      website_hp: '',
    },
  });

  function handleTypeSelect(type: string) {
    setSelectedType(type);
    form.setValue('projectType', type);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const typePrefix = values.projectType ? `[Proyecto: ${values.projectType}]\n` : '';
      const consolidatedPayload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: `${typePrefix}${values.message}`,
        website_hp: values.website_hp,
      };

      const result = await handleLeadSubmit(consolidatedPayload);
      if (result.success) {
        track('generate_lead', { form: 'cotizacion' });
        toast({
          title: '¡Solicitud Registrada con Éxito!',
          description: 'Gracias. Un asesor técnico se comunicará por WhatsApp en menos de 15 minutos.',
        });
        setWhatsappFollowUp(
          whatsappHref(
            whatsappNumber,
            `Hola Modulares GM, soy ${values.name}. Acabo de pedir una cotización en la web: ${values.message}`
          )
        );
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
    <div className="flex h-full flex-col justify-between rounded-[2rem] border border-stone-300 dark:border-stone-800 bg-white dark:bg-[#12161A] p-5 sm:p-7 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
      <div>
        {/* Cabecera del Formulario */}
        <div className="pb-4 border-b border-stone-200 dark:border-stone-800 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-stone-900 dark:text-stone-100">
              Cotización & Asesoría
            </span>
            <span className="text-stone-400 dark:text-stone-600">·</span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Sin Costo
            </span>
          </div>
          <h3 className="font-headline text-2xl font-semibold text-stone-950 dark:text-white mt-1">
            Inicie su Proyecto
          </h3>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mt-1">
            Seleccione el tipo de proyecto y compártanos sus medidas o ideas iniciales.
          </p>
          <a
            href={whatsappHref(whatsappNumber, '¡Hola Modulares GM! Quisiera cotizar un proyecto a medida y recibir asesoría directa.')}
            target="_blank"
            rel="noopener noreferrer"
            data-location="contact_form_header"
            data-label="Formulario WhatsApp Directo"
            className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all active:scale-95"
          >
            <MessageCircle size={14} />
            <span>¿Prefieres chatear de inmediato? Escríbenos por WhatsApp</span>
          </a>
        </div>

        {/* Formulario */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            data-webmcp-name="ContactForm"
            data-webmcp-description="Formulario oficial de cotización arquitectónica para cocinas modulares, cuarzos, clósets y remodelación integral en Ecuador"
          >
            {/* Honeypot Invisible anti-spam para capturar bots */}
            <div
              aria-hidden="true"
              style={{
                display: 'none',
                opacity: 0,
                position: 'absolute',
                top: 0,
                left: 0,
                height: 0,
                width: 0,
                zIndex: -1,
                pointerEvents: 'none',
              }}
              tabIndex={-1}
            >
              <label htmlFor="website_hp">Website URL (dejar vacío)</label>
              <input
                id="website_hp"
                type="text"
                autoComplete="off"
                tabIndex={-1}
                {...form.register('website_hp')}
              />
            </div>

            {/* Campo: Nombre Completo */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-[0.14em] text-stone-950 dark:text-stone-100">
                    Nombre y Apellido *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej. Arq. Carolina Morales"
                      className="h-11 sm:h-12 rounded-xl border-stone-300 bg-stone-50/70 px-3.5 text-stone-950 font-medium placeholder:text-stone-500 transition-all focus-visible:border-stone-900 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-stone-900 dark:border-stone-700 dark:bg-stone-950/60 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus-visible:border-white dark:focus-visible:bg-stone-950"
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
                    <FormLabel className="text-xs font-bold uppercase tracking-[0.14em] text-stone-950 dark:text-stone-100">
                      Correo Electrónico *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="ejemplo@correo.com"
                        className="h-11 sm:h-12 rounded-xl border-stone-300 bg-stone-50/70 px-3.5 text-stone-950 font-medium placeholder:text-stone-500 transition-all focus-visible:border-stone-900 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-stone-900 dark:border-stone-700 dark:bg-stone-950/60 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus-visible:border-white dark:focus-visible:bg-stone-950"
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
                    <FormLabel className="text-xs font-bold uppercase tracking-[0.14em] text-stone-950 dark:text-stone-100">
                      Teléfono o WhatsApp *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej. 099 123 4567"
                        className="h-11 sm:h-12 rounded-xl border-stone-300 bg-stone-50/70 px-3.5 text-stone-950 font-medium placeholder:text-stone-500 transition-all focus-visible:border-stone-900 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-stone-900 dark:border-stone-700 dark:bg-stone-950/60 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus-visible:border-white dark:focus-visible:bg-stone-950"
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
                  <FormLabel className="text-xs font-bold uppercase tracking-[0.14em] text-stone-950 dark:text-stone-100">
                    Descripción del Espacio o Proyecto *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Indíquenos las dimensiones tentativas, ubicación en Ecuador, materiales de preferencia (ej. cuarzo Calacatta Gold, melamina hidrófuga) o si ya cuenta con planos arquitectónicos..."
                      className="min-h-[85px] resize-none rounded-xl border-stone-300 bg-stone-50/70 p-3.5 text-stone-950 font-medium placeholder:text-stone-500 transition-all focus-visible:border-stone-900 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-stone-900 dark:border-stone-700 dark:bg-stone-950/60 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus-visible:border-white dark:focus-visible:bg-stone-950"
                      data-webmcp-input="projectDetails"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />

            {/* Seguimiento Inmediato por WhatsApp */}
            {whatsappFollowUp && (
              <a
                href={whatsappFollowUp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 text-xs sm:text-sm font-bold text-stone-950 dark:text-white transition-all hover:bg-emerald-500/20 active:scale-[0.98]"
              >
                <MessageCircle size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>¡Recibido! ¿Desea atención inmediata? Continúe por WhatsApp</span>
              </a>
            )}

            {/* Botón de Envío de Alto Contraste */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="h-12 sm:h-13 w-full rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-sm tracking-wide shadow-md active:scale-[0.98] transition-all dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Procesando requerimiento...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar Solicitud (Respuesta en 15 min)</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Indicadores de Confianza & Compromiso al pie del formulario */}
      <div className="mt-5 pt-3.5 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-stone-800 dark:text-stone-200">
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Sin costo ni compromiso</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Sparkles size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Respuesta por WhatsApp &lt;15 min</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Quito, Valles y a nivel nacional</span>
        </span>
      </div>
    </div>
  );
}
