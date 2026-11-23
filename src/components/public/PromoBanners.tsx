'use client';

import React from 'react';
import { Promo } from '@/types/database';
import { trackTenantClick } from '@/lib/queries';
import { Tag, MapPin, Sparkles } from 'lucide-react';

interface PromoBannersProps {
  promos: Promo[];
  onSelectTenant?: (tenantId: string) => void;
}

export function PromoBanners({ promos, onSelectTenant }: PromoBannersProps) {
  if (!promos || promos.length === 0) return null;

  const handlePromoClick = (promo: Promo) => {
    if (promo.tenant_id) {
      trackTenantClick(promo.tenant_id, 'promo');
      if (onSelectTenant) {
        onSelectTenant(promo.tenant_id);
      }
    } else if (promo.gmaps_url) {
      window.open(promo.gmaps_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-[#D9531E]" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E]">
          Promo & Diskon Aktif
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {promos.map((promo) => (
          <div
            key={promo.id}
            onClick={() => handlePromoClick(promo)}
            className="cursor-pointer group relative overflow-hidden rounded-2xl border border-[#EAE5DC] dark:border-[#2C2623] bg-white dark:bg-[#1C1917] p-4 transition-all duration-200 hover:border-[#D9531E]/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#D9531E]/10 text-[#D9531E] dark:bg-[#F97316]/15 dark:text-[#F97316]">
                <Tag className="w-3 h-3" />
                {promo.badge_text || 'Promo'}
              </span>
              {promo.tenant?.name && (
                <span className="text-xs font-medium text-[#78716C] dark:text-[#A8A29E] truncate max-w-[150px]">
                  {promo.tenant.name}
                </span>
              )}
            </div>

            <h3 className="font-bold text-sm sm:text-base text-[#1C1917] dark:text-[#F5F5F4] group-hover:text-[#D9531E] dark:group-hover:text-[#F97316] transition-colors line-clamp-1 mb-1 font-[family-name:var(--font-heading)]">
              {promo.title}
            </h3>

            <p className="text-xs text-[#78716C] dark:text-[#A8A29E] line-clamp-2 mb-3">
              {promo.subtitle}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-[#EAE5DC]/60 dark:border-[#2C2623]/60 text-xs">
              <span className="font-semibold text-[#D9531E] dark:text-[#F97316] group-hover:underline">
                Lihat Menu & Klaim &rarr;
              </span>
              {promo.gmaps_url && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (promo.tenant_id) trackTenantClick(promo.tenant_id, 'gmaps');
                    window.open(promo.gmaps_url, '_blank', 'noopener,noreferrer');
                  }}
                  className="inline-flex items-center gap-1 text-[#78716C] dark:text-[#A8A29E] hover:text-[#D9531E] p-1"
                  title="Lihat Peta Lokasi"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Peta</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
