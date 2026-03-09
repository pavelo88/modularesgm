'use client';

import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Trash2, UploadCloud, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  currentUrl: string;
  onUpload: (url: string) => void;
  onRemove: () => void;
  label?: string;
  folder?: string;
  className?: string;
}

export function ImageUploader({ currentUrl, onUpload, onRemove, label, folder = 'cms', className }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `${folder}/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      onUpload(url);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && <Label className="text-[10px] font-bold uppercase text-muted-foreground">{label}</Label>}
      <div className="relative group aspect-video rounded-xl overflow-hidden border bg-muted flex items-center justify-center">
        {currentUrl ? (
          <>
            {/* IMPROVEMENT: Using object-contain for logos to avoid cropping issues */}
            <img 
                src={currentUrl} 
                alt="Preview" 
                className={cn(
                    "w-full h-full transition-opacity group-hover:opacity-40",
                    folder === 'brands' ? "object-contain" : "object-cover"
                )}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <Button variant="destructive" size="sm" onClick={(e) => { e.preventDefault(); onRemove(); }} className="h-8 text-xs shadow-xl">
                    <Trash2 className="mr-2 h-3 w-3" /> Quitar
                </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon size={24} strokeWidth={1.5} />
            <span className="text-[10px]">Sin imagen</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          id={`file-${label}-${folder}-${Math.random()}`}
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <Button
          asChild
          variant="outline"
          className="w-full h-8 cursor-pointer text-xs"
          disabled={isUploading}
        >
          <label htmlFor={`file-${label}-${folder}-${Math.random()}`} className="flex items-center justify-center cursor-pointer">
            {isUploading ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-3 w-3" />
            )}
            {isUploading ? 'Subiendo...' : 'Cargar Nueva'}
          </label>
        </Button>
      </div>
    </div>
  );
}
