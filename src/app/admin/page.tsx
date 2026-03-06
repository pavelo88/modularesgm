'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition } from 'react';
import { Home, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { login } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const formSchema = z.object({
  password: z.string().min(1, { message: 'La contraseña es requerida.' }),
});

export default function AdminLoginPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await login(values.password);
      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Acceso Denegado',
          description: result.error,
        });
      }
    });
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
              <Lock size={24} />
            </div>
          </div>
          <CardTitle className="text-2xl">Panel de Administración</CardTitle>
          <CardDescription>Ingrese su contraseña para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                {isPending ? 'Verificando...' : 'Ingresar'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button variant="link" asChild className="w-full">
            <Link href="/"><Home className="mr-2 h-4 w-4"/>Volver al sitio principal</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
