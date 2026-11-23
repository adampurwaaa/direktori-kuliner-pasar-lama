'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Tenant, Promo, TenantCategory, MenuItem } from '@/types/database';
import { Navbar } from '@/components/public/Navbar';
import { PromoBanners } from '@/components/public/PromoBanners';
import { SearchFilterBar } from '@/components/public/SearchFilterBar';
import { TenantCard } from '@/components/public/TenantCard';
import { TenantDetailModal } from '@/components/public/TenantDetailModal';
import { MenuItemDetailModal } from '@/components/public/MenuItemDetailModal';
import { Store, Utensils, RefreshCw } from 'lucide-react';
import { getTenants, getActivePromos } from '@/lib/queries';

interface PublicDirectoryProps {
  initialTenants: Tenant[];
  initialPromos: Promo[];
}

export function PublicDirectory({ initialTenants, initialPromos }: PublicDirectoryProps) {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [promos, setPromos] = useState<Promo[]>(initialPromos);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Client-side synchronization: pastikan data terbaru dari database atau localStorage selalu dimuat saat dibuka
  useEffect(() => {
    let isMounted = true;
    const syncLatestData = async () => {
      try {
        const [latestTenants, latestPromos] = await Promise.all([
          getTenants(),
          getActivePromos(),
        ]);
        if (isMounted) {
          if (latestTenants && latestTenants.length > 0) {
            setTenants(latestTenants);
          }
          if (latestPromos && latestPromos.length > 0) {
            setPromos(latestPromos);
          }
        }
      } catch (err) {
        console.warn('Sync public directory error:', err);
      }
    };

    syncLatestData();

    // Listener custom event jika admin mengubah data di tab yang sama atau storage event di window lain
    const handleStorageChange = () => {
      syncLatestData();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('kuliner_data_updated', handleStorageChange);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('kuliner_data_updated', handleStorageChange);
    };
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [latestTenants, latestPromos] = await Promise.all([
        getTenants(),
        getActivePromos(),
      ]);
      setTenants(latestTenants);
      setPromos(latestPromos);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TenantCategory>('Semua');

  // Modal Level 1 (Tenant Detail & Full Menu)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  // Modal Level 2 (Menu Item Detail: Big Image & Full Desc)
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  // Filter Logic
  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      const matchCategory =
        selectedCategory === 'Semua' || tenant.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [tenants, selectedCategory, searchQuery]);

  const handleSelectTenantById = (tenantId: string) => {
    const found = tenants.find((t) => t.id === tenantId);
    if (found) {
      setSelectedTenant(found);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#12100E] text-[#1C1917] dark:text-[#F5F5F4] transition-colors">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {/* Editorial Welcome Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#D9531E]/10 dark:bg-[#F97316]/15 text-[#D9531E] dark:text-[#F97316] mb-2">
              <Utensils className="w-3.5 h-3.5" />
              <span>Pusat Kuliner Malam Legendaris & Jajanan Viral</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-[family-name:var(--font-heading)] leading-tight text-[#1C1917] dark:text-[#F5F5F4]">
              Jajanan & Kuliner Pasar Lama
            </h1>
            <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E] mt-1">
              Cek daftar menu resmi, harga tertera, promo aktif, dan navigasi langsung ke lapak penjual.
            </p>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#1C1917] border border-[#EAE5DC] dark:border-[#2C2623] hover:border-[#D9531E] text-[#78716C] dark:text-[#A8A29E] hover:text-[#D9531E] transition shadow-xs min-h-[38px] disabled:opacity-50"
            title="Muat ulang direktori terbaru"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#D9531E]' : ''}`} />
            <span>{isRefreshing ? 'Sinkronisasi...' : 'Sinkronkan'}</span>
          </button>
        </div>

        {/* Promo Banners Component */}
        <PromoBanners
          promos={promos}
          onSelectTenant={handleSelectTenantById}
        />

        {/* Search & Category Filter */}
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Tenant Cards Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E]">
              Daftar Toko & Pedagang ({filteredTenants.length})
            </h2>
          </div>

          {filteredTenants.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-[#EAE5DC] dark:border-[#2C2623] bg-white/40 dark:bg-[#1C1917]/40">
              <Store className="w-10 h-10 mx-auto text-[#78716C] dark:text-[#A8A29E] mb-3 stroke-[1.5]" />
              <h3 className="text-base font-bold text-[#1C1917] dark:text-[#F5F5F4] font-[family-name:var(--font-heading)]">
                Tidak ada kuliner yang cocok
              </h3>
              <p className="text-xs text-[#78716C] dark:text-[#A8A29E] mt-1 max-w-sm mx-auto">
                Coba gunakan kata kunci pencarian lain atau pilih kategori Semua.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Semua');
                }}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF8F5] dark:bg-[#2C2623] border border-[#EAE5DC] dark:border-[#2C2623] hover:border-[#D9531E] transition min-h-[44px]"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTenants.map((tenant) => (
                <TenantCard
                  key={tenant.id}
                  tenant={tenant}
                  onSelectTenant={setSelectedTenant}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer Street-Food Editorial */}
      <footer className="border-t border-[#EAE5DC] dark:border-[#2C2623] py-8 px-4 bg-white/50 dark:bg-[#12100E]/50 text-center">
        <div className="max-w-6xl mx-auto space-y-2">
          <p className="text-xs font-bold text-[#1C1917] dark:text-[#F5F5F4] font-[family-name:var(--font-heading)]">
            Direktori Kuliner Digital Pasar Lama Tangerang
          </p>
          <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E]">
            Jl. Kisamaun, Sukasari, Kec. Tangerang, Kota Tangerang, Banten. Buka setiap sore hingga malam.
          </p>
        </div>
      </footer>

      {/* Modal Level 1: Tenant Detail & Full Menu List */}
      <TenantDetailModal
        tenant={selectedTenant}
        onClose={() => setSelectedTenant(null)}
        onSelectMenuItem={setSelectedMenuItem}
      />

      {/* Modal Level 2: Menu Item Big Photo & Detailed Specs */}
      <MenuItemDetailModal
        item={selectedMenuItem}
        onClose={() => setSelectedMenuItem(null)}
      />
    </div>
  );
}
