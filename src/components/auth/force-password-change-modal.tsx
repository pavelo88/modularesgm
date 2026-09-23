'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePassword, getAuth } from 'firebase/auth';
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
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { markPasswordChanged } from '@/lib/affiliate-actions';

const passwordSchema = z.object({
  password: z.string().min(8, 'Debe tener al menos 8 caracteres'),
  confirm: z.string()
}).refine(data => data.password === data.confirm, {
  message: "Las contraseñas no coinciden",
  path: ["confirm"]
});

export function ForcePasswordChangeModal({ isOpen }: { isOpen: boolean }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirm: '' }
  });

  if (!isOpen) return null;

  async function onSubmit(values: z.infer<typeof passwordSchema>) {
    setIsPending(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('No hay usuario autenticado');

      await updatePassword(user, values.password);
      
      const idToken = await user.getIdToken();
      await markPasswordChanged(idToken);
      
      toast({
        title: '¡Clave actualizada!',
        description: 'Tu nueva clave ha sido guardada con éxito.',
      });
      
      router.refresh(); // Recarga para quitar el modal
    } catch (err: any) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'No se pudo actualizar la clave',
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-8 shadow-2xl dark:bg-[#19242D]">
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Cambio de Clave Obligatorio
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Has iniciado sesión con tu número de cédula. Por seguridad, debes establecer una contraseña definitiva.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400">
                    Nueva Contraseña
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Mínimo 8 caracteres" {...field} className="dark:bg-black/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400">
                    Confirmar Contraseña
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Repite tu contraseña" {...field} className="dark:bg-black/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90 text-white">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Actualizar y Continuar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
