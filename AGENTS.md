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
