import { Tenant, MenuItem, Promo, DailyClickStat } from '@/types/database';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { DUMMY_TENANTS, DUMMY_MENUS, DUMMY_PROMOS, generateDummyStats } from '@/lib/dummy-data';

// ==========================================
// LOCAL STORAGE KEYS (CLEAN STATE, EXCLUDE 'bakmi tes')
// ==========================================
const LS_TENANTS_KEY = 'kuliner_tenants_data';
const LS_MENUS_KEY = 'kuliner_menus_data';
const LS_PROMOS_KEY = 'kuliner_promos_data';

// Filter out test items if present
function cleanTenants(list: Tenant[]): Tenant[] {
  return list.filter(
    (t) =>
      t.name?.toLowerCase() !== 'bakmi tes' &&
      t.slug !== 'bakmi-tes' &&
      !t.name?.toLowerCase().includes('bakmi tes')
  );
}

function getLocalData<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw);
    if (key === LS_TENANTS_KEY && Array.isArray(parsed)) {
      const cleaned = cleanTenants(parsed as Tenant[]);
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(key, JSON.stringify(cleaned));
      }
      return cleaned as unknown as T[];
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function setLocalData<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('kuliner_data_updated'));
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }
}

// ==========================================
// TENANTS READ & MUTATIONS
// ==========================================
export async function getTenants(): Promise<Tenant[]> {
  if (!isSupabaseConfigured()) {
    const local = getLocalData<Tenant>(LS_TENANTS_KEY, DUMMY_TENANTS);
    return cleanTenants(local).filter((t) => t.is_active);
  }
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('is_active', true)
      .order('name');
    if (error || !data || data.length === 0) {
      return cleanTenants(getLocalData<Tenant>(LS_TENANTS_KEY, DUMMY_TENANTS)).filter((t) => t.is_active);
    }
    return cleanTenants(data);
  } catch {
    return cleanTenants(getLocalData<Tenant>(LS_TENANTS_KEY, DUMMY_TENANTS)).filter((t) => t.is_active);
  }
}

export async function getAllTenantsAdmin(): Promise<Tenant[]> {
  if (!isSupabaseConfigured()) {
    return cleanTenants(getLocalData<Tenant>(LS_TENANTS_KEY, DUMMY_TENANTS));
  }
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return cleanTenants(getLocalData<Tenant>(LS_TENANTS_KEY, DUMMY_TENANTS));
    }
    return cleanTenants(data);
  } catch {
    return cleanTenants(getLocalData<Tenant>(LS_TENANTS_KEY, DUMMY_TENANTS));
  }
}

