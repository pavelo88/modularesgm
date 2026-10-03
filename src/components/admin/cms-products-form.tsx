'use client';

import { useState, useTransition, useMemo } from 'react';
import type { SiteContent, Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { saveSiteContent, getProductDescription } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Save, Sparkles, Trash2, RotateCcw, Search, Star, Package } from 'lucide-react';
import { Card } from '../ui/card';
import { ImageUploader } from './image-uploader';
import { defaultSiteContent } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

const CATALOG_CATEGORIES = [
  'Todos', 'Closets', 'Cocinas', 'Oficina', 'Gamer', 'Baño', 'Puertas', 'Estimulación', 'Escritorios', 'General'
];

const PRICE_UNIT_OPTIONS = [
  { value: 'unidad', label: 'Por unidad' },
  { value: 'metro_lineal', label: 'Por metro lineal' },
  { value: 'metro_cuadrado', label: 'Por metro cuadrado' },
];

interface CmsProductsFormProps {
  siteContent: SiteContent;
  setSiteContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}

export function CmsProductsForm({ siteContent, setSiteContent }: CmsProductsFormProps) {
  const { toast } = useToast();
  const [isSaving, startSaving] = useTransition();
  const [generatingDescId, setGeneratingDescId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const handleProductChange = (id: number, field: keyof Product, value: unknown) => {
    setSiteContent(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Date.now(),
      title: 'Nuevo Producto',
      desc: 'Descripción comercial del producto...',
      price: 0,
      discountPrice: null,
      imgUrl: defaultSiteContent.products[0]?.imgUrl || '',
      category: activeCategory !== 'Todos' ? activeCategory : 'General',
      priceUnit: 'unidad',
      inStock: true,
      featured: false,
    };
    setSiteContent(prev => ({
      ...prev,
      products: [newProduct, ...prev.products]
    }));
    setActiveCategory(newProduct.category);
    toast({ title: 'Producto añadido', description: 'Completa los datos y guarda los cambios.' });
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('¿Eliminar este producto definitivamente de la tienda?')) {
      setSiteContent(prev => ({
        ...prev,
        products: prev.products.filter(p => p.id !== id)
      }));
      toast({ title: 'Producto eliminado', description: 'Recuerda guardar para aplicar los cambios.' });
    }
  };

  const handleRestoreDefaults = () => {
    if (confirm('¿Restaurar todos los productos a los valores por defecto?')) {
      setSiteContent(prev => ({ ...prev, products: defaultSiteContent.products }));
    }
  };

  const handleSave = () => {
    startSaving(async () => {
      const result = await saveSiteContent(siteContent);
      if (result.success) {
        toast({ title: 'Éxito', description: 'Catálogo de productos actualizado.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    });
  };

  const handleGenerateDesc = async (product: Product) => {
    setGeneratingDescId(product.id);
    const result = await getProductDescription(product.title, product.category);
    if (result.success && result.data) {
      handleProductChange(product.id, 'desc', result.data);
      toast({ title: 'Éxito', description: 'Descripción generada con IA.' });
    } else {
      toast({ variant: 'destructive', title: 'Error de IA', description: result.error });
    }
    setGeneratingDescId(null);
  };

  // Contadores por categoría
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: siteContent.products.length };
    siteContent.products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [siteContent.products]);

  // Filtrado combinado: categoría + búsqueda
  const filteredProducts = useMemo(() => {
    let list = siteContent.products;
    if (activeCategory !== 'Todos') list = list.filter(p => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return list;
  }, [siteContent.products, activeCategory, search]);

  return (
    <div className="space-y-6">
      {/* Header sticky */}
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border sticky top-0 z-10 gap-4">
        <div>
          <h1 className="text-xl font-bold">Catálogo de la Tienda</h1>
          <p className="text-xs text-muted-foreground">
            {siteContent.products.length} productos · {filteredProducts.length} visibles
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRestoreDefaults}>
            <RotateCcw className="mr-2 h-4 w-4" /> Restaurar
          </Button>
          <Button variant="outline" size="sm" onClick={handleAddProduct}>
            <Plus className="mr-2 h-4 w-4" /> Añadir
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar
          </Button>
        </div>
      </div>

      {/* Filtro por categoría + búsqueda */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar producto por nombre o categoría..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATALOG_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all border",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted border-transparent hover:border-primary/40 text-muted-foreground"
              )}
            >
              {cat}
              {categoryCounts[cat] !== undefined && (
                <span className="ml-1.5 opacity-60">({categoryCounts[cat] ?? 0})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        {filteredProducts.length === 0 && (
          <div className="col-span-2 py-16 text-center text-muted-foreground">
            <Package size={40} className="mx-auto mb-3 opacity-20" />
            <p>No se encontraron productos en esta categoría.</p>
          </div>
        )}
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group overflow-hidden border-2 hover:border-primary/20 transition-all">
            <div className="flex flex-col gap-5 p-5">

              {/* Imagen */}
              <ImageUploader
                label="Foto del Producto"
                currentUrl={product.imgUrl}
                onUpload={(url) => {
                  const cacheBuster = url.includes('?') ? `&v=${Date.now()}` : `?v=${Date.now()}`;
                  handleProductChange(product.id, 'imgUrl', url + cacheBuster);
                }}
                onRemove={() => {
                  const defaultImg = defaultSiteContent.products.find(p => p.id === product.id)?.imgUrl || defaultSiteContent.products[0].imgUrl;
                  handleProductChange(product.id, 'imgUrl', defaultImg);
                }}
                folder="products"
              />

              {/* Título + Categoría */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Título</Label>
                  <Input value={product.title || ''} onChange={e => handleProductChange(product.id, 'title', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Categoría</Label>
                  <select
                    value={product.category || ''}
                    onChange={e => handleProductChange(product.id, 'category', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {CATALOG_CATEGORIES.filter(c => c !== 'Todos').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subcategoría + Material */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Subcategoría</Label>
                  <Input
                    placeholder="ej: Closet Moderno, Cocina en L..."
                    value={product.subcategory || ''}
                    onChange={e => handleProductChange(product.id, 'subcategory', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Dimensiones</Label>
                  <Input
                    placeholder="ej: 2.40m x 0.60m x 2.10m"
                    value={product.dimensions || ''}
                    onChange={e => handleProductChange(product.id, 'dimensions', e.target.value)}
                  />
                </div>
              </div>

              {/* Material */}
              <div className="space-y-1">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">Material</Label>
                <Input
                  placeholder="ej: MDF 18mm, melamina blanca, herrajes Blum..."
                  value={product.material || ''}
                  onChange={e => handleProductChange(product.id, 'material', e.target.value)}
                />
              </div>

              {/* Precio + Unidad + Oferta */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Precio ($)</Label>
                  <Input
                    type="number"
                    value={product.price ?? 0}
                    onChange={e => handleProductChange(product.id, 'price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Unidad precio</Label>
                  <select
                    value={product.priceUnit || 'unidad'}
                    onChange={e => handleProductChange(product.id, 'priceUnit', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {PRICE_UNIT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Oferta ($)</Label>
                  <Input
                    type="number"
                    value={product.discountPrice ?? ''}
                    onChange={e => handleProductChange(product.id, 'discountPrice', e.target.value ? parseFloat(e.target.value) : null)}
                  />
                </div>
              </div>

              {/* Descripción con IA */}
              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Descripción</Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-[9px] bg-primary/5 hover:bg-primary/10"
                    onClick={() => handleGenerateDesc(product)}
                    disabled={generatingDescId === product.id}
                  >
                    {generatingDescId === product.id ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Sparkles className="mr-1 h-3 w-3" />}
                    Generar con IA
                  </Button>
                </div>
                <Textarea
                  value={product.desc || ''}
                  onChange={e => handleProductChange(product.id, 'desc', e.target.value)}
                  className="h-20 resize-none text-sm"
                />
              </div>

              {/* Toggles + Acciones */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`stock-${product.id}`}
                      checked={product.inStock !== false}
                      onCheckedChange={v => handleProductChange(product.id, 'inStock', v)}
                    />
                    <Label htmlFor={`stock-${product.id}`} className="text-xs cursor-pointer">
                      {product.inStock !== false ? 'En stock' : 'Sin stock'}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`featured-${product.id}`}
                      checked={product.featured === true}
                      onCheckedChange={v => handleProductChange(product.id, 'featured', v)}
                    />
                    <Label htmlFor={`featured-${product.id}`} className="text-xs flex items-center gap-1 cursor-pointer">
                      <Star size={10} className={product.featured ? 'text-yellow-500 fill-yellow-500' : ''} />
                      Destacado
                    </Label>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </Button>
              </div>

            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

