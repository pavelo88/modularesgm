# 20 · Análisis previo a pauta pagada — ¿qué le falta a la página?

Fecha: 2026-11-16
Alcance: lectura del código de `src/` (home, páginas de producto, store, precios, catálogo, formularios, analítica, SEO) y del documento 18.
Estado: **análisis estático**. No se levantó el sitio en navegador ni se midió rendimiento real. Lo marcado como *no verificado* debe comprobarse antes de invertir.

---

## 1. Veredicto

La página está bien construida técnicamente y el SEO base está limpio (auditoría de 24 URLs: 0 errores, 0 avisos). **Pero hoy no conviene pagar pauta.** Hay cuatro bloqueos que, si el tráfico de pago llega a la página tal como está, generan riesgo legal, rechazo de anuncios o reclamos de clientes:

1. Reseñas con nombre propio y etiqueta "Cliente Verificado" que no sé si son reales.
2. No existen política de privacidad ni términos, y los formularios piden datos personales.
3. Píxeles de Meta y Google cargados sin mecanismo de consentimiento visible.
4. Garantías y plazos contradictorios entre secciones.

---

## 2. Bloqueos (resolver antes de cualquier anuncio)

### B1 · Reseñas posiblemente fabricadas — CRÍTICO
- **Dónde:** [src/components/home/social-proof-reviews.tsx](src/components/home/social-proof-reviews.tsx) (líneas 5–31) y la sección se renderiza en [src/app/(public)/page.tsx](src/app/(public)/page.tsx:32).
- **Qué hay:** tres testimonios con nombre, profesión, edificio, fecha y etiqueta "Cliente Verificado", con frases muy específicas ("entrega al día 16", "render 3D idéntico a lo instalado").
- **Riesgo:** si no provienen de clientes reales, es publicidad engañosa. Meta prohíbe testimonios falsos en anuncios y la cuenta puede restringirse. Además, en Ecuador una reseña inventada expone a sanciones por publicidad engañosa.
- **Acción:** confirmar con cada cliente por escrito (y con su permiso para usar nombre/foto) o **retirar la sección**. No hay que publicar nada que no puedas respaldar. Lo mismo aplica a cualquier "5 estrellas" o cifra de clientes.

### B2 · Sin política de privacidad ni términos — CRÍTICO
- **Dónde:** no existe ninguna ruta de privacidad, términos o legal en `src/app`. El [footer](src/components/layout/footer.tsx) no enlaza a nada legal.
- **Riesgo:** Meta exige una URL de política de privacidad para campañas con formularios o píxel. La Ley Orgánica de Protección de Datos Personales de Ecuador exige informar la finalidad del tratamiento y obtener consentimiento. El [formulario de contacto](src/components/home/contact/contact-form.tsx) recoge nombre, correo y teléfono.
- **Acción:** redactar política de privacidad y términos de compra (incluido el contrato de anticipo y entrega), enlazarlos desde footer y formularios y revisarlos con un abogado.

### B3 · Píxeles sin consentimiento visible — ALTO
- **Dónde:** [src/lib/analytics.ts](src/lib/analytics.ts) envía eventos a GA4 (`G-2LKR039L8Y`), Meta Pixel (`fbq`) y dataLayer. No encontré ningún banner ni gestor de cookies en `src/` (la única coincidencia de "consent" está en auth y admin).
- **Riesgo:** datos de visitantes ecuatorianos y europeos recogidos sin base de consentimiento; la medición de conversiones también se degrada.
- **Acción:** banner de cookies con "Aceptar / Rechazar" y activar el modo de consentimiento de Google y Meta. *No verificado:* qué se carga antes del consentimiento.

