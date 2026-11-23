'use client';

import React, { useState } from 'react';
import { Tenant, Promo } from '@/types/database';
import { Plus, Edit2, Trash2, Check, X, Tag, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { LocationPicker } from '@/components/admin/LocationPicker';
import { savePromoAction, deletePromoAction } from '@/lib/queries';

interface TabPromosProps {
  tenants: Tenant[];
  promos: Promo[];
  onRefresh: () => void;
}

export function TabPromos({ tenants, promos, onRefresh }: TabPromosProps) {
  const [promoList, setPromoList] = useState<Promo[]>(promos);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<Partial<Promo>>({
    tenant_id: tenants[0]?.id || '',
    title: '',
    subtitle: '',
    badge_text: 'Diskon 20%',
    gmaps_url: tenants[0]?.gmaps_url || 'https://www.google.com/maps?q=-6.17892,106.63098',
    is_featured: true,
    is_active: true,
  });

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const handleOpenAdd = () => {
    const defaultTenant = tenants[0];
    setFormData({
      tenant_id: defaultTenant?.id || '',
      title: '',
      subtitle: '',
      badge_text: 'Diskon 20%',
      gmaps_url: defaultTenant?.gmaps_url || 'https://www.google.com/maps?q=-6.17892,106.63098',
      is_featured: true,
      is_active: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (p: Promo) => {
    setFormData(p);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      showFeedback('error', 'Judul promo tidak boleh kosong.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await savePromoAction(formData, tenants);
      if (res.success && res.data) {
        if (formData.id) {
          setPromoList((prev) => prev.map((p) => (p.id === res.data!.id ? res.data! : p)));
          showFeedback('success', `Promo "${res.data.title}" berhasil diperbarui.`);
        } else {
          setPromoList((prev) => [res.data!, ...prev]);
          showFeedback('success', `Promo baru "${res.data.title}" berhasil ditambahkan.`);
        }
        setIsEditing(false);
        onRefresh();
      } else {
        showFeedback('error', res.error || 'Gagal menyimpan promo.');
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Gagal memproses penyimpanan promo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Yakin ingin menghapus materi promo "${title}"?`)) return;

    try {
      const res = await deletePromoAction(id);
      if (res.success) {
        setPromoList((prev) => prev.filter((p) => p.id !== id));
        showFeedback('success', `Materi promo "${title}" berhasil dihapus.`);
        onRefresh();
      } else {
        showFeedback('error', res.error || 'Gagal menghapus promo.');
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Gagal menghapus promo.');
    }
  };

  const handleToggleStatus = async (promo: Promo) => {
    try {
      const updated = { ...promo, is_active: !promo.is_active };
      const res = await savePromoAction(updated, tenants);
      if (res.success && res.data) {
        setPromoList((prev) => prev.map((p) => (p.id === promo.id ? res.data! : p)));
        showFeedback('success', `Status promo "${promo.title}" diubah menjadi ${res.data.is_active ? 'Tayang' : 'Non-Aktif'}.`);
        onRefresh();
      }
    } catch {
      showFeedback('error', 'Gagal mengubah status tayang promo.');
    }
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#1C1917] dark:text-[#F5F5F4] font-[family-name:var(--font-heading)]">
            Manajemen Iklan & Banner Promo
          </h2>
          <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
            Atur materi promosi berbayar/kerjasama tenant yang tampil di bagian atas direktori pengunjung.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#D9531E] hover:bg-[#C04312] text-white transition min-h-[44px] shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Promo Baru</span>
        </button>
      </div>

      {/* Promos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promoList.map((promo) => (
          <div
            key={promo.id}
            className="p-4 rounded-2xl border border-[#EAE5DC] dark:border-[#2C2623] bg-white dark:bg-[#1C1917] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#D9531E]/10 text-[#D9531E] dark:bg-[#F97316]/15 dark:text-[#F97316]">
                  <Tag className="w-3 h-3" />
                  {promo.badge_text || 'Promo'}
                </span>
                <div className="flex items-center gap-1.5">
                  {promo.is_featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-600">
                      <Sparkles className="w-3 h-3" />
                      Unggulan
                    </span>
                  )}
                  <button
                    onClick={() => handleToggleStatus(promo)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shadow-sm ${
                      promo.is_active
                        ? 'bg-emerald-500 text-white'
                        : 'bg-stone-500 text-white'
                    }`}
                    title="Klik untuk mengubah status tayang"
                  >
                    {promo.is_active ? 'Tayang' : 'Non-Aktif'}
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-base text-[#1C1917] dark:text-[#F5F5F4] mb-1 font-[family-name:var(--font-heading)]">
                {promo.title}
              </h3>
              <p className="text-xs text-[#78716C] dark:text-[#A8A29E] line-clamp-2 mb-2">
                {promo.subtitle}
              </p>
              {promo.tenant?.name && (
                <p className="text-[11px] font-medium text-[#D9531E] dark:text-[#F97316]">
                  Tenant: {promo.tenant.name}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#EAE5DC] dark:border-[#2C2623] mt-3">
              {promo.gmaps_url ? (
                <a
                  href={promo.gmaps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-[#D9531E] hover:underline"
                >
                  Buka Peta &rarr;
                </a>
              ) : (
                <span className="text-[10px] text-[#78716C]">Maps Tenant</span>
              )}

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(promo)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FAF8F5] dark:bg-[#2C2623] border border-[#EAE5DC] dark:border-[#2C2623] text-[#1C1917] dark:text-[#F5F5F4] hover:border-[#D9531E]"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(promo.id, promo.title)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-600 hover:bg-red-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal CRUD Promo Form */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-[#1C1917] rounded-3xl border border-[#EAE5DC] dark:border-[#2C2623] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC] dark:border-[#2C2623] mb-4">
              <h3 className="font-bold text-base text-[#1C1917] dark:text-[#F5F5F4]">
                {formData.id ? 'Edit Banner Promo' : 'Tambah Promo Baru'}
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
                  Tenant / Pedagang Pemasang Promo *
                </label>
                <select
                  value={formData.tenant_id || ''}
                  onChange={(e) => {
                    const tId = e.target.value;
                    const selectedTenant = tenants.find((t) => t.id === tId);
                    setFormData({
                      ...formData,
                      tenant_id: tId,
                      gmaps_url: selectedTenant?.gmaps_url || formData.gmaps_url,
                    });
                  }}
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
                  Judul Promo (Headline) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Promo Jajanan Viral: Crepes Jumbo Diskon 20%"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/50 dark:bg-[#12100E]/50 text-sm focus:outline-none focus:border-[#D9531E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1">
                  Subjudul / Ketentuan Promo
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Tunjukkan halaman ini ke kasir untuk mendapatkan promo..."
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/50 dark:bg-[#12100E]/50 text-sm focus:outline-none focus:border-[#D9531E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1">
                    Label Badge Promo
                  </label>
                  <input
                    type="text"
                    value={formData.badge_text || ''}
                    onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                    placeholder="Contoh: Diskon 20%"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/50 dark:bg-[#12100E]/50 text-sm focus:outline-none focus:border-[#D9531E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1">
                    Status Tayang
                  </label>
                  <select
                    value={formData.is_active ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/50 dark:bg-[#12100E]/50 text-sm focus:outline-none focus:border-[#D9531E]"
                  >
                    <option value="true">Aktif (Tayang)</option>
                    <option value="false">Non-Aktif (Draft)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured_promo"
                  checked={Boolean(formData.is_featured)}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded border-[#EAE5DC] text-[#D9531E] focus:ring-[#D9531E]"
                />
                <label htmlFor="featured_promo" className="text-xs font-semibold text-[#1C1917] dark:text-[#F5F5F4] cursor-pointer">
                  Tampilkan di Banner Utama (Featured)
                </label>
              </div>

              {/* Pengaturan Titik Lokasi Google Maps untuk Promo */}
              <LocationPicker
                gmapsUrl={formData.gmaps_url || ''}
                locationNote=""
                onGmapsUrlChange={(url) => setFormData({ ...formData, gmaps_url: url })}
                onLocationNoteChange={() => {}}
              />

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
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Promo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
