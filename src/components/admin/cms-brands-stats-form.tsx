'use client';

import { useTransition } from 'react';
import type { SiteContent, Brand, Stat } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveSiteContent } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface CmsBrandsStatsFormProps {
  siteContent: SiteContent;
  setSiteContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}

export function CmsBrandsStatsForm({ siteContent, setSiteContent }: CmsBrandsStatsFormProps) {
  const { toast } = useToast();
  const [isSaving, startSaving] = useTransition();

  const handleItemChange = <T extends Brand | Stat>(
    arrayName: 'brands' | 'stats',
    id: number,
    field: keyof T,
    value: string
  ) => {
    setSiteContent(prev => ({
      ...prev,
      [arrayName]: (prev[arrayName] as T[]).map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAddItem = (arrayName: 'brands' | 'stats') => {
    const newItem =
      arrayName === 'brands'
        ? { id: Date.now(), name: 'Nueva Marca', url: 'https://logo.clearbit.com/example.com' }
        : { id: Date.now(), value: '0', label: 'Nuevo Stat', icon: 'Zap' };
    setSiteContent(prev => ({ ...prev, [arrayName]: [...prev[arrayName], newItem as any] }));
  };

  const handleDeleteItem = (arrayName: 'brands' | 'stats', id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
      setSiteContent(prev => ({
        ...prev,
        [arrayName]: (prev[arrayName] as (Brand | Stat)[]).filter(item => item.id !== id),
      }));
    }
  };

  const handleSave = () => {
    startSaving(async () => {
      const result = await saveSiteContent(siteContent);
      if (result.success) {
        toast({ title: 'Éxito', description: 'Datos guardados correctamente.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Guardar Cambios
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Marcas Aliadas</CardTitle>
            <CardDescription>Logos que aparecen en el carrusel.</CardDescription>
            <Button variant="outline" size="sm" onClick={() => handleAddItem('brands')}>
              <Plus className="mr-2 h-4 w-4" /> Añadir Marca
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {siteContent.brands.map(brand => (
              <div key={brand.id} className="flex items-center gap-4 p-2 rounded-md border">
                <Image src={brand.url} alt={brand.name} width={40} height={40} className="p-1 bg-white rounded" />
                <div className="flex-1 space-y-2">
                  <Input value={brand.name} onChange={e => handleItemChange('brands', brand.id, 'name', e.target.value)} />
                  <Input value={brand.url} onChange={e => handleItemChange('brands', brand.id, 'url', e.target.value)} />
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteItem('brands', brand.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
            <CardDescription>Tarjetas de estadísticas en la sección hero.</CardDescription>
            <Button variant="outline" size="sm" onClick={() => handleAddItem('stats')}>
              <Plus className="mr-2 h-4 w-4" /> Añadir Stat
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {siteContent.stats.map(stat => (
              <div key={stat.id} className="flex items-center gap-4 p-2 rounded-md border">
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Valor" value={stat.value} onChange={e => handleItemChange('stats', stat.id, 'value', e.target.value)} />
                    <Input placeholder="Icono" value={stat.icon} onChange={e => handleItemChange('stats', stat.id, 'icon', e.target.value)} />
                  </div>
                  <Input placeholder="Etiqueta" value={stat.label} onChange={e => handleItemChange('stats', stat.id, 'label', e.target.value)} />
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteItem('stats', stat.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