### B4 · Garantías y plazos contradictorios — ALTO
| Dato | Dónde | Valor que afirma |
|---|---|---|
| Garantía | [catalogo-explorer.tsx:394](src/components/catalog/catalogo-explorer.tsx:394), [store/page.tsx:194](src/app/(public)/store/page.tsx:194) | 3 a 5 años |
| Garantía | [trust-guarantee-section.tsx](src/components/home/trust-guarantee-section.tsx) | 5 años escritos |
| Entrega | [store/page.tsx:488](src/app/(public)/store/page.tsx:488) | 7 a 15 días hábiles |
| Entrega | trust-guarantee-section.tsx | 15 a 21 días laborables |
| Penalidad | trust-guarantee-section.tsx | $50 USD diarios por retraso, "contrato notariado" |

- **Riesgo:** un cliente que compare dos secciones tendrá motivo de reclamo, y un anuncio que prometa la cifra equivocada es publicidad engañosa.
- **Acción:** elegir **una** cifra de garantía y de entrega, la que la operación cumple de verdad, y reflejarla igual en todo el sitio, las fichas, precios y anuncios. Si la penalidad de $50/día existe, debe estar en el contrato real; si no, quitarla.

---

## 3. Conversión (pagar tráfico sin estas mejoras quema presupuesto)

### C1 · Promesa de respuesta inconsistente — ALTO
- El formulario promete "en menos de 15 minutos" ([contact-form.tsx:81](src/components/home/contact/contact-form.tsx:81)). El documento 18 habla de "24 horas" (que ya no aparece en el código).
- Un cliente de pauta probará la promesa a los 10 minutos. Solo prometer lo que el equipo cumple con WhatsApp en horario real.

### C2 · "Agregar al carrito" en muebles de $1.000–$5.000 — ALTO
- En el modal de [catalogo-explorer.tsx](src/components/catalog/catalogo-explorer.tsx:962-985) aparece **junto** al botón de WhatsApp "Comprar / Cotizar". Lo mismo en [product-card.tsx:442](src/components/store/product-card.tsx:442).
- Para cocinas y clósets, el carrito con pago en línea no es la vía de compra de este público (medición en sitio, acabados, anticipo). Deja un camino de compra que no se puede cumplir.
- **Acción:** en cocinas, closets, baños, puertas y muebles de oficina, quitar el carrito y dejar "Cotizar con medidas" + "Agendar visita". Mantener el carrito solo en escritorios o artículos estandarizados.

### C3 · La página de anuncio no existe — ALTO
- No hay landing de campaña. La home tiene nueve bloques antes del formulario de contacto ([page.tsx:27-35](src/app/(public)/page.tsx:27)) y el usuario de pauta llega con intención concreta.
- **Acción:** crear 2–3 landings (p. ej. `/cocinas-quito`, `/closets-quito`) con: titular con la oferta, CTA de WhatsApp arriba, formulario corto (nombre + WhatsApp + sector), prueba social real y sin navegación al catálogo completo. Medir cada una con UTM.

### C4 · Dos botones flotantes posiblemente superpuestos — MEDIO
- Existen [whatsapp-fab.tsx](src/components/shared/whatsapp-fab.tsx) (mensaje contextual por página, muy bien pensado) y [concierge-fab.tsx](src/components/shared/concierge-fab.tsx), que el layout sí importa. *No verificado:* si ambos se muestran a la vez y se pisan en móvil.
- **Acción:** un solo CTA flotante de WhatsApp en móvil.

### C5 · Documento 18 desactualizado — MEDIO
- El documento 18 dice que no hay botón flotante de WhatsApp, que no hay reseñas embebidas y que el formulario promete 24 horas. El código ya tiene parte de eso. **El documento 18 no es una lista fiable de pendientes**: hay que contrastarlo con el código antes de usarlo como plan.
- Además, el documento 18 presenta "personas simuladas" pero **no hay ningún informe de ejecución de MiroFish en el repo**. Trátalo como hipótesis, no como evidencia.

### C6 · Chatbot IA público sin límites visibles — MEDIO (no auditado)
- Existe [public-ai-chatbot-flow.ts](src/ai/flows/public-ai-chatbot-flow.ts). Con pauta, el tráfico se multiplica y cada mensaje cuesta tokens. *No verificado:* límite de uso por IP o por sesión, ni protección ante inyección de prompts. Antes de invertir, poner rate limit y revisar el flujo con la skill de seguridad LLM.

