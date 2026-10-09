'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Store,
  Layers,
  ChevronLeft
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface CatalogRow {
  id: string;
  num: string;
  title: string;
  badge: string;
  categoryTag: string;
  desc: string;
  specs: string[];
  href: string;
  ctaText: string;
  photos: Array<{ url: string; label: string }>;
}

const CATEGORY_FILTERS = [
  { id: 'todos', label: 'Todos los Catálogos' },
  { id: 'cocinas', label: 'Cocinas' },
  { id: 'closets', label: 'Clósets & Vestidores' },
  { id: 'bano', label: 'Baños & Vanities' },
  { id: 'escritorios', label: 'Escritorios' },
  { id: 'oficina', label: 'Muebles de Oficina' },
  { id: 'puertas', label: 'Puertas Pivotantes' },
  { id: 'gamer', label: 'Setups Gamer' },
  { id: 'estimulacion', label: 'Estimulación' },
];

const DESKTOP_CIRCULAR_CATEGORIES = [
  { id: 'todos', label: 'Todos', imgUrl: '/images/catalog/extracted_DE_COCINAS/img-004.webp' },
  { id: 'cocinas', label: 'Cocina', imgUrl: '/images/catalog/extracted_DE_COCINAS/img-006.webp' },
  { id: 'closets', label: 'Clósets', imgUrl: '/images/catalog/extracted_CLOSETS_1/img-017.webp' },
  { id: 'bano', label: 'Baños', imgUrl: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-004.webp' },
  { id: 'escritorios', label: 'Escritorios', imgUrl: '/images/catalog/extracted_estudiantiles/img-000.webp' },
  { id: 'oficina', label: 'Oficina', imgUrl: '/images/catalog/extracted_MUEBLES_OFICINA/img-007.webp' },
  { id: 'puertas', label: 'Puertas', imgUrl: '/images/catalog/extracted_DE_PUERTAS/img-007.webp' },
  { id: 'gamer', label: 'Gamer', imgUrl: '/images/catalog/extracted_MUEBLES_GAMER_2/img-004.webp' },
  { id: 'estimulacion', label: 'Estimulación', imgUrl: '/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-000.webp' },
];

export function CatalogoExplorer({ rows }: { rows: CatalogRow[] }) {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesCategory =
        selectedCategory === 'todos' ||
        row.id.toLowerCase() === selectedCategory.toLowerCase() ||
        row.categoryTag.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        row.title.toLowerCase().includes(query) ||
        row.desc.toLowerCase().includes(query) ||
        row.badge.toLowerCase().includes(query) ||
        row.specs.some((s) => s.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [rows, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <ChevronRight size={14} />
          <span className="text-foreground font-medium">Catálogo Oficial GM</span>
        </nav>

        {/* HERO EDITORIAL: 2 COLUMNAS (Texto a la izquierda, 2x2 Badges a la derecha) */}
        <header className="mb-8 pb-8 border-b border-border/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Columna Izquierda: Títulos y Descripción */}
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-2 block">
                Catálogo General • Colecciones de Autor 2026
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-headline tracking-tight text-foreground leading-[1.15]">
                Catálogos de Muebles Modulares y Espacios a Medida
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-3 font-normal max-w-2xl leading-relaxed">
                Cada ambiente concebido con rigor planimétrico, materiales hidrófugos de alta densidad y superficies nobles.
                Seleccione una línea para explorar todos sus modelos o filtre directamente según su requerimiento.
              </p>
            </div>

            {/* Columna Derecha: Grid 2x2 de Señales de Confianza y Calidad */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-card border border-border/70 shadow-sm flex flex-col gap-1.5 transition-all hover:border-primary/40 hover:shadow-md">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                    <span className="font-bold text-xs text-foreground">Garantía 3 a 5 Años</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Cobertura directa de fábrica en herrajes y tableros.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-card border border-border/70 shadow-sm flex flex-col gap-1.5 transition-all hover:border-primary/40 hover:shadow-md">
                  <div className="flex items-center gap-2">
                    <Truck size={18} className="text-amber-500 shrink-0" />
                    <span className="font-bold text-xs text-foreground">Envíos a Todo Ecuador</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Logística profesional a Quito, Guayaquil, Cuenca y más.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-card border border-border/70 shadow-sm flex flex-col gap-1.5 transition-all hover:border-primary/40 hover:shadow-md">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-primary shrink-0" />
                    <span className="font-bold text-xs text-foreground">Pelikano RH 18mm</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Melamina antibacterial resistente a humedad y calor.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-card border border-border/70 shadow-sm flex flex-col gap-1.5 transition-all hover:border-primary/40 hover:shadow-md">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
                    <span className="font-bold text-xs text-foreground">Herrajes Blum & Häfele</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Sistemas alemanes con cierre suave y alta durabilidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* FILTRO CIRCULAR DE CATEGORÍAS (EXCLUSIVO ESCRITORIO - Idéntico a referencia) */}
        <section aria-label="Nuestras Categorías" className="hidden md:block mb-10 py-6 px-4 rounded-3xl border border-border/60 bg-card/30 backdrop-blur-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold font-headline tracking-tight text-foreground">
              Nuestras Categorías
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Seleccione una categoría para explorar colecciones de autor y especificaciones técnicas
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto flex items-center justify-center gap-5 sm:gap-7 flex-wrap">
            {DESKTOP_CIRCULAR_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="group flex flex-col items-center gap-2.5 transition-all focus:outline-none"
                >
                  <div
                    className={cn(
                      "relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-sm group-hover:scale-105 group-hover:shadow-md",
                      isActive
                        ? "border-primary ring-4 ring-primary/20 scale-105 shadow-lg"
                        : "border-border/80 group-hover:border-primary/60"
                    )}
                  >
                    <Image
                      src={cat.imgUrl}
                      alt={cat.label}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-primary/10 border-2 border-primary rounded-full pointer-events-none" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold tracking-tight transition-colors",
                      isActive ? "text-primary font-bold" : "text-stone-700 dark:text-stone-300 group-hover:text-foreground"
                    )}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* BARRA DE FILTROS EN CELULARES & BUSCADOR + TIENDA EN TODO DISPOSITIVO */}
        <section className="mb-10 sticky top-16 z-20 py-3 bg-background/95 backdrop-blur-md border-b border-border/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Píldoras de Filtros en Celulares (Para no sobrecargar la pantalla chica) */}
            <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
              {CATEGORY_FILTERS.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                      isActive
                        ? 'bg-foreground text-background shadow-sm'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Buscador en Vivo & Botón Tienda */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar en catálogos (cuarzo, isla, vestidor)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 text-xs rounded-full bg-card border-border/80 focus-visible:ring-1 focus-visible:ring-primary w-full"
                />
              </div>

              <Link
                href="/store"
                className="inline-flex items-center gap-2 text-xs font-bold text-foreground hover:text-primary transition-colors px-4 py-2.5 rounded-full border border-border/80 bg-card shadow-sm active:scale-95 shrink-0"
              >
                <Store size={14} className="text-primary" />
                <span className="hidden sm:inline">Explorar Tienda</span>
                <span className="sm:hidden">Tienda</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* LISTADO DE SECCIONES DE CATÁLOGO */}
        {filteredRows.length === 0 ? (
          <div className="py-20 text-center rounded-3xl border border-dashed border-border p-8 bg-card/20">
            <Layers className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-foreground">No se encontraron líneas de catálogo</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              No hay colecciones que coincidan con la búsqueda &quot;{searchQuery}&quot;. Intente seleccionar otra categoría o limpiar el buscador.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('todos');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-full text-xs font-bold bg-foreground text-background hover:opacity-90 active:scale-95 transition-all"
            >
              Ver todos los catálogos
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {filteredRows.map((row) => (
              <section
                key={row.id}
                id={row.id}
                className="relative rounded-3xl border border-border/60 bg-card/40 backdrop-blur-md p-6 sm:p-8 lg:p-10 transition-all duration-300 hover:border-border/90 hover:shadow-xl"
              >
                {/* Cabecera de la Sección / Fila */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs font-bold text-primary tracking-widest">{row.num}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                        {row.badge}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-headline font-bold text-foreground tracking-tight">
                      {row.title}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{row.desc}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {row.specs.map((spec, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-muted/60 text-foreground border border-border/40"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
                    <Link
                      href={row.href}
                      className="inline-flex items-center gap-2 text-xs font-bold px-5 py-3 rounded-full bg-foreground text-background hover:opacity-90 transition-all shadow-md active:scale-95 group"
                    >
                      <span>{row.ctaText}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Galería Visual de 4 Tomas del Catálogo:
                    - EN CELULARES: Carrusel táctil con tarjetas ANCHAS (84vw) y ALTAS (aspect-[16/11])
                    - EN ESCRITORIO: Grilla de 4 columnas */}
                <div className="flex lg:grid lg:grid-cols-4 gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-3 lg:pb-0 scrollbar-none -mx-2 px-2 lg:mx-0 lg:px-0">
                  {row.photos.map((photo, pIdx) => (
                    <Link
                      key={pIdx}
                      href={row.href}
                      className="group relative w-[84vw] sm:w-[320px] lg:w-auto shrink-0 lg:shrink aspect-[16/11] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-muted/30 border border-border/50 block shadow-sm hover:shadow-md transition-all snap-start"
                    >
                      <Image
                        src={photo.url}
                        alt={`${row.title} - ${photo.label}`}
                        fill
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                      <div className="absolute bottom-3 left-3 right-3 text-left">
                        <span className="text-xs sm:text-[11px] font-semibold text-white drop-shadow-sm line-clamp-1">
                          {photo.label}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