export async function saveTenantAction(
  tenantData: Partial<Tenant>
): Promise<{ success: boolean; data?: Tenant; error?: string }> {
  const isUpdate = Boolean(tenantData.id);

  const payload: any = {
    name: tenantData.name?.trim() || '',
    category: tenantData.category || 'Jajanan Viral',
    description: tenantData.description?.trim() || '',
    location_note: tenantData.location_note?.trim() || '',
    cover_image: tenantData.cover_image || 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80',
    open_hours: tenantData.open_hours?.trim() || '16:00 - 23:00 WIB',
    gmaps_url: tenantData.gmaps_url?.trim() || 'https://www.google.com/maps?q=-6.17915,106.63110',
    is_active: tenantData.is_active ?? true,
  };

  if (!payload.name) {
    return { success: false, error: 'Nama tenant tidak boleh kosong.' };
  }

  if (isSupabaseConfigured()) {
    try {
      if (isUpdate) {
        payload.updated_at = new Date().toISOString();
        const { data, error } = await supabase
          .from('tenants')
          .update(payload)
          .eq('id', tenantData.id)
          .select()
          .single();
        if (error) throw error;
        return { success: true, data };
      } else {
        payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
        const { data, error } = await supabase
          .from('tenants')
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        return { success: true, data };
      }
    } catch (err: any) {
      console.warn('Supabase tenant save error, fallback to local storage:', err);
    }
  }

  // Local storage persistence
  const currentList = cleanTenants(getLocalData<Tenant>(LS_TENANTS_KEY, DUMMY_TENANTS));
  let savedItem: Tenant;

  if (isUpdate) {
    savedItem = { ...currentList.find((t) => t.id === tenantData.id), ...payload, id: tenantData.id } as Tenant;
    const updated = currentList.map((t) => (t.id === tenantData.id ? savedItem : t));
    setLocalData(LS_TENANTS_KEY, updated);
  } else {
    savedItem = {
      ...payload,
      id: `t-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      slug: payload.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString(36),
    } as Tenant;
    setLocalData(LS_TENANTS_KEY, [savedItem, ...currentList]);
  }

  return { success: true, data: savedItem };
}

export async function deleteTenantAction(tenantId: string): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('tenants').delete().eq('id', tenantId);
      if (error) throw error;
    } catch (err: any) {
      console.warn('Supabase delete error:', err);
    }
  }

  const currentList = cleanTenants(getLocalData<Tenant>(LS_TENANTS_KEY, DUMMY_TENANTS));
  setLocalData(
    LS_TENANTS_KEY,
    currentList.filter((t) => t.id !== tenantId)
  );

  return { success: true };
}

// ==========================================
// MENUS READ & MUTATIONS
// ==========================================
export async function getMenusByTenantId(tenantId: string): Promise<MenuItem[]> {
  if (!isSupabaseConfigured()) {
    const list = getLocalData<MenuItem>(LS_MENUS_KEY, DUMMY_MENUS);
    return list.filter((m) => m.tenant_id === tenantId);
  }
  try {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('is_best_seller', { ascending: false })
      .order('name');
    if (error || !data || data.length === 0) {
      const list = getLocalData<MenuItem>(LS_MENUS_KEY, DUMMY_MENUS);
      return list.filter((m) => m.tenant_id === tenantId);
    }
    return data;
  } catch {
    const list = getLocalData<MenuItem>(LS_MENUS_KEY, DUMMY_MENUS);
    return list.filter((m) => m.tenant_id === tenantId);
  }
}

export async function getAllMenus(): Promise<MenuItem[]> {
  if (!isSupabaseConfigured()) {
    return getLocalData<MenuItem>(LS_MENUS_KEY, DUMMY_MENUS);
  }
  try {
    const { data, error } = await supabase.from('menus').select('*').order('name');
    if (error || !data || data.length === 0) {
      return getLocalData<MenuItem>(LS_MENUS_KEY, DUMMY_MENUS);
    }
    return data;
  } catch {
    return getLocalData<MenuItem>(LS_MENUS_KEY, DUMMY_MENUS);
  }
}

export async function saveMenuAction(
  menuData: Partial<MenuItem>
): Promise<{ success: boolean; data?: MenuItem; error?: string }> {
  const isUpdate = Boolean(menuData.id);

  if (!menuData.name?.trim()) {
    return { success: false, error: 'Nama menu tidak boleh kosong.' };
  }
  if (!menuData.tenant_id) {
    return { success: false, error: 'Wajib memilih tenant/toko terkait.' };
  }

  const payload: any = {
    tenant_id: menuData.tenant_id,
    name: menuData.name.trim(),
    description: menuData.description?.trim() || '',
    price: Number(menuData.price) || 0,
    discount_price: menuData.discount_price && Number(menuData.discount_price) > 0 ? Number(menuData.discount_price) : null,
    image_url: menuData.image_url || 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=600&q=80',
    is_best_seller: Boolean(menuData.is_best_seller),
  };

  if (isSupabaseConfigured()) {
    try {
      if (isUpdate) {
        payload.updated_at = new Date().toISOString();
        const { data, error } = await supabase
          .from('menus')
          .update(payload)
          .eq('id', menuData.id)
          .select()
          .single();
        if (error) throw error;
        return { success: true, data };
      } else {
        const { data, error } = await supabase
          .from('menus')
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        return { success: true, data };
      }
    } catch (err: any) {
      console.warn('Supabase menu save error, fallback to local storage:', err);
    }
  }

  const currentList = getLocalData<MenuItem>(LS_MENUS_KEY, DUMMY_MENUS);
  let savedItem: MenuItem;

  if (isUpdate) {
    savedItem = { ...currentList.find((m) => m.id === menuData.id), ...payload, id: menuData.id } as MenuItem;
    const updated = currentList.map((m) => (m.id === menuData.id ? savedItem : m));
    setLocalData(LS_MENUS_KEY, updated);
  } else {
    savedItem = {
      ...payload,
      id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    } as MenuItem;
    setLocalData(LS_MENUS_KEY, [savedItem, ...currentList]);
  }

  return { success: true, data: savedItem };
}

export async function deleteMenuAction(menuId: string): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('menus').delete().eq('id', menuId);
      if (error) throw error;
    } catch (err: any) {
      console.warn('Supabase delete menu error:', err);
    }
  }

  const currentList = getLocalData<MenuItem>(LS_MENUS_KEY, DUMMY_MENUS);
  setLocalData(
    LS_MENUS_KEY,
    currentList.filter((m) => m.id !== menuId)
  );

  return { success: true };
}

// ==========================================
// PROMOS READ & MUTATIONS
// ==========================================
export async function getActivePromos(): Promise<Promo[]> {
  if (!isSupabaseConfigured()) {
    const list = getLocalData<Promo>(LS_PROMOS_KEY, DUMMY_PROMOS);
    return list.filter((p) => p.is_active);
  }
  try {
    const { data, error } = await supabase
      .from('promos')
      .select('*, tenant:tenants(*)')
      .eq('is_active', true)
      .order('is_featured', { ascending: false });
    if (error || !data || data.length === 0) {
      return getLocalData<Promo>(LS_PROMOS_KEY, DUMMY_PROMOS).filter((p) => p.is_active);
    }
    return data;
  } catch {
    return getLocalData<Promo>(LS_PROMOS_KEY, DUMMY_PROMOS).filter((p) => p.is_active);
  }
}

export async function getAllPromosAdmin(): Promise<Promo[]> {
  if (!isSupabaseConfigured()) {
    return getLocalData<Promo>(LS_PROMOS_KEY, DUMMY_PROMOS);
  }
  try {
    const { data, error } = await supabase
      .from('promos')
      .select('*, tenant:tenants(*)')
      .order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return getLocalData<Promo>(LS_PROMOS_KEY, DUMMY_PROMOS);
    }
    return data;
  } catch {
    return getLocalData<Promo>(LS_PROMOS_KEY, DUMMY_PROMOS);
  }
}

export async function savePromoAction(
  promoData: Partial<Promo>,
  allTenants: Tenant[]
): Promise<{ success: boolean; data?: Promo; error?: string }> {
  const isUpdate = Boolean(promoData.id);

  if (!promoData.title?.trim()) {
    return { success: false, error: 'Judul promo tidak boleh kosong.' };
  }

  const matchedTenant = allTenants.find((t) => t.id === promoData.tenant_id);

  const payload: any = {
    tenant_id: promoData.tenant_id || null,
    title: promoData.title.trim(),
    subtitle: promoData.subtitle?.trim() || '',
    badge_text: promoData.badge_text?.trim() || 'Promo',
    gmaps_url: promoData.gmaps_url?.trim() || matchedTenant?.gmaps_url || 'https://www.google.com/maps?q=-6.17915,106.63110',
    is_featured: Boolean(promoData.is_featured),
    is_active: promoData.is_active ?? true,
  };

  if (isSupabaseConfigured()) {
    try {
      if (isUpdate) {
        payload.updated_at = new Date().toISOString();
        const { data, error } = await supabase
          .from('promos')
          .update(payload)
          .eq('id', promoData.id)
          .select('*, tenant:tenants(*)')
          .single();
        if (error) throw error;
        return { success: true, data };
      } else {
        const { data, error } = await supabase
          .from('promos')
          .insert([payload])
          .select('*, tenant:tenants(*)')
          .single();
        if (error) throw error;
        return { success: true, data };
      }
    } catch (err: any) {
      console.warn('Supabase promo save error, fallback to local storage:', err);
    }
  }

  const currentList = getLocalData<Promo>(LS_PROMOS_KEY, DUMMY_PROMOS);
  let savedItem: Promo;

  if (isUpdate) {
    savedItem = {
      ...currentList.find((p) => p.id === promoData.id),
      ...payload,
      id: promoData.id,
      tenant: matchedTenant,
    } as Promo;
    const updated = currentList.map((p) => (p.id === promoData.id ? savedItem : p));
    setLocalData(LS_PROMOS_KEY, updated);
  } else {
    savedItem = {
      ...payload,
      id: `promo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      tenant: matchedTenant,
    } as Promo;
    setLocalData(LS_PROMOS_KEY, [savedItem, ...currentList]);
  }

  return { success: true, data: savedItem };
}

