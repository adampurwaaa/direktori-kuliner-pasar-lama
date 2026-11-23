'use client';

import React from 'react';
import Image from 'next/image';
import { MenuItem } from '@/types/database';
import { formatRupiah } from '@/lib/utils';
import { X, Star, Sparkles } from 'lucide-react';

interface MenuItemDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export function MenuItemDetailModal({ item, onClose }: MenuItemDetailModalProps) {
  if (!item) return null;

  const hasDiscount = item.discount_price && item.discount_price > 0 && item.discount_price < item.price;
  const discountPercent = hasDiscount
    ? Math.round(((item.price - item.discount_price!) / item.price) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-[#1C1917] rounded-3xl border border-[#EAE5DC] dark:border-[#2C2623] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Large Food Image */}
        <div className="relative aspect-[4/3] w-full bg-[#FAF8F5] dark:bg-[#12100E]">
          <Image
            src={item.image_url || 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80'}
            alt={item.name}
            fill
            className="object-cover"
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition min-w-[40px] min-h-[40px] flex items-center justify-center z-10"
            aria-label="Tutup detail menu"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating Badges */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 flex-wrap">
            {item.is_best_seller && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md">
                <Star className="w-3.5 h-3.5 fill-white" />
                Menu Terlaris
              </span>
            )}
            {hasDiscount && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#D9531E] text-white shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                Hemat {discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1C1917] dark:text-[#F5F5F4] font-[family-name:var(--font-heading)] leading-snug">
              {item.name}
            </h3>
          </div>

          {/* Description Section */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#12100E] border border-[#EAE5DC]/80 dark:border-[#2C2623]/80">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] mb-1">
              Deskripsi Menu
            </h4>
            <p className="text-xs sm:text-sm text-[#1C1917] dark:text-[#F5F5F4] leading-relaxed">
              {item.description || 'Tidak ada catatan deskripsi khusus untuk menu ini.'}
            </p>
          </div>

          {/* Price Breakdown */}
          <div className="flex items-center justify-between pt-2 border-t border-[#EAE5DC] dark:border-[#2C2623]">
            <div>
              <span className="block text-[11px] text-[#78716C] dark:text-[#A8A29E]">
                Harga Resmi
              </span>
              <div className="flex items-baseline gap-2 tabular-nums">
                {hasDiscount ? (
                  <>
                    <span className="text-xl font-extrabold text-[#D9531E] dark:text-[#F97316]">
                      {formatRupiah(item.discount_price!)}
                    </span>
                    <span className="text-xs text-[#78716C] dark:text-[#A8A29E] line-through">
                      {formatRupiah(item.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-extrabold text-[#1C1917] dark:text-[#F5F5F4]">
                    {formatRupiah(item.price)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FAF8F5] dark:bg-[#2C2623] border border-[#EAE5DC] dark:border-[#2C2623] hover:border-[#D9531E] text-[#1C1917] dark:text-[#F5F5F4] transition min-h-[44px]"
            >
              Kembali ke Toko
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
