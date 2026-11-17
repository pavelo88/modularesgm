'use client';

import { useContext, useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Ruler, Package, Eye, MessageCircle, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [cardImageIdx, setCardImageIdx] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const unitLabel = product.priceUnit ? (PRICE_UNIT_LABEL[product.priceUnit] ?? '') : '';
  const isOutOfStock = product.inStock === false;
  const isCustomQuote = !product.price || product.price === 0;

  // Colección deduplicada de imágenes disponibles para el producto (sin repetir fotos)
  const allImages = useMemo(() => {
    const list = [product.imgUrl, ...(product.images || [])].filter(Boolean) as string[];
    return Array.from(new Set(list));
  }, [product.imgUrl, product.images]);

  const hasSecondaryAngle = allImages.length > 1;

  // Auto-carrusel suave al pasar el cursor (hover) para ver los ángulos
  useEffect(() => {
    if (!isHovered || !hasSecondaryAngle) return;
    const interval = setInterval(() => {
      setCardImageIdx((prev) => (prev + 1) % allImages.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isHovered, hasSecondaryAngle, allImages.length]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCardImageIdx((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCardImageIdx((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  const handleSelectImage = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setCardImageIdx(idx);
  };

  const openQuickView = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIdx(cardImageIdx);
    setIsQuickViewOpen(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWhatsAppQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    const priceText = product.price ? ` (Precio: $${product.price})` : '';
    const dimText = product.dimensions ? ` - Medidas: ${product.dimensions}` : '';
    const message = isCustomQuote
      ? `¡Hola Modulares GM! Me interesa cotizar a medida el proyecto: *${product.title}*${dimText}. ¿Podrían agendar una visita técnica o asesorarme?`
      : `¡Hola Modulares GM! Me interesa el producto: *${product.title}*${priceText}${dimText}. ¿Tienen disponibilidad o entrega e instalación en Quito?`;
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
        {/* Contenedor de la Imagen con Carousel de Ángulos */}
        <div 
          onClick={openQuickView}
          className="relative aspect-[16/10] w-full overflow-hidden bg-muted/40 cursor-pointer select-none"
        >
          {/* Imagen Activa del Carousel */}
          <Image
            src={allImages[cardImageIdx] || allImages[0]}
            alt={`${product.title} - Foto ${cardImageIdx + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-all duration-500 group-hover:scale-105"
            priority={false}
          />

          {/* Overlay de gradiente sutil estilo Apple */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Badges superiores */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-background/80 dark:bg-black/60 backdrop-blur-md text-foreground border border-white/10 shadow-sm">
              {product.category}
            </span>
            {hasSecondaryAngle && (
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/20 backdrop-blur-md text-primary font-bold border border-primary/30 flex items-center gap-1">
                {cardImageIdx + 1}/{allImages.length} fotos
              </span>
            )}
          </div>

          {/* Controles del Carrusel (Flechas Anterior y Siguiente) */}
          {hasSecondaryAngle && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 shadow-md"
                title="Foto anterior"
                aria-label="Ver foto anterior"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 shadow-md"
                title="Siguiente foto"
                aria-label="Ver siguiente foto"
              >
                <ChevronRight size={14} />
              </button>

              {/* Indicadores de Puntos (Dots) */}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 pointer-events-auto bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                {allImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => handleSelectImage(e, idx)}
                    aria-label={`Ver foto ${idx + 1}`}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300 active:scale-90",
                      cardImageIdx === idx 
                        ? "w-3 bg-primary shadow-sm" 
                        : "w-1 bg-white/60 hover:bg-white"
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* Botón Flotante de Vista Rápida */}
          <button
            type="button"
            onClick={openQuickView}
            className="absolute bottom-2.5 right-2.5 z-20 p-2 rounded-full bg-background/80 dark:bg-black/70 backdrop-blur-md text-foreground border border-white/15 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
            title="Vista rápida y detalles"
            aria-label="Ver detalles del producto"
          >
            <Eye size={14} />
          </button>
        </div>

        {/* Contenido / Información Proporcional */}
        <div className="p-4 flex-1 flex flex-col justify-between gap-3">
          <div>
            {product.subcategory && (
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">
                {product.subcategory}
              </p>
            )}
            <h3 
              onClick={openQuickView}
              className="text-sm sm:text-base font-semibold text-foreground line-clamp-1 cursor-pointer hover:text-primary transition-colors"
            >
              {product.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 font-light">
              {product.desc}
            </p>

            {/* Ficha técnica compacta */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2.5 border-t border-border/40">
              {product.dimensions && (
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md font-mono">
                  <Ruler size={10} className="text-primary shrink-0" />
                  {product.dimensions}
                </span>
              )}
              {product.material && (
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md line-clamp-1 max-w-[170px]">
                  <Package size={10} className="text-primary shrink-0" />
                  {product.material}
                </span>
              )}
            </div>
          </div>

          {/* Footer de Precio y Acción */}
          <div className="flex items-center justify-between pt-2.5 border-t border-border/40">
            <div>
              {isCustomQuote ? (
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary block">
                    A Medida
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Cotización directa
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground block">
                    Precio Directo
                  </span>
                  <p className="text-lg font-black text-foreground tracking-tight">
                    ${product.price}
                    {unitLabel && <span className="text-[10px] font-normal text-muted-foreground ml-1">{unitLabel}</span>}
                  </p>
                </div>
              )}
            </div>

            {/* Botón de Acción Principal */}
            {isCustomQuote ? (
              <Button
                size="sm"
                onClick={handleWhatsAppQuote}
                className="h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3 py-1 flex items-center gap-1 active:scale-95 transition-all shadow-sm"
              >
                <MessageCircle size={13} />
                <span>Cotizar</span>
              </Button>
            ) : (
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleWhatsAppQuote}
                  className="h-8 w-8 p-0 rounded-full border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-600 text-emerald-600 hover:text-white transition-all active:scale-95 shadow-sm"
                  title="Consultar disponibilidad por WhatsApp"
                  aria-label={`Consultar ${product.title} por WhatsApp`}
                >
                  <MessageCircle size={14} />
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={cn(
                    "h-8 rounded-full font-semibold text-xs px-3 py-1 flex items-center gap-1 active:scale-95 transition-all shadow-sm",
                    addedAnimation
                      ? "bg-emerald-600 text-white"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  aria-label={`Agregar ${product.title} al carrito`}
                >
                  {addedAnimation ? (
                    <>
                      <Check size={13} />
                      <span>Listo</span>
                    </>
                  ) : (
                    <>
                      <Plus size={13} />
                      <span>Agregar</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Modal de Vista Rápida ("Quick View" & Galería de Ángulos - Mismo estándar de Catálogo) */}
      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl bg-background/95 backdrop-blur-2xl border border-border/80 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Columna Izquierda: Galería y Fotos del Producto */}
            <div className="lg:col-span-6 bg-muted/20 p-5 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/60">
              <div>
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-background border border-border/60 shadow-md">
                  <Image
                    src={allImages[activeImageIdx] || allImages[0]}
                    alt={product.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/10 shadow-sm">
                    {product.category} • Ref GM-{product.id}
                  </div>
                </div>

                {/* Miniaturas de los ángulos */}
                {allImages.length > 1 && (
                  <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIdx(idx)}
                        className={cn(
                          "relative w-16 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 active:scale-95",
                          activeImageIdx === idx ? "border-primary scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      >
                        <Image src={img} alt={`Ángulo ${idx + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sellos de Confianza de Fábrica GM */}
              <div className="grid grid-cols-3 gap-2 mt-5 pt-5 border-t border-border/60 text-center">
                <div className="p-2 rounded-xl bg-card border border-border/50">
                  <span className="text-[10px] font-bold text-foreground block">3 a 5 Años</span>
                  <span className="text-[9px] text-muted-foreground block leading-tight">Garantía directa</span>
                </div>
                <div className="p-2 rounded-xl bg-card border border-border/50">
                  <span className="text-[10px] font-bold text-foreground block">Envíos Ecuador</span>
                  <span className="text-[9px] text-muted-foreground block leading-tight">Quito y valles</span>
                </div>
                <div className="p-2 rounded-xl bg-card border border-border/50">
                  <span className="text-[10px] font-bold text-foreground block">Pelikano RH</span>
                  <span className="text-[9px] text-muted-foreground block leading-tight">18mm hidrófugo</span>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Información Técnica y Compra */}
            <div className="lg:col-span-6 p-5 sm:p-8 flex flex-col justify-between gap-5 text-left">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-primary border-primary/30 text-xs font-bold uppercase tracking-wider">
                    {product.subcategory || product.category}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-muted-foreground">
                    SKU: GM-{product.id}
                  </span>
                </div>

                <DialogTitle className="text-xl sm:text-2xl font-bold font-headline text-foreground leading-tight">
                  {product.title}
                </DialogTitle>

                <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                  {product.desc}
                </DialogDescription>

                <div className="mt-4 space-y-2 bg-muted/40 p-3.5 rounded-2xl border border-border/60 text-xs text-foreground">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Material:</span>
                    <span className="font-semibold text-right">{product.material || 'Melamina RH 18mm Pelikano'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Garantía:</span>
                    <span className="font-semibold text-emerald-500">3 años contra defectos</span>
                  </div>
                  {product.dimensions && (
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Dimensiones:</span>
                      <span className="font-semibold">{product.dimensions}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Instalación:</span>
                    <span className="font-semibold">Quito y valles (disponible)</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="p-3.5 rounded-2xl border border-primary/20 bg-primary/5 mb-4">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    {isCustomQuote ? 'Presupuesto' : 'Precio Oficial'}
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-black text-foreground">
                      {isCustomQuote ? 'A Medida' : `$${product.price}`}
                    </span>
                    {unitLabel && <span className="text-xs text-muted-foreground font-semibold">{unitLabel}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <Button
                    onClick={handleWhatsAppQuote}
                    className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-5 sm:py-6 text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <MessageCircle size={18} />
                    <span>
                      {isCustomQuote 
                        ? 'Cotizar por WhatsApp & Render 3D' 
                        : 'Comprar / Cotizar por WhatsApp'}
                    </span>
                  </Button>

                  {!isCustomQuote && (
                    <Button
                      variant="outline"
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className={cn(
                        "w-full rounded-2xl border-border/80 hover:bg-muted font-semibold py-4 sm:py-5 text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm",
                        addedAnimation && "bg-emerald-600 text-white border-emerald-600"
                      )}
                    >
                      {addedAnimation ? (
                        <>
                          <Check size={16} />
                          <span>¡Agregado al Carrito!</span>
                        </>
                      ) : (
                        <>
                          <Plus size={16} />
                          <span>Agregar al Carrito</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
