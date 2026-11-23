'use client';

import React, { useState, useMemo } from 'react';
import { Tenant, DailyClickStat } from '@/types/database';
import {
  Calendar,
  Filter,
  BarChart2,
  MousePointerClick,
  MapPin,
  Tag,
  Target,
  ArrowUpRight,
} from 'lucide-react';

interface TabStatsProps {
  tenants: Tenant[];
  stats: DailyClickStat[];
}

type AggregationMode = 'daily' | 'monthly' | 'yearly';
type ClickTypeFilter = 'all' | 'menu' | 'gmaps' | 'promo';

export function TabStats({ tenants, stats }: TabStatsProps) {
  // Calendar Range Filter
  const defaultStartDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString().split('T')[0];
  }, []);

  const defaultEndDate = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  const [startDate, setStartDate] = useState<string>(defaultStartDate);
  const [endDate, setEndDate] = useState<string>(defaultEndDate);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('all');
  const [clickTypeFilter, setClickTypeFilter] = useState<ClickTypeFilter>('all');
  const [aggregationMode, setAggregationMode] = useState<AggregationMode>('daily');

  // Filter stats by date and tenant
  const filteredStats = useMemo(() => {
    return stats.filter((s) => {
      const matchStart = !startDate || s.stat_date >= startDate;
      const matchEnd = !endDate || s.stat_date <= endDate;
      const matchTenant = selectedTenantId === 'all' || s.tenant_id === selectedTenantId;
      return matchStart && matchEnd && matchTenant;
    });
  }, [stats, startDate, endDate, selectedTenantId]);

  // Total Summary Cards Calculation
  const totalMenuClicks = useMemo(
    () => filteredStats.reduce((sum, s) => sum + s.menu_clicks, 0),
    [filteredStats]
  );
  const totalGmapsClicks = useMemo(
    () => filteredStats.reduce((sum, s) => sum + s.gmaps_clicks, 0),
    [filteredStats]
  );
  const totalPromoClicks = useMemo(
    () => filteredStats.reduce((sum, s) => sum + s.promo_clicks, 0),
    [filteredStats]
  );
  const grandTotalClicks = totalMenuClicks + totalGmapsClicks + totalPromoClicks;

  // Chart Aggregation Data
  const chartData = useMemo(() => {
    const groups: { [key: string]: { label: string; menu: number; gmaps: number; promo: number; total: number } } = {};

    filteredStats.forEach((s) => {
      let key = s.stat_date;
      let label = s.stat_date.slice(5); // MM-DD default

      if (aggregationMode === 'monthly') {
        key = s.stat_date.slice(0, 7); // YYYY-MM
        label = s.stat_date.slice(0, 7);
      } else if (aggregationMode === 'yearly') {
        key = s.stat_date.slice(0, 4); // YYYY
        label = s.stat_date.slice(0, 4);
      }

      if (!groups[key]) {
        groups[key] = { label, menu: 0, gmaps: 0, promo: 0, total: 0 };
      }

      groups[key].menu += s.menu_clicks;
      groups[key].gmaps += s.gmaps_clicks;
      groups[key].promo += s.promo_clicks;
      groups[key].total += (s.menu_clicks + s.gmaps_clicks + s.promo_clicks);
    });

    const sortedKeys = Object.keys(groups).sort();
    return sortedKeys.map((k) => groups[k]);
  }, [filteredStats, aggregationMode]);

  // Max value for bar scaling
  const maxBarValue = useMemo(() => {
    if (chartData.length === 0) return 100;
    const values = chartData.map((d) => {
      if (clickTypeFilter === 'menu') return d.menu;
      if (clickTypeFilter === 'gmaps') return d.gmaps;
      if (clickTypeFilter === 'promo') return d.promo;
      return d.total;
    });
    return Math.max(...values, 10);
  }, [chartData, clickTypeFilter]);

  // Per-Tenant Breakdown Stats Table
  const perTenantStats = useMemo(() => {
    return tenants.map((tenant) => {
      const tenantEntries = filteredStats.filter((s) => s.tenant_id === tenant.id);
      const menuClicks = tenantEntries.reduce((sum, s) => sum + s.menu_clicks, 0);
      const gmapsClicks = tenantEntries.reduce((sum, s) => sum + s.gmaps_clicks, 0);
      const promoClicks = tenantEntries.reduce((sum, s) => sum + s.promo_clicks, 0);
      const totalClicks = menuClicks + gmapsClicks + promoClicks;
      const percentage = grandTotalClicks > 0 ? (totalClicks / grandTotalClicks) * 100 : 0;

      return {
        tenant,
        menuClicks,
        gmapsClicks,
        promoClicks,
        totalClicks,
        percentage,
      };
    }).sort((a, b) => b.totalClicks - a.totalClicks);
  }, [tenants, filteredStats, grandTotalClicks]);

  const handleFocusTenant = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#1C1917] dark:text-[#F5F5F4] font-[family-name:var(--font-heading)]">
            Laporan Analisis & Statistik Klik
          </h2>
          <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
            Pantau interaksi pengunjung secara real-time untuk bukti performa pedagang dan efektivitas iklan promo.
          </p>
        </div>
      </div>

      {/* Filter Toolbar (Calendar, Tenant, Click Type, Mode) */}
      <div className="p-4 rounded-2xl border border-[#EAE5DC] dark:border-[#2C2623] bg-white dark:bg-[#1C1917] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#D9531E]" />
            <span>Dari Tanggal</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/60 dark:bg-[#12100E]/60 text-[#1C1917] dark:text-[#F5F5F4] focus:outline-none focus:border-[#D9531E]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#D9531E]" />
            <span>Sampai Tanggal</span>
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/60 dark:bg-[#12100E]/60 text-[#1C1917] dark:text-[#F5F5F4] focus:outline-none focus:border-[#D9531E]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#D9531E]" />
            <span>Filter Tenant</span>
          </label>
          <select
            value={selectedTenantId}
            onChange={(e) => setSelectedTenantId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/60 dark:bg-[#12100E]/60 text-[#1C1917] dark:text-[#F5F5F4] focus:outline-none focus:border-[#D9531E]"
          >
            <option value="all">Semua Tenant</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1 flex items-center gap-1">
            <MousePointerClick className="w-3.5 h-3.5 text-[#D9531E]" />
            <span>Jenis Klik</span>
          </label>
          <select
            value={clickTypeFilter}
            onChange={(e) => setClickTypeFilter(e.target.value as ClickTypeFilter)}
            className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/60 dark:bg-[#12100E]/60 text-[#1C1917] dark:text-[#F5F5F4] focus:outline-none focus:border-[#D9531E]"
          >
            <option value="all">Semua Jenis Klik</option>
            <option value="menu">Klik Lihat Menu</option>
            <option value="gmaps">Klik Google Maps</option>
            <option value="promo">Klik Promo</option>
          </select>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl border border-[#EAE5DC] dark:border-[#2C2623] bg-white dark:bg-[#1C1917]">
          <span className="text-[11px] font-medium text-[#78716C] dark:text-[#A8A29E] block mb-1">
            Total Seluruh Klik
          </span>
          <div className="text-2xl font-extrabold text-[#1C1917] dark:text-[#F5F5F4] tabular-nums font-[family-name:var(--font-heading)]">
            {grandTotalClicks.toLocaleString('id-ID')}
          </div>
          <span className="text-[10px] text-[#78716C] mt-1 block">
            Akumulasi dalam rentang tanggal
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-[#EAE5DC] dark:border-[#2C2623] bg-white dark:bg-[#1C1917]">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#78716C] dark:text-[#A8A29E] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#D9531E]" />
            <span>Klik Lihat Menu</span>
          </div>
          <div className="text-2xl font-extrabold text-[#D9531E] dark:text-[#F97316] tabular-nums font-[family-name:var(--font-heading)]">
            {totalMenuClicks.toLocaleString('id-ID')}
          </div>
          <span className="text-[10px] text-[#78716C] mt-1 block">
            Pengunjung membaca daftar menu
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-[#EAE5DC] dark:border-[#2C2623] bg-white dark:bg-[#1C1917]">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#78716C] dark:text-[#A8A29E] mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Klik Google Maps</span>
          </div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums font-[family-name:var(--font-heading)]">
            {totalGmapsClicks.toLocaleString('id-ID')}
          </div>
          <span className="text-[10px] text-[#78716C] mt-1 block">
            Pengunjung membuka rute lapak
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-[#EAE5DC] dark:border-[#2C2623] bg-white dark:bg-[#1C1917]">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#78716C] dark:text-[#A8A29E] mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Klik Promo Banner</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums font-[family-name:var(--font-heading)]">
            {totalPromoClicks.toLocaleString('id-ID')}
          </div>
          <span className="text-[10px] text-[#78716C] mt-1 block">
            Interaksi promo dari tenant
          </span>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="p-5 rounded-3xl border border-[#EAE5DC] dark:border-[#2C2623] bg-white dark:bg-[#1C1917] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#D9531E]" />
            <h3 className="font-bold text-sm sm:text-base text-[#1C1917] dark:text-[#F5F5F4] font-[family-name:var(--font-heading)]">
              Diagram Batang Tren Interaksi Pengunjung
            </h3>
          </div>

          {/* Grouping switch */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#FAF8F5] dark:bg-[#12100E] border border-[#EAE5DC] dark:border-[#2C2623] text-xs">
            {(['daily', 'monthly', 'yearly'] as AggregationMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setAggregationMode(mode)}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  aggregationMode === mode
                    ? 'bg-[#D9531E] text-white shadow-sm'
                    : 'text-[#78716C] dark:text-[#A8A29E] hover:text-[#1C1917]'
                }`}
              >
                {mode === 'daily' ? 'Per Tanggal' : mode === 'monthly' ? 'Per Bulan' : 'Per Tahun'}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive CSS Bar Chart */}
        <div className="pt-4">
          {chartData.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#78716C]">
              Tidak ada data statistik untuk filter tanggal ini.
            </div>
          ) : (
            <div className="flex items-end gap-2 overflow-x-auto pb-4 pt-10 min-h-[220px] scrollbar-none">
              {chartData.map((d, index) => {
                let barVal = d.total;
                if (clickTypeFilter === 'menu') barVal = d.menu;
                if (clickTypeFilter === 'gmaps') barVal = d.gmaps;
                if (clickTypeFilter === 'promo') barVal = d.promo;

                const heightPercent = Math.max(Math.round((barVal / maxBarValue) * 100), 4);

                return (
                  <div key={index} className="flex-1 min-w-[36px] flex flex-col items-center group">
                    <span className="text-[10px] font-bold text-[#78716C] dark:text-[#A8A29E] tabular-nums mb-1 opacity-0 group-hover:opacity-100 transition">
                      {barVal}
                    </span>
                    <div className="w-full max-w-[28px] h-36 bg-[#FAF8F5] dark:bg-[#12100E] rounded-t-lg flex items-end overflow-hidden">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          clickTypeFilter === 'menu'
                            ? 'bg-[#D9531E]'
                            : clickTypeFilter === 'gmaps'
                            ? 'bg-blue-500'
                            : clickTypeFilter === 'promo'
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-t from-[#D9531E] to-amber-500'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] text-[#78716C] dark:text-[#A8A29E] mt-2 whitespace-nowrap tabular-nums">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 pt-2 border-t border-[#EAE5DC] dark:border-[#2C2623] text-[11px] text-[#78716C] dark:text-[#A8A29E] flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#D9531E]" />
            <span>Lihat Menu</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
            <span>Google Maps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span>Klik Promo</span>
          </div>
        </div>
      </div>

      {/* Bagian Khusus: Statistik Klik Per Toko */}
      <div className="p-5 rounded-3xl border border-[#EAE5DC] dark:border-[#2C2623] bg-white dark:bg-[#1C1917] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-[#1C1917] dark:text-[#F5F5F4] font-[family-name:var(--font-heading)]">
              Statistik Klik Per Toko
            </h3>
            <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
              Rincian komparasi performa interaksi antar tenant pada rentang tanggal terpilih.
            </p>
          </div>
          {selectedTenantId !== 'all' && (
            <button
              onClick={() => setSelectedTenantId('all')}
              className="text-xs font-semibold text-[#D9531E] hover:underline"
            >
              Reset Fokus (Lihat Semua)
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EAE5DC] dark:border-[#2C2623] text-[#78716C] dark:text-[#A8A29E]">
                <th className="py-2.5 px-3 font-semibold">Nama Toko</th>
                <th className="py-2.5 px-3 font-semibold">Kategori</th>
                <th className="py-2.5 px-3 font-semibold text-right">Klik Menu</th>
                <th className="py-2.5 px-3 font-semibold text-right">Klik Maps</th>
                <th className="py-2.5 px-3 font-semibold text-right">Klik Promo</th>
                <th className="py-2.5 px-3 font-semibold text-right">Total Klik</th>
                <th className="py-2.5 px-3 font-semibold w-36">Kontribusi (%)</th>
                <th className="py-2.5 px-3 font-semibold text-center">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE5DC]/60 dark:divide-[#2C2623]/60">
              {perTenantStats.map((row) => {
                const isFocused = selectedTenantId === row.tenant.id;
                return (
                  <tr
                    key={row.tenant.id}
                    className={`hover:bg-[#FAF8F5]/80 dark:hover:bg-[#12100E]/50 transition ${
                      isFocused ? 'bg-[#D9531E]/5' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-[#1C1917] dark:text-[#F5F5F4]">
                      {row.tenant.name}
                    </td>
                    <td className="py-3 px-3 text-[#78716C] dark:text-[#A8A29E]">
                      {row.tenant.category}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-[#D9531E] font-medium">
                      {row.menuClicks.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-blue-600 dark:text-blue-400 font-medium">
                      {row.gmapsClicks.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums text-emerald-600 dark:text-emerald-400 font-medium">
                      {row.promoClicks.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums font-bold text-[#1C1917] dark:text-[#F5F5F4]">
                      {row.totalClicks.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-[#FAF8F5] dark:bg-[#12100E] rounded-full overflow-hidden border border-[#EAE5DC] dark:border-[#2C2623]">
                          <div
                            style={{ width: `${Math.min(row.percentage, 100)}%` }}
                            className="h-full bg-[#D9531E] rounded-full"
                          />
                        </div>
                        <span className="text-[11px] font-semibold tabular-nums text-[#78716C] dark:text-[#A8A29E] w-9 text-right">
                          {row.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleFocusTenant(row.tenant.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                          isFocused
                            ? 'bg-[#D9531E] text-white'
                            : 'bg-[#FAF8F5] dark:bg-[#2C2623] border border-[#EAE5DC] dark:border-[#2C2623] text-[#1C1917] dark:text-[#F5F5F4] hover:border-[#D9531E]'
                        }`}
                      >
                        <Target className="w-3 h-3" />
                        <span>{isFocused ? 'Sedang Fokus' : 'Fokus Toko'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
