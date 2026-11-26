# Plan de pauta y separación de cuentas

Fecha: 2026-11-19  
Proyectos: Modulares GM y Vermilion Routes

## Resumen para decisión

Las dos marcas deben operar con cuentas, perfiles, conversiones, públicos y campañas separados. El objetivo inicial no es gastar lo máximo, sino comprar datos fiables durante 30 días y decidir el presupuesto con coste por lead cualificado.

La estructura observada actualmente es:

| Proyecto | Mercado | Perfil de Negocio | Cuenta Ads observada | Estado |
|---|---|---|---|---|
| Modulares GM | Ecuador | Verificado; Quito | `3411962066` aparece vinculado en Business Profile | Confirmar nombre de la cuenta antes de tocar Analytics |
| Vermilion Routes | EEUU, Reino Unido y Europa | Perfil mostrado en Ads | `301-085-7341` aparece como Vermilion Routes | Analytics quedó vinculado; revisar que GA4 corresponda a Vermilion |

El dato crítico es que `301-085-7341` no debe recibir campañas de Modulares GM. La cuenta `3411962066` es la candidata natural para Modulares porque figura vinculada al Perfil de Negocio de Modulares, pero debe confirmarse visualmente en Google Ads antes de modificar o desvincular integraciones.

## Permisos necesarios

No hacen falta permisos adicionales para auditar la situación actual: ya existe acceso a Analytics, Google Ads y Business Profile.

Para dejarlo completamente operativo se necesita:

1. Acceso de administrador a cada cuenta Ads, o autorización del administrador actual para vincular Analytics y Business Profile.
2. Acceso de propietario o administrador al Perfil de Negocio correspondiente.
3. Acceso de edición a la propiedad GA4 correcta de cada proyecto.
4. Método de facturación aprobado por cada jefe. No se debe guardar una tarjeta ni activar cargos sin autorización del responsable.
5. Confirmación escrita de la identidad de cada cuenta Ads: nombre, ID y proyecto.

## Arquitectura correcta

### Modulares GM — Ecuador

- Perfil: Modulares GM Quito.
- Ads: la cuenta que confirme el jefe como `3411962066`.
- GA4: propiedad del sitio de Modulares GM, con `generate_lead` y `whatsapp_click` como eventos clave.
- Landing: `/cocinas`, `/precios` o una landing específica de campaña con WhatsApp visible.
- Objetivo: solicitudes de cotización y visitas técnicas en Quito y Valles.
- Idioma: español.
- Ubicaciones iniciales: Quito, Cumbayá, Tumbaco, Nayón, Puembo y Valle de los Chillos; excluir ubicaciones donde no se pueda atender.

### Vermilion Routes — EEUU, Reino Unido y Europa

- Perfil: el Perfil de Negocio que corresponda a Vermilion Routes.
- Ads: `301-085-7341`, si el administrador confirma que es la cuenta de Vermilion.
- GA4: propiedad propia de Vermilion, nunca la propiedad de Modulares GM.
- Landing: una página por servicio y país prioritario, con idioma, moneda y teléfono correctos.
- Objetivo: formularios, llamadas o reservas según el servicio real.
- Mercados: no lanzar EEUU, Reino Unido y toda Europa simultáneamente sin datos; empezar por un país y servicio con margen suficiente.

## Presupuestos de prueba para decisión de los jefes

Son rangos de prueba, no una promesa de resultados. El presupuesto final debe aprobarlo cada responsable.

| Proyecto | Escenario prudente | Escenario aprendizaje | Escenario crecimiento | Duración mínima |
|---|---:|---:|---:|---|
| Modulares GM | USD 300/mes | USD 600/mes | USD 1.200/mes | 30 días |
| Vermilion Routes | USD 900/mes | USD 1.800/mes | USD 3.600/mes | 30 días |

La decisión debe basarse en coste por lead cualificado, tasa de respuesta y ventas, no en clics o impresiones. Si el margen bruto de un proyecto no soporta el coste objetivo por adquisición, se reduce el mercado o se cambia la oferta antes de aumentar inversión.

## Campañas iniciales

### Modulares GM

1. Google Search para demanda existente: cocinas modulares, mesones de cuarzo, closets y remodelación en Quito.
2. Una campaña de marca con presupuesto pequeño para proteger búsquedas de Modulares GM.
3. Remarketing solo después de validar consentimiento, audiencias y volumen suficiente.

Reparto de prueba sugerido: 70% Search de intención alta, 20% marca, 10% experimentación.

### Vermilion Routes

1. Una campaña Search por país o idioma prioritario, no una campaña global mezclada.
2. Grupos de anuncios separados por servicio y ubicación.
3. Extensiones de llamada, ubicación y enlaces solo cuando la información sea correcta para ese mercado.
4. Remarketing y Performance Max después de tener conversiones verificadas y suficiente volumen.

Reparto de prueba sugerido: 80% Search de intención alta y 20% pruebas de mercado/remarketing, siempre que exista consentimiento válido.

## Bloqueos antes de publicar

### Modulares GM

- Confirmar que `3411962066` es la cuenta Ads de Modulares.
- Corregir la vinculación GA4 si la propiedad de Modulares quedó asociada a la cuenta de Vermilion `301-085-7341`.
- Publicar política de privacidad y términos enlazados desde el sitio.
- Añadir banner de consentimiento y Consent Mode antes de usar remarketing.
- Confirmar que reseñas, garantías, plazos y promesas de respuesta son demostrables.
- Crear landing específica de pauta y probar el flujo WhatsApp/lead de principio a fin.

### Vermilion Routes

- Confirmar propietario, país y servicio principal de la cuenta `301-085-7341`.
- Confirmar que su GA4 no sea la propiedad de Modulares.
- Revisar políticas legales, consentimiento, llamadas y formularios para EEUU, Reino Unido y Europa.
- Elegir un mercado inicial y una oferta verificable.
- Validar horarios, moneda, teléfono y capacidad real de atención.

## Protocolo de lanzamiento

1. Auditoría de cuentas y permisos.
2. Corrección de relaciones entre Business Profile, Ads y GA4.
3. Validación en tiempo real de `generate_lead`, WhatsApp, llamadas y formularios.
4. Revisión de landing, privacidad y consentimiento.
5. Campaña de prueba de 30 días con presupuesto aprobado.
6. Revisión semanal de términos de búsqueda, leads cualificados, coste y ventas.
7. Escalado máximo de 20–30% por semana solo si el coste por lead y la operación lo soportan.

## Decisiones que deben tomar los jefes

- Presupuesto mensual y límite diario de cada proyecto.
- Mercado inicial de Vermilion.
- Servicio prioritario y margen mínimo aceptable.
- Coste máximo por lead cualificado y por venta.
- Persona responsable de responder leads y tiempo máximo de respuesta.
- Confirmación del ID Ads correcto de cada marca.

## Estado actual

- Modulares GM tiene Perfil de Negocio verificado.
- Google Analytics de Modulares ya mide tráfico y eventos de conversión.
- `generate_lead` y `whatsapp_click` están configurados como eventos clave en la propiedad revisada.
- La cuenta `301-085-7341` aparece como Vermilion Routes en Google Ads.
- El Perfil de Negocio de Modulares aparece vinculado a `3411962066`.
- No se deben crear campañas hasta confirmar y corregir la relación GA4-Ads de ambas marcas.
