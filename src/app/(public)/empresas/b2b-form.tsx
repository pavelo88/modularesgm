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
import { ArrowRight, Loader2, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { track } from '@/lib/analytics';

const b2bSchema = z.object({
  company: z.string().trim().min(2, { message: 'Indique el nombre de la empresa o firma.' }).max(120),
  ruc: z.string().trim().max(20).optional(),
  contactName: z.string().trim().min(2, { message: 'Indique la persona de contacto.' }).max(100),
  position: z.string().trim().max(80).optional(),
  city: z.string().trim().min(2, { message: 'Indique la ciudad del proyecto.' }).max(60),
  phone: z.string().trim().min(7, { message: 'Teléfono o WhatsApp de contacto.' }).max(30),
  email: z.string().trim().email({ message: 'Correo corporativo válido.' }).max(120),
  projectType: z.string().min(2, { message: 'Seleccione o escriba el tipo de proyecto.' }),
  estimatedUnits: z.string().trim().max(50).optional(),
  estimatedBudget: z.string().trim().max(50).optional(),
  details: z.string().trim().min(10, { message: 'Describa brevemente el alcance del proyecto (mínimo 10 caracteres).' }).max(2500),
  website_hp: z.string().optional(),
});

type B2BFormValues = z.infer<typeof b2bSchema>;

export function B2BForm() {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<B2BFormValues>({
    resolver: zodResolver(b2bSchema),
    defaultValues: {
      company: '',
      ruc: '',
      contactName: '',
      position: '',
      city: 'Quito',
      phone: '',
      email: '',
      projectType: 'Torre Residencial (Cocinas & Clósets)',
      estimatedUnits: '',
      estimatedBudget: '',
      details: '',
      website_hp: '',
    },
  });

  function onSubmit(values: B2BFormValues) {
    startTransition(async () => {
      const summaryMsg = `[PROPUESTA B2B EMPRESAS]
Empresa: ${values.company}
RUC: ${values.ruc || 'No especificado'}
Contacto: ${values.contactName} (${values.position || 'Representante'})
Ciudad: ${values.city}
Tipo de Proyecto: ${values.projectType}
Unidades estimadas: ${values.estimatedUnits || 'A definir'}
Presupuesto aprox.: ${values.estimatedBudget || 'Por cotizar'}

Detalles del proyecto:
${values.details}`;

      const res = await handleLeadSubmit({
        name: `${values.company} (${values.contactName})`,
        email: values.email,
        phone: values.phone,
        message: summaryMsg,
        website_hp: values.website_hp,
      });

      if (res.success) {
        track('generate_lead', { form: 'b2b_empresas', company: values.company });
        setIsSuccess(true);
        toast({
          title: '¡Solicitud B2B Registrada con Éxito!',
          description: 'Nuestro departamento corporativo ha recibido el requerimiento para revisión de especificaciones y cotización en volumen.',
        });
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error de Envío',
          description: res.error || 'No se pudo procesar la solicitud corporativa. Intente nuevamente.',
        });
      }
    });
  }

  if (isSuccess) {
    return (
      <div className="p-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 text-center animate-in fade-in-0 duration-300">
        <div className="h-12 w-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={24} />
        </div>
        <h4 className="text-xl font-bold text-foreground mb-2">
          Propuesta en Proceso de Asignación
        </h4>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-6 font-normal">
          Hemos registrado tu requerimiento comercial corporativo en nuestro CRM. Un director de proyectos revisará los alcances técnicos y te contactará en horario de oficina.
        </p>
        <Button
          type="button"
          onClick={() => setIsSuccess(false)}
          variant="outline"
          className="rounded-full text-xs font-bold"
        >
          Enviar otra consulta de proyecto
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Honeypot anti-spam invisible */}
          <div className="hidden">
            <FormField
              control={form.control}
              name="website_hp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} tabIndex={-1} autoComplete="off" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Nombre de Empresa o Razón Social *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Constructora Andina S.A." {...field} className="rounded-xl bg-background/80" />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ruc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">RUC (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="1790000000001" {...field} className="rounded-xl bg-background/80" />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Persona de Contacto *</FormLabel>
                  <FormControl>
                    <Input placeholder="Arq. Roberto Morales" {...field} className="rounded-xl bg-background/80" />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Cargo en la Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Director de Obra / Residente" {...field} className="rounded-xl bg-background/80" />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Ciudad del Proyecto *</FormLabel>
                  <FormControl>
                    <Input placeholder="Quito, Guayaquil, etc." {...field} className="rounded-xl bg-background/80" />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Teléfono / WhatsApp *</FormLabel>
                  <FormControl>
                    <Input placeholder="0991234567" {...field} className="rounded-xl bg-background/80" />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Correo Corporativo *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="compras@empresa.com" {...field} className="rounded-xl bg-background/80" />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="projectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Tipo de Requerimiento *</FormLabel>
                  <FormControl>
                    <Input placeholder="Torre residencial, oficinas, etc." {...field} className="rounded-xl bg-background/80" />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedUnits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Cant. Unidades Aprox.</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. 24 departamentos / 12 oficinas" {...field} className="rounded-xl bg-background/80" />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedBudget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Presupuesto Estimado</FormLabel>
                  <FormControl>
                    <Input placeholder="USD 15,000 - 40,000" {...field} className="rounded-xl bg-background/80" />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-foreground">Detalles del Proyecto & Planos Disponibles *</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Describa el cronograma de obra, especificaciones requeridas (Melamina Pelikano RH, herrajes de cierre suave, mesones de cuarzo) o enlace a planos en la nube..."
                    className="rounded-xl bg-background/80 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 rounded-xl text-xs sm:text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md active:scale-95"
          >
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Registrando requerimiento corporativo...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <span>Enviar Solicitud de Propuesta B2B</span>
                <ArrowRight size={16} />
              </span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
