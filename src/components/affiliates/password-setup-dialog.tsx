'use client';

import { useId, useState } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, type User } from 'firebase/auth';
import { Check, Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { markPasswordChanged } from '@/lib/affiliate-actions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  /** Usuario de Firebase; si no se pasa, se usa la sesión actual. */
  user?: User | null;
  /** Pedir la contraseña actual (portal). En el primer ingreso ya se acaba de iniciar sesión con la cédula. */
  askCurrent?: boolean;
  /** Se llama cuando la clave quedó guardada y se mostró la confirmación. */
  onDone: () => void;
}

const RULES = [
  { id: 'len', label: '8 o más caracteres', test: (p: string) => p.length >= 8 },
  { id: 'case', label: 'Mayúscula y minúscula', test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { id: 'num', label: 'Al menos un número', test: (p: string) => /\d/.test(p) },
];

/** 0-4: reglas cumplidas + un punto extra por largo (12+) o símbolo. */
function strengthOf(p: string) {
  if (!p) return 0;
  const met = RULES.filter((r) => r.test(p)).length;
  const bonus = p.length >= 12 || /[^A-Za-z0-9]/.test(p) ? 1 : 0;
  return Math.min(4, met + (met === RULES.length ? bonus : 0));
}

const STRENGTH_LABEL = ['', 'Débil', 'Regular', 'Buena', 'Excelente'];
const STRENGTH_COLOR = ['bg-muted', 'bg-red-500', 'bg-amber-500', 'bg-lime-500', 'bg-emerald-500'];

export function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  autoFocus,
  invalid,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  placeholder?: string;
  autoFocus?: boolean;
  invalid?: boolean;
}) {
  const id = useId();
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-invalid={invalid || undefined}
          className={cn(
            'h-11 w-full rounded-xl bg-background/60 pl-3.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground/60',
            'shadow-[0_0_0_1px_hsl(var(--border))] outline-none transition-shadow duration-150',
            'focus:shadow-[0_0_0_2px_hsl(var(--primary))]',
            invalid && 'shadow-[0_0_0_1px_hsl(var(--destructive))] focus:shadow-[0_0_0_2px_hsl(var(--destructive))]'
          )}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="absolute right-0.5 top-0.5 grid h-10 w-10 place-items-center rounded-lg text-muted-foreground transition-colors duration-150 hover:text-foreground active:scale-95"
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}

/** Medidor de fortaleza + reglas. Solo se anima transform/opacity (rápido y fluido). */
export function StrengthMeter({ value }: { value: string }) {
  const score = strengthOf(value);
  return (
    <div aria-live="polite" className="-mt-1 space-y-2">
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
            <span
              className={cn(
                'block h-full origin-left rounded-full transition-transform duration-200 ease-emil-out motion-reduce:transition-none',
                score >= i ? 'scale-x-100' : 'scale-x-0',
                STRENGTH_COLOR[Math.max(score, 1)]
              )}
            />
          </span>
        ))}
        <span className="w-16 text-right text-[11px] font-medium text-muted-foreground">{STRENGTH_LABEL[score]}</span>
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {RULES.map((r) => {
          const ok = r.test(value);
          return (
            <li
              key={r.id}
              className={cn('flex items-center gap-1.5 text-[11px] transition-colors duration-150', ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground')}
            >
              <Check size={12} strokeWidth={3} className={cn('transition-opacity duration-150', ok ? 'opacity-100' : 'opacity-30')} />
              {r.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Cambio de contraseña obligatorio (clave inicial = cédula). No se puede cerrar hasta guardarla.
 * Sustituye a los dos cuadros anteriores: uno no se cerraba al terminar y el otro era muy básico.
 */
export function PasswordSetupDialog({ open, user, askCurrent = false, onDone }: Props) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const mismatch = confirm.length > 0 && next !== confirm;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const target = user ?? auth.currentUser;
    if (!target) return setError('Tu sesión expiró. Vuelve a iniciar sesión.');
    if (next.length < 8) return setError('La nueva contraseña debe tener al menos 8 caracteres.');
    if (next !== confirm) return setError('Las contraseñas no coinciden.');
    if (askCurrent && next === current) return setError('La nueva contraseña debe ser distinta a la actual.');

    setBusy(true);
    try {
      if (askCurrent) {
        await reauthenticateWithCredential(target, EmailAuthProvider.credential(target.email || '', current));
      }
      await updatePassword(target, next);
      await markPasswordChanged(await target.getIdToken(true));
      setDone(true);
      setTimeout(onDone, 1100);
    } catch (err: any) {
      const code: string = err?.code || '';
      setError(
        /wrong-password|invalid-credential/.test(code)
          ? 'La contraseña actual no es correcta.'
          : code === 'auth/requires-recent-login'
            ? 'Por seguridad, cierra sesión, vuelve a entrar y repite el cambio.'
            : code === 'auth/weak-password'
              ? 'Esa contraseña es demasiado débil. Prueba con una más larga.'
              : 'No se pudo guardar la contraseña. Intenta nuevamente.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        // No se puede cerrar: hay que definir la clave. El botón X del primitivo se oculta.
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className={cn(
          'z-[100] w-[calc(100%-2rem)] max-w-[26rem] gap-0 overflow-hidden rounded-2xl border-0 bg-card p-0 [&>button]:hidden',
          'shadow-[0_0_0_1px_hsl(var(--border)/0.7),0_28px_70px_-16px_rgb(0_0_0/0.65)]'
        )}
      >
        <div className="bg-[radial-gradient(120%_90%_at_50%_-30%,hsl(var(--primary)/0.22),transparent_62%)] px-7 pb-2 pt-8 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]">
            {done ? <ShieldCheck size={22} /> : <KeyRound size={22} />}
          </div>
          <DialogTitle className="mt-4 font-headline text-[1.6rem] font-bold leading-tight tracking-tight">
            {done ? '¡Todo listo!' : 'Crea tu contraseña'}
          </DialogTitle>
          <DialogDescription className="mx-auto mt-1.5 max-w-[19rem] text-[13px] leading-relaxed text-muted-foreground">
            {done
              ? 'Tu contraseña personal quedó guardada. Te llevamos a tu portal.'
              : 'Entraste con tu cédula. Por seguridad, elige una contraseña propia antes de continuar.'}
          </DialogDescription>
        </div>

        {done ? (
          <div className="grid place-items-center px-7 pb-9 pt-5">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 animate-in zoom-in-75 fade-in-0 duration-300 motion-reduce:animate-none">
              <Check size={28} strokeWidth={2.5} />
            </span>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 px-7 pb-7 pt-5">
            {askCurrent && (
              <PasswordField label="Contraseña actual" value={current} onChange={setCurrent} autoComplete="current-password" autoFocus />
            )}
            <PasswordField
              label="Nueva contraseña"
              value={next}
              onChange={setNext}
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              autoFocus={!askCurrent}
            />

            <StrengthMeter value={next} />

            <PasswordField
              label="Repite la contraseña"
              value={confirm}
              onChange={setConfirm}
              autoComplete="new-password"
              placeholder="Escríbela otra vez"
              invalid={mismatch}
            />
            {mismatch && <p className="-mt-2 text-xs text-destructive">Las contraseñas no coinciden.</p>}

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-destructive/10 px-3.5 py-2.5 text-[13px] leading-snug text-destructive shadow-[inset_0_0_0_1px_hsl(var(--destructive)/0.25)]"
              >
                {error}
              </p>
            )}

            <Button type="submit" size="lg" disabled={busy} className="h-11 w-full rounded-xl text-[15px] font-semibold">
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {busy ? 'Guardando…' : 'Guardar y continuar'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
