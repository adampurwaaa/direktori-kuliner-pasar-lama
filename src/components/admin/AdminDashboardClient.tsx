'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tenant, MenuItem, Promo, DailyClickStat } from '@/types/database';
import { TabTenants } from '@/components/admin/TabTenants';
import { TabMenus } from '@/components/admin/TabMenus';
import { TabPromos } from '@/components/admin/TabPromos';
import { TabStats } from '@/components/admin/TabStats';
import {
  Store,
  UtensilsCrossed,
  Tag,
  BarChart3,
  LogOut,
  ExternalLink,
  Moon,
  Sun,
  RefreshCw,
} from 'lucide-react';
import { useTheme } from '@/components/common/ThemeProvider';
import { getAllTenantsAdmin, getAllMenus, getAllPromosAdmin, getClickStatsAdmin } from '@/lib/queries';
import { supabase } from '@/lib/supabase/client';

interface AdminDashboardClientProps {
  initialTenants: Tenant[];
  initialMenus: MenuItem[];
  initialPromos: Promo[];
  initialStats: DailyClickStat[];
}

type TabType = 'tenants' | 'menus' | 'promos' | 'stats';

export function AdminDashboardClient({
  initialTenants,
  initialMenus,
  initialPromos,
  initialStats,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('tenants');

  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [menus, setMenus] = useState<MenuItem[]>(initialMenus);
  const [promos, setPromos] = useState<Promo[]>(initialPromos);
  const [stats, setStats] = useState<DailyClickStat[]>(initialStats);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    document.cookie = 'kuliner_admin_session=; path=/; max-age=0; SameSite=Lax';
    window.location.href = '/admin/login';
  };

  // Re-fetch all data to ensure instantaneous and consistent state across all tabs
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [tData, mData, pData, sData] = await Promise.all([
        getAllTenantsAdmin(),
        getAllMenus(),
        getAllPromosAdmin(),
        getClickStatsAdmin(),
      ]);
      setTenants(tData);
      setMenus(mData);
      setPromos(pData);
      setStats(sData);
      router.refresh();
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#12100E] text-[#1C1917] dark:text-[#F5F5F4] transition-colors">
      
      {/* Top Navbar Admin */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-[#1C1917]/90 border-b border-[#EAE5DC] dark:border-[#2C2623]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D9531E] flex items-center justify-center text-white shadow-sm">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold font-[family-name:var(--font-heading)] leading-none">
                  Portal Admin Kuliner
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D9531E]/10 text-[#D9531E]">
                  Pasar Lama
                </span>
              </div>
              <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] mt-0.5">
                Panel Pengelola & Analitik Interaksi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5] dark:bg-[#12100E] text-[#1C1917] dark:text-[#F5F5F4] hover:border-[#D9531E] transition min-h-[40px] min-w-[40px] flex items-center justify-center disabled:opacity-50"
              title="Perbarui Data (Sync)"
            >
              <RefreshCw className={`w-4 h-4 text-[#D9531E] ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#FAF8F5] dark:bg-[#12100E] border border-[#EAE5DC] dark:border-[#2C2623] hover:border-[#D9531E]/40 text-[#1C1917] dark:text-[#F5F5F4] transition min-h-[40px]"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#D9531E]" />
              <span className="hidden sm:inline">Lihat Web Publik</span>
            </a>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5] dark:bg-[#12100E] text-[#1C1917] dark:text-[#F5F5F4] transition min-h-[40px] min-w-[40px] flex items-center justify-center"
              title="Ganti Tema"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#F97316]" />
              ) : (
                <Moon className="w-4 h-4 text-[#78716C]" />
              )}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-red-500/10 text-red-600 hover:bg-red-500/20 transition min-h-[40px]"
              title="Keluar dari sesi admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout with Tabs */}
      <div className="max-w-7xl w-full mx-auto px-4 py-6 flex-1 flex flex-col">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-[#EAE5DC] dark:border-[#2C2623] mb-6 scrollbar-none">
          <button
            onClick={() => setActiveTab('tenants')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition min-h-[44px] ${
              activeTab === 'tenants'
                ? 'bg-[#D9531E] text-white shadow-sm'
                : 'bg-white dark:bg-[#1C1917] border border-[#EAE5DC] dark:border-[#2C2623] text-[#78716C] dark:text-[#A8A29E] hover:border-[#D9531E]/40'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Data Tenant / Toko ({tenants.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('menus')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition min-h-[44px] ${
              activeTab === 'menus'
                ? 'bg-[#D9531E] text-white shadow-sm'
                : 'bg-white dark:bg-[#1C1917] border border-[#EAE5DC] dark:border-[#2C2623] text-[#78716C] dark:text-[#A8A29E] hover:border-[#D9531E]/40'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Daftar Menu ({menus.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('promos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition min-h-[44px] ${
              activeTab === 'promos'
                ? 'bg-[#D9531E] text-white shadow-sm'
                : 'bg-white dark:bg-[#1C1917] border border-[#EAE5DC] dark:border-[#2C2623] text-[#78716C] dark:text-[#A8A29E] hover:border-[#D9531E]/40'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Iklan & Promo ({promos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition min-h-[44px] ${
              activeTab === 'stats'
                ? 'bg-[#D9531E] text-white shadow-sm'
                : 'bg-white dark:bg-[#1C1917] border border-[#EAE5DC] dark:border-[#2C2623] text-[#78716C] dark:text-[#A8A29E] hover:border-[#D9531E]/40'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Statistik Klik</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <main className="flex-1">
          {activeTab === 'tenants' && (
            <TabTenants tenants={tenants} onRefresh={handleRefresh} />
          )}

          {activeTab === 'menus' && (
            <TabMenus tenants={tenants} menus={menus} onRefresh={handleRefresh} />
          )}

          {activeTab === 'promos' && (
            <TabPromos tenants={tenants} promos={promos} onRefresh={handleRefresh} />
          )}

          {activeTab === 'stats' && (
            <TabStats tenants={tenants} stats={stats} />
          )}
        </main>
      </div>

    </div>
  );
}
