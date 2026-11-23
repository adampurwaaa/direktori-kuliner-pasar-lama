'use client';

import React from 'react';
import { MapPin, Moon, Sun, UtensilsCrossed } from 'lucide-react';
import { useTheme } from '@/components/common/ThemeProvider';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  const handleOpenKawasanMaps = () => {
    window.open('https://maps.google.com/?q=Pasar+Lama+Tangerang', '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FAF8F5]/90 dark:bg-[#12100E]/90 border-b border-[#EAE5DC] dark:border-[#2C2623] transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#D9531E] flex items-center justify-center text-white shadow-sm">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-[#1C1917] dark:text-[#F5F5F4] leading-tight font-[family-name:var(--font-heading)]">
              Kuliner Pasar Lama
            </h1>
            <p className="text-[11px] font-medium text-[#78716C] dark:text-[#A8A29E] leading-none">
              Kota Tangerang
            </p>
          </div>
        </div>

        {/* Action Buttons: Peta Kawasan & Dark Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenKawasanMaps}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#FAF8F5] dark:bg-[#1C1917] border border-[#EAE5DC] dark:border-[#2C2623] hover:border-[#D9531E]/40 text-[#1C1917] dark:text-[#F5F5F4] transition duration-200 min-h-[44px]"
            title="Buka Peta Kawasan Pasar Lama di Google Maps"
          >
            <MapPin className="w-4 h-4 text-[#D9531E]" />
            <span className="hidden sm:inline">Peta Kawasan</span>
            <span className="sm:hidden">Peta</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5] dark:bg-[#1C1917] text-[#1C1917] dark:text-[#F5F5F4] hover:bg-[#EAE5DC]/40 dark:hover:bg-[#2C2623]/50 transition duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Ubah tema"
            title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#F97316]" />
            ) : (
              <Moon className="w-4 h-4 text-[#78716C]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
