'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Crosshair,
  Search,
  Check,
  ZoomIn,
  ZoomOut,
  Compass,
  ArrowRight,
  ExternalLink,
  X,
  Layers,
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface InteractivePinMapProps {
  initialLat?: number;
  initialLng?: number;
  locationNote?: string;
  onConfirm: (lat: number, lng: number, gmapsUrl: string, autoNote?: string) => void;
  onClose?: () => void;
}

// Pusat Area Pasar Lama Tangerang (Jl. Kisamaun)
const PASAR_LAMA_CENTER = {
  lat: -6.17915,
  lng: 106.63110,
};

// Preset Titik Landmark di Kawasan Pasar Lama
const PRESET_LOCATIONS = [
  {
    name: 'Pintu Gerbang Utama Kisamaun',
    lat: -6.17892,
    lng: 106.63098,
    note: 'Jl. Kisamaun (Dekat Gerbang Utama Pasar Lama)',
  },
  {
    name: 'Klenteng Boen Tek Bio',
    lat: -6.17822,
    lng: 106.63012,
    note: 'Jl. Bhakti (Area Samping Klenteng Boen Tek Bio)',
  },
  {
    name: 'Tengah Deretan Kisamaun',
    lat: -6.17954,
    lng: 106.63124,
    note: 'Jl. Kisamaun (Tengah Koridor Kuliner Malam)',
  },
  {
    name: 'Pintu Barat / Belakang Pasar',
    lat: -6.18025,
    lng: 106.63185,
    note: 'Kawasan Belakang Pasar Lama Tangerang',
  },
  {
    name: 'Museum Benteng Heritage',
    lat: -6.17798,
    lng: 106.62995,
    note: 'Dekat Museum Benteng Heritage',
  },
  {
    name: 'Depan Roppan / Roti Kisamaun',
    lat: -6.17935,
    lng: 106.63115,
    note: 'Jl. Kisamaun (Depan Toko Roti Roppan)',
  },
];

