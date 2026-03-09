
'use client';

import { useTransition } from 'react';
import type { SiteContent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getSeoSuggestions, saveSiteContent } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Sparkles, Phone, MapPin, Share2, Search } from 'lucide-react';
import { ImageUploader } from './image-uploader';
import { defaultSiteContent } from '@/lib/data';

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
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
            <h2 className="text-xl font-bold">Configuración de Inicio</h2>
            <p className="text-sm text-muted-foreground">Modifica el Hero, contacto y SEO del sitio.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Guardar Cambios
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg border-primary/10 overflow-hidden">
            <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="text-lg">Sección Hero (Banner Principal)</CardTitle>
                <CardDescription>Es la primera impresión que tienen tus clientes.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="heroTitle">Título Principal</Label>
                        <Input id="heroTitle" name="heroTitle" value={siteContent.heroTitle || ''} onChange={handleInputChange} className="font-bold text-lg"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="heroSubtitle">Subtítulo Descriptivo</Label>
                        <Textarea id="heroSubtitle" name="heroSubtitle" value={siteContent.heroSubtitle || ''} onChange={handleInputChange} className="min-h-[100px]"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="ctaText">Texto del Botón Principal</Label>
                        <Input id="ctaText" name="ctaText" value={siteContent.ctaText || ''} onChange={handleInputChange} />
                    </div>
                    <ImageUploader
                        label="Imagen de Fondo del Hero"
                        currentUrl={siteContent.heroMediaUrl}
                        onUpload={(url) => setSiteContent(prev => ({...prev, heroMediaUrl: url}))}
                        onRemove={() => setSiteContent(prev => ({...prev, heroMediaUrl: defaultSiteContent.heroMediaUrl}))}
                        folder="hero"
                    />
                </div>
            </CardContent>
        </Card>

        <div className="space-y-8">
            <Card>
                <CardHeader className="bg-secondary/5 border-b">
                    <CardTitle className="text-lg flex items-center gap-2"><Phone className="h-4 w-4"/> Contacto y Ubicación</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="whatsappNumber">WhatsApp (Sin +)</Label>
                            <Input id="whatsappNumber" name="whatsappNumber" value={siteContent.whatsappNumber || ''} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Dirección Física</Label>
                            <Input id="address" name="address" value={siteContent.address || ''} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mapUrl">Google Maps Embed URL (Iframe src)</Label>
                        <Textarea id="mapUrl" name="mapUrl" value={siteContent.mapUrl || ''} onChange={handleInputChange} className="h-24 text-xs font-mono"/>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="bg-muted/50 border-b">
                    <CardTitle className="text-lg flex items-center gap-2"><Share2 className="h-4 w-4"/> Redes Sociales</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="socialUrls.facebook">Facebook URL</Label>
                        <Input id="socialUrls.facebook" name="socialUrls.facebook" value={siteContent.socialUrls?.facebook || ''} onChange={handleInputChange} placeholder="https://..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="socialUrls.instagram">Instagram URL</Label>
                        <Input id="socialUrls.instagram" name="socialUrls.instagram" value={siteContent.socialUrls?.instagram || ''} onChange={handleInputChange} placeholder="https://..." />
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-background p-4">
            <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary"/>
                <div>
                    <CardTitle className="text-lg">Posicionamiento SEO</CardTitle>
                    <CardDescription>Optimiza cómo apareces en Google.</CardDescription>
                </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleGenerateSeo} disabled={isGeneratingSeo} className="bg-background">
                {isGeneratingSeo ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-primary" />}
                Generar con IA
            </Button>
        </CardHeader>
        <CardContent className="p-6 grid md:grid-cols-3 gap-6">
           <div className="space-y-2">
            <Label htmlFor="seo.title">Título SEO (60 carac.)</Label>
            <Input id="seo.title" name="seo.title" value={siteContent.seo?.title || ''} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo.description">Meta Descripción (160 carac.)</Label>
            <Textarea id="seo.description" name="seo.description" value={siteContent.seo?.description || ''} onChange={handleInputChange} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="seo.keywords">Palabras Clave (Separadas por comas)</Label>
            <Textarea id="seo.keywords" name="seo.keywords" value={siteContent.seo?.keywords || ''} onChange={handleInputChange} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
