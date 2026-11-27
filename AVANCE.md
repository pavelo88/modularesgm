## [2026-11-27] - Modulares GM - Antigravity
**Qué se hizo:** Despliegue de imagen de marca oficial 3D y blindaje definitivo de previsualización en WhatsApp y redes sociales:
1. Generación de `public/og-image.jpg` y `src/app/opengraph-image.jpg` a partir de la imagen oficial de marca en 3D ("GM", "MODULARES GM", "18 AÑOS de experiencia", "DISEÑO • FABRICACIÓN • ACABADOS").
2. Formato estricto **Baseline JPEG** (`progressive: false`) de 131 KB y 1200x630 px con submuestreo croma 4:2:0, garantizando lectura inmediata en los scrapers de WhatsApp y decodificadores móviles.
3. Inyección estática obligatoria en el `<head>` de `RootLayout` (`src/app/layout.tsx`) con etiquetas directas `og:image`, `og:image:secure_url`, `og:title`, `og:description`, `og:type` y `twitter:image` en los primeros 1,000 bytes del stream.
4. Validación técnica completa: `npx tsc --noEmit` (0 errores), `npm run build` (27/27 páginas y rutas estáticas compiladas con éxito) y `npm run seo-audit` (31 URLs rastreadas, 0 errores, 0 avisos).
**Resultado:** Cada vez que se comparta `https://www.modularesgm.com` o cualquier subpágina en WhatsApp, Facebook, Twitter, Telegram o iMessage, se renderiza la tarjeta de marca con el logotipo volumétrico 3D de Modulares GM, título y descripción sin depender de renderizado JS.
**Skills usadas/modificadas:** 01_architecture_quality_agent, 02_development_agent, registrar-avance.
**Próximos pasos:** Despliegue a producción mediante `git push origin main`.
**Archivos modificados:** `public/og-image.jpg`, `public/og-image.png`, `src/app/opengraph-image.jpg`, `src/app/twitter-image.jpg`, `src/app/layout.tsx`, `docs/agent-handoff.md`, `AVANCE.md`.

## [2026-11-27] - Modulares GM - Antigravity
**Qué se hizo:** Rediseño integral del hero de afiliados (`AffiliateHero`), integración de fotografías de equipos reales mestizos, optimización A+ de titles (50-60 caracteres) y expansión exhaustiva de `llms.txt` con preguntas y respuestas directas para motores de IA.
**Resultado:** Hero de afiliados alineado al estándar corporativo y de la Home: fondo luminoso con viñeta suave (`to-black/25`), eliminado el riel invasivo de tarjetas, selector sutil de fotos en esquina inferior derecha con rotación de los 5 equipos (emprendedores, arquitectos, inmobiliarias, técnicos, diseñadores). Certificado con 0 errores TypeScript, 0 errores/avisos en auditoría SEO y build de producción exitoso.
**Skills usadas/modificadas:** modularidad-archivos, registrar-avance, agency-aeo-foundations-architect.
**Próximos pasos:** Despliegue en producción mediante git push a `main`.
**Archivos modificados:** `src/components/affiliates/affiliate-hero.tsx`, `src/app/(public)/afiliados/page.tsx`, `src/app/(public)/afiliados/layout.tsx`, `src/app/(public)/empresas/page.tsx`, páginas sectoriales B2B, `public/llms.txt`, `public/llms-full.txt`, `docs/agent-handoff.md`.

## [2026-11-18] - Modulares GM - Codex
**Qué se hizo:** Rediseño de la experiencia móvil del hero y la barra inferior.
**Resultado:** WhatsApp ahora destaca en verde, los stats quedan debajo del primer viewport, el H1 sube y el texto/CTA baja; se aclaró el centro del overlay.
**Skills usadas/modificadas:** modularidad-archivos, registrar-avance.
**Próximos pasos:** Revisar visualmente en un dispositivo móvil real y ajustar si se desea más o menos separación vertical.
**Archivos modificados:** C:\dev\proyectos\modularesgm\src\components\home\hero-slider\hero-slider.tsx; C:\dev\proyectos\modularesgm\src\components\layout\mobile-bottom-nav.tsx.

