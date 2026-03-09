'use client';

import { useState, useTransition } from 'react';
import type { SiteContent, Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { saveSiteContent, getProductDescription } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Save, Sparkles, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '../ui/card';

interface CmsProductsFormProps {
  siteContent: SiteContent;
  setSiteContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}

export function CmsProductsForm({ siteContent, setSiteContent }: CmsProductsFormProps) {
  const { toast } = useToast();
  const [isSaving, startSaving] = useTransition();
  const [generatingDescId, setGeneratingDescId] = useState<number | null>(null);

  const handleProductChange = (id: number, field: keyof Product, value: string | number | null) => {
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
    setSiteContent(prev => ({ ...prev, products: [...prev.products, newProduct] }));
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
        toast({ title: 'Éxito', description: 'Productos guardados correctamente.' });
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestionar Productos</h1>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleAddProduct}><Plus className="mr-2 h-4 w-4" /> Añadir Producto</Button>
            <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar Cambios
            </Button>
        </div>
      </div>
      
      <Accordion type="single" collapsible className="w-full space-y-4">
        {siteContent.products.map((product) => (
          <AccordionItem value={String(product.id)} key={product.id} className="border-b-0">
             <Card>
                <AccordionTrigger className="p-4 hover:no-underline">
                    <div className="flex items-center gap-4">
                        <Image src={product.imgUrl || ''} alt={product.title || ''} width={40} height={40} className="rounded-md h-10 w-10 object-cover"/>
                        <span className="font-semibold">{product.title || 'Producto Sin Título'}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Título</Label>
                            <Input value={product.title || ''} onChange={(e) => handleProductChange(product.id, 'title', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Categoría</Label>
                            <Input value={product.category || ''} onChange={(e) => handleProductChange(product.id, 'category', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Precio</Label>
                            <Input type="number" value={product.price ?? 0} onChange={(e) => handleProductChange(product.id, 'price', parseFloat(e.target.value) || 0)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Precio con Descuento (opcional)</Label>
                            <Input type="number" value={product.discountPrice ?? ''} onChange={(e) => handleProductChange(product.id, 'discountPrice', e.target.value ? parseFloat(e.target.value) : null)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label>Descripción</Label>
                             <Button size="sm" variant="ghost" onClick={() => handleGenerateDesc(product)} disabled={generatingDescId === product.id}>
                                {generatingDescId === product.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                Generar con IA
                            </Button>
                        </div>
                        <Textarea value={product.desc || ''} onChange={(e) => handleProductChange(product.id, 'desc', e.target.value)} />
                    </div>
                    <div className="flex justify-end">
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                        </Button>
                    </div>
                </AccordionContent>
             </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
