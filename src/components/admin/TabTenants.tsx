'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Tenant } from '@/types/database';
import { Plus, Edit2, Trash2, MapPin, Clock, Check, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { LocationPicker } from '@/components/admin/LocationPicker';
import { saveTenantAction, deleteTenantAction } from '@/lib/queries';

interface TabTenantsProps {
  tenants: Tenant[];
  onRefresh: () => void;
}

export function TabTenants({ tenants, onRefresh }: TabTenantsProps) {
  const [tenantList, setTenantList] = useState<Tenant[]>(tenants);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<Partial<Tenant>>({
    name: '',
    category: 'Jajanan Viral',
    description: '',
    location_note: '',
    cover_image: '',
    open_hours: '16:00 - 23:00 WIB',
    gmaps_url: 'https://www.google.com/maps?q=-6.17892,106.63098',
    is_active: true,
  });

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      category: 'Jajanan Viral',
      description: '',
      location_note: 'Jl. Kisamaun (Kawasan Kuliner Pasar Lama)',
      cover_image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80',
      open_hours: '16:00 - 23:00 WIB',
      gmaps_url: 'https://www.google.com/maps?q=-6.17892,106.63098',
      is_active: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (t: Tenant) => {
    setFormData(t);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showFeedback('error', 'Nama toko/tenant wajib diisi.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveTenantAction(formData);
      if (res.success && res.data) {
        if (formData.id) {
          setTenantList((prev) => prev.map((t) => (t.id === res.data!.id ? res.data! : t)));
          showFeedback('success', `Tenant "${res.data.name}" berhasil diperbarui.`);
        } else {
          setTenantList((prev) => [res.data!, ...prev]);
          showFeedback('success', `Tenant baru "${res.data.name}" berhasil ditambahkan.`);
        }
        setIsEditing(false);
        onRefresh();
      } else {
        showFeedback('error', res.error || 'Gagal menyimpan tenant.');
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Terjadi kesalahan sistem saat menyimpan data.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus tenant "${name}"? Seluruh menu terkait juga akan dihapus.`)) {
      return;
    }

    try {
      const res = await deleteTenantAction(id);
      if (res.success) {
        setTenantList((prev) => prev.filter((t) => t.id !== id));
        showFeedback('success', `Tenant "${name}" berhasil dihapus.`);
        onRefresh();
      } else {
        showFeedback('error', res.error || 'Gagal menghapus tenant.');
      }
    } catch (err: any) {
      showFeedback('error', err.message || 'Gagal menghapus tenant.');
    }
  };

  const handleToggleStatus = async (tenant: Tenant) => {
    try {
      const updated = { ...tenant, is_active: !tenant.is_active };
      const res = await saveTenantAction(updated);
      if (res.success && res.data) {
        setTenantList((prev) => prev.map((t) => (t.id === tenant.id ? res.data! : t)));
        showFeedback('success', `Status tenant "${tenant.name}" diubah menjadi ${res.data.is_active ? 'Aktif' : 'Non-Aktif'}.`);
        onRefresh();
      }
    } catch {
      showFeedback('error', 'Gagal mengubah status tenant.');
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

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#1C1917] dark:text-[#F5F5F4] font-[family-name:var(--font-heading)]">
            Manajemen Tenant & Pedagang
          </h2>
          <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
            Kelola data toko, lokasi lapak di Pasar Lama, dan jam operasional.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#D9531E] hover:bg-[#C04312] text-white transition min-h-[44px] shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tenant Baru</span>
        </button>
      </div>

      {/* Tenant Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenantList.map((tenant) => (
          <div
            key={tenant.id}
            className="p-4 rounded-2xl border border-[#EAE5DC] dark:border-[#2C2623] bg-white dark:bg-[#1C1917] flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[#FAF8F5] dark:bg-[#12100E] mb-3 border border-[#EAE5DC] dark:border-[#2C2623]">
                <Image
                  src={tenant.cover_image || 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80'}
                  alt={tenant.name}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => handleToggleStatus(tenant)}
                  className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm ${
                    tenant.is_active
                      ? 'bg-emerald-500 text-white'
                      : 'bg-stone-500 text-white'
                  }`}
                  title="Klik untuk mengubah status aktif/non-aktif"
                >
                  {tenant.is_active ? 'Aktif' : 'Non-Aktif'}
                </button>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF8F5] dark:bg-[#2C2623] text-[#78716C] dark:text-[#A8A29E] border border-[#EAE5DC] dark:border-[#2C2623]">
                  {tenant.category}
                </span>
              </div>

              <h3 className="font-bold text-base text-[#1C1917] dark:text-[#F5F5F4] line-clamp-1">
                {tenant.name}
              </h3>
              <p className="text-xs text-[#78716C] dark:text-[#A8A29E] line-clamp-2 mt-1 mb-3">
                {tenant.description}
              </p>

              <div className="space-y-1 text-xs text-[#78716C] dark:text-[#A8A29E] border-t border-[#EAE5DC]/60 dark:border-[#2C2623]/60 pt-2 mb-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D9531E]" />
                  <span className="truncate tabular-nums">{tenant.open_hours}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#78716C]" />
                  <span className="truncate">{tenant.location_note}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#EAE5DC] dark:border-[#2C2623]">
              <a
                href={tenant.gmaps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-[#D9531E] hover:underline flex items-center gap-1"
              >
                <span>Buka Maps</span>
                <span className="text-[10px]">&rarr;</span>
              </a>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(tenant)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FAF8F5] dark:bg-[#2C2623] border border-[#EAE5DC] dark:border-[#2C2623] text-[#1C1917] dark:text-[#F5F5F4] hover:border-[#D9531E]"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(tenant.id, tenant.name)}
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

      {/* Modal CRUD Form */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white dark:bg-[#1C1917] rounded-3xl border border-[#EAE5DC] dark:border-[#2C2623] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC] dark:border-[#2C2623] mb-4">
              <h3 className="font-bold text-base text-[#1C1917] dark:text-[#F5F5F4]">
                {formData.id ? 'Edit Data Tenant' : 'Tambah Tenant Baru'}
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
                  Nama Toko / Pedagang *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Sate Ayam H. Ishak"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/50 dark:bg-[#12100E]/50 text-sm focus:outline-none focus:border-[#D9531E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1">
                  Kategori
                </label>
                <select
                  value={formData.category || 'Jajanan Viral'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/50 dark:bg-[#12100E]/50 text-sm focus:outline-none focus:border-[#D9531E]"
                >
                  <option value="Jajanan Viral">Jajanan Viral</option>
                  <option value="Makanan Berat">Makanan Berat</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>

              {/* Upload Foto Cover dari Galeri / File */}
              <div>
                <label className="block text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1.5">
                  Foto Cover Toko / Lapak
                </label>
                <ImageUpload
                  value={formData.cover_image || ''}
                  onChange={(url) => setFormData({ ...formData, cover_image: url })}
                  folder="tenants"
                  aspect="video"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1">
                  Deskripsi Profil Singkat
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ceritakan keistimewaan dan ciri khas cita rasa toko..."
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/50 dark:bg-[#12100E]/50 text-sm focus:outline-none focus:border-[#D9531E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1">
                  Catatan Lokasi Lapak (Patokan Pasar Lama)
                </label>
                <input
                  type="text"
                  value={formData.location_note || ''}
                  onChange={(e) => setFormData({ ...formData, location_note: e.target.value })}
                  placeholder="Contoh: Jl. Kisamaun No. 42 (Dekat Gerbang Utama Pasar Lama)"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/50 dark:bg-[#12100E]/50 text-sm focus:outline-none focus:border-[#D9531E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1">
                    Jam Operasional
                  </label>
                  <input
                    type="text"
                    value={formData.open_hours || ''}
                    onChange={(e) => setFormData({ ...formData, open_hours: e.target.value })}
                    placeholder="16:00 - 23:00 WIB"
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/50 dark:bg-[#12100E]/50 text-sm focus:outline-none focus:border-[#D9531E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#78716C] dark:text-[#A8A29E] mb-1">
                    Status Toko
                  </label>
                  <select
                    value={formData.is_active ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE5DC] dark:border-[#2C2623] bg-[#FAF8F5]/50 dark:bg-[#12100E]/50 text-sm focus:outline-none focus:border-[#D9531E]"
                  >
                    <option value="true">Aktif (Tampil di Publik)</option>
                    <option value="false">Non-Aktif (Sembunyikan)</option>
                  </select>
                </div>
              </div>

              {/* Pengaturan Google Maps & Titik Interaktif */}
              <LocationPicker
                gmapsUrl={formData.gmaps_url || ''}
                locationNote={formData.location_note || ''}
                onGmapsUrlChange={(url) => setFormData({ ...formData, gmaps_url: url })}
                onLocationNoteChange={(note) => setFormData({ ...formData, location_note: note })}
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
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
