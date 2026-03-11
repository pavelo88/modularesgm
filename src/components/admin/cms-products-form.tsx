'use client';

import { useState, useTransition } from 'react';
import type { SiteContent, Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { saveSiteContent, getProductDescription } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Save, Sparkles, Trash2, RotateCcw } from 'lucide-react';
import { Card } from '../ui/card';
import { ImageUploader } from './image-uploader';
import { defaultSiteContent } from '@/lib/data';

interface CmsProductsFormProps {
  siteContent: SiteContent;
  setSiteContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}

export function CmsProductsForm({ siteContent, setSiteContent }: CmsProductsFormProps) {
  const { toast } = useToast();
  const [isSaving, startSaving] = useTransition();
  const [generatingDescId, setGeneratingDescId] = useState<number | null>(null);

  const handleProductChange = (id: number, field: keyof Product, value: any) => {
    setSiteContent(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };
  
  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Date.now(),
      title: 'Nuevo Producto',
      desc: '',
      price: 0,
      discountPrice: null,
      imgUrl: defaultSiteContent.products[0]?.imgUrl || '',
      category: 'General'
    };
    setSiteContent(prev => ({ ...prev, products: [newProduct, ...prev.products] }));
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setSiteContent(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
    }
  };
  
  const handleRestoreDefaults = () => {
    if (confirm('¿Restaurar todos los productos de la tienda a los valores por defecto?')) {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border sticky top-0 z-10">
        <div>
            <h1 className="text-xl font-bold">Catálogo de la Tienda</h1>
            <p className="text-xs text-muted-foreground">{siteContent.products.length} productos listos para la venta.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRestoreDefaults}><RotateCcw className="mr-2 h-4 w-4" /> Restaurar</Button>
            <Button variant="outline" size="sm" onClick={handleAddProduct}><Plus className="mr-2 h-4 w-4" /> Añadir</Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar Cambios
            </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        {siteContent.products.map((product) => (
          <Card key={product.id} className="group overflow-hidden border-2 hover:border-primary/20 transition-all">
            <div className="flex flex-col gap-6 p-6">
              <div className="w-full shrink-0">
                <ImageUploader
                  label="Foto del Producto"
                  currentUrl={product.imgUrl}
                  onUpload={(url) => handleProductChange(product.id, 'imgUrl', url)}
                  onRemove={() => {
                    const defaultImg = defaultSiteContent.products.find(p => p.id === product.id)?.imgUrl || defaultSiteContent.products[0].imgUrl;
                    handleProductChange(product.id, 'imgUrl', defaultImg);
                  }}
                  folder="products"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Título Comercial</Label>
                    <Input value={product.title || ''} onChange={(e) => handleProductChange(product.id, 'title', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Categoría</Label>
                    <Input value={product.category || ''} onChange={(e) => handleProductChange(product.id, 'category', e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground">Precio ($)</Label>
                      <Input type="number" value={product.price ?? 0} onChange={(e) => handleProductChange(product.id, 'price', parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground">Oferta ($)</Label>
                      <Input type="number" value={product.discountPrice ?? ''} onChange={(e) => handleProductChange(product.id, 'discountPrice', e.target.value ? parseFloat(e.target.value) : null)} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center mb-1">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground">Descripción del Producto</Label>
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
                      onChange={(e) => handleProductChange(product.id, 'desc', e.target.value)} 
                      className="h-20 resize-none text-sm"
                  />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <p className="text-[10px] text-muted-foreground">ID: {product.id}</p>
                  <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Eliminar Producto
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
