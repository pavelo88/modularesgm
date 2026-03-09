'use client';

import { useTransition } from 'react';
import type { SiteContent, Service } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { saveSiteContent } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { ImageUploader } from './image-uploader';

interface CmsServicesFormProps {
  siteContent: SiteContent;
  setSiteContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}

export function CmsServicesForm({ siteContent, setSiteContent }: CmsServicesFormProps) {
  const { toast } = useToast();
  const [isSaving, startSaving] = useTransition();

  const handleServiceChange = (id: number, field: keyof Service, value: string) => {
    setSiteContent(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const handleAddService = () => {
    const newService: Service = {
      id: Date.now(),
      title: 'Nuevo Servicio',
      desc: '',
      imgUrl: '',
      icon: 'Grid',
      catalogUrl: ''
    };
    setSiteContent(prev => ({ ...prev, services: [newService, ...prev.services] }));
  };

  const handleDeleteService = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      setSiteContent(prev => ({ ...prev, services: prev.services.filter(s => s.id !== id) }));
    }
  };
  
  const handleSave = () => {
    startSaving(async () => {
      const result = await saveSiteContent(siteContent);
      if (result.success) {
        toast({ title: 'Éxito', description: 'Servicios guardados correctamente.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    });
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-card p-4 rounded-xl border sticky top-0 z-10">
        <div>
            <h1 className="text-xl font-bold">Gestión de Servicios</h1>
            <p className="text-xs text-muted-foreground">{siteContent.services.length} servicios activos en la web.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAddService}><Plus className="mr-2 h-4 w-4" /> Añadir</Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar Cambios
            </Button>
        </div>
      </div>
      
      {/* REDESIGN: 2 elements per row on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        {siteContent.services.map((service) => (
          <Card key={service.id} className="group overflow-hidden border-2 hover:border-primary/20 transition-all">
            <div className="flex flex-col gap-6 p-6">
              <div className="w-full">
                <ImageUploader
                  label="Imagen Principal"
                  currentUrl={service.imgUrl}
                  onUpload={(url) => handleServiceChange(service.id, 'imgUrl', url)}
                  onRemove={() => handleServiceChange(service.id, 'imgUrl', '')}
                  folder="services"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Título del Servicio</Label>
                    <Input 
                      value={service.title || ''} 
                      onChange={(e) => handleServiceChange(service.id, 'title', e.target.value)}
                      className="font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground">Icono (Lucide name)</Label>
                    <Input value={service.icon || ''} onChange={(e) => handleServiceChange(service.id, 'icon', e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Descripción Detallada</Label>
                  <Textarea 
                      value={service.desc || ''} 
                      onChange={(e) => handleServiceChange(service.id, 'desc', e.target.value)} 
                      className="h-24 resize-none"
                  />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <p className="text-[10px] text-muted-foreground italic">ID: {service.id}</p>
                  <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteService(service.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Eliminar
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
