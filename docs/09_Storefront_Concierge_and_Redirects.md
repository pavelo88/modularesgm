# 🏛️ 09. Rediseño Editorial de Tienda, Catálogo y Concierge Unificado (Storefront, Lookbook & Concierge)

Este documento detalla la reestructuración completa de la experiencia de compra, la arquitectura de redireccionamientos por categoría, la fusión del botón flotante de atención (WhatsApp + IA Asesor) y la erradicación definitiva de inconsistencias de contraste de color.

Sincronizado con:
- [[catalogo_maestro]]
- [[07_Architectural_Luxury_Redesign]]
- [[08_Catalog_Curation_and_Store_Sync]]

---

## 🎯 1. Principales Soluciones Implementadas

### A. Tienda Minimalista y de Lujo (`/store`)
- **Eliminación de Bloques Invasivos:** Se removieron los bloques amarillos de texto que ocupaban la parte superior de la tienda.
- **Header Editorial:** Título estilizado, insignias de confianza discretas (*Garantía 3 a 5 años* y *Envíos Ecuador*), y barra unificada de píldoras de categorías y búsqueda instantánea en la parte superior.
- **Carrusel Multi-Ángulo en Tarjetas:** Cada `ProductCard` cuenta con navegación por flechas y puntos indicadores discretos para explorar diferentes tomas del mismo mueble directamente en la tarjeta.
- **Cero Duplicados:** Deduplicación estricta de imágenes en memoria (`new Set()`) para evitar que la foto de portada aparezca dos veces.

### B. Índice de Catálogos Lookbook (`/catalogo`)
- **Fila Dedicada por Categoría:** Cada una de las 7 líneas principales (Cocinas, Clósets, Baños, Escritorios, Oficinas, Puertas, Gamer) cuenta con:
  - Numeración editorial (`01`, `02`, etc.) y distintivo técnico.
  - Descripción arquitectónica detallada y especificaciones de materiales (Pelikano RH 18mm, herrajes Blum, cuarzo antibacterial).
  - Riel de fotos horizontales deslizable con 4 tomas de proyectos reales.
  - Botón directo a la categoría correspondiente (`/cocinas`, `/closets`, `/muebles-bano`, etc.).

### C. Redireccionamientos Permanentes (HTTP 308)
En `next.config.ts`, se configuraron redirecciones permanentes para todas las URLs cortas o comunes:
- `/cocina` $\rightarrow$ `/cocinas`
- `/closet` $\rightarrow$ `/closets`
- `/bano`, `/banos`, `/baños` $\rightarrow$ `/muebles-bano`
- `/oficina` $\rightarrow$ `/muebles-oficina`
- `/puerta` $\rightarrow$ `/puertas`
- `/escritorio` $\rightarrow$ `/escritorios`

### D. Concierge FAB Flotante Unificado (`<ConciergeFAB />`)
- Se fusionaron los botones separados de WhatsApp y Chatbot en un **único botón flotante** en la esquina inferior derecha.
- Al pulsar el botón, despliega un menú flotante con:
  1. **WhatsApp Directo:** Con mensaje pre-cargado contextual según la ruta en la que se encuentra el usuario (ej. en `/cocinas`, pre-llena interés en cocinas y mesones).
  2. **Asistente Virtual IA 24/7:** Abre el modal de chat. Si la API de IA externa no estuviera disponible, se activa automáticamente el motor nativo `nativeSalesAdvisorResponse`, que orienta con amabilidad, recomienda los enlaces del catálogo y captura el contacto del cliente en Firestore (`leads`).
  3. **Llamar al Atelier:** Enlace telefónico directo `tel:+593963064374`.

### E. Erradicación de Errores de Contraste (`text-secondary`)
- Se eliminaron todos los usos de la clase `text-secondary` en textos huérfanos del proyecto. En Tailwind / shadcn, `--secondary` es un color de fondo claro en modo luz (`hsl(40 16% 93%)`) y oscuro en modo dark (`hsl(224 16% 12%)`), lo que causaba texto invisible (blanco sobre blanco en modo claro y negro sobre negro en modo oscuro).
- Se reemplazaron por `text-primary`, `text-amber-600 dark:text-amber-400` y `text-stone-900 dark:text-stone-100`.

---

## 🏗️ 2. Diagrama de Arquitectura de Atención y Navegación

```mermaid
graph TD
    User[Visitante en modularesgm.com] --> Store[/store - Tienda Limpia]
    User --> Catalogo[/catalogo - Lookbook Editorial]
    User --> Categories[Páginas Dedicadas /cocinas, /closets, etc.]
    
    User --> Concierge[Botón Concierge Flotante]
    Concierge -->|Clic| Menu[Menú de Atención]
    
    Menu --> OptionWA[1. Asesor WhatsApp Contextual]
    Menu --> OptionIA[2. Asistente IA 24/7]
    Menu --> OptionPhone[3. Llamada Directa a Planta]
    
    OptionIA --> ChatbotWindow[Chatbot Modal]
    ChatbotWindow -->|Online| GeminiAPI[Google Gemini Flash]
    ChatbotWindow -->|Fallback / Offline| NativeAdvisor[Motor Asesor de Ventas Nativo]
    
    NativeAdvisor --> CapturaLead[(Firestore: leads)]
    GeminiAPI --> CapturaLead
```

---

## 📋 3. Estado de Certificación
- **Build Status:** Compilación verificada con éxito (`npm run build`, exit code 0).
- **TypeScript:** 0 errores (`npx tsc --noEmit`).
- **SEO & Core Web Vitals:** A+ sin estilos inline ni bloqueos del hilo principal.