export function InteractivePinMap({
  initialLat = PASAR_LAMA_CENTER.lat,
  initialLng = PASAR_LAMA_CENTER.lng,
  locationNote = '',
  onConfirm,
  onClose,
}: InteractivePinMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [currentLat, setCurrentLat] = useState<number>(initialLat || PASAR_LAMA_CENTER.lat);
  const [currentLng, setCurrentLng] = useState<number>(initialLng || PASAR_LAMA_CENTER.lng);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [suggestedNote, setSuggestedNote] = useState(locationNote);

  // Keyboard shortcut Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Update note based on nearest landmark
  const updateNearestNote = (lat: number, lng: number) => {
    let nearest = PRESET_LOCATIONS[0];
    let minDistance = 99999;
    PRESET_LOCATIONS.forEach((spot) => {
      const dist = Math.sqrt(Math.pow(spot.lat - lat, 2) + Math.pow(spot.lng - lng, 2));
      if (dist < minDistance) {
        minDistance = dist;
        nearest = spot;
      }
    });

    if (minDistance < 0.0006) {
      setSuggestedNote(nearest.note);
    } else {
      setSuggestedNote(`Pasar Lama Tangerang (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
    }
  };

  // Inisialisasi peta Leaflet dengan drag & zoom penuh
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentLat, currentLng],
        zoom: 18,
        minZoom: 14,
        maxZoom: 19,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Event saat peta digeser dengan mouse/sentuhan
      map.on('move', () => {
        const center = map.getCenter();
        const lat = Number(center.lat.toFixed(6));
        const lng = Number(center.lng.toFixed(6));
        setCurrentLat(lat);
        setCurrentLng(lng);
        updateNearestNote(lat, lng);
      });

      // Event saat peta diklik langsung
      map.on('click', (e: L.LeafletMouseEvent) => {
        map.panTo(e.latlng, { animate: true });
        const lat = Number(e.latlng.lat.toFixed(6));
        const lng = Number(e.latlng.lng.toFixed(6));
        setCurrentLat(lat);
        setCurrentLng(lng);
        updateNearestNote(lat, lng);
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handler Zoom
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };
  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  // GPS Lokasi Saat Ini
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser Anda tidak mendukung deteksi lokasi GPS.');
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setCurrentLat(lat);
        setCurrentLng(lng);
        updateNearestNote(lat, lng);
        mapInstanceRef.current?.setView([lat, lng], 18, { animate: true });
        setIsGettingLocation(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsGettingLocation(false);
        alert('Tidak dapat mendeteksi lokasi saat ini. Pastikan izin akses lokasi aktif.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Pilih dari preset spot cepat
  const handleSelectPreset = (spot: typeof PRESET_LOCATIONS[0]) => {
    setCurrentLat(spot.lat);
    setCurrentLng(spot.lng);
    setSuggestedNote(spot.note);
    mapInstanceRef.current?.setView([spot.lat, spot.lng], 18, { animate: true });
  };

  // Konfirmasi titik akhir dan tutup modal
  const handleConfirm = () => {
    const finalUrl = `https://www.google.com/maps?q=${currentLat},${currentLng}`;
    onConfirm(currentLat, currentLng, finalUrl, suggestedNote);
    if (onClose) onClose();
  };

  const filteredPresets = PRESET_LOCATIONS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.note.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#1C1917] rounded-3xl overflow-hidden border border-[#EAE5DC] dark:border-[#2C2623] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
      
      {/* Top Bar with Search & Close X Button */}
      <div className="p-3 border-b border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5] dark:bg-[#12100E] flex items-center gap-2 shrink-0 z-30">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari patokan atau spot di Pasar Lama Tangerang..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#EAE5DC] dark:border-[#2C2623] bg-white dark:bg-[#1C1917] text-xs text-[#1C1917] dark:text-[#F5F5F4] placeholder:text-[#78716C] focus:outline-none focus:border-[#D9531E] transition"
          />
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white dark:bg-[#1C1917] border border-[#EAE5DC] dark:border-[#2C2623] hover:bg-stone-100 dark:hover:bg-stone-800 text-[#1C1917] dark:text-[#F5F5F4] transition min-w-[42px] min-h-[42px] flex items-center justify-center shrink-0 shadow-xs"
            title="Tutup Peta (Esc)"
          >
            <X className="w-5 h-5 text-[#78716C] hover:text-[#D9531E]" />
          </button>
        )}
      </div>

      {/* Main Interactive Map Viewport with Drag & Wheel Zoom */}
      <div className="relative flex-1 w-full min-h-[300px] bg-stone-200 dark:bg-stone-900 overflow-hidden">
        {/* Leaflet DOM container (fully draggable & zoomable) */}
        <div ref={mapContainerRef} className="w-full h-full cursor-grab active:cursor-grabbing z-10" />

        {/* Central Floating Pin Marker & Tooltip (ShopeeFood Style) */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center -translate-y-5 z-20">
          <div className="animate-bounce flex flex-col items-center">
            {/* Callout Bubble */}
            <div className="px-3.5 py-1.5 rounded-2xl bg-[#D9531E] text-white text-[11px] font-bold shadow-xl flex items-center gap-1.5 whitespace-nowrap mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Titik Lokasi Lapak</span>
            </div>
            {/* Custom Pin Icon */}
            <div className="relative flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-[#D9531E] border-2 border-white shadow-2xl flex items-center justify-center text-white">
                <MapPin className="w-5 h-5 fill-white" />
              </div>
              <div className="w-3 h-3 rounded-full bg-black/40 blur-[2px] absolute -bottom-2" />
            </div>
          </div>
        </div>

        {/* Helper Instructions Pill */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <div className="px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white text-[10px] font-medium shadow-md flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Geser peta / klik titik untuk memindahkan pin</span>
          </div>
        </div>

        {/* Floating Quick CTA Button directly on Map Viewport (ShopeeFood Style) */}
        <div className="absolute top-3 right-3 z-20">
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#D9531E] hover:bg-[#C04312] text-white shadow-xl flex items-center gap-1.5 transition min-h-[38px] border border-white/20"
          >
            <Check className="w-4 h-4" />
            <span>Terapkan Titik Ini</span>
          </button>
        </div>

        {/* Zoom & GPS Controls */}
        <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
            className="p-2.5 rounded-2xl bg-white dark:bg-[#1C1917] text-[#1C1917] dark:text-[#F5F5F4] border border-[#EAE5DC] dark:border-[#2C2623] hover:text-[#D9531E] shadow-xl transition flex items-center justify-center min-w-[44px] min-h-[44px]"
            title="Gunakan Lokasi Saat Ini (GPS)"
          >
            <Crosshair className={`w-4 h-4 ${isGettingLocation ? 'animate-spin text-[#D9531E]' : ''}`} />
          </button>

          <div className="flex flex-col bg-white dark:bg-[#1C1917] rounded-2xl border border-[#EAE5DC] dark:border-[#2C2623] shadow-xl overflow-hidden">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-2 text-[#1C1917] dark:text-[#F5F5F4] hover:bg-[#FAF8F5] dark:hover:bg-[#12100E] border-b border-[#EAE5DC] dark:border-[#2C2623]"
              title="Perbesar"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-2 text-[#1C1917] dark:text-[#F5F5F4] hover:bg-[#FAF8F5] dark:hover:bg-[#12100E]"
              title="Perkecil"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Location & Confirm Action Bar */}
      <div className="p-4 bg-white dark:bg-[#1C1917] border-t border-[#EAE5DC] dark:border-[#2C2623] space-y-3 shrink-0 z-30">
        {/* Selected Coordinates Bar */}
        <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#12100E] border border-[#EAE5DC] dark:border-[#2C2623]">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#D9531E]">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>Patokan Terdeteksi</span>
            </div>
            <p className="text-xs font-bold text-[#1C1917] dark:text-[#F5F5F4] truncate mt-0.5">
              {suggestedNote}
            </p>
            <p className="text-[10px] font-mono text-[#78716C] dark:text-[#A8A29E] mt-0.5">
              {currentLat.toFixed(5)}, {currentLng.toFixed(5)}
            </p>
          </div>

          <a
            href={`https://www.google.com/maps?q=${currentLat},${currentLng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#EAE5DC] dark:border-[#2C2623] hover:border-[#D9531E] text-[#1C1917] dark:text-[#F5F5F4] transition"
            title="Uji buka link di tab baru"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D9531E]" />
            <span className="hidden sm:inline">Tes Peta</span>
          </a>
        </div>

        {/* Quick Spot Suggestion Chips */}
        <div>
          <span className="text-[11px] font-bold text-[#78716C] dark:text-[#A8A29E] block mb-1.5 uppercase tracking-wider">
            Spot Populer Terdekat
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {filteredPresets.map((spot) => {
              const isSelected =
                Math.abs(spot.lat - currentLat) < 0.0002 && Math.abs(spot.lng - currentLng) < 0.0002;
              return (
                <button
                  type="button"
                  key={spot.name}
                  onClick={() => handleSelectPreset(spot)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium border transition flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#D9531E] border-[#D9531E] text-white shadow-sm'
                      : 'bg-[#FAF8F5] dark:bg-[#12100E] border-[#EAE5DC] dark:border-[#2C2623] text-[#1C1917] dark:text-[#F5F5F4] hover:border-[#D9531E]'
                  }`}
                >
                  <span>{spot.name}</span>
                  {isSelected && <Check className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons: Batal & Terapkan Titik Ini */}
        <div className="flex items-center justify-end gap-2 pt-1">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] hover:bg-stone-100 dark:hover:bg-stone-800 transition min-h-[44px]"
            >
              Batal
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-2xl text-xs font-bold bg-[#D9531E] hover:bg-[#C04312] text-white shadow-md flex items-center justify-center gap-2 transition min-h-[44px]"
          >
            <Check className="w-4 h-4" />
            <span>Terapkan Titik Ini</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
