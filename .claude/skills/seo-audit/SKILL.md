---
name: seo-audit
description: Ejecuta el auditor SEO del proyecto (scripts/seo-audit.mjs), interpreta el informe y corrige los errores antes de cerrar una tarea o hacer commit. Úsalo siempre que cambies rutas, metadatos, sitemap, robots, redirecciones, o páginas públicas.
---

# seo-audit

1. Si vas a auditar cambios locales, asegúrate de que el dev server corre en `http://localhost:9002`
   (`npm run dev`, o `preview_start` con la config `dev`). Para producción no hace falta.
2. Ejecuta:
   - local: `npm run seo-audit -- --base http://localhost:9002`
   - producción: `npm run seo-audit`
3. Lee la salida y `seo-reports/latest.md`. Cada incidencia lista las URLs afectadas.
4. Corrige primero los `error` (bloquean el commit), luego los `warn` si son baratos de arreglar.
5. Repite hasta tener 0 errores. Resume al usuario qué encontraste y qué corregiste.

## Notas
- Audita el HTML inicial (sin ejecutar JavaScript), igual que la primera pasada de Googlebot.
- En `next dev` el HTML trae contenido extra de streaming: un `H1_MULTIPLE` en local puede ser falso
  positivo; confírmalo contra producción tras desplegar.
- Qué incidencias bloquean se define en `severityOf()` dentro del script.
- Reglas completas del equipo: `AGENTS.md`.
