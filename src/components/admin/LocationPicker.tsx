'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Map, ExternalLink } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import with SSR false for Leaflet interactive map
const InteractivePinMap = dynamic(
  () => import('@/components/admin/InteractivePinMap').then((mod) => mod.InteractivePinMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-white dark:bg-[#1C1917] rounded-3xl">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-[#D9531E] border-t-transparent animate-spin" />
          <span className="text-xs text-[#78716C]">Memuat Peta Interaktif...</span>
        </div>
      </div>
    ),
  }
);

interface LocationPickerProps {
  gmapsUrl: string;
  locationNote: string;
  onGmapsUrlChange: (url: string) => void;
  onLocationNoteChange: (note: string) => void;
}

export function LocationPicker({
  gmapsUrl,
  locationNote,
  onGmapsUrlChange,
  onLocationNoteChange,
}: LocationPickerProps) {
  // Hanya 2 opsi sesuai instruksi: Pin Peta & Input Link
  const [activeMode, setActiveMode] = useState<'map' | 'link'>('map');
  const [showMapModal, setShowMapModal] = useState(false);

  // Parse initial coordinates from gmapsUrl if present
  let parsedLat = -6.17915;
  let parsedLng = 106.63110;
  if (gmapsUrl.includes('?q=')) {
    const coords = gmapsUrl.split('?q=')[1]?.split(',');
    if (coords && coords.length >= 2) {
      const lat = parseFloat(coords[0]);
      const lng = parseFloat(coords[1]);
      if (!isNaN(lat) && !isNaN(lng)) {
        parsedLat = lat;
        parsedLng = lng;
      }
    }
  }

  const handleMapConfirm = (lat: number, lng: number, url: string, note?: string) => {
    onGmapsUrlChange(url);
    if (note && (!locationNote || locationNote === 'Jl. Kisamaun (Kawasan Kuliner Pasar Lama)')) {
      onLocationNoteChange(note);
    }
    setShowMapModal(false);
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/60 dark:bg-[#12100E]/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-bold text-[#1C1917] dark:text-[#F5F5F4] flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#D9531E]" />
          <span>Pengaturan Lokasi Lapak & Google Maps</span>
        </label>

        {/* Tab Selector Mode (Tepat 2 Opsi Rapi & Proporsional: Pin Peta & Input Link) */}
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white dark:bg-[#1C1917] border border-[#EAE5DC] dark:border-[#2C2623] text-xs">
          <button
            type="button"
            onClick={() => setActiveMode('map')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
              activeMode === 'map'
                ? 'bg-[#D9531E] text-white shadow-xs'
                : 'text-[#78716C] dark:text-[#A8A29E] hover:text-[#1C1917]'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Pin Peta</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('link')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeMode === 'link'
                ? 'bg-[#D9531E] text-white shadow-xs'
                : 'text-[#78716C] dark:text-[#A8A29E] hover:text-[#1C1917]'
            }`}
          >
            Input Link
          </button>
        </div>
      </div>

      {/* Mode 1: Pin Peta Interaktif ShopeeFood Style */}
      {activeMode === 'map' && (
        <div className="space-y-3">
          <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E]">
            Tentukan titik lapak persis di atas peta interaktif Pasar Lama dengan geser/klik pin (ala ShopeeFood):
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#1C1917] border border-[#EAE5DC] dark:border-[#2C2623]">
            <div className="w-10 h-10 rounded-2xl bg-[#D9531E]/10 dark:bg-[#F97316]/15 text-[#D9531E] dark:text-[#F97316] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h4 className="text-xs font-bold text-[#1C1917] dark:text-[#F5F5F4]">
                Peta Pin-Point Interaktif
              </h4>
              <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] truncate">
                {gmapsUrl ? `Titik aktif: ${gmapsUrl}` : 'Belum memilih titik peta'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowMapModal(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-[#D9531E] hover:bg-[#C04312] text-white transition shadow-sm min-h-[40px] flex items-center justify-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>Buka Peta & Tentukan Pin</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Input Link Manual */}
      {activeMode === 'link' && (
        <div>
          <label className="block text-[11px] text-[#78716C] dark:text-[#A8A29E] mb-1">
            URL Google Maps Langsung:
          </label>
          <input
            type="url"
            value={gmapsUrl}
            onChange={(e) => onGmapsUrlChange(e.target.value)}
            placeholder="https://maps.app.goo.gl/... atau https://www.google.com/maps?q=..."
            className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-white dark:bg-[#1C1917] text-xs focus:outline-none focus:border-[#D9531E]"
          />
        </div>
      )}

      {/* Result Preview Bar */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#EAE5DC] dark:border-[#2C2623] text-[11px]">
        <div className="truncate text-[#78716C] dark:text-[#A8A29E]">
          <span className="font-semibold text-[#1C1917] dark:text-[#F5F5F4]">Link Aktif: </span>
          <span className="font-mono text-[10px]">{gmapsUrl || 'Belum diatur'}</span>
        </div>
        {gmapsUrl && (
          <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1 text-[#D9531E] dark:text-[#F97316] hover:underline font-bold"
          >
            <Navigation className="w-3 h-3" />
            <span>Tes Buka Peta</span>
          </a>
        )}
      </div>

      {/* Fullscreen/Modal Pin Map Viewport */}
      {showMapModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl h-[85vh] max-h-[750px]">
            <InteractivePinMap
              initialLat={parsedLat}
              initialLng={parsedLng}
              locationNote={locationNote}
              onConfirm={handleMapConfirm}
              onClose={() => setShowMapModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
