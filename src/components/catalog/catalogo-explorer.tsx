'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  ArrowLeft,
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Store,
  Layers,
  ChevronLeft,
  ChevronDown,
  FileDown,
  Play,
  Pause,
  ShoppingBag,
  ShoppingCart,
  MessageCircle,
  Ruler,
  Clock,
  Eye
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import useEmblaCarousel from 'embla-carousel-react';
import { generateLuxuryCatalogPdf } from '@/lib/catalog-pdf-generator';
import { ALL_CATALOG_PRODUCTS } from '@/lib/catalog-full';
import type { Product } from '@/lib/types';
import { useCart } from '@/context/cart-provider';
import { useSiteContent } from '@/context/site-content-provider';
import { SITE, whatsappHref } from '@/lib/site';
import { track } from '@/lib/analytics';

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
  products?: Product[];
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
  { id: 'escritorios', label: 'Escritorios', imgUrl: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-000.webp' },
  { id: 'oficina', label: 'Oficina', imgUrl: '/images/catalog/extracted_MUEBLES_OFICINA/img-007.webp' },
  { id: 'puertas', label: 'Puertas', imgUrl: '/images/catalog/extracted_DE_PUERTAS/img-007.webp' },
  { id: 'gamer', label: 'Gamer', imgUrl: '/images/catalog/extracted_MUEBLES_GAMER_2/img-004.webp' },
  { id: 'estimulacion', label: 'Estimulación', imgUrl: '/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-000.webp' },
];

export function getCategoryProducts(row: CatalogRow): Product[] {
  if (row.products && row.products.length > 0) {
    return row.products;
  }
  const norm = (row.categoryTag || row.id).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return ALL_CATALOG_PRODUCTS.filter((p) => {
    const pCat = p.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (norm === 'cocinas') return pCat === 'cocinas';
    if (norm === 'closets') return pCat === 'closets';
    if (norm === 'bano') return pCat.includes('bano');
    if (norm === 'escritorios') return pCat === 'escritorios';
    if (norm === 'oficina') return pCat === 'oficina';
    if (norm === 'puertas') return pCat === 'puertas';
    if (norm === 'gamer') return pCat === 'gamer';
    if (norm === 'estimulacion') return pCat.includes('estimulacion');
    return false;
  });
}

interface CatalogProductCardProps {
  product: Product;
  row: CatalogRow;
  onOpenModal: () => void;
  'aria-hidden'?: boolean;
}