## [2026-11-18] - Modulares GM - Codex
**Qué se hizo:** Auditoría y corrección de la medición de conversiones a WhatsApp para pauta.
**Resultado:** Eliminado el doble conteo en enlaces que tenían tracking manual y global; ahora los eventos incluyen término UTM, referrer, click ID, indicador UTM y producto del modal de catálogo. `generate_lead` también queda disponible en dataLayer.
**Skills usadas/modificadas:** modularidad-archivos, registrar-avance.
**Próximos pasos:** Confirmar en GA4 Tiempo real y DebugView una visita con UTMs antes de activar campañas.
**Archivos modificados:** C:\dev\proyectos\modularesgm\src\lib\analytics.ts; C:\dev\proyectos\modularesgm\src\components\shared\whatsapp-analytics-tracker.tsx; C:\dev\proyectos\modularesgm\src\components\catalog\catalogo-explorer.tsx; componentes de CTA WhatsApp.

## [2026-11-18] - Modulares GM - Codex
**Qué se hizo:** Corregida la accesibilidad del menú lateral móvil y refinado el encabezado del panel admin para mostrar “Modulares GM” con el nombre claro de cada sección.
**Resultado:** El warning de Radix desaparece al incluir un `SheetTitle` oculto; el header móvil ya muestra “Analítica”, “Directorio de Usuarios & Roles” y las demás secciones bajo la marca. Se añadieron señales metadata generales para buscadores.
**Skills usadas/modificadas:** modularidad-archivos, registrar-avance.
**Próximos pasos:** Verificar el panel en un teléfono real y configurar conversiones/consentimiento antes de activar Google Ads.
**Archivos modificados:** C:\dev\proyectos\modularesgm\src\components\ui\sidebar.tsx; C:\dev\proyectos\modularesgm\src\components\admin\admin-header-utils.ts; C:\dev\proyectos\modularesgm\src\components\admin\dashboard-client.tsx; C:\dev\proyectos\modularesgm\src\app\layout.tsx.

## [2026-11-19] - Modulares GM - Codex
**Qué se hizo:** Auditada la separación de cuentas de Google Ads y Google Business para Modulares GM y Vermilion Routes; preparado plan ejecutivo de pauta para ambos proyectos.
**Resultado:** Modulares GM aparece verificado en Business Profile y vinculado a `3411962066`; `301-085-7341` aparece como Vermilion Routes. Se documentaron arquitectura correcta, permisos, presupuestos de prueba, bloqueos legales/técnicos y decisiones para los jefes.
**Skills usadas/modificadas:** modularidad-archivos, registrar-avance.
**Próximos pasos:** Confirmar el nombre real de `3411962066`, corregir la relación GA4-Ads si corresponde y aprobar presupuesto/mercado antes de publicar campañas.
**Archivos modificados:** C:\dev\proyectos\modularesgm\docs\21_Plan_Pauta_Dos_Proyectos.md.

## [2026-11-19] - Modulares GM - Codex
**Qué se hizo:** Creado el manual integral de marketing automatizado para ambas marcas.
**Resultado:** Quedaron documentados Google Ads/Business, Meta Ads, TikTok Ads, SEO/IA, producción de imágenes y videos, CRM, automatizaciones, medición, permisos, presupuestos y roadmap de 90 días.
**Skills usadas/modificadas:** modularidad-archivos, registrar-avance.
**Próximos pasos:** Los jefes deben aprobar cuentas, mercados, presupuestos y campañas concretas antes de publicar.
**Archivos modificados:** C:\dev\proyectos\modularesgm\docs\22_Sistema_Integral_Marketing_Automatizado.md; C:\dev\proyectos\modularesgm\AGENTS.md; C:\dev\proyectos\modularesgm\docs\agent-handoff.md.