export async function deletePromoAction(promoId: string): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('promos').delete().eq('id', promoId);
      if (error) throw error;
    } catch (err: any) {
      console.warn('Supabase delete promo error:', err);
    }
  }

  const currentList = getLocalData<Promo>(LS_PROMOS_KEY, DUMMY_PROMOS);
  setLocalData(
    LS_PROMOS_KEY,
    currentList.filter((p) => p.id !== promoId)
  );

  return { success: true };
}

// ==========================================
// CLICK TRACKING (RPC)
// ==========================================
export async function trackTenantClick(tenantId: string, clickType: 'menu' | 'gmaps' | 'promo') {
  if (!tenantId) return;
  if (!isSupabaseConfigured()) {
    try {
      const statsJson = localStorage.getItem('kuliner_local_stats');
      const stats: DailyClickStat[] = statsJson ? JSON.parse(statsJson) : [];
      const today = new Date().toISOString().split('T')[0];
      let stat = stats.find((s) => s.tenant_id === tenantId && s.stat_date === today);
      if (!stat) {
        stat = {
          id: `local-${Date.now()}`,
          tenant_id: tenantId,
          stat_date: today,
          menu_clicks: 0,
          gmaps_clicks: 0,
          promo_clicks: 0,
        };
        stats.push(stat);
      }
      if (clickType === 'menu') stat.menu_clicks += 1;
      if (clickType === 'gmaps') stat.gmaps_clicks += 1;
      if (clickType === 'promo') stat.promo_clicks += 1;
      localStorage.setItem('kuliner_local_stats', JSON.stringify(stats));
    } catch {
      // ignore
    }
    return;
  }

  try {
    await supabase.rpc('increment_tenant_click', {
      p_tenant_id: tenantId,
      p_click_type: clickType,
    });
  } catch (err) {
    console.error('Error logging click stats:', err);
  }
}