function CatalogProductCard({
  product,
  row,
  onOpenModal,
  'aria-hidden': ariaHidden,
}: CatalogProductCardProps) {
  const isCustomQuote = !product.price || product.price === 0;

  return (
    <article
      tabIndex={ariaHidden ? -1 : 0}
      aria-hidden={ariaHidden}
      onClick={onOpenModal}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenModal();
        }
      }}
      className={cn(
        "group relative w-[285px] sm:w-[320px] md:w-[340px] shrink-0 rounded-3xl border border-border/70 bg-card/85 backdrop-blur-md overflow-hidden cursor-pointer transition-all duration-300",
        "hover:border-primary/60 hover:shadow-[0_20px_45px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.45)] hover:-translate-y-2 active:scale-[0.98] select-none flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-primary/40"
      )}
    >
      {/* Top Image & Overlay */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/40">
        <Image
          src={product.imgUrl}
          alt={`${product.title} - ${row.title}`}
          fill
          sizes="(max-width: 640px) 285px, 340px"
          className="object-cover transition-transform duration-700 ease-emil-out group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-background/90 dark:bg-black/80 backdrop-blur-md text-foreground border border-white/10 shadow-sm">
            {product.subcategory || `Ref GM-${product.id}`}
          </span>
          {product.priceUnit === 'metro_lineal' ? (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary/95 text-primary-foreground backdrop-blur-md shadow-sm">
              Metro Lineal
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/60 text-white/95 backdrop-blur-md border border-white/15">
              Garantía GM
            </span>
          )}
        </div>

        {/* Hover Bottom Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="text-xs font-semibold text-white drop-shadow-md line-clamp-1">
            {product.title}
          </span>
          <span className="shrink-0 p-1.5 rounded-full bg-primary text-primary-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Eye size={13} />
          </span>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              {product.category} • GM-{product.id}
            </span>
            {product.dimensions && (
              <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                <Ruler size={10} className="text-primary shrink-0" />
                {product.dimensions}
              </span>
            )}
          </div>

          <h3 className="font-headline font-bold text-sm sm:text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {product.desc}
          </p>

          {product.material && (
            <div className="mt-2.5 flex items-center gap-1 text-[10px] text-muted-foreground/90 bg-muted/50 px-2.5 py-1 rounded-md border border-border/40">
              <Sparkles size={10} className="text-primary shrink-0" />
              <span className="line-clamp-1">{product.material}</span>
            </div>
          )}
        </div>

        {/* Footer with Price & Purchase Action */}
        <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground block">
              {isCustomQuote ? 'Presupuesto' : 'Precio Directo'}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black text-foreground tracking-tight">
                {isCustomQuote ? 'A Medida' : `$${product.price.toLocaleString('es-EC')}`}
              </span>
              {product.priceUnit === 'metro_lineal' && (
                <span className="text-[10px] text-muted-foreground">/ m. lineal</span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/30 transition-all active:scale-95 shadow-sm"
          >
            <ShoppingBag size={13} />
            <span>Comprar</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export function CatalogoExplorer({ rows }: { rows: CatalogRow[] }) {
  const { addToCart } = useCart();
  const { siteContent } = useSiteContent();
  const whatsappNumber = siteContent?.whatsappNumber || SITE.phone;

  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadingCategory, setDownloadingCategory] = useState<string | null>(null);
  const [pdfStatus, setPdfStatus] = useState<string | null>(null);

  // Estado del Modal de Compra y Ficha Técnica
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedRowForProduct, setSelectedRowForProduct] = useState<CatalogRow | null>(null);
  const [activeModalImage, setActiveModalImage] = useState<string>('');
  const [cartSuccess, setCartSuccess] = useState(false);

  // Control de Pausa individual por carrusel
  const [pausedRows, setPausedRows] = useState<Record<string, boolean>>({});

  const togglePauseRow = (rowId: string) => {
    setPausedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const handleOpenPurchaseModal = (product: Product, row: CatalogRow) => {
    setSelectedProduct(product);
    setSelectedRowForProduct(row);
    setActiveModalImage(product.imgUrl);
    setCartSuccess(false);
  };

  const modalImages = useMemo(() => {
    if (!selectedProduct) return [];
    const list = [selectedProduct.imgUrl, ...(selectedProduct.images || [])].filter(Boolean);
    return Array.from(new Set(list));
  }, [selectedProduct]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    dragFree: true,
  });

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    if (typeof window === 'undefined') return;

    if (catId === 'todos') {
      const controls = document.getElementById('catalog-controls');
      if (controls) {
        const offset = 80;
        const y = controls.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
      return;
    }

    const el = document.getElementById(catId);
    if (el) {
      const headerOffset = 144;
      const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  const handleDownloadPdf = async (categoryId?: string) => {
    try {
      setIsGeneratingPdf(true);
      setDownloadingCategory(categoryId || 'todos');
      await generateLuxuryCatalogPdf(categoryId, (msg) => setPdfStatus(msg));
    } catch (err) {
      console.error('Error al generar catálogo PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
      setDownloadingCategory(null);
      setPdfStatus(null);
    }
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesCategory =
        selectedCategory === 'todos' ||
        row.id.toLowerCase() === selectedCategory.toLowerCase() ||
        row.categoryTag.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory;

      const prods = getCategoryProducts(row);
      const matchesSearch =
        row.title.toLowerCase().includes(query) ||
        row.desc.toLowerCase().includes(query) ||
        row.badge.toLowerCase().includes(query) ||
        row.specs.some((s) => s.toLowerCase().includes(query)) ||
        prods.some(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.desc.toLowerCase().includes(query) ||
            (p.material && p.material.toLowerCase().includes(query)) ||
            (p.dimensions && p.dimensions.toLowerCase().includes(query))
        );

      return matchesCategory && matchesSearch;
    });
  }, [rows, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-20 bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <ChevronRight size={13} />
          <span className="text-foreground font-medium">Catálogo Oficial GM</span>
        </nav>

        {/* HERO EDITORIAL: 2 COLUMNAS */}
        <header className="mb-6 pb-6 border-b border-border/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Columna Izquierda: Títulos y Descripción */}
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-1.5 block">
                Catálogo General • Colecciones de Autor 2026
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-4xl font-black font-headline tracking-tight text-foreground leading-[1.15]">
                Catálogos de Muebles Modulares y Espacios a Medida
              </h1>
              <p className="text-muted-foreground text-sm mt-2 font-normal max-w-xl leading-relaxed">
                Diseño arquitectónico con tableros hidrófugos Pelikano RH 18mm, herrajes alemanes Blum y mesones en cuarzo y granito. Explore las tarjetas interactivas de cada diseño para cotizar o comprar directamente.
              </p>

              {/* Botones de Acción de Autor en Hero */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleDownloadPdf()}
                  disabled={isGeneratingPdf}
                  className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-full bg-foreground text-background hover:opacity-90 transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  <FileDown size={14} className={cn("text-primary", isGeneratingPdf && "animate-bounce")} />
                  <span>{isGeneratingPdf ? (pdfStatus || 'Generando...') : 'Descargar Catálogo Completo en PDF'}</span>
                </button>
                <Link
                  href="/store"
                  className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-full border border-border/80 bg-card text-foreground hover:text-primary transition-all shadow-sm active:scale-95"
                >
                  <Store size={14} className="text-primary" />
                  <span>Explorar Tienda Online</span>
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
                    Cobertura de fábrica en herrajes y tableros.
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
                    Melamina antibacterial hidrófuga.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-card border border-border/70 shadow-sm flex flex-col gap-1 transition-all hover:border-primary/40">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
                    <span className="font-bold text-xs text-foreground">Blum & Häfele</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Herrajes con cierre suave amortiguado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* FILTRO CIRCULAR DE CATEGORÍAS (ESCRITORIO) */}
        <section aria-label="Nuestras Categorías" className="hidden md:block mb-8 py-5 px-6 rounded-3xl border border-border/60 bg-card/40 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between mb-4 px-1">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Sparkles size={15} className="text-primary" /> Colecciones GM de Autor
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Haga clic para saltar a la línea de catálogo o filtrar sus modelos
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
            <div className="overflow-hidden cursor-grab active:cursor-grabbing px-1" ref={emblaRef}>
              <div className="flex gap-6 sm:gap-7 items-center py-2">
                {DESKTOP_CIRCULAR_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryClick(cat.id)}
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

        {/* BARRA DE FILTROS EN CELULARES & BUSCADOR + ACCIONES */}
        <section id="catalog-controls" className="mb-8 sticky top-16 z-20 py-2.5 bg-background/95 backdrop-blur-md border-b border-border/50 scroll-mt-20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Lista Desplegable en Celulares */}
            <div className="md:hidden w-full pb-1">
              <label htmlFor="catalog-mobile-category-select" className="sr-only">Seleccionar Categoría del Catálogo</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5 text-primary">
                  <Layers size={15} />
                </div>
                <select
                  id="catalog-mobile-category-select"
                  value={selectedCategory}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleCategoryClick(val);
                  }}
                  className="w-full h-11 pl-10 pr-10 text-xs font-bold rounded-full bg-card border border-border/80 text-foreground appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  {CATEGORY_FILTERS.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-background text-foreground py-2 font-medium">
                      {cat.id === 'todos' ? '📂 Todos los Catálogos' : `✨ ${cat.label}`}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Buscador en Vivo & Botones de Acción */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar modelos, cuarzo, escritorios, closets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 text-xs rounded-full bg-card border-border/80 focus-visible:ring-1 focus-visible:ring-primary w-full"
                />
              </div>

              {/* Botón Descargar Catálogo General */}
              <button
                type="button"
                onClick={() => handleDownloadPdf()}
                disabled={isGeneratingPdf}
                className="inline-flex items-center gap-2 text-xs font-bold text-background bg-foreground hover:opacity-90 transition-all px-4 py-2.5 rounded-full shadow-sm active:scale-95 shrink-0 disabled:opacity-50"
              >
                <FileDown size={14} className={cn("text-primary", isGeneratingPdf && downloadingCategory === 'todos' && "animate-bounce")} />
                <span>{isGeneratingPdf && downloadingCategory === 'todos' ? (pdfStatus || 'Generando...') : 'Descargar PDF'}</span>
              </button>

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

        {/* LISTADO DE SECCIONES CON CARRUSELES INFINITOS ALTERNADOS */}
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
            {filteredRows.map((row, index) => {
              const allRowProducts = getCategoryProducts(row);
              const query = searchQuery.trim().toLowerCase();

              const displayedProducts = query
                ? allRowProducts.filter(
                    (p) =>
                      p.title.toLowerCase().includes(query) ||
                      p.desc.toLowerCase().includes(query) ||
                      (p.material && p.material.toLowerCase().includes(query)) ||
                      (p.dimensions && p.dimensions.toLowerCase().includes(query))
                  )
                : allRowProducts;

              // Alternar dirección del carrusel infinito:
              // Pares (0, 2, 4...) -> Izquierda a Derecha (LTR)
              // Impares (1, 3, 5...) -> Derecha a Izquierda (RTL)
              const isEven = index % 2 === 0;
              const isPaused = !!pausedRows[row.id];
              const marqueeAnimationClass = isEven ? 'animate-marquee-ltr' : 'animate-marquee-rtl';
              const directionLabel = isEven ? 'Flujo: Izq → Der' : 'Flujo: Der → Izq';

              return (
                <section
                  key={row.id}
                  id={row.id}
                  className="relative scroll-mt-36 sm:scroll-mt-40 rounded-3xl border border-border/60 bg-card/40 backdrop-blur-md p-6 sm:p-8 lg:p-10 transition-all duration-300 hover:border-border/90 hover:shadow-xl"
                >
                  {/* Cabecera de la Sección / Fila */}
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
                    <div className="max-w-2xl">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="font-mono text-xs font-bold text-primary tracking-widest">{row.num}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                          {row.badge}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-muted text-foreground border border-border/50">
                          {displayedProducts.length} Diseños Disponibles
                        </span>
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground/80 px-2.5 py-0.5 rounded-full bg-background/60 border border-border/40">
                          {isEven ? <ArrowRight size={11} className="text-primary" /> : <ArrowLeft size={11} className="text-primary" />}
                          <span>{directionLabel}</span>
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

                    {/* Acciones de la Sección: Pausar/Reanudar, Tienda y Descargar PDF de la línea */}
                    <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start lg:self-center">
                      {/* Botón para Pausar o Reanudar el movimiento del carrusel */}
                      {displayedProducts.length > 3 && (
                        <button
                          type="button"
                          onClick={() => togglePauseRow(row.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-full border border-border/80 bg-card hover:bg-muted text-foreground transition-all shadow-sm active:scale-95"
                          title={isPaused ? "Reanudar desplazamiento automático" : "Pausar desplazamiento"}
                        >
                          {isPaused ? (
                            <>
                              <Play size={13} className="text-primary fill-primary" />
                              <span>Reanudar</span>
                            </>
                          ) : (
                            <>
                              <Pause size={13} className="text-muted-foreground" />
                              <span>Pausar</span>
                            </>
                          )}
                        </button>
                      )}

                      <Link
                        href={`/store?category=${encodeURIComponent(row.categoryTag || row.id)}`}
                        className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-full border border-primary/40 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm active:scale-95"
                      >
                        <Store size={14} className="shrink-0" />
                        <span>Ver en Tienda</span>
                      </Link>

                      {/* Botón Descargar Catálogo PDF de la Categoría */}
                      <button
                        type="button"
                        onClick={() => handleDownloadPdf(row.id)}
                        disabled={isGeneratingPdf}
                        className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-full bg-foreground text-background hover:opacity-90 transition-all shadow-md active:scale-95 group disabled:opacity-50 shrink-0"
                      >
                        <FileDown size={14} className={cn("text-primary", downloadingCategory === row.id && "animate-bounce")} />
                        <span>
                          {downloadingCategory === row.id
                            ? (pdfStatus || 'Descargando...')
                            : `Descargar PDF`}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* CARRUSEL INFINITO ALTERNADO CON TARJETAS DE PRODUCTOS:
                      - Pasa de Izquierda a Derecha en filas pares
                      - Pasa de Derecha a Izquierda en filas impares
                      - Se pausa automáticamente al pasar el cursor o tocar (hover/active)
                      - Máscara de gradiente suave en los bordes para acabado de lujo */}
                  {displayedProducts.length === 0 ? (
                    <div className="py-8 text-center bg-card/20 rounded-2xl border border-dashed border-border/60">
                      <p className="text-xs text-muted-foreground">
                        No se encontraron modelos en esta categoría con el filtro actual.
                      </p>
                    </div>
                  ) : displayedProducts.length <= 3 ? (
                    /* Si hay 3 o menos modelos (ej. por filtro de búsqueda), mostramos grilla estática elegante */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {displayedProducts.map((product) => (
                        <CatalogProductCard
                          key={`static-${product.id}`}
                          product={product}
                          row={row}
                          onOpenModal={() => handleOpenPurchaseModal(product, row)}
                        />
                      ))}
                    </div>
                  ) : (
                    /* Carrusel Infinito con Track Duplicado para Bucle Continuo Matemático */
                    <div className="relative overflow-hidden marquee-mask py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                      <div
                        className={cn(
                          marqueeAnimationClass,
                          "flex items-stretch gap-5",
                          isPaused && "marquee-paused"
                        )}
                      >
                        {/* Primera pasada */}
                        {displayedProducts.map((product, pIdx) => (
                          <CatalogProductCard
                            key={`orig-${product.id}-${pIdx}`}
                            product={product}
                            row={row}
                            onOpenModal={() => handleOpenPurchaseModal(product, row)}
                          />
                        ))}
                        {/* Segunda pasada duplicada para costura infinita sin cortes */}
                        {displayedProducts.map((product, pIdx) => (
                          <CatalogProductCard
                            key={`dup-${product.id}-${pIdx}`}
                            product={product}
                            row={row}
                            aria-hidden={true}
                            onOpenModal={() => handleOpenPurchaseModal(product, row)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Nota al pie de la sección informando al usuario sobre la interacción */}
                  <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground px-1">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={12} className="text-primary" />
                      Pase el cursor o presione cualquier tarjeta para pausar y abrir los detalles de compra.
                    </span>
                    <span className="hidden sm:inline font-mono text-[10px]">
                      Pelikano RH 18mm • Herrajes Blum
                    </span>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL DE COMPRA Y DETALLES RÁPIDOS ("Info de la imagen para la compra") */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl bg-background/95 backdrop-blur-2xl border border-border/80 shadow-2xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && selectedRowForProduct && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Columna Izquierda: Galería y Fotos del Producto */}
              <div className="lg:col-span-6 bg-muted/20 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/60">
                <div>
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-background border border-border/60 shadow-md">
                    <Image
                      src={activeModalImage || selectedProduct.imgUrl}
                      alt={selectedProduct.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 500px"
                      className="object-cover"
                      priority
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/10 shadow-sm">
                      {selectedProduct.category} • Ref GM-{selectedProduct.id}
                    </div>
                  </div>

                  {/* Miniaturas de ángulos si existen más fotos */}
                  {modalImages.length > 1 && (
                    <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                      {modalImages.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveModalImage(img)}
                          className={cn(
                            "relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 active:scale-95",
                            activeModalImage === img
                              ? "border-primary scale-105 shadow-md"
                              : "border-transparent opacity-60 hover:opacity-100"
                          )}
                        >
                          <Image src={img} alt={`Ángulo ${idx + 1}`} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sellos de Confianza de Fábrica GM */}
                <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-border/60 text-center">
                  <div className="p-2.5 rounded-xl bg-card border border-border/50">
                    <ShieldCheck size={18} className="text-emerald-500 mx-auto mb-1" />
                    <span className="text-[10px] font-bold text-foreground block">3 a 5 Años</span>
                    <span className="text-[9px] text-muted-foreground block leading-tight">Garantía directa</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-card border border-border/50">
                    <Truck size={18} className="text-amber-500 mx-auto mb-1" />
                    <span className="text-[10px] font-bold text-foreground block">Envíos Ecuador</span>
                    <span className="text-[9px] text-muted-foreground block leading-tight">Quito y provincias</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-card border border-border/50">
                    <CheckCircle2 size={18} className="text-primary mx-auto mb-1" />
                    <span className="text-[10px] font-bold text-foreground block">Pelikano RH</span>
                    <span className="text-[9px] text-muted-foreground block leading-tight">Antihumedad 18mm</span>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Especificaciones y Conversión de Compra */}
              <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="outline" className="text-primary border-primary/30 text-xs font-bold uppercase tracking-wider">
                      {selectedProduct.subcategory || selectedProduct.category}
                    </Badge>
                    <span className="text-xs font-mono font-bold text-muted-foreground">
                      SKU: GM-{selectedProduct.id}
                    </span>
                  </div>

                  <DialogTitle className="text-2xl sm:text-3xl font-headline font-bold text-foreground leading-tight">
                    {selectedProduct.title}
                  </DialogTitle>

                  <DialogDescription className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {selectedProduct.desc}
                  </DialogDescription>

                  {/* Ficha Técnica Detallada */}
                  <div className="mt-5 rounded-2xl bg-muted/40 p-4 border border-border/60 text-xs space-y-2.5">
                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Sparkles size={12} className="text-primary" /> Material de estructura:
                      </span>
                      <span className="font-semibold text-foreground text-right">
                        {selectedProduct.material || 'Melamina Pelikano RH 18mm hidrófuga'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-border/40">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-emerald-500" /> Herrajes:
                      </span>
                      <span className="font-semibold text-foreground">
                        Blum / Häfele con cierre amortiguado
                      </span>
                    </div>

                    {selectedProduct.dimensions && (
                      <div className="flex justify-between items-center py-1 border-b border-border/40">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Ruler size={12} className="text-primary" /> Dimensiones:
                        </span>
                        <span className="font-semibold text-foreground">
                          {selectedProduct.dimensions}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center py-1">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Clock size={12} className="text-amber-500" /> Tiempo de entrega:
                      </span>
                      <span className="font-semibold text-foreground">
                        7 a 15 días hábiles a medida
                      </span>
                    </div>
                  </div>

                  {/* Precio y Condiciones Comerciales */}
                  <div className="mt-5 p-4 rounded-2xl border border-primary/20 bg-primary/5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                      Inversión Estimada
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl font-black text-foreground tracking-tight">
                        {selectedProduct.price ? `$${selectedProduct.price.toLocaleString('es-EC')}` : 'Cotización a Medida'}
                      </span>
                      {selectedProduct.priceUnit === 'metro_lineal' && (
                        <span className="text-xs font-semibold text-muted-foreground">USD / metro lineal</span>
                      )}
                      {selectedProduct.discountPrice && (
                        <span className="text-sm font-semibold text-muted-foreground line-through ml-1">
                          ${selectedProduct.discountPrice.toLocaleString('es-EC')}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">
                      💳 Facilidades de pago: Tarjeta de crédito hasta 12 meses, transferencia bancaria o 50% anticipo y saldo contra entrega.
                    </p>
                  </div>
                </div>

                {/* Botones de Acción Directa para la Compra */}
                <div className="space-y-3 pt-2">
                  {/* Botón WhatsApp */}
                  <a
                    href={whatsappHref(
                      whatsappNumber,
                      `¡Hola Modulares GM! Me interesa comprar / cotizar el modelo: *${selectedProduct.title}* (Código: GM-${selectedProduct.id}, Precio referencial: $${selectedProduct.price || 'A convenir'}). ¿Me podrían dar asesoría sobre acabados y agendar visita o cotización?`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('whatsapp_click', { location: 'catalogo_modal', item_name: selectedProduct.title })}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md active:scale-95 transition-all text-center"
                  >
                    <MessageCircle size={18} />
                    <span>Comprar / Cotizar por WhatsApp con Asesor</span>
                  </a>

                  {/* Botón Agregar al Carrito */}
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(selectedProduct);
                      setCartSuccess(true);
                      setTimeout(() => setCartSuccess(false), 2200);
                    }}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-bold text-sm shadow-sm active:scale-95 transition-all",
                      cartSuccess
                        ? "bg-emerald-600 text-white"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    )}
                  >
                    {cartSuccess ? (
                      <>
                        <CheckCircle2 size={18} className="text-white" />
                        <span>¡Agregado al Carrito Exitosamente!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={18} />
                        <span>Agregar al Carrito de Compras</span>
                      </>
                    )}
                  </button>

                  {/* Enlaces de Tienda y Ficha */}
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <Link
                      href={`/store?category=${encodeURIComponent(selectedProduct.category)}`}
                      className="text-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      <Store size={13} />
                      <span>Ver más en Tienda</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDownloadPdf(selectedRowForProduct.id)}
                      disabled={isGeneratingPdf}
                      className="text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 hover:underline"
                    >
                      <FileDown size={13} />
                      <span>Descargar PDF de esta línea</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
