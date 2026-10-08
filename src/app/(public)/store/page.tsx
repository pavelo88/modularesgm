'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Sparkles, Store as StoreIcon, ShieldCheck, Truck, Wrench, ChevronRight } from 'lucide-react';
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

export default function StorePage() {
  const { siteContent, loading } = useSiteContent();
  const { selectedCategory, setSelectedCategory } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* BREADCRUMB DE NAVEGACIÓN */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <ChevronRight size={14} />
          <span className="text-foreground font-medium">Tienda Oficial</span>
        </nav>

        {/* CÁPSULA GEO DIRECT ANSWER (Primeros 1,000 caracteres de DOM) */}
        <aside 
          aria-label="Resumen ejecutivo y especificaciones técnicas"
          className="mb-8 p-5 sm:p-6 rounded-3xl border border-primary/20 bg-primary/5 backdrop-blur-md relative overflow-hidden"
        >
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles size={15} />
            <span>Direct Answer • Catálogo Oficial de Modulares GM</span>
          </div>
          <p className="text-sm md:text-base text-foreground font-medium mb-3 leading-relaxed">
            Mobiliario modular a medida para residencias, oficinas y proyectos comerciales en Ecuador. Fabricación con tableros Pelikano RH de 18mm resistentes a la humedad, herrajes europeos con cierre amortiguado y mesones en cuarzo y granito natural.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-muted-foreground">
            <li className="flex items-center gap-1.5"><span className="text-primary font-bold">✔</span> Tableros RH 18mm hidrófugos</li>
            <li className="flex items-center gap-1.5"><span className="text-primary font-bold">✔</span> Herrajes Blum / Häfele con cierre lento</li>
            <li className="flex items-center gap-1.5"><span className="text-primary font-bold">✔</span> Garantía oficial de 3 a 5 años</li>
            <li className="flex items-center gap-1.5"><span className="text-primary font-bold">✔</span> Envíos e instalación en Ecuador</li>
          </ul>
        </aside>

        {/* HERO PRINCIPAL DE LA TIENDA */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/60">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
                Catálogo General • Colección 2026
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-headline tracking-tight text-foreground">
                Mobiliario Modular de <span className="text-primary">Alta Gama</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg mt-3 font-normal max-w-2xl leading-relaxed">
                Diseño contemporáneo, tableros hidrófugos de 18mm y herrajes con cierre suave. Explora piezas listas para instalar o cotiza tu proyecto a medida.
              </p>
            </div>
          </div>

          {/* Señales de Confianza Luxury */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-card/40 border border-border/40 text-xs">
              <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
              <span className="font-medium text-foreground">Garantía 3 a 5 años</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-card/40 border border-border/40 text-xs">
              <Truck size={18} className="text-primary shrink-0" />
              <span className="font-medium text-foreground">Envíos a todo Ecuador</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-card/40 border border-border/40 text-xs">
              <Wrench size={18} className="text-amber-500 shrink-0" />
              <span className="font-medium text-foreground">Instalación en Quito</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-card/40 border border-border/40 text-xs">
              <Sparkles size={18} className="text-violet-500 shrink-0" />
              <span className="font-medium text-foreground">Melamina Pelikano 18mm</span>
            </div>
          </div>
        </header>

        {/* BARRA DE FILTROS ÚNICA & BÚSQUEDA (Diseño Aprobado de Imagen 4) */}
        <section aria-label="Filtros de productos" className="mb-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-2 rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-sm">
            
            {/* Píldoras de Categorías Minimalistas */}
            <div className="flex items-center gap-1.5 overflow-x-auto px-2 py-1 scrollbar-none">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
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
        <main>
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
