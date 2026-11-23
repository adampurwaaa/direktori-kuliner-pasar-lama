'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Tenant, MenuItem } from '@/types/database';
import { getMenusByTenantId, trackTenantClick } from '@/lib/queries';
import { formatRupiah } from '@/lib/utils';
import { X, MapPin, Clock, Star, Navigation, Sparkles } from 'lucide-react';

interface TenantDetailModalProps {
  tenant: Tenant | null;
  onClose: () => void;
  onSelectMenuItem: (item: MenuItem) => void;
}

export function TenantDetailModal({
  tenant,
  onClose,
  onSelectMenuItem,
}: TenantDetailModalProps) {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tenant) return;
    setIsLoading(true);
    getMenusByTenantId(tenant.id).then((data) => {
      setMenus(data);
      setIsLoading(false);
    });
  }, [tenant]);

  if (!tenant) return null;

  const handleOpenMaps = () => {
    trackTenantClick(tenant.id, 'gmaps');
    window.open(tenant.gmaps_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#1C1917] rounded-t-3xl sm:rounded-2xl border border-[#EAE5DC] dark:border-[#2C2623] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        
        {/* Header Cover Bar */}
        <div className="relative h-44 sm:h-52 w-full bg-[#FAF8F5] dark:bg-[#12100E] shrink-0">
          <Image
            src={tenant.cover_image || 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80'}
            alt={tenant.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition min-w-[40px] min-h-[40px] flex items-center justify-center z-10"
            aria-label="Tutup rincian toko"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title and Badges inside Banner */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#D9531E] text-white mb-1.5">
              {tenant.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-heading)] leading-tight">
              {tenant.name}
            </h2>
          </div>
        </div>

        {/* Tenant Info & Action */}
        <div className="p-4 sm:p-5 border-b border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/60 dark:bg-[#12100E]/50 shrink-0">
          <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] leading-relaxed mb-3">
            {tenant.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="space-y-1 text-xs text-[#78716C] dark:text-[#A8A29E]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#D9531E]" />
                <span className="tabular-nums font-medium">{tenant.open_hours}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D9531E]" />
                <span>{tenant.location_note}</span>
              </div>
            </div>

            <button
              onClick={handleOpenMaps}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#D9531E] hover:bg-[#C04312] text-white transition min-h-[44px] shadow-sm"
            >
              <Navigation className="w-4 h-4" />
              <span>Petunjuk Arah (Maps)</span>
            </button>
          </div>
        </div>

        {/* Menu Items List (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E]">
              Daftar Menu ({menus.length})
            </h3>
            <span className="text-[11px] text-[#78716C] dark:text-[#A8A29E]">
              Pilih item untuk foto besar & deskripsi
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-20 rounded-xl bg-black/5 dark:bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : menus.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#78716C] dark:text-[#A8A29E]">
              Belum ada menu yang didaftarkan untuk toko ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5">
              {menus.map((item) => {
                const hasDiscount = item.discount_price && item.discount_price > 0 && item.discount_price < item.price;
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectMenuItem(item)}
                    className="cursor-pointer group flex items-center gap-3 p-3 rounded-2xl border border-[#EAE5DC] dark:border-[#2C2623] hover:border-[#D9531E]/60 bg-white dark:bg-[#1C1917] transition-all duration-200"
                  >
                    {/* Thumbnail: Aspect Square rounded-xl */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#FAF8F5] dark:bg-[#12100E] shrink-0 border border-[#EAE5DC] dark:border-[#2C2623]">
                      <Image
                        src={item.image_url || 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=600&q=80'}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        {item.is_best_seller && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
                            <Star className="w-3 h-3 fill-amber-500" />
                            Best Seller
                          </span>
                        )}
                        {hasDiscount && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#D9531E]/15 text-[#D9531E] dark:text-[#F97316]">
                            <Sparkles className="w-3 h-3" />
                            Promo
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-[#1C1917] dark:text-[#F5F5F4] group-hover:text-[#D9531E] dark:group-hover:text-[#F97316] transition-colors truncate">
                        {item.name}
                      </h4>

                      <p className="text-xs text-[#78716C] dark:text-[#A8A29E] line-clamp-1 mb-1">
                        {item.description}
                      </p>

                      {/* Pricing with Tabular Nums */}
                      <div className="flex items-center gap-2 tabular-nums">
                        {hasDiscount ? (
                          <>
                            <span className="text-sm font-bold text-[#D9531E] dark:text-[#F97316]">
                              {formatRupiah(item.discount_price!)}
                            </span>
                            <span className="text-xs text-[#78716C] dark:text-[#A8A29E] line-through">
                              {formatRupiah(item.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-[#1C1917] dark:text-[#F5F5F4]">
                            {formatRupiah(item.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
