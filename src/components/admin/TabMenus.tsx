'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Tenant, MenuItem } from '@/types/database';
import { formatRupiah } from '@/lib/utils';
import { Plus, Edit2, Trash2, Star, Check, X, Filter, CheckCircle2, AlertCircle } from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { saveMenuAction, deleteMenuAction } from '@/lib/queries';

interface TabMenusProps {
  tenants: Tenant[];
  menus: MenuItem[];
  onRefresh: () => void;
}

export function TabMenus({ tenants, menus, onRefresh }: TabMenusProps) {
  const [menuList, setMenuList] = useState<MenuItem[]>(menus);
  const [selectedTenantFilter, setSelectedTenantFilter] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<Partial<MenuItem>>({
    tenant_id: tenants[0]?.id || '',
    name: '',
    description: '',
    price: 20000,
    discount_price: null,
    image_url: '',
    is_best_seller: false,
  });

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const filteredMenus = selectedTenantFilter === 'all'
    ? menuList
    : menuList.filter((m) => m.tenant_id === selectedTenantFilter);

  const handleOpenAdd = () => {
    setFormData({
      tenant_id: selectedTenantFilter !== 'all' ? selectedTenantFilter : tenants[0]?.id || '',
      name: '',
      description: '',
      price: 20000,
      discount_price: null,
      image_url: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=600&q=80',
      is_best_seller: false,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (m: MenuItem) => {
    setFormData(m);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showFeedback('error', 'Nama menu wajib diisi.');
      return;
    }
    if (!formData.tenant_id) {
      showFeedback('error', 'Pilih salah satu toko/tenant terkait.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveMenuAction(formData);
      if (res.success && res.data) {
        if (formData.id) {
          setMenuList((prev) => prev.map((m) => (m.id === res.data!.id ? res.data! : m)));
          showFeedback('success', `Menu "${res.data.name}" berhasil diperbarui.`);
        } else {
          setMenuList((prev) => [res.data!, ...prev]);
          showFeedback('success', `Menu baru "${res.data.name}" berhasil ditambahkan.`);
        }
        setIsEditing(false);
        onRefresh();
      } else {
        showFeedback('error', res.error || 'Gagal menyimpan menu.');
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Gagal memproses penyimpanan menu.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus menu "${name}"?`)) return;

    try {
      const res = await deleteMenuAction(id);
      if (res.success) {
        setMenuList((prev) => prev.filter((m) => m.id !== id));
        showFeedback('success', `Menu "${name}" berhasil dihapus.`);
        onRefresh();
      } else {
        showFeedback('error', res.error || 'Gagal menghapus menu.');
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Gagal menghapus menu.');
    }
  };

  const getTenantName = (tId: string) => {
    const t = tenants.find((tenant) => tenant.id === tId);
    return t ? t.name : 'Toko Tidak Dikenal';
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2 animate-in fade-in duration-200 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span className="font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* Header bar with Tenant Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#1C1917] dark:text-[#F5F5F4] font-[family-name:var(--font-heading)]">
            Manajemen Daftar Menu
          </h2>
          <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
            Kelola rincian menu makanan/minuman, foto thumbnail, harga promo, dan status best seller.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-white dark:bg-[#1C1917] text-xs">
            <Filter className="w-3.5 h-3.5 text-[#78716C]" />
            <select
              value={selectedTenantFilter}
              onChange={(e) => setSelectedTenantFilter(e.target.value)}
              className="bg-transparent text-[#1C1917] dark:text-[#F5F5F4] focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Toko ({menuList.length} menu)</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#D9531E] hover:bg-[#C04312] text-white transition min-h-[44px] shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Menu</span>
          </button>
        </div>
      </div>

      {/* Menu Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredMenus.map((menu) => {
          const hasDiscount = menu.discount_price && menu.discount_price > 0 && menu.discount_price < menu.price;
          return (
            <div
              key={menu.id}
              className="p-3.5 rounded-2xl border border-[#EAE5DC] dark:border-[#2C2623] bg-white dark:bg-[#1C1917] flex gap-3 items-start justify-between"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FAF8F5] dark:bg-[#12100E] shrink-0 border border-[#EAE5DC] dark:border-[#2C2623]">
                <Image
                  src={menu.image_url || 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=600&q=80'}
                  alt={menu.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-medium text-[#78716C] dark:text-[#A8A29E] truncate">
                    {getTenantName(menu.tenant_id)}
                  </span>
                  {menu.is_best_seller && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/15 text-amber-600">
                      <Star className="w-2.5 h-2.5 fill-amber-500" />
                      Best
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-[#1C1917] dark:text-[#F5F5F4] truncate">
                  {menu.name}
                </h4>

                <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] line-clamp-1 mb-1.5">
                  {menu.description}
                </p>

                <div className="flex items-baseline gap-2 tabular-nums">
                  {hasDiscount ? (
                    <>
                      <span className="text-xs font-bold text-[#D9531E] dark:text-[#F97316]">
                        {formatRupiah(menu.discount_price!)}
                      </span>
                      <span className="text-[10px] text-[#78716C] line-through">
                        {formatRupiah(menu.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-[#1C1917] dark:text-[#F5F5F4]">
                      {formatRupiah(menu.price)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  onClick={() => handleOpenEdit(menu)}
                  className="p-1.5 rounded-lg border border-[#EAE5DC] dark:border-[#2C2623] text-[#78716C] hover:text-[#D9531E]"
                  title="Edit Menu"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(menu.id, menu.name)}
                  className="p-1.5 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20"
                  title="Hapus Menu"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal CRUD Menu Form */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-[#1C1917] rounded-3xl border border-[#EAE5DC] dark:border-[#2C2623] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC] dark:border-[#2C2623] mb-4">
              <h3 className="font-bold text-base text-[#1C1917] dark:text-[#F5F5F4]">
                {formData.id ? 'Edit Item Menu' : 'Tambah Menu Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1 text-[#78716C] hover:text-[#1C1917] dark:hover:text-[#F5F5F4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1">
                  Pilih Toko / Tenant Terkait *
                </label>
                <select
                  required
                  value={formData.tenant_id || ''}
                  onChange={(e) => setFormData({ ...formData, tenant_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/50 dark:bg-[#12100E]/50 text-sm focus:outline-none focus:border-[#D9531E]"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1">
                  Nama Menu *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Sate Ayam Daging Spesial"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/50 dark:bg-[#12100E]/50 text-sm focus:outline-none focus:border-[#D9531E]"
                />
              </div>

              {/* Upload Foto Menu Langsung dari Galeri/File */}
              <div>
                <label className="block text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1.5">
                  Foto Item Menu
                </label>
                <ImageUpload
                  value={formData.image_url || ''}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  folder="menus"
                  aspect="square"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1">
                  Deskripsi Lengkap Menu (Bahan, rasa, porsi)
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan isi porsi, bumbu khusus, atau keistimewaan menu ini..."
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/50 dark:bg-[#12100E]/50 text-sm focus:outline-none focus:border-[#D9531E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1">
                    Harga Normal (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/50 dark:bg-[#12100E]/50 text-sm focus:outline-none focus:border-[#D9531E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1">
                    Harga Diskon (Rp, Kosongkan jika normal)
                  </label>
                  <input
                    type="number"
                    value={formData.discount_price ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_price: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="Contoh: 18000"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/50 dark:bg-[#12100E]/50 text-sm focus:outline-none focus:border-[#D9531E]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="best_seller"
                  checked={Boolean(formData.is_best_seller)}
                  onChange={(e) => setFormData({ ...formData, is_best_seller: e.target.checked })}
                  className="rounded border-[#EAE5DC] text-[#D9531E] focus:ring-[#D9531E]"
                />
                <label htmlFor="best_seller" className="text-xs font-semibold text-[#1C1917] dark:text-[#F5F5F4] cursor-pointer">
                  Tandai sebagai Menu Terlaris (Best Seller)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAE5DC] dark:border-[#2C2623]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] hover:bg-stone-100 dark:hover:bg-stone-800 transition min-h-[44px]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#D9531E] hover:bg-[#C04312] text-white flex items-center gap-1.5 transition min-h-[44px] shadow-sm disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Menu'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
