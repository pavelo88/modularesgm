'use client';

import { useContext, useState } from 'react';
import Image from 'next/image';
import { Plus, Ruler, Package, Eye, MessageCircle, Check, X } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/cart-provider';
import { cn } from '@/lib/utils';
import { SITE, whatsappHref } from '@/lib/site';
import { track } from '@/lib/analytics';
import { SiteContentContext } from '@/context/site-content-provider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const PRICE_UNIT_LABEL: Record<string, string> = {
  metro_lineal: '/ m. lineal',
  metro_cuadrado: '/ m²',
  unidad: '',
};

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const whatsappNumber = useContext(SiteContentContext)?.siteContent?.whatsappNumber || SITE.phone;
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const unitLabel = product.priceUnit ? (PRICE_UNIT_LABEL[product.priceUnit] ?? '') : '';
  const isOutOfStock = product.inStock === false;
  const isCustomQuote = !product.price || product.price === 0;

  // Colección de todas las imágenes disponibles para el producto (foto principal + ángulos secundarios)
  const allImages = [product.imgUrl, ...(product.images || [])].filter(Boolean);
  const hasSecondaryAngle = allImages.length > 1;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWhatsAppQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `¡Hola Modulares GM! Me interesa solicitar una cotización personalizada del producto: *${product.title}*${product.dimensions ? ` (Medidas: ${product.dimensions})` : ''}. ¿Me podrían dar asesoría?`;
    track('whatsapp_click', { location: 'producto', item_name: product.title });
    window.open(whatsappHref(whatsappNumber, message), '_blank');
  };

  return (
    <>
      <article
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "group relative flex flex-col h-full rounded-3xl border border-border/50 bg-card/60 backdrop-blur-md overflow-hidden transition-all duration-500",
          "hover:border-primary/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:-translate-y-1.5",
          isOutOfStock && "opacity-60"
        )}
      >
        {/* Contenedor de la Imagen con Transición de Ángulo (Hover) */}
        <div 
          onClick={() => setIsQuickViewOpen(true)}
          className="relative aspect-[4/3] w-full overflow-hidden bg-muted/40 cursor-pointer"
        >
          {/* Imagen Primaria */}
          <Image
            src={allImages[0]}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={cn(
              "object-cover transition-all duration-700",
              hasSecondaryAngle && isHovered ? "opacity-0 scale-105" : "opacity-100 group-hover:scale-105"
            )}
            priority={false}
          />

          {/* Imagen Secundaria (Segundo ángulo en Hover) */}
          {hasSecondaryAngle && (
            <Image
              src={allImages[1]}
              alt={`${product.title} - Ángulo alternativo`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={cn(
                "object-cover transition-all duration-700 absolute inset-0",
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100 pointer-events-none"
              )}
            />
          )}

          {/* Overlay de gradiente sutil estilo Apple */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Badges superiores */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-background/80 dark:bg-black/60 backdrop-blur-md text-foreground border border-white/10 shadow-sm">
              {product.category}
            </span>
            {hasSecondaryAngle && (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-primary/20 backdrop-blur-md text-primary font-bold border border-primary/30 flex items-center gap-1">
                +2 ángulos
              </span>
            )}
          </div>

          {/* Botón Flotante de Vista Rápida */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            className="absolute bottom-3 right-3 p-2.5 rounded-full bg-background/80 dark:bg-black/70 backdrop-blur-md text-foreground border border-white/15 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
            title="Vista rápida y detalles"
            aria-label="Ver detalles del producto"
          >
            <Eye size={16} />
          </button>
        </div>

        {/* Contenido / Información */}
        <div className="p-5 flex-1 flex flex-col justify-between gap-4">
          <div>
            {product.subcategory && (
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">
                {product.subcategory}
              </p>
            )}
            <h3 
              onClick={() => setIsQuickViewOpen(true)}
              className="text-base md:text-lg font-bold text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors"
            >
              {product.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 font-normal">
              {product.desc}
            </p>

            {/* Ficha técnica compacta */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border/40">
              {product.dimensions && (
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md font-mono">
                  <Ruler size={11} className="text-primary shrink-0" />
                  {product.dimensions}
                </span>
              )}
              {product.material && (
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md line-clamp-1 max-w-[200px]">
                  <Package size={11} className="text-primary shrink-0" />
                  {product.material}
                </span>
              )}
            </div>
          </div>

          {/* Footer de Precio y Acción */}
          <div className="flex items-center justify-between pt-3 border-t border-border/40">
            <div>
              {isCustomQuote ? (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary block">
                    Fabricación a Medida
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Cotización sin costo
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                    Precio Directo
                  </span>
                  <p className="text-2xl font-black text-foreground tracking-tight">
                    ${product.price}
                    {unitLabel && <span className="text-xs font-normal text-muted-foreground ml-1">{unitLabel}</span>}
                  </p>
                </div>
              )}
            </div>

            {/* Botón de Acción Principal */}
            {isCustomQuote ? (
              <Button
                size="sm"
                onClick={handleWhatsAppQuote}
                className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 flex items-center gap-1.5 active:scale-95 transition-all shadow-md"
              >
                <MessageCircle size={15} />
                <span>Cotizar</span>
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={cn(
                  "rounded-full font-semibold text-xs px-4 py-2 flex items-center gap-1.5 active:scale-95 transition-all shadow-md",
                  addedAnimation
                    ? "bg-emerald-600 text-white"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                aria-label={`Agregar ${product.title} al carrito`}
              >
                {addedAnimation ? (
                  <>
                    <Check size={15} />
                    <span>Agregado</span>
                  </>
                ) : (
                  <>
                    <Plus size={15} />
                    <span>Agregar</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </article>

      {/* Modal de Vista Rápida ("Quick View" & Galería de Ángulos) */}
      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent className="max-w-3xl rounded-3xl p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Galería de Fotos del Producto */}
            <div className="relative bg-muted/30 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border/50">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-background/50 border border-border/40 shadow-inner">
                <Image
                  src={allImages[activeImageIdx] || allImages[0]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Miniaturas de los ángulos */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={cn(
                        "relative w-16 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0",
                        activeImageIdx === idx ? "border-primary scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                      )}
                    >
                      <Image src={img} alt={`Ángulo ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información Técnica y Compra */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-primary border-primary/30 text-xs">
                    {product.category}
                  </Badge>
                  {product.dimensions && (
                    <span className="text-xs font-mono text-muted-foreground">
                      {product.dimensions}
                    </span>
                  )}
                </div>

                <DialogTitle className="text-2xl font-bold font-headline mb-2">
                  {product.title}
                </DialogTitle>

                <DialogDescription className="text-sm text-muted-foreground mb-4">
                  {product.desc}
                </DialogDescription>

                <div className="space-y-2 bg-muted/40 p-4 rounded-2xl border border-border/40 mb-6 text-xs text-foreground">
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">Material:</span>
                    <span className="font-semibold">{product.material || 'Melamina RH 18mm Pelikano'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/30">
                    <span className="text-muted-foreground">Garantía:</span>
                    <span className="font-semibold text-emerald-500">3 años contra defectos</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Instalación:</span>
                    <span className="font-semibold">Quito y valles (disponible)</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-muted-foreground block">
                      {isCustomQuote ? 'Presupuesto' : 'Precio Oficial'}
                    </span>
                    <span className="text-3xl font-black text-foreground">
                      {isCustomQuote ? 'A Medida' : `$${product.price}`}
                    </span>
                    {unitLabel && <span className="text-xs text-muted-foreground ml-1">{unitLabel}</span>}
                  </div>
                </div>

                {isCustomQuote ? (
                  <Button
                    onClick={handleWhatsAppQuote}
                    className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-6 text-base shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <MessageCircle size={20} />
                    <span>Cotizar este modelo por WhatsApp</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-base shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Plus size={20} />
                    <span>Agregar al Carrito</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
