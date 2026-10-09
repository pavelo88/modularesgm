'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

const STORE_CATEGORIES = [
  'Todos',
  'Cocinas',
  'Closets',
  'Muebles de Baño',
  'Puertas',
  'Gamer',
  'Muebles de Oficina',
  'Escritorios',
];

const STORE_CIRCULAR_CATEGORIES = [
  { id: 'Todos', label: 'Todos', imgUrl: '/images/catalog/extracted_DE_COCINAS/img-004.webp' },
  { id: 'Cocinas', label: 'Cocinas', imgUrl: '/images/catalog/extracted_DE_COCINAS/img-006.webp' },
  { id: 'Closets', label: 'Clósets', imgUrl: '/images/catalog/extracted_CLOSETS_1/img-017.webp' },
  { id: 'Muebles de Baño', label: 'Baños', imgUrl: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-004.webp' },
  { id: 'Escritorios', label: 'Escritorios', imgUrl: '/images/catalog/extracted_estudiantiles/img-000.webp' },
  { id: 'Muebles de Oficina', label: 'Oficina', imgUrl: '/images/catalog/extracted_MUEBLES_OFICINA/img-007.webp' },
  { id: 'Puertas', label: 'Puertas', imgUrl: '/images/catalog/extracted_DE_PUERTAS/img-007.webp' },
  { id: 'Gamer', label: 'Gamer', imgUrl: '/images/catalog/extracted_MUEBLES_GAMER_2/img-004.webp' },
  { id: 'Circuitos de Estimulación Temprana', label: 'Estimulación', imgUrl: '/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-000.webp' },
];

export default function StorePage() {
  const { siteContent, loading } = useSiteContent();
  const { selectedCategory, setSelectedCategory } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    dragFree: true,
    containScroll: false,
  });

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    const el = document.getElementById('store-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Usamos los productos de siteContent si están disponibles, o el catálogo completo local como fallback confiable
  const rawProducts = siteContent?.products && siteContent.products.length > 0 
    ? siteContent.products 
    : ALL_CATALOG_PRODUCTS;

  const categories = useMemo(() => {
    // Garantiza el orden oficial de categorías según el diseño aprobado
    const uniqueCats = Array.from(new Set(rawProducts.map(p => p.category))).filter(Boolean);
    const ordered = STORE_CATEGORIES.filter(c => c === 'Todos' || uniqueCats.includes(c));
    // Agrega cualquier categoría residual si existiera
    uniqueCats.forEach(c => {
      if (!ordered.includes(c)) ordered.push(c);
    });
    return ordered;
  }, [rawProducts]);

  const filteredProducts = useMemo(() => {
    return rawProducts.filter(product => {
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
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
      <div id="top" className="h-0 pt-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* BREADCRUMB DE NAVEGACIÓN */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <ChevronRight size={14} />
          <span className="text-foreground font-medium">Tienda Oficial GM</span>
        </nav>

        {/* HERO EDITORIAL DE LA TIENDA: 2 COLUMNAS (Texto a la izquierda, 2x2 Badges a la derecha) */}
        <header className="mb-10 pb-8 border-b border-border/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Columna Izquierda: Información y Acciones */}
            <div className="lg:col-span-7">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary mb-2 block">
                Catálogo Oficial GM • Fabricación de Autor
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-headline tracking-tight text-foreground leading-[1.15]">
                Tienda & Catálogo de Mobiliario Modular
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-3 font-normal max-w-2xl leading-relaxed">
                Módulos listos para cotizar o comprar directamente. Melamina Pelikano RH 18mm hidrófuga, herrajes alemanes Blum y superficies nobles a medida.
              </p>

              {/* Botón de acceso a Catálogos Detallados */}
              <div className="mt-5 flex items-center gap-3">
                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-full border border-border/80 bg-card text-foreground hover:text-primary transition-all shadow-sm active:scale-95"
                >
                  <BookOpen size={15} className="text-primary" />
                  <span>Ver Catálogos Completos de Autor</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
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

        {/* FILTRO CIRCULAR DE CATEGORÍAS (EXCLUSIVO ESCRITORIO - Carrusel Infinito con Filtro y Scroll a Tienda) */}
        <section aria-label="Categorías de la Tienda" className="hidden md:block mb-10 py-6 px-4 rounded-3xl border border-border/60 bg-card/30 backdrop-blur-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold font-headline tracking-tight text-foreground">
              Explorar por Categoría
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Haga clic en una categoría para filtrar productos y desplazarse directamente al catálogo
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto px-10">
            {/* Flecha Izquierda */}
            <button
              type="button"
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card/90 border border-border/80 shadow-md flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all active:scale-95"
              aria-label="Categorías anteriores"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Viewport del Carrusel Infinito */}
            <div className="overflow-hidden" ref={emblaRef}>
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

            {/* Flecha Derecha */}
            <button
              type="button"
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card/90 border border-border/80 shadow-md flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all active:scale-95"
              aria-label="Siguientes categorías"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </section>

        {/* BARRA DE FILTROS ÚNICA & BÚSQUEDA */}
        <section aria-label="Filtros de productos" className="mb-8">
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
                  value={selectedCategory}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 text-xs font-bold rounded-full bg-background border border-border/80 text-foreground appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  {categories.map((category) => (
                    <option key={category} value={category} className="bg-background text-foreground py-2 font-medium">
                      {category === 'Todos' ? '📂 Todas las categorías' : `✨ ${category}`}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Píldoras de Categorías en Pantallas Medianas y Grandes */}
            <div className="hidden md:flex items-center gap-1.5 overflow-x-auto px-2 py-1 scrollbar-none">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95",
                    selectedCategory === category
                      ? "bg-foreground text-background shadow-md font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {category}
                </button>
              ))}
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
        <main id="store-grid">
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
