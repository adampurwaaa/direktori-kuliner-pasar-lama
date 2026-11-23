-- ==============================================================================
-- SCHEMA: DIREKTORI KULINER DIGITAL PASAR LAMA TANGERANG
-- High-Traffic Ready with Daily Click Aggregation & Row Level Security (RLS)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS / DOMAINS (Opsional, gunakan VARCHAR/TEXT dengan check constraint agar fleksibel)

-- 3. TABEL: tenants (Daftar Toko / Pedagang Kaki Lima)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL DEFAULT 'Jajanan Viral', -- 'Jajanan Viral', 'Makanan Berat', 'Minuman', 'Dessert'
    description TEXT,
    location_note TEXT, -- misal: 'Depan Klenteng Boen Tek Bio', 'Dekat Pintu Gerbang Kisamaun'
    cover_image TEXT,
    open_hours VARCHAR(100) DEFAULT '16:00 - 23:00 WIB',
    gmaps_url TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing untuk pencarian cepat & filter kategori
CREATE INDEX IF NOT EXISTS idx_tenants_category ON public.tenants (category);
CREATE INDEX IF NOT EXISTS idx_tenants_is_active ON public.tenants (is_active);
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON public.tenants (slug);

-- 4. TABEL: menus (Daftar Menu per Tenant)
CREATE TABLE IF NOT EXISTS public.menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL DEFAULT 0, -- Dalam Rupiah
    discount_price INTEGER, -- Dalam Rupiah (opsional)
    image_url TEXT,
    is_best_seller BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_menus_tenant_id ON public.menus (tenant_id);
CREATE INDEX IF NOT EXISTS idx_menus_is_best_seller ON public.menus (is_best_seller);

-- 5. TABEL: promos (Banner Iklan & Promo Tenant)
CREATE TABLE IF NOT EXISTS public.promos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    badge_text VARCHAR(100), -- misal: 'Diskon 20%', 'Beli 2 Gratis 1'
    gmaps_url TEXT, -- opsional: jika kosong bisa merujuk ke gmaps_url tenant
    is_featured BOOLEAN NOT NULL DEFAULT false,
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_promos_is_active ON public.promos (is_active);
CREATE INDEX IF NOT EXISTS idx_promos_is_featured ON public.promos (is_featured);

-- 6. TABEL: daily_click_stats (Agregasi Klik Harian - High Traffic Ready)
CREATE TABLE IF NOT EXISTS public.daily_click_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    stat_date DATE NOT NULL DEFAULT CURRENT_DATE,
    menu_clicks INTEGER NOT NULL DEFAULT 0,
    gmaps_clicks INTEGER NOT NULL DEFAULT 0,
    promo_clicks INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_tenant_stat_date UNIQUE (tenant_id, stat_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON public.daily_click_stats (stat_date);
CREATE INDEX IF NOT EXISTS idx_daily_stats_tenant_date ON public.daily_click_stats (tenant_id, stat_date);

-- 7. RPC FUNCTION: increment_tenant_click
-- Atomic upsert untuk menangani ribuan klik konkuren tanpa locking bottleneck
CREATE OR REPLACE FUNCTION public.increment_tenant_click(
    p_tenant_id UUID,
    p_click_type TEXT -- 'menu', 'gmaps', 'promo'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_today DATE := CURRENT_DATE;
BEGIN
    INSERT INTO public.daily_click_stats (tenant_id, stat_date, menu_clicks, gmaps_clicks, promo_clicks)
    VALUES (
        p_tenant_id,
        v_today,
        CASE WHEN p_click_type = 'menu' THEN 1 ELSE 0 END,
        CASE WHEN p_click_type = 'gmaps' THEN 1 ELSE 0 END,
        CASE WHEN p_click_type = 'promo' THEN 1 ELSE 0 END
    )
    ON CONFLICT (tenant_id, stat_date)
    DO UPDATE SET
        menu_clicks = public.daily_click_stats.menu_clicks + (CASE WHEN p_click_type = 'menu' THEN 1 ELSE 0 END),
        gmaps_clicks = public.daily_click_stats.gmaps_clicks + (CASE WHEN p_click_type = 'gmaps' THEN 1 ELSE 0 END),
        promo_clicks = public.daily_click_stats.promo_clicks + (CASE WHEN p_click_type = 'promo' THEN 1 ELSE 0 END),
        updated_at = timezone('utc'::text, now());
END;
$$;

-- Berikan izin eksekusi ke anon & authenticated
GRANT EXECUTE ON FUNCTION public.increment_tenant_click(UUID, TEXT) TO anon, authenticated, service_role;

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_click_stats ENABLE ROW LEVEL SECURITY;

-- Tenants Policies
CREATE POLICY "Public Read Active Tenants"
    ON public.tenants FOR SELECT
    USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin Full Access Tenants"
    ON public.tenants FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Menus Policies
CREATE POLICY "Public Read Menus"
    ON public.menus FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.tenants
            WHERE public.tenants.id = public.menus.tenant_id
            AND (public.tenants.is_active = true OR auth.role() = 'authenticated')
        )
    );

CREATE POLICY "Admin Full Access Menus"
    ON public.menus FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Promos Policies
CREATE POLICY "Public Read Active Promos"
    ON public.promos FOR SELECT
    USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admin Full Access Promos"
    ON public.promos FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Daily Click Stats Policies
CREATE POLICY "Public Read Click Stats"
    ON public.daily_click_stats FOR SELECT
    USING (true);

CREATE POLICY "Admin Full Access Stats"
    ON public.daily_click_stats FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 9. STORAGE BUCKET: kuliner-assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('kuliner-assets', 'kuliner-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies: Public can read assets, authenticated users (admin) can upload/modify
CREATE POLICY "Public Access Storage kuliner-assets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'kuliner-assets');

CREATE POLICY "Admin Upload kuliner-assets"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'kuliner-assets');

CREATE POLICY "Admin Modify kuliner-assets"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'kuliner-assets');

CREATE POLICY "Admin Delete kuliner-assets"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'kuliner-assets');
