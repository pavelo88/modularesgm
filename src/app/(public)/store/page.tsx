'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Sparkles, 
  Store as StoreIcon, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown, 
  ChevronLeft, 
  Layers, 
  ArrowRight,
  BookOpen,
  Wrench
} from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { ProductCard } from '@/components/store/product-card';
import { CartSidebar } from '@/components/store/cart-sidebar';
import { useCart } from '@/context/cart-provider';
import { useSiteContent } from '@/context/site-content-provider';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ALL_CATALOG_PRODUCTS } from '@/lib/catalog-full';

function normalizeCategoryName(raw?: string | null): string {
  if (!raw) return 'Todos';
  const s = raw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  if (s === 'todos' || !s) return 'Todos';
  if (s.includes('bano') || s.includes('vanit') || s.includes('lavaman')) return 'Baño';
  if (s.includes('oficina') || s.includes('corporativ')) return 'Oficina';
  if (s.includes('cocina')) return 'Cocinas';
  if (s.includes('closet') || s.includes('armario') || s.includes('vestidor')) return 'Closets';
  if (s.includes('escritorio')) return 'Escritorios';
  if (s.includes('puerta')) return 'Puertas';
  if (s.includes('gamer')) return 'Gamer';
  if (s.includes('estimula') || s.includes('infantil')) return 'Estimulación';
  return raw;
}

const CATEGORY_LABELS: Record<string, string> = {
  Todos: 'Todas las Colecciones',
  Cocinas: 'Cocinas Integrales & Cuarzo',
  Closets: 'Clósets & Vestidores',
  'Baño': 'Muebles de Baño & Vanities',
  Escritorios: 'Escritorios & Home Office',
  Oficina: 'Muebles de Oficina & Corporativo',
  Puertas: 'Puertas Pivotantes & de Paso',
  Gamer: 'Setups Gamer & Streaming',
  'Estimulación': 'Circuitos de Estimulación',
};

const STORE_CATEGORIES = [
  'Todos',
  'Cocinas',
  'Closets',
  'Baño',
  'Puertas',
  'Gamer',
  'Oficina',
  'Escritorios',
  'Estimulación',
];

