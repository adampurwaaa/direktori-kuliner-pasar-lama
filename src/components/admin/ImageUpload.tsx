'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { UploadCloud, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  aspect?: 'square' | 'video' | 'banner';
}

export function ImageUpload({
  value,
  onChange,
  folder = 'uploads',
  aspect = 'video',
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Pilih file gambar valid (JPG, PNG, WebP).');
      return;
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Ukuran file maksimal 5MB.');
      return;
    }

    setIsUploading(true);

    try {
      if (isSupabaseConfigured()) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('kuliner-assets')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.warn('Storage upload warning, fallback ke local preview:', uploadError);
          // Fallback ke data URL jika bucket belum di-setup di console
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              onChange(event.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from('kuliner-assets')
            .getPublicUrl(fileName);

          if (publicUrlData?.publicUrl) {
            onChange(publicUrlData.publicUrl);
          }
        }
      } else {
        // Mode offline/lokal: konversi langsung ke Data URL Base64
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            onChange(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengunggah foto.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const aspectClass =
    aspect === 'square'
      ? 'aspect-square max-w-[140px]'
      : aspect === 'banner'
      ? 'aspect-[21/9]'
      : 'aspect-video';

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {value ? (
        <div className={`relative ${aspectClass} w-full rounded-2xl overflow-hidden border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5] dark:bg-[#12100E] group`}>
          <Image
            src={value}
            alt="Preview foto"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-[#1C1917] hover:bg-stone-100 shadow-md transition"
            >
              Ganti Foto
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-md transition"
              title="Hapus Foto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-[#EAE5DC] dark:border-[#2C2623] hover:border-[#D9531E] dark:hover:border-[#F97316] rounded-2xl p-6 text-center bg-[#FAF8F5]/50 dark:bg-[#12100E]/50 transition duration-200"
        >
          <div className="w-10 h-10 rounded-xl bg-[#D9531E]/10 dark:bg-[#F97316]/15 text-[#D9531E] dark:text-[#F97316] flex items-center justify-center mx-auto mb-2">
            {isUploading ? (
              <UploadCloud className="w-5 h-5 animate-bounce" />
            ) : (
              <ImageIcon className="w-5 h-5" />
            )}
          </div>
          <p className="text-xs font-bold text-[#1C1917] dark:text-[#F5F5F4]">
            {isUploading ? 'Mengunggah foto...' : 'Pilih Foto dari Galeri / File'}
          </p>
          <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] mt-0.5">
            Mendukung file JPG, PNG, atau WebP (Maks. 5MB)
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
