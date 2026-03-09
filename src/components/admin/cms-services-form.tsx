'use client';

import { useState, useTransition } from 'react';
import type { SiteContent, Service } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { saveSiteContent } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
      imgUrl: 'https://picsum.photos/seed/' + Date.now() + '/800/800',
      icon: 'Grid',
      catalogUrl: ''
    };
    setSiteContent(prev => ({ ...prev, services: [...prev.services, newService] }));
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
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestionar Servicios</h1>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleAddService}><Plus className="mr-2 h-4 w-4" /> Añadir Servicio</Button>
            <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Guardar Cambios
            </Button>
        </div>
      </div>
      
      <Accordion type="single" collapsible className="w-full space-y-4">
        {siteContent.services.map((service) => (
          <AccordionItem value={String(service.id)} key={service.id} className="border-b-0">
             <Card>
                <AccordionTrigger className="p-4 hover:no-underline">
                    <div className="flex items-center gap-4">
                        <Image src={service.imgUrl || ''} alt={service.title || ''} width={40} height={40} className="rounded-md h-10 w-10 object-cover"/>
                        <span className="font-semibold">{service.title || 'Servicio Sin Título'}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="p-6 pt-0 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Título</Label>
                                <Input value={service.title || ''} onChange={(e) => handleServiceChange(service.id, 'title', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label>Icono</Label>
                                <Input value={service.icon || ''} onChange={(e) => handleServiceChange(service.id, 'icon', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Descripción</Label>
                            <Textarea value={service.desc || ''} onChange={(e) => handleServiceChange(service.id, 'desc', e.target.value)} />
                        </div>
                        <div className="flex justify-end">
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                            </Button>
                        </div>
                    </div>
                </AccordionContent>
             </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