---

## 4. Lo que ya está bien (no tocar)

- **SEO técnico:** auditoría de 24 URLs con 0 errores y 0 avisos ([seo-reports/latest.md](seo-reports/latest.md)).
- **Medición con atribución:** eventos con canal, UTM, ubicación del clic y producto ([lib/analytics.ts](src/lib/analytics.ts)). Es la base correcta para optimizar pauta.
- **WhatsApp contextual:** el mensaje inicial cambia por página ([whatsapp-fab.tsx](src/components/shared/whatsapp-fab.tsx)).
- **Bloque de confianza:** taller propio, visita técnica y garantía explicados ([trust-guarantee-section.tsx](src/components/home/trust-guarantee-section.tsx)), siempre que se resuelva B4.
- **Datos estructurados:** LocalBusiness, Product, FAQPage, BreadcrumbList.

---

## 5. Técnico y de mantenimiento

- **Archivos de más de 500 líneas** (regla de Pablo en el CLAUDE global): `src/lib/catalog-full.ts` (2854), `catalogo-explorer.tsx` (1018), `afiliados/acceso/page.tsx` (816), `catalog-pdf-generator.ts` (800), `ui/sidebar.tsx` (763), `users-manager.tsx` (747), `lib/actions.ts` (544), `store/page.tsx` (508). No bloquean la pauta, pero conviene modularizarlos.
- **Archivo pesado en la raíz:** `recorrido_lounge_3d.blend` (58 MB). *No verificado:* si está versionado en git. Si lo está, sacarlo del repo.
- **Rendimiento:** `public/` pesa 8.3 MB y no hay imágenes sueltas de más de 800 KB. *No verificado:* Core Web Vitals en móvil. Medir con PageSpeed antes de pagar tráfico.

---

## 6. Plan de acción propuesto (orden)

| # | Acción | Tipo | Bloquea pauta |
|---|---|---|---|
| 1 | Confirmar o retirar reseñas (B1) | Contenido | Sí |
| 2 | Política de privacidad y términos, enlazados (B2) | Legal | Sí |
| 3 | Banner de cookies y consent mode (B3) | Técnico | Sí |
| 4 | Unificar garantía, entrega y penalidad (B4) | Comercial | Sí |
| 5 | Quitar carrito de muebles grandes (C2) | UX | No, pero quema presupuesto |
| 6 | Landings de campaña con UTM (C3) | Marketing | No, pero es la página de destino |
| 7 | Promesa de respuesta real (C1) | Operación | No |
| 8 | Un solo CTA flotante en móvil (C4) | UX | No |
| 9 | Límite de uso del chatbot (C6) | Seguridad | No |
| 10 | Medir rendimiento móvil | Técnico | No |

---

## 7. Simulaciones MiroFish — estado

- **No se han lanzado.** En [MiroFish/.env](file:///C:/dev/proyectos/MiroFish/.env) `LLM_API_KEY` y `ZEP_API_KEY` siguen siendo placeholders, y el backend (`localhost:5001`) no responde.
- Cada simulación consume tokens de LLM (el README advierte de consumo alto y pide empezar con menos de 40 rondas) y usa Zep. **100 simulaciones son un gasto real** que hay que aprobar con presupuesto.
- Recomendación: primero resolver B1–B4, porque una simulación sobre una página con reseñas dudosas y garantías contradictorias solo confirmaría los mismos problemas.

---

## 8. Límites de este análisis

- Análisis de código, no de navegador. No se revisó el resultado renderizado, ni formularios enviándose, ni PayPal.
- No se verificó qué cliente real respalda cada reseña ni qué garantía cumple la operación. Eso lo sabe el negocio, no el código.
- No es asesoría legal. B2 y B4 deben revisarse con un abogado en Ecuador.
