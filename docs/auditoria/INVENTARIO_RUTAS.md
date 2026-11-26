# INVENTARIO Y CLASIFICACIÓN DE RUTAS — MODULARES GM

**Fecha:** 26 de Noviembre de 2026  
**Dominio:** `https://www.modularesgm.com`  
**Total Rutas Públicas e Internas:** 28 rutas activas

---

## 1. Clasificación de Rutas Públicas (B2C, B2B y Silos)

| Ruta | Estado | Clasificación | Propósito Comercial | Observaciones Técnicas |
| :--- | :--- | :--- | :--- | :--- |
| `/` | 200 OK | **Funcional** | Home, Hero cinematográfico, Catálogo, Garantías, Contacto | SSR en Byte 0 con fallback seguro. |
| `/cocinas` | 200 OK | **Funcional** | Silo Cocinas Integrales & Cuarzo | JSON-LD Schema CollectionPage + FAQPage. |
| `/closets` | 200 OK | **Funcional** | Silo Clósets & Walk-in Boutique | Filtros por subcategoría e imágenes WebP. |
| `/muebles-bano` | 200 OK | **Funcional** | Silo Vanities & Muebles de Baño | Modelos flotantes y con mesón de cuarzo. |
| `/puertas` | 200 OK | **Funcional** | Silo Puertas Pivotantes Monumentales | Bisagras de alta carga, seguridad digital. |
| `/escritorios` | 200 OK | **Funcional** | Silo Escritorios Home Office & Estudiantil | Compra directa o cotización. |
| `/muebles-oficina`| 200 OK | **Funcional** | Silo Mobiliario Corporativo | Recepciones, gerencia, divisiones. |
| `/gamer` | 200 OK | **Funcional** | Silo Setups Gamer & Streaming | Iluminación RGB y pasacables técnicos. |
| `/empresas` | 200 OK | **Funcional (Nueva)**| Landing B2B Constructoras & Instituciones | Formulario corporativo con CRM automático. |
| `/store` | 200 OK | **Funcional** | Tienda Online & Catálogo Modular | Carrito, filtros, h1 único optimizado. |
| `/store/checkout`| 200 OK | **Funcional** | Pasarela de Pago PayPal & Depósito | Precios calculados en centavos. |
| `/catalogo` | 200 OK | **Funcional** | Catálogo Digital Interactivo con PDF | Descarga de PDF planimétrico dinámico. |
| `/precios` | 200 OK | **Funcional** | Catálogo Transparente de Precios | Listado por metro lineal y módulo. |
| `/privacidad` | 200 OK | **Funcional (Nueva)**| Política de Privacidad & LOPDP | Obligatorio para Meta Ads y Google Ads. |
| `/terminos` | 200 OK | **Funcional (Nueva)**| Términos de Fabricación y Garantías | Anticipos, visitas técnicas y plazos. |
| `/afiliados` | 200 OK | **Funcional** | Información Programa de Afiliados | Esquema comisiones y registro. |
| `/afiliados/acceso`| 200 OK| **Funcional** | Login y Registro de Afiliados | Firebase Auth con validación de roles. |

---

## 2. Clasificación de Rutas Privadas y Administrativas

| Ruta | Estado | Clasificación | Propósito | Seguridad |
| :--- | :--- | :--- | :--- | :--- |
| `/admin` | 200 OK | **Funcional** | Acceso Administrativo (Login) | Protegido con session cookies HttpOnly. |
| `/admin/dashboard` | 200 OK | **Funcional** | Panel CMS, Leads, Analítica y Usuarios | Requiere rol `admin` o `superadmin`. |
| `/afiliados/portal`| 200 OK | **Funcional** | Dashboard de Afiliado | Código de referido, enlaces de atribución. |
| `/afiliados/portal/ganancias` | 200 OK | **Funcional** | Historial de Comisiones | Ventas cobradas y balances. |
| `/afiliados/portal/perfil` | 200 OK | **Funcional** | Datos de Pago y Perfil | Cuentas bancarias en Ecuador. |
| `/afiliados/portal/recursos` | 200 OK | **Funcional** | Material Promocional | Banners, copies y fotos autorizadas. |
| `/afiliados/portal/red` | 200 OK | **Funcional** | Red de Afiliados Multinivel | Niveles 10-3-2 de referidos. |
| `/afiliados/portal/retiros` | 200 OK | **Funcional** | Solicitudes de Retiro | Monto mínimo configurable. |

---

## 3. Endpoints de API

| Ruta API | Método | Estado | Función |
| :--- | :--- | :--- | :--- |
| `/api/paypal/create-order` | POST | **Funcional** | Crea orden segura con monto validado en servidor. |
| `/api/paypal/capture-order`| POST | **Funcional** | Captura y liquida transacción con conciliación. |
| `/api/paypal/config` | GET | **Funcional** | Entrega Client ID público para SDK PayPal. |
