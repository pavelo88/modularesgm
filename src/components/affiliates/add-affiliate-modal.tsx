'use client';

import React, { useState } from 'react';
import { UserPlus, CheckCircle2, AlertCircle, Loader2, Sparkles, User, Mail, CreditCard, Phone, AtSign } from 'lucide-react';
import { createDownlineAffiliateAction } from '@/lib/affiliate-register-actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddAffiliateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sponsorUsername: string;
  onAffiliateCreated?: () => void;
}

export function AddAffiliateModal({
  open,
  onOpenChange,
  sponsorUsername,
  onAffiliateCreated,
}: AddAffiliateModalProps) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [cedula, setCedula] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const resetForm = () => {
    setName('');
    setUsername('');
    setEmail('');
    setCedula('');
    setPhone('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!loading) {
      if (!nextOpen) resetForm();
      onOpenChange(nextOpen);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !username.trim() || !email.trim() || !cedula.trim()) {
      setErrorMsg('Por favor llena todos los campos obligatorios (*).');
      return;
    }

    if (cedula.trim().length < 6) {
      setErrorMsg('La cédula debe tener al menos 6 dígitos (servirá de contraseña temporal).');
      return;
    }

    setLoading(true);
    try {
      const res = await createDownlineAffiliateAction({
        sponsorUsername,
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        cedula: cedula.trim(),
        phone: phone.trim() || undefined,
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Error al crear el afiliado.');
        setLoading(false);
        return;
      }

      setSuccessMsg(res.message || 'Afiliado registrado con éxito.');
      onAffiliateCreated?.();
      setTimeout(() => {
        handleOpenChange(false);
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border border-stone-200 dark:border-stone-800 bg-background/95 p-6 backdrop-blur-2xl shadow-2xl">
        <DialogHeader className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/12 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]">
              <UserPlus size={20} />
            </span>
            <div>
              <DialogTitle className="text-lg font-bold tracking-tight text-foreground font-headline">
                Registrar Nuevo Afiliado
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Quedará vinculado directamente bajo tu patrocinio (@{sponsorUsername}).
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <p className="leading-relaxed font-semibold">{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-foreground">
              Nombre Completo <span className="text-primary">*</span>
            </Label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Carlos Mendoza"
                className="h-10 rounded-xl pl-9 text-xs"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">
                Usuario / Código <span className="text-primary">*</span>
              </Label>
              <div className="relative">
                <AtSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                  placeholder="carlos.m"
                  className="h-10 rounded-xl pl-9 text-xs font-mono"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-foreground">
                Cédula / DNI <span className="text-primary">*</span>
              </Label>
              <div className="relative">
                <CreditCard size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value.trim())}
                  placeholder="1723456789"
                  className="h-10 rounded-xl pl-9 text-xs font-mono"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-foreground">
              Correo Electrónico <span className="text-primary">*</span>
            </Label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="carlos@correo.com"
                className="h-10 rounded-xl pl-9 text-xs"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-foreground">Teléfono / WhatsApp (Opcional)</Label>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0991234567"
                className="h-10 rounded-xl pl-9 text-xs"
                disabled={loading}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-muted/40 p-3 text-[11px] leading-relaxed text-muted-foreground">
            <p className="flex items-center gap-1.5 font-medium text-foreground mb-0.5">
              <Sparkles size={13} className="text-primary" /> Clave de acceso automático:
            </p>
            El nuevo afiliado ingresará por primera vez con su cédula como contraseña y el sistema le solicitará cambiar su clave de forma segura.
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
              className="h-10 rounded-xl px-4 text-xs font-medium"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-10 rounded-xl px-5 text-xs font-bold active:scale-95 transition-all shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <UserPlus size={14} className="mr-1.5" />
                  Registrar Afiliado
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