## [2026-11-19] - Modulares GM - Codex
**Qué se hizo:** Preparado el sitio para pauta con consentimiento previo y carga condicionada de Meta Pixel; añadido soporte opcional para Google Ads y eventos de consentimiento.
**Resultado:** `npx tsc --noEmit` y `npm run build` correctos (25/25 rutas). El Perfil de Negocio de Modulares está verificado; se intentó publicar el catálogo, pero Google exigió una imagen válida y el borrador se descartó sin publicar.
**Skills usadas/modificadas:** modularidad-archivos, registrar-avance.
**Próximos pasos:** Definir `NEXT_PUBLIC_GOOGLE_ADS_ID` y `NEXT_PUBLIC_META_PIXEL_ID` en Vercel, conectar TikTok desde `/admin` y publicar el catálogo con una imagen aceptada por Google.
**Archivos modificados:** C:\dev\proyectos\modularesgm\src\app\layout.tsx; C:\dev\proyectos\modularesgm\src\components\shared\consent-manager.tsx.
## [2026-11-19] - Modulares GM - Codex
**Qué se hizo:** Se eliminó la plantilla `.env.example` y se dejó un único archivo `.env` con las variables públicas de analítica y espacios para los identificadores que aún no están disponibles.
**Resultado:** El valor confirmado de GA4 quedó preparado; no se inventó un `AW-...` porque no existe en el repositorio ni en los datos revisados.
**Skills usadas/modificadas:** reglas-seguridad, registrar-avance.
**Próximos pasos:** Obtener en Google Ads la etiqueta de Google con formato `AW-XXXXXXXXXX` y el ID del Meta Pixel; después pegarlos en Vercel.
**Archivos modificados:** C:\dev\proyectos\modularesgm\.env; C:\dev\proyectos\modularesgm\.env.example; C:\dev\proyectos\modularesgm\AVANCE.md.
## [2026-11-26] - Modulares GM - Codex
**Qué se hizo:** Audité el HTML indexable, sitemap, robots, metadatos, JSON-LD y recursos para buscadores/IA; reforcé intención local y categorías de servicio.
**Resultado:** Auditoría SEO local en 22 URLs con 0 errores y 0 avisos; TypeScript sin errores y build de producción 25/25 rutas.
**Skills usadas/modificadas:** reglas-seguridad, modularidad-archivos, registrar-avance.
**Próximos pasos:** Verificar en Search Console y Google Business Profile las áreas atendidas, reseñas y datos reales antes de invertir; revisar términos de búsqueda semanalmente.
**Archivos modificados:** C:\dev\proyectos\modularesgm\src\app\layout.tsx; C:\dev\proyectos\modularesgm\src\components\home\home-seo-content.tsx; C:\dev\proyectos\modularesgm\src\components\shared\seo-structured-data.tsx; C:\dev\proyectos\modularesgm\public\llms.txt.

## [2026-11-27] - Modulares GM - Codex
**Qué se hizo:** Preparé una dirección artística para unificar contrastes en modo claro/oscuro y mantener el footer permanentemente oscuro, revisando los tokens globales, el layout público, el footer y las rutas públicas.
**Resultado:** Detecté una base cromática ya existente de caliza/obsidiana/bronce, pero fragmentada por colores directos; propuse sumar verde petróleo como acento secundario controlado para B2B e información, sin tocar todavía el código visual.
**Skills usadas/modificadas:** reglas-seguridad, registrar-avance.
**Próximos pasos:** Convertir el plan aprobado en tokens de superficie, rediseñar el footer oscuro y auditar cada familia de páginas en ambos modos con verificación visual y SEO.
**Archivos modificados:** C:\dev\proyectos\modularesgm\AVANCE.md; C:\dev\proyectos\modularesgm\docs\agent-handoff.md.

