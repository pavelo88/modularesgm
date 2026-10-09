'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Sparkles, ShieldCheck, Truck, Wrench, ChevronRight, HelpCircle, ArrowLeft } from 'lucide-react';
import type { Product } from '@/lib/types';
import type { CategorySEO } from '@/lib/catalog-full';
import { ProductCard } from '@/components/store/product-card';
import { CartSidebar } from '@/components/store/cart-sidebar';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface CategoryShowcaseProps {
  config: CategorySEO;
  products: Product[];
}

export function CategoryShowcase({ config, products }: CategoryShowcaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Todos');

  const subcategories = useMemo(() => {
    const subs = Array.from(new Set(products.map(p => p.subcategory).filter(Boolean))) as string[];
    return ['Todos', ...subs];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.dimensions && product.dimensions.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesSubcategory = 
        selectedSubcategory === 'Todos' || product.subcategory === selectedSubcategory;

      return matchesSearch && matchesSubcategory;
    });
  }, [products, searchQuery, selectedSubcategory]);

  // Schema.org JSON-LD para CollectionPage, ItemList y FAQPage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `https://www.modularesgm.com/${config.slug}#webpage`,
        url: `https://www.modularesgm.com/${config.slug}`,
        name: config.title,
        description: config.metaDescription,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Inicio',
              item: 'https://www.modularesgm.com'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Tienda',
              item: 'https://www.modularesgm.com/store'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: config.categoryName,
              item: `https://www.modularesgm.com/${config.slug}`
            }
          ]
        }
      },
      {
        '@type': 'ItemList',
        itemListElement: products.map((p, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: p.title,
            description: p.desc,
            image: `https://www.modularesgm.com${p.imgUrl}`,
            offers: {
              '@type': 'Offer',
              price: p.price || 0,
              priceCurrency: 'USD',
              availability: p.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
            }
          }
        }))
      },
      {
        '@type': 'FAQPage',
        mainEntity: config.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      }
    ]
  };

  return (
    <>
      {/* Inyección JSON-LD Schema.org para SEO & Google AI */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb de Navegación */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <ChevronRight size={14} />
            <Link href="/store" className="hover:text-primary transition-colors">Tienda</Link>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">{config.categoryName}</span>
          </nav>

          {/* HERO SECTION DE LA CATEGORÍA */}
          <header className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/60">
              <div className="max-w-3xl">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary mb-2 block">
                  Catálogo Oficial GM • {config.categoryName}
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-headline tracking-tight text-foreground">
                  {config.h1}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base mt-2 font-normal max-w-2xl leading-relaxed">
                  {config.heroSubtitle}
                </p>
              </div>

              {/* Botón Volver a la Tienda Global */}
              <Link 
                href="/catalogo"
                className="inline-flex items-center gap-2 text-xs font-bold text-foreground hover:text-primary transition-colors px-5 py-2.5 rounded-full border border-border/80 bg-card/60 shrink-0 shadow-sm active:scale-95"
              >
                <ArrowLeft size={14} />
                <span>Ver todos los catálogos</span>
              </Link>
            </div>

            {/* Señales de Confianza Luxury */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
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

          {/* BARRA DE FILTROS & BÚSQUEDA MINIMALISTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
            {/* Píldoras de Subcategorías */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {subcategories.map(sub => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95 ${
                    selectedSubcategory === sub
                      ? 'bg-foreground text-background shadow-md'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Buscador de Producto */}
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar modelo o medidas..."
                className="pl-9 rounded-full bg-muted/40 border-border/60 text-xs h-10 focus:ring-primary"
              />
            </div>
          </div>

          {/* GRID DE PRODUCTOS CON HOVER DE ÁNGULOS */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center rounded-3xl border border-dashed border-border/60 bg-muted/20">
              <p className="text-muted-foreground text-sm">
                No encontramos modelos que coincidan con &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedSubcategory('Todos'); }}
                className="mt-3 text-xs text-primary font-bold hover:underline"
              >
                Restablecer filtros
              </button>
            </div>
          )}

          {/* SECCIÓN FAQ PARA SEO Y RICH SNIPPETS */}
          {config.faqs && config.faqs.length > 0 && (
            <section className="mt-24 max-w-4xl mx-auto pt-16 border-t border-border/60">
              <div className="text-center mb-10">
                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 inline-flex items-center gap-1.5">
                  <HelpCircle size={14} />
                  <span>Preguntas Frecuentes</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-headline text-foreground">
                  Todo lo que necesitas saber antes de comprar
                </h2>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {config.faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="border border-border/50 bg-card/40 rounded-2xl px-6 data-[state=open]:border-primary/40 transition-colors"
                  >
                    <AccordionTrigger className="text-left font-bold text-sm sm:text-base py-4 hover:no-underline hover:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-xs sm:text-sm pb-4 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}

        </div>
      </div>

      {/* Carrito Lateral Funcional */}
      <CartSidebar />
    </>
  );
}
