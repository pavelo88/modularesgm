
'use client';

import { useState, useTransition } from 'react';
import type { SiteContent } from '@/lib/types';
import { Hero } from '@/components/home/hero';
import { Services } from '@/components/home/services';
import { BrandsCarousel } from '@/components/home/brands-carousel';
import { ContactSection } from '@/components/home/contact/contact-section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUploader } from './image-uploader';
import { saveSiteContent } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Loader2, Save, X } from 'lucide-react';
import { defaultSiteContent } from '@/lib/data';

interface VisualEditorProps {
  siteContent: SiteContent;
  setSiteContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}

export function VisualEditor({ siteContent, setSiteContent }: VisualEditorProps) {
  const { toast } = useToast();
  const [isSaving, startSaving] = useTransition();
  const [editingSection, setEditingSection] = useState<'hero' | 'services' | 'contact' | null>(null);

  const handleSave = () => {
    startSaving(async () => {
      const result = await saveSiteContent(siteContent);
      if (result.success) {
        toast({ title: 'Éxito', description: 'Cambios publicados correctamente.' });
        setEditingSection(null);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSiteContent(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative space-y-12 pb-24">
      {/* Floating Save Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button size="lg" onClick={handleSave} disabled={isSaving} className="shadow-2xl h-14 px-8 rounded-full">
          {isSaving ? <Loader2 className="mr-2 animate-spin" /> : <Save className="mr-2" />}
          Publicar Cambios Web
        </Button>
      </div>

      {/* Hero Section Preview with Overlay Editing */}
      <div className="relative group rounded-3xl overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all">
        <Hero 
            heroTitle={siteContent.heroTitle} 
            heroSubtitle={siteContent.heroSubtitle} 
            ctaText={siteContent.ctaText} 
            stats={siteContent.stats} 
        />
        <div className="absolute top-4 right-4 z-20">
            <Button variant="secondary" onClick={() => setEditingSection('hero')} className="shadow-lg backdrop-blur-md bg-white/50 border-white/20">
                <Edit3 size={16} className="mr-2" /> Editar Hero
            </Button>
        </div>
      </div>

      {/* Brands Preview */}
      <div className="opacity-50 pointer-events-none grayscale">
        <BrandsCarousel brands={siteContent.brands} />
      </div>

      {/* Services Section Preview */}
      <div className="relative group rounded-3xl overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all">
        <Services services={siteContent.services} />
        <div className="absolute top-4 right-4 z-20">
            <Button variant="secondary" onClick={() => setEditingSection('services')} className="shadow-lg backdrop-blur-md bg-white/50 border-white/20">
                <Edit3 size={16} className="mr-2" /> Gestionar Servicios
            </Button>
        </div>
      </div>

      {/* Contact Section Preview */}
      <div className="relative group rounded-3xl overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all">
        <ContactSection siteContent={siteContent} />
        <div className="absolute top-4 right-4 z-20">
            <Button variant="secondary" onClick={() => setEditingSection('contact')} className="shadow-lg backdrop-blur-md bg-white/50 border-white/20">
                <Edit3 size={16} className="mr-2" /> Editar Contacto
            </Button>
        </div>
      </div>

      {/* Editing Modal/Drawer Overlay */}
      {editingSection && (
        <div className="fixed inset-0 z-[60] flex items-center justify-end bg-black/40 backdrop-blur-sm p-4">
            <Card className="w-full max-w-xl h-full overflow-y-auto animate-in slide-in-from-right duration-300 shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between border-b sticky top-0 bg-background z-10 p-4">
                    <CardTitle className="text-xl capitalize">Editando: {editingSection}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setEditingSection(null)}>
                        <X size={20} />
                    </Button>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {editingSection === 'hero' && (
                        <>
                            <div className="space-y-2">
                                <Label>Título Principal</Label>
                                <Input name="heroTitle" value={siteContent.heroTitle} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Subtítulo descriptivo</Label>
                                <Textarea name="heroSubtitle" value={siteContent.heroSubtitle} onChange={handleInputChange} className="h-24" />
                            </div>
                            <div className="space-y-2">
                                <Label>Texto del Botón</Label>
                                <Input name="ctaText" value={siteContent.ctaText} onChange={handleInputChange} />
                            </div>
                            <ImageUploader 
                                label="Imagen de Fondo (Background)"
                                currentUrl={siteContent.heroMediaUrl}
                                onUpload={(url) => setSiteContent(prev => ({...prev, heroMediaUrl: url}))}
                                onRemove={() => setSiteContent(prev => ({...prev, heroMediaUrl: defaultSiteContent.heroMediaUrl}))}
                                folder="hero"
                            />
                        </>
                    )}
                    
                    {editingSection === 'services' && (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground mb-4">Usa la pestaña <strong>"Servicios"</strong> en el menú lateral para una gestión detallada de cada elemento.</p>
                            <Button className="w-full" variant="outline" onClick={() => setEditingSection(null)}>
                                Ir al listado completo
                            </Button>
                        </div>
                    )}

                    {editingSection === 'contact' && (
                        <>
                            <div className="space-y-2">
                                <Label>Título del Formulario</Label>
                                <Input name="formTitle" value={siteContent.formTitle} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Subtítulo del Formulario</Label>
                                <Textarea name="formSubtitle" value={siteContent.formSubtitle} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Google Maps URL (Embed)</Label>
                                <Textarea name="mapUrl" value={siteContent.mapUrl} onChange={handleInputChange} className="h-32 text-xs font-mono" />
                            </div>
                        </>
                    )}
                    
                    <div className="pt-6 border-t flex gap-3">
                        <Button className="flex-1" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 animate-spin" /> : <Save className="mr-2" />}
                            Guardar Cambios
                        </Button>
                        <Button variant="outline" onClick={() => setEditingSection(null)}>Cancelar</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
