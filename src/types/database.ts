export type TenantCategory = 'Semua' | 'Jajanan Viral' | 'Makanan Berat' | 'Minuman' | 'Dessert';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  category: 'Jajanan Viral' | 'Makanan Berat' | 'Minuman' | 'Dessert';
  description: string;
  location_note: string;
  cover_image: string;
  open_hours: string;
  gmaps_url: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MenuItem {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number | null;
  image_url: string;
  is_best_seller: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Promo {
  id: string;
  tenant_id?: string;
  tenant?: Tenant;
  title: string;
  subtitle: string;
  badge_text?: string;
  gmaps_url?: string;
  is_featured: boolean;
  valid_until?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DailyClickStat {
  id: string;
  tenant_id: string;
  stat_date: string;
  menu_clicks: number;
  gmaps_clicks: number;
  promo_clicks: number;
  created_at?: string;
  updated_at?: string;
}

export interface TenantWithStats extends Tenant {
  menus?: MenuItem[];
  total_menu_clicks?: number;
  total_gmaps_clicks?: number;
  total_promo_clicks?: number;
  total_clicks?: number;
  click_percentage?: number;
}
