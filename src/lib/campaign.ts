/**
 * Campaña activa que se muestra en la barra superior. Para cambiarla, edita el texto y la fecha;
 * para apagarla, pon `endsAt` en el pasado. La fecha se compara en el navegador del visitante.
 */
export const CAMPAIGN = {
  id: 'navidad-2026',
  short: 'Cocina lista para Navidad: aprueba tu diseño hasta el 13 de noviembre',
  /** Versión para celular: la barra mide ~350 px y la fecha límite no debe cortarse. */
  mobile: 'Cocina para Navidad: diseño hasta el 13 nov',
  cta: 'Cotizar',
  whatsappMessage: 'Hola Modulares GM, quiero mi cocina lista para Navidad. ¿Cuándo pueden venir a medir?',
  /** Viernes 13 de noviembre de 2026, 23:59 en Ecuador (UTC-5). */
  endsAt: '2026-11-14T04:59:59Z',
} as const;
