/** Datos de contacto y marca (única fuente de verdad para NAP, JSON-LD y barra de contacto). */
export const SITE_BASE = 'https://www.modularesgm.com';

export const SITE = {
  name: 'Modulares GM',
  legalName: 'Modulares GM Diseño, Construcción y Mobiliario',
  phone: '0962524311',
  phoneIntl: '+593962524311',
  address: 'Rosa Yeira 420 y Serpaio Japeravi, Quito, Ecuador',
  city: 'Quito',
  country: 'EC',
  social: {
    facebook: 'https://facebook.com/modularesgm',
    instagram: 'https://www.instagram.com/modularesgm2020/',
  },
} as const;

/** Número para wa.me: solo dígitos con código de país (0962524311 → 593962524311). */
export function toWhatsAppNumber(raw: string) {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('593')) return digits;
  return `593${digits.replace(/^0+/, '')}`;
}

/** Formato legible: +593 96 252 4311 */
export function formatPhone(raw: string) {
  const n = toWhatsAppNumber(raw);
  return `+${n.slice(0, 3)} ${n.slice(3, 5)} ${n.slice(5, 8)} ${n.slice(8)}`;
}

export const whatsappHref = (raw: string, text?: string) =>
  `https://wa.me/${toWhatsAppNumber(raw)}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
