'use client';

import { useState, useTransition } from 'react';
import type { SiteContent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getSeoSuggestions, saveSiteContent } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface CmsGeneralFormProps {
  siteContent: SiteContent;
  setSiteContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}

export function CmsGeneralForm({ siteContent, setSiteContent }: CmsGeneralFormProps) {
  const { toast } = useToast();
  const [isSaving, startSaving] = useTransition();
  const [isGeneratingSeo, startGeneratingSeo] = useTransition();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSiteContent((prev) => ({
        ...prev,
        [parent]: { ...(prev as any)[parent], [child]: value },
      }));
    } else {
      setSiteContent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    startSaving(async () => {
      const result = await saveSiteContent(siteContent);
      if (result.success) {
        toast({ title: 'Éxito', description: 'Contenido guardado correctamente.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    });
  };

  const handleGenerateSeo = () => {
    startGeneratingSeo(async () => {
        const result = await getSeoSuggestions(siteContent.heroTitle, siteContent.heroSubtitle);
        if (result.success && result.data) {
            setSiteContent(prev => ({...prev, seo: result.data!}));
            toast({ title: 'Éxito', description: 'Sugerencias SEO generadas.' });
        } else {
            toast({ variant: 'destructive', title: 'Error de IA', description: result.error });
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

      <Card>
        <CardHeader>
          <CardTitle>Sección Hero</CardTitle>
          <CardDescription>Contenido principal de la página de inicio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroTitle">Título Principal</Label>
            <Input id="heroTitle" name="heroTitle" value={siteContent.heroTitle || ''} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Subtítulo</Label>
            <Textarea id="heroSubtitle" name="heroSubtitle" value={siteContent.heroSubtitle || ''} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ctaText">Texto del Botón (CTA)</Label>
            <Input id="ctaText" name="ctaText" value={siteContent.ctaText || ''} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label>Imagen de Fondo</Label>
            <Image src={siteContent.heroMediaUrl || ''} alt="Hero Background" width={200} height={100} className="rounded-md object-cover" />
            <Input type="file" disabled />
            <p className="text-xs text-muted-foreground">La carga de archivos está deshabilitada en esta demo.</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contacto y Redes</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">Número de WhatsApp</Label>
            <Input id="whatsappNumber" name="whatsappNumber" value={siteContent.whatsappNumber || ''} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" name="address" value={siteContent.address || ''} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="socialUrls.facebook">Facebook URL</Label>
            <Input id="socialUrls.facebook" name="socialUrls.facebook" value={siteContent.socialUrls?.facebook || ''} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="socialUrls.instagram">Instagram URL</Label>
            <Input id="socialUrls.instagram" name="socialUrls.instagram" value={siteContent.socialUrls?.instagram || ''} onChange={handleInputChange} />
          </div>
           <div className="md:col-span-2 space-y-2">
            <Label htmlFor="mapUrl">Google Maps Embed URL</Label>
            <Textarea id="mapUrl" name="mapUrl" value={siteContent.mapUrl || ''} onChange={handleInputChange} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>SEO</CardTitle>
              <CardDescription>Optimización para motores de búsqueda.</CardDescription>
            </div>
            <Button variant="outline" onClick={handleGenerateSeo} disabled={isGeneratingSeo}>
                {isGeneratingSeo ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generar con IA
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
            <Label htmlFor="seo.title">Título SEO</Label>
            <Input id="seo.title" name="seo.title" value={siteContent.seo?.title || ''} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo.description">Meta Descripción</Label>
            <Textarea id="seo.description" name="seo.description" value={siteContent.seo?.description || ''} onChange={handleInputChange} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="seo.keywords">Palabras Clave</Label>
            <Textarea id="seo.keywords" name="seo.keywords" value={siteContent.seo?.keywords || ''} onChange={handleInputChange} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