## [2026-11-27] - Modulares GM - Codex
**Qué se hizo:** Ejecutada la dirección artística local: footer oscuro permanente, tokens editoriales de obsidiana/papel/bronce, nueva banda verde petróleo y alternancia de superficies en home, contacto, garantías, catálogo y destacados.
**Resultado:** Revisión visual en `http://localhost:9002` en modo claro y oscuro; el footer conserva fondo oscuro en ambos. TypeScript, build y auditoría SEO pasaron correctamente: 31 URLs, 0 errores y 0 avisos; no se publicó a producción.
**Skills usadas/modificadas:** reglas-seguridad, modularidad-archivos, computer-use, registrar-avance.
**Próximos pasos:** Revisar con Pablo si desea extender el tratamiento papel/petróleo a más módulos internos del portal de afiliados o admin; el servidor local queda disponible en el puerto 9002.
**Archivos modificados:** C:\dev\proyectos\modularesgm\src\app\globals.css; C:\dev\proyectos\modularesgm\src\components\layout\footer.tsx; C:\dev\proyectos\modularesgm\src\components\home\contact\contact-section.tsx; C:\dev\proyectos\modularesgm\src\components\home\contact\contact-info.tsx; C:\dev\proyectos\modularesgm\src\components\home\contact\contact-form.tsx; C:\dev\proyectos\modularesgm\src\components\home\services.tsx; C:\dev\proyectos\modularesgm\src\components\home\trust-guarantee-section.tsx; C:\dev\proyectos\modularesgm\src\components\home\storefront-sections.tsx; C:\dev\proyectos\modularesgm\src\components\catalog\catalog-page.tsx.

## [2026-11-27] - Modulares GM - Codex
**Qué se hizo:** Reparé la vista local después de detectar que `next build` y `next dev` habían tocado `.next` simultáneamente, dejando manifiestos de desarrollo incompletos.
**Resultado:** Se limpió únicamente la caché generada `.next`, se reinició `npm run dev` y `http://localhost:9002/` volvió a responder 200 y mostrar la home. Queda visible solo el aviso conocido de Next por conflicto de `favicon.ico`, ajeno al rediseño.
**Skills usadas/modificadas:** reglas-seguridad, computer-use, registrar-avance.
**Próximos pasos:** Si se desea eliminar el indicador “1 Issue”, resolver por separado el conflicto existente entre `public/favicon.ico` y la ruta de favicon de App Router.
**Archivos modificados:** C:\dev\proyectos\modularesgm\.next (caché generada eliminada y recreada por Next).

## [2026-11-27] - Modulares GM - Codex
**Qué se hizo:** Ajusté el contraste artístico en héroes, contacto y páginas corporativas: degradado oscuro localizado a la izquierda, imagen visible a la derecha, bandas petróleo/grafito, tarjetas marfil en modo oscuro y footer oscuro permanente. Corregí imágenes de Escritorios, Baños, Puertas y Gamer con assets locales semánticamente adecuados.
**Resultado:** Verificado en localhost en claro y oscuro: hero home/corporativo, grilla de líneas especializadas, formulario de contacto y footer. TypeScript y SEO audit pasaron: 31 URLs, 0 errores y 0 avisos. No se publicó a producción.
**Pendiente:** Sigue separado el conflicto existente entre `public/favicon.ico` y `src/app/favicon.ico`, que provoca el indicador “1 Issue” de Next durante desarrollo.
**Archivos modificados:** C:\dev\proyectos\modularesgm\src\app\globals.css; C:\dev\proyectos\modularesgm\src\components\corporate\corporate-hero.tsx; C:\dev\proyectos\modularesgm\src\components\corporate\corporate-sectors-grid.tsx; C:\dev\proyectos\modularesgm\src\components\corporate\sector-page-template.tsx; C:\dev\proyectos\modularesgm\src\components\home\hero-slider\hero-slider.tsx; C:\dev\proyectos\modularesgm\src\components\home\storefront-sections.tsx.
