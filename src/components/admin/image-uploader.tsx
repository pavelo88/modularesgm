
'use client';

import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Trash2, UploadCloud, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  currentUrl: string;
  onUpload: (url: string) => void;
  onRemove: () => void;
  label?: string;
  folder?: string;
}

export function ImageUploader({ currentUrl, onUpload, onRemove, label, folder = 'cms' }: ImageUploaderProps) {
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
    <div className="space-y-3">
      {label && <Label className="text-xs font-bold uppercase">{label}</Label>}
      <div className="relative group aspect-video rounded-xl overflow-hidden border bg-muted flex items-center justify-center">
        {currentUrl ? (
          <>
            <Image src={currentUrl} alt="Preview" fill className="object-cover transition-opacity group-hover:opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="destructive" size="sm" onClick={onRemove}>
                    <Trash2 className="mr-2 h-4 w-4" /> Quitar Imagen
                </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon size={32} strokeWidth={1.5} />
            <span className="text-xs">Sin imagen seleccionada</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          id={`file-${label}`}
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <Button
          asChild
          variant="outline"
          className="w-full h-9 cursor-pointer"
          disabled={isUploading}
        >
          <label htmlFor={`file-${label}`} className="flex items-center justify-center">
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-4 w-4" />
            )}
            {isUploading ? 'Subiendo...' : 'Cambiar Imagen'}
          </label>
        </Button>
      </div>
    </div>
  );
}
