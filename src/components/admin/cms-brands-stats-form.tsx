'use client';

import { useTransition } from 'react';
import type { SiteContent, Brand, Stat } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveSiteContent } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Save, Trash2, RotateCcw } from 'lucide-react';
import { ImageUploader } from './image-uploader';
import { getIconComponent } from '@/lib/icons';
import { defaultSiteContent } from '@/lib/data';

interface CmsBrandsStatsFormProps {
  siteContent: SiteContent;
  setSiteContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}

export function CmsBrandsStatsForm({ siteContent, setSiteContent }: CmsBrandsStatsFormProps) {
  const { toast } = useToast();
  const [isSaving, startSaving] = useTransition();

  const handleBrandChange = (id: number, field: keyof Brand, value: string) => {
    setSiteContent(prev => ({
      ...prev,
      brands: prev.brands.map(b => b.id === id ? { ...b, [field]: value } : b),
    }));
  };

  const handleStatChange = (id: number, field: keyof Stat, value: string) => {
    setSiteContent(prev => ({
      ...prev,
      stats: prev.stats.map(s => s.id === id ? { ...s, [field]: value } : s),
    }));
  };

  const handleAddBrand = () => {
    const newBrand: Brand = { 
      id: Date.now(), 
      name: 'Nueva Marca', 
      url: defaultSiteContent.brands[0]?.url || '' 
    };
    setSiteContent(prev => ({ 
      ...prev, 
      brands: [newBrand, ...prev.brands] 
    }));
    toast({
      title: "Marca añadida",
      description: "Recuerda subir el logo y guardar.",
    });
  };

  const handleAddStat = () => {
    const newStat: Stat = { 
      id: Date.now(), 
      value: '0', 
      label: 'Nuevo Dato', 
      icon: 'Activity' 
    };
    setSiteContent(prev => ({ 
      ...prev, 
      stats: [...prev.stats, newStat] 
    }));
    toast({
      title: "Estadística añadida",
      description: "Edita el valor y el icono.",
    });
  };

  const handleDeleteItem = (arrayName: 'brands' | 'stats', id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este elemento definitivamente?')) {
      setSiteContent(prev => ({
        ...prev,
        [arrayName]: (prev[arrayName] as any[]).filter(item => item.id !== id),
      }));
      toast({
        title: "Elemento eliminado",
        description: "No olvides guardar para confirmar la acción.",
      });
    }
  };
  
  const handleRestoreDefaults = () => {
    if (confirm('¿Restaurar Marcas y Estadísticas a los valores originales?')) {
      setSiteContent(prev => ({
        ...prev,
        brands: defaultSiteContent.brands,
        stats: defaultSiteContent.stats,
      }));
    }
  };

  const handleSave = () => {
    startSaving(async () => {
      const result = await saveSiteContent(siteContent);
      if (result.success) {
        toast({ title: 'Éxito', description: 'Marcas y Estadísticas guardadas.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
          <h2 className="text-xl font-bold">Marcas y Experiencia</h2>
          <p className="text-sm text-muted-foreground">Gestiona logos de proveedores y datos del Hero.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRestoreDefaults}>
            <RotateCcw className="mr-2 h-4 w-4" /> Restaurar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar Cambios
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Marcas Aliadas</CardTitle>
              <CardDescription>Logos que aparecen en el carrusel principal.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddBrand}>
              <Plus className="mr-2 h-4 w-4" /> Añadir Marca
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteContent.brands.map(brand => (
                <div key={brand.id} className="flex flex-col gap-4 p-4 rounded-xl border bg-muted/20">
                  <div className="bg-white rounded-lg p-2 border shadow-inner">
                    <ImageUploader
                      currentUrl={brand.url}
                      onUpload={(url) => handleBrandChange(brand.id, 'url', url)}
                      onRemove={() => {
                        const defaultUrl = defaultSiteContent.brands.find(b => b.id === brand.id)?.url || defaultSiteContent.brands[0].url;
                        handleBrandChange(brand.id, 'url', defaultUrl);
                      }}
                      folder="brands"
                      label="Logo de la Marca"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Nombre</Label>
                      <Input 
                        value={brand.name || ''} 
                        onChange={e => handleBrandChange(brand.id, 'name', e.target.value)} 
                        placeholder="Ej: Novopan"
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive w-full hover:bg-destructive/10" 
                      onClick={() => handleDeleteItem('brands', brand.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Eliminar Marca
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Estadísticas (Experiencia)</CardTitle>
              <CardDescription>Tarjetas de datos que se muestran en el Hero.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddStat}>
              <Plus className="mr-2 h-4 w-4" /> Añadir Stat
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {siteContent.stats.map(stat => (
                <div key={stat.id} className="p-4 rounded-xl border bg-muted/20 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                        {getIconComponent(stat.icon as any, { size: 20 })}
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => handleDeleteItem('stats', stat.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Valor</Label>
                        <Input value={stat.value || ''} onChange={e => handleStatChange(stat.id, 'value', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Icono</Label>
                        <Input value={stat.icon || ''} onChange={e => handleStatChange(stat.id, 'icon', e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Etiqueta</Label>
                      <Input value={stat.label || ''} onChange={e => handleStatChange(stat.id, 'label', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