// ==========================================
// STATS FOR ADMIN
// ==========================================
export async function getClickStatsAdmin(
  startDate?: string,
  endDate?: string,
  tenantId?: string
): Promise<DailyClickStat[]> {
  if (!isSupabaseConfigured()) {
    let dummy = generateDummyStats();
    if (startDate) dummy = dummy.filter((s) => s.stat_date >= startDate);
    if (endDate) dummy = dummy.filter((s) => s.stat_date <= endDate);
    if (tenantId && tenantId !== 'all') dummy = dummy.filter((s) => s.tenant_id === tenantId);
    return dummy;
  }

  try {
    let query = supabase.from('daily_click_stats').select('*');
    if (startDate) query = query.gte('stat_date', startDate);
    if (endDate) query = query.lte('stat_date', endDate);
    if (tenantId && tenantId !== 'all') query = query.eq('tenant_id', tenantId);

    const { data, error } = await query.order('stat_date', { ascending: true });
    if (error || !data || data.length === 0) {
      let dummy = generateDummyStats();
      if (startDate) dummy = dummy.filter((s) => s.stat_date >= startDate);
      if (endDate) dummy = dummy.filter((s) => s.stat_date <= endDate);
      if (tenantId && tenantId !== 'all') dummy = dummy.filter((s) => s.tenant_id === tenantId);
      return dummy;
    }
    return data;
  } catch {
    return generateDummyStats();
  }
}
