'use client';

import React from 'react';
import Image from 'next/image';
import { Tenant } from '@/types/database';
import { Clock, MapPin, ChevronRight, Navigation } from 'lucide-react';
import { trackTenantClick } from '@/lib/queries';

interface TenantCardProps {
  tenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
}

export function TenantCard({ tenant, onSelectTenant }: TenantCardProps) {
  const handleOpenMaps = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackTenantClick(tenant.id, 'gmaps');
    window.open(tenant.gmaps_url, '_blank', 'noopener,noreferrer');
  };

  const handleCardClick = () => {
    trackTenantClick(tenant.id, 'menu');
    onSelectTenant(tenant);
  };

  return (
    <article
      onClick={handleCardClick}
      className="group cursor-pointer flex flex-col justify-between overflow-hidden rounded-2xl border border-[#EAE5DC] dark:border-[#2C2623] bg-white dark:bg-[#1C1917] transition-all duration-200 hover:border-[#D9531E]/50 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
    >
      <div>
        {/* Cover Image: Aspect 4/3 Editorial Ratio */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF8F5] dark:bg-[#12100E]">
          <Image
            src={tenant.cover_image || 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80'}
            alt={tenant.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur-md text-white">
              {tenant.category}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          <h3 className="font-bold text-base text-[#1C1917] dark:text-[#F5F5F4] group-hover:text-[#D9531E] dark:group-hover:text-[#F97316] transition-colors line-clamp-1 font-[family-name:var(--font-heading)] mb-1">
            {tenant.name}
          </h3>

          <p className="text-xs text-[#78716C] dark:text-[#A8A29E] line-clamp-2 mb-3 leading-relaxed">
            {tenant.description}
          </p>

          <div className="space-y-1.5 text-xs text-[#78716C] dark:text-[#A8A29E]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 shrink-0 text-[#D9531E]" />
              <span className="truncate tabular-nums">{tenant.open_hours}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#78716C] dark:text-[#A8A29E]" />
              <span className="truncate">{tenant.location_note}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 border-t border-[#EAE5DC]/70 dark:border-[#2C2623]/70 flex items-center justify-between gap-2 bg-[#FAF8F5]/40 dark:bg-[#12100E]/30">
        <button
          type="button"
          onClick={handleOpenMaps}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] hover:text-[#D9531E] hover:bg-[#EAE5DC]/50 dark:hover:bg-[#2C2623]/60 transition min-h-[40px]"
          title="Buka rute navigasi Google Maps"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Navigasi Maps</span>
        </button>

        <span className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-[#D9531E] dark:text-[#F97316] group-hover:bg-[#D9531E]/10 transition min-h-[40px]">
          <span>Menu</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
}
