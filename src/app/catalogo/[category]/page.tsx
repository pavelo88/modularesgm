import { permanentRedirect } from 'next/navigation';

const SLUG_MAP: Record<string, string> = {
  escritorios: '/escritorios',
  cocinas: '/cocinas',
  closets: '/closets',
  bano: '/muebles-bano',
  'muebles-bano': '/muebles-bano',
  gamer: '/gamer',
  oficina: '/muebles-oficina',
  'muebles-oficina': '/muebles-oficina',
  puertas: '/puertas',
  estimulacion: '/contacto',
};

export function generateStaticParams() {
  return [
    { category: 'escritorios' },
    { category: 'cocinas' },
    { category: 'closets' },
    { category: 'bano' },
    { category: 'muebles-bano' },
    { category: 'gamer' },
    { category: 'oficina' },
    { category: 'muebles-oficina' },
    { category: 'puertas' },
    { category: 'estimulacion' },
  ];
}

export default async function DynamicCategoryRedirectPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const target = SLUG_MAP[category.toLowerCase()] || '/catalogo';
  permanentRedirect(target);
}
