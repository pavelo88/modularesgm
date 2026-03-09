'use client';

import { useState, useTransition } from 'react';
import type { SiteContent, Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { saveSiteContent, getProductDescription } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Save, Sparkles, Trash2, ShoppingBag } from 'lucide-react';
import { Card } from '../ui/card';
import { ImageUploader } from './image-uploader';
import { ScrollArea } from '@/components/ui/scroll-area';

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
      imgUrl: 'https://picsum.photos/seed/' + Date.now() + '/800/800',
      category: 'General'
    };
    setSiteContent(prev => ({ ...prev, products: [newProduct, ...prev.products] }));
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setSiteContent(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
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
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
            <h1 className="text-xl font-bold">Catálogo de la Tienda</h1>
            <p className="text-xs text-muted-foreground">{siteContent.products.length} productos listos para la venta.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAddProduct}><Plus className="mr-2 h-4 w-4" /> Añadir</Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar
            </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 pr-4">
        <div className="grid grid-cols-1 gap-6 pb-20">
          {siteContent.products.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-2 hover:border-primary/20 transition-all">
              <div className="flex flex-col md:flex-row gap-6 p-6">
                <div className="w-full md:w-64 shrink-0">
                  <ImageUploader
                    label="Foto del Producto"
                    currentUrl={product.imgUrl}
                    onUpload={(url) => handleProductChange(product.id, 'imgUrl', url)}
                    onRemove={() => handleProductChange(product.id, 'imgUrl', 'https://picsum.photos/seed/product/800/800')}
                    folder="products"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground">Título Comercial</Label>
                      <Input value={product.title || ''} onChange={(e) => handleProductChange(product.id, 'title', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase text-muted-foreground">Categoría</Label>
                      <Input value={product.category || ''} onChange={(e) => handleProductChange(product.id, 'category', e.target.value)} />
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
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center mb-1">
                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Descripción del Producto</Label>
                        <Button 
                            size="xs" 
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
                    <p className="text-[10px] text-muted-foreground">Producto ID: {product.id}</p>
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar Producto
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
