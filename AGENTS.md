# AGENTS.md — Reglas del equipo (humanos y agentes de IA)

Este archivo lo lee cualquier herramienta o agente que trabaje en el repo
(Claude Code, Codex, Antigravity, OpenClaw, Hermes, etc.). Es el "idioma común" del equipo.

## Proyecto
Sitio de Modulares GM (Quito, Ecuador). Next.js (App Router) desplegado en Vercel desde `main`.
Dominio canónico: `https://www.modularesgm.com` (el dominio sin www redirige con 308).

## Regla SEO obligatoria antes de cerrar una tarea o hacer commit

Si tocaste algo en `src/app/**`, `src/components/**`, `next.config.ts`, rutas, metadatos,
`sitemap.ts` o `robots.ts`:

1. Levanta el sitio (`npm run dev`, puerto 9002).
2. Ejecuta `npm run seo-audit -- --base http://localhost:9002`.
3. Si hay `errores`, corrígelos y vuelve a ejecutar hasta quedar en 0.
4. Revisa `seo-reports/latest.md` (los `avisos` se reportan, no bloquean).

Para auditar producción: `npm run seo-audit`.

### Reglas que el auditor protege
- El sitemap solo lista URLs que responden **200** (nunca redirecciones ni noindex).
- Cada página indexable tiene `<title>`, meta description, un `<h1>` y canonical propio **en el HTML inicial**
  (no solo después de hidratar: ojo con `useSearchParams` + `Suspense`, el `fallback` es lo que ven los rastreadores).
- Redirecciones permanentes: 301/308, nunca 302/307.
- Sin enlaces internos rotos ni páginas huérfanas.

## Convenciones
- Commits en español, estilo `tipo(ámbito): resumen`.
- No mezclar en un commit cambios ajenos a la tarea (revisa `git status` antes de `git add`).
- Documentación de cambios grandes en `docs/NN_Titulo.md` (siguiente número libre).

## Traspaso entre agentes
Al terminar, añade 2–4 líneas a `docs/agent-handoff.md`: qué hiciste, qué quedó pendiente,
qué debe revisar el siguiente. Léelo al empezar. Así los agentes "conversan" sin depender de la herramienta.

## Marketing compartido y cuentas publicitarias

Estas reglas son obligatorias para Codex, Antigravity, Claude Code y cualquier otro agente que trabaje en pauta:

- Lee primero [`docs/21_Plan_Pauta_Dos_Proyectos.md`](docs/21_Plan_Pauta_Dos_Proyectos.md) y las últimas entradas de `docs/agent-handoff.md`.
- Mantén dos operaciones separadas: **Modulares GM** solo para Ecuador y **Vermilion Routes** para EEUU, Reino Unido y Europa. No mezcles nombres, perfiles, propiedades GA4, públicos, conversiones, landings, teléfonos, presupuestos ni campañas.
- Estado observado el 2026-11-19: el Perfil de Negocio de Modulares GM está verificado y aparece vinculado a Ads `3411962066`; Ads `301-085-7341` aparece como Vermilion Routes. Confirmar el nombre real de `3411962066` antes de cambiar vínculos.
- No desvincules, vincules, concedas permisos, guardes facturación ni publiques campañas sin autorización explícita de Pablo en el chat para esa acción concreta.
- Antes de lanzar anuncios, confirma con el jefe de cada proyecto: cuenta Ads, propiedad GA4, mercado, objetivo, presupuesto diario/mensual, coste máximo por lead y responsable de responder.
- Antes de invertir, valida eventos `generate_lead` y `whatsapp_click`, consentimiento, política de privacidad, términos, landing, teléfono, horarios y promesas comerciales.
- No presentes hipótesis, simulaciones o testimonios sintéticos como resultados reales. No prometas rendimiento ni afirmes “somos los mejores” como hecho comprobado.
- El plan ejecutivo y los presupuestos de referencia están en `docs/21_Plan_Pauta_Dos_Proyectos.md`. Es una propuesta para decisión de los jefes, no autorización de gasto.
- El sistema integral de marketing, contenidos, automatización, producción audiovisual y medición está en `docs/22_Sistema_Integral_Marketing_Automatizado.md`.