const STORE_CIRCULAR_CATEGORIES = [
  { id: 'Todos', label: 'Todos', imgUrl: '/images/catalog/extracted_DE_COCINAS/img-004.webp' },
  { id: 'Cocinas', label: 'Cocinas', imgUrl: '/images/catalog/extracted_DE_COCINAS/img-006.webp' },
  { id: 'Closets', label: 'Clósets', imgUrl: '/images/catalog/extracted_CLOSETS_1/img-017.webp' },
  { id: 'Baño', label: 'Baños', imgUrl: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-004.webp' },
  { id: 'Escritorios', label: 'Escritorios', imgUrl: '/images/catalog/extracted_estudiantiles/img-000.webp' },
  { id: 'Oficina', label: 'Oficina', imgUrl: '/images/catalog/extracted_MUEBLES_OFICINA/img-007.webp' },
  { id: 'Puertas', label: 'Puertas', imgUrl: '/images/catalog/extracted_DE_PUERTAS/img-007.webp' },
  { id: 'Gamer', label: 'Gamer', imgUrl: '/images/catalog/extracted_MUEBLES_GAMER_2/img-004.webp' },
  { id: 'Estimulación', label: 'Estimulación', imgUrl: '/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-000.webp' },
];

function StoreContent() {
  const { siteContent, loading } = useSiteContent();
  const { selectedCategory, setSelectedCategory } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();

  // Sincronizar automáticamente categoría desde query params (ej: /store?category=bano o /store?category=oficina)
  useEffect(() => {
    const catQuery = searchParams?.get('category');
    if (catQuery) {
      const normalized = normalizeCategoryName(catQuery);
      setSelectedCategory(normalized);
    }
  }, [searchParams, setSelectedCategory]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    dragFree: true,
  });

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const handleCategorySelect = (catId: string) => {
    const normalized = normalizeCategoryName(catId);
    setSelectedCategory(normalized);
    if (typeof window !== 'undefined') {
      const el = document.getElementById('store-controls');
      if (el) {
        // Sticky header is 64px. Giving 80px offset places the filter bar right below the navbar cleanly
        const headerOffset = 80;
        const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }
  };

  // Usamos los productos de siteContent si están disponibles, o el catálogo completo local como fallback confiable
  const rawProducts = siteContent?.products && siteContent.products.length > 0 
    ? siteContent.products 
    : ALL_CATALOG_PRODUCTS;

  const categories = useMemo(() => {
    // Garantiza el orden oficial de categorías según el diseño aprobado
    const uniqueCats = Array.from(new Set(rawProducts.map(p => normalizeCategoryName(p.category)))).filter(Boolean);
    const ordered = STORE_CATEGORIES.filter(c => c === 'Todos' || uniqueCats.includes(c));
    // Agrega cualquier categoría residual si existiera
    uniqueCats.forEach(c => {
      if (!ordered.includes(c)) ordered.push(c);
    });
    return ordered;
  }, [rawProducts]);

  const filteredProducts = useMemo(() => {
    const normSelected = normalizeCategoryName(selectedCategory);
    return rawProducts.filter(product => {
      const prodCat = normalizeCategoryName(product.category);
      const matchesCategory = normSelected === 'Todos' || prodCat === normSelected;
      const matchesSearch = 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.dimensions && product.dimensions.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.subcategory && product.subcategory.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }, [rawProducts, selectedCategory, searchQuery]);

  return (
    <>
      <div id="top" className="h-0 pt-20 sm:pt-24"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 relative z-10">
        
        {/* BREADCRUMB DE NAVEGACIÓN */}
        <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <ChevronRight size={13} />
          <span className="text-foreground font-medium">Tienda Oficial GM</span>
        </nav>

        {/* HERO EDITORIAL DE LA TIENDA: 2 COLUMNAS */}
        <header className="mb-6 pb-6 border-b border-border/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Columna Izquierda: Información y Acciones */}
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-1.5 block">
                Catálogo Oficial GM • Fabricación de Autor
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-4xl font-black font-headline tracking-tight text-foreground leading-[1.15]">
                Tienda & Catálogo de Mobiliario Modular
              </h1>
              <p className="text-muted-foreground text-sm mt-2 font-normal max-w-xl leading-relaxed">
                Módulos listos para cotizar o comprar directamente. Melamina Pelikano RH 18mm hidrófuga, herrajes alemanes Blum y superficies nobles a medida.
              </p>

              {/* Botón de acceso a Catálogos Detallados */}
              <div className="mt-4 flex items-center gap-3">
                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-full border border-border/80 bg-card text-foreground hover:text-primary transition-all shadow-sm active:scale-95"
                >
                  <BookOpen size={14} className="text-primary" />
                  <span>Ver Catálogos Completos de Autor</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Columna Derecha: Grid 2x2 de Señales de Confianza y Calidad */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-card border border-border/70 shadow-sm flex flex-col gap-1 transition-all hover:border-primary/40">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                    <span className="font-bold text-xs text-foreground">Garantía 3 a 5 Años</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Cobertura directa en herrajes y tableros.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-card border border-border/70 shadow-sm flex flex-col gap-1 transition-all hover:border-primary/40">
                  <div className="flex items-center gap-2">
                    <Truck size={18} className="text-amber-500 shrink-0" />
                    <span className="font-bold text-xs text-foreground">Envíos a Todo Ecuador</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Quito, Guayaquil, Cuenca y más.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-card border border-border/70 shadow-sm flex flex-col gap-1 transition-all hover:border-primary/40">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-primary shrink-0" />
                    <span className="font-bold text-xs text-foreground">Pelikano RH 18mm</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Melamina antibacterial resistente.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-card border border-border/70 shadow-sm flex flex-col gap-1 transition-all hover:border-primary/40">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
                    <span className="font-bold text-xs text-foreground">Blum & Häfele</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Sistemas alemanes de cierre suave.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* FILTRO CIRCULAR DE CATEGORÍAS (EXCLUSIVO ESCRITORIO - Carrusel Infinito con Imágenes Grandes y Detalladas) */}
        <section aria-label="Categorías de la Tienda" className="hidden md:block mb-8 py-5 px-6 rounded-3xl border border-border/60 bg-card/40 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between mb-4 px-1">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Sparkles size={15} className="text-primary" /> Explorar por Categoría
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Deslice para explorar y haga clic para filtrar productos y posicionar el catálogo
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={scrollPrev}
                className="w-8 h-8 rounded-full bg-card border border-border/80 shadow-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all active:scale-95"
                aria-label="Categorías anteriores"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                className="w-8 h-8 rounded-full bg-card border border-border/80 shadow-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all active:scale-95"
                aria-label="Siguientes categorías"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="relative">
            {/* Viewport del Carrusel Infinito */}
            <div className="overflow-hidden cursor-grab active:cursor-grabbing px-1" ref={emblaRef}>
              <div className="flex gap-6 sm:gap-7 items-center py-2">
                {STORE_CIRCULAR_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id)}
                      className="group flex flex-col items-center gap-2.5 transition-all focus:outline-none shrink-0"
                    >
                      <div
                        className={cn(
                          "relative w-20 h-20 sm:w-22 sm:h-22 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-md group-hover:scale-105 group-hover:shadow-lg",
                          isActive
                            ? "border-primary ring-4 ring-primary/20 scale-105 shadow-xl"
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
                          "text-xs font-semibold tracking-tight transition-colors whitespace-nowrap",
                          isActive ? "text-primary font-bold" : "text-stone-700 dark:text-stone-300 group-hover:text-foreground"
                        )}
                      >
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* BARRA DE FILTROS & BÚSQUEDA */}
        <section id="store-controls" aria-label="Filtros de productos" className="mb-6 scroll-mt-24">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-2 rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-sm">
            
            {/* Selector desplegable en celulares (Lista Desplegable Cómoda & Elegante) */}
            <div className="md:hidden w-full px-2 pt-1 pb-1">
              <label htmlFor="store-category-select" className="sr-only">Seleccionar Categoría</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5 text-primary">
                  <Layers size={15} />
                </div>
                <select
                  id="store-category-select"
                  value={normalizeCategoryName(selectedCategory)}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 text-xs font-bold rounded-full bg-background border border-border/80 text-foreground appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  {categories.map((category) => (
                    <option key={category} value={category} className="bg-background text-foreground py-2 font-medium">
                      {category === 'Todos' ? '📂 Todas las colecciones' : `✨ ${CATEGORY_LABELS[category] || category}`}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Estado de Categoría Activa en Pantallas Grandes (Sin duplicar píldoras) */}
            <div className="hidden md:flex items-center gap-2.5 px-3 py-1 text-xs">
              <span className="text-muted-foreground font-medium">Línea seleccionada:</span>
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold">
                {CATEGORY_LABELS[normalizeCategoryName(selectedCategory)] || selectedCategory}
              </span>
              {normalizeCategoryName(selectedCategory) !== 'Todos' && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('Todos')}
                  className="text-xs text-muted-foreground hover:text-foreground underline transition-colors ml-1"
                >
                  Ver todas
                </button>
              )}
            </div>

            {/* Buscador Rápido */}
            <div className="relative w-full md:w-80 px-2 pb-1 md:pb-0">
              <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar escritorios, counters, cuarzo..."
                className="pl-9 pr-4 rounded-full bg-background/60 border-border/60 text-xs h-10 focus:ring-primary"
              />
            </div>
          </div>

          {/* Contador de Resultados y Filtro Activo */}
          <div className="flex items-center justify-between px-2 mt-4 text-xs text-muted-foreground">
            <span>
              Mostrando <strong className="text-foreground font-semibold">{filteredProducts.length}</strong> modelos en catálogo
            </span>
            {selectedCategory !== 'Todos' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('Todos')}
                className="text-primary hover:underline font-medium"
              >
                Ver todas las categorías
              </button>
            )}
          </div>
        </section>

        {/* CUADRÍCULA DE PRODUCTOS (LUXURY CARDS CON HOVER DE ÁNGULOS) */}
        <main id="store-grid" className="scroll-mt-36">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3 p-4 rounded-3xl border border-border/40 bg-card/20 animate-pulse">
                  <div className="h-56 bg-muted/60 rounded-2xl w-full" />
                  <div className="h-4 bg-muted/60 rounded w-3/4" />
                  <div className="h-3 bg-muted/40 rounded w-1/2" />
                  <div className="h-8 bg-muted/50 rounded-xl w-1/3 mt-4" />
                </div>
              ))}
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center rounded-3xl border border-dashed border-border/60 bg-muted/10 max-w-xl mx-auto">
              <StoreIcon size={48} className="mx-auto mb-4 text-muted-foreground opacity-30" />
              <h3 className="text-lg font-bold text-foreground mb-1">No se encontraron productos</h3>
              <p className="text-xs text-muted-foreground mb-4">
                No hay resultados para &ldquo;{searchQuery}&rdquo; en la categoría &ldquo;{selectedCategory}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('Todos'); }}
                className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all active:scale-95"
              >
                Restablecer búsqueda
              </button>
            </div>
          )}
        </main>

        {/* GARANTÍAS Y BENEFICIOS AL FINAL DE LA TIENDA */}
        <section className="mt-24 pt-16 border-t border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-6 rounded-3xl bg-card/40 border border-border/40">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-base text-foreground mb-1">Garantía Directa de Fábrica</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Todos nuestros muebles modulares cuentan con hasta 5 años de garantía contra defectos de fabricación y desajustes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-3xl bg-card/40 border border-border/40">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-base text-foreground mb-1">Envíos a Nivel Nacional</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Despachamos de forma segura a Quito, Guayaquil, Cuenca y todas las provincias del Ecuador con embalaje reforzado.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-3xl bg-card/40 border border-border/40">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 shrink-0">
                <Wrench size={24} />
              </div>
              <div>
                <h4 className="font-bold text-base text-foreground mb-1">Instalación y Armado Experto</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Equipo técnico especializado en Quito y valles para nivelación milimétrica y fijación segura a pared.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>

      <CartSidebar />
    </>
  );
}

export default function StorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-28 text-center text-muted-foreground text-sm">
        Cargando catálogo oficial...
      </div>
    }>
      <StoreContent />
    </Suspense>
  );
}
