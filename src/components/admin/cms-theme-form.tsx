'use client';

import { useTransition } from 'react';
import type { SiteContent, ThemeColors } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveSiteContent } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Palette, Save, RotateCcw } from 'lucide-react';
import { defaultSiteContent } from '@/lib/data';

interface CmsThemeFormProps {
  siteContent: SiteContent;
  setSiteContent: React.Dispatch<React.SetStateAction<SiteContent>>;
}

export function CmsThemeForm({ siteContent, setSiteContent }: CmsThemeFormProps) {
  const { toast } = useToast();
  const [isSaving, startSaving] = useTransition();

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setSiteContent(prev => ({
      ...prev,
      theme: { ...prev.theme, [key]: value }
    }));
  };

  const handleReset = () => {
    if (confirm('¿Restablecer colores a los valores por defecto?')) {
        setSiteContent(prev => ({ ...prev, theme: defaultSiteContent.theme }));
    }
  };

  const handleSave = () => {
    startSaving(async () => {
      const result = await saveSiteContent(siteContent);
      if (result.success) {
        toast({ title: 'Éxito', description: 'Colores del sitio actualizados.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
    });
  };

  const ColorField = ({ label, colorKey }: { label: string, colorKey: keyof ThemeColors }) => (
    <div className="space-y-3 p-4 rounded-xl border bg-muted/20">
      <div className="flex justify-between items-center">
        <Label className="text-xs font-bold uppercase">{label}</Label>
        <div 
          className="w-8 h-8 rounded-full border shadow-sm" 
          style={{ backgroundColor: siteContent.theme?.[colorKey] || '#000' }}
        />
      </div>
      <div className="flex gap-2">
        <Input 
          type="color" 
          value={siteContent.theme?.[colorKey] || '#000000'} 
          onChange={(e) => handleColorChange(colorKey, e.target.value)}
          className="w-12 h-10 p-1 cursor-pointer"
        />
        <Input 
          type="text" 
          value={siteContent.theme?.[colorKey] || ''} 
          onChange={(e) => handleColorChange(colorKey, e.target.value)}
          className="font-mono text-sm"
          placeholder="#000000"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <div>
          <h2 className="text-xl font-bold">Identidad Visual</h2>
          <p className="text-sm text-muted-foreground">Personaliza la paleta de colores de tu marca.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Aplicar Colores
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ColorField label="Color Primario (Header, Títulos)" colorKey="primary" />
        <ColorField label="Color Secundario (Botones, Acentos)" colorKey="secondary" />
        <ColorField label="Fondo General" colorKey="background" />
        <ColorField label="Texto Principal" colorKey="foreground" />
        <ColorField label="Color de Acento (Muted)" colorKey="accent" />
      </div>
      
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
                <Palette size={16} /> Nota sobre Personalización
            </CardTitle>
            <CardDescription className="text-xs">
                Los colores se aplican dinámicamente. El color primario afecta a la mayoría de los componentes interactivos y títulos. Asegúrate de mantener un buen contraste para la lectura.
            </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
