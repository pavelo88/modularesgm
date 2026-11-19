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
