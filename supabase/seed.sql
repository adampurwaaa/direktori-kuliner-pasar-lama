-- ==============================================================================
-- SEED DATA: KULINER PASAR LAMA TANGERANG REALISTIS
-- ==============================================================================

DO $$
DECLARE
    v_sate_id UUID := '11111111-1111-1111-1111-111111111111';
    v_crepes_id UUID := '22222222-2222-2222-2222-222222222222';
    v_es_id UUID := '33333333-3333-3333-3333-333333333333';
    v_laksa_id UUID := '44444444-4444-4444-4444-444444444444';
    v_kue_id UUID := '55555555-5555-5555-5555-555555555555';
    v_telur_id UUID := '66666666-6666-6666-6666-666666666666';
BEGIN
    -- 1. SEED TENANTS
    INSERT INTO public.tenants (id, name, slug, category, description, location_note, cover_image, open_hours, gmaps_url, is_active)
    VALUES
    (
        v_sate_id,
        'Sate Ayam H. Ishak',
        'sate-ayam-h-ishak',
        'Makanan Berat',
        'Legenda kuliner Pasar Lama sejak 1954. Daging ayam empuk disiram bumbu kacang gurih pekat bercitarasa khas peranakan Benteng.',
        'Jl. Kisamaun No. 42 (Dekat Gerbang Utama Pasar Lama)',
        'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80',
        '16:00 - 22:30 WIB',
        'https://maps.google.com/?q=Pasar+Lama+Tangerang+Sate+Ishak',
        true
    ),
    (
        v_crepes_id,
        'Crepes Jumbo Kisamaun',
        'crepes-jumbo-kisamaun',
        'Jajanan Viral',
        'Crepes berukuran ekstra renyah dengan topping premium melimpah seperti Nutella, keju parut tebal, dan pisang karamel legit.',
        'Jl. Kisamaun (Depan Toko Roti Roppan Pasar Lama)',
        'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
        '16:30 - 23:00 WIB',
        'https://maps.google.com/?q=Pasar+Lama+Tangerang+Crepes',
        true
    ),
    (
        v_es_id,
        'Es Buntin Peranakan Benteng',
        'es-buntin-peranakan-benteng',
        'Minuman',
        'Minuman es legendaris dengan es serut gunung, sirup pandan merah buatan sendiri, kelapa kopyor, dan jelly segar penghapus dahaga.',
        'Jl. Bhakti No. 12 (Samping Klenteng Boen Tek Bio)',
        'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        '15:00 - 22:00 WIB',
        'https://maps.google.com/?q=Klenteng+Boen+Tek+Bio+Tangerang',
        true
    ),
    (
        v_laksa_id,
        'Laksa Tangerang Ny. Giok',
        'laksa-tangerang-ny-giok',
        'Makanan Berat',
        'Kekayaan kuliner Tangerang berkuah santan kental gurih, mie tepung beras kenyal, potongan ayam kampung, dan taburan kacang hijau empuk.',
        'Kawasan Kuliner Belakang Pasar Lama',
        'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
        '16:00 - 23:00 WIB',
        'https://maps.google.com/?q=Pasar+Lama+Tangerang+Laksa',
        true
    ),
    (
        v_kue_id,
        'Kue Rangi & Pancong Lumer Mang Udin',
        'kue-rangi-pancong-mang-udin',
        'Dessert',
        'Kue tradisional khas Betawi-Sunda dipanggang di atas bara arang kayu. Pancong lumer aneka rasa dan rangi siram gula merah kental legit.',
        'Jl. Kisamaun (Tengah Deretan Kuliner Kaki Lima)',
        'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80',
        '17:00 - 23:30 WIB',
        'https://maps.google.com/?q=Pasar+Lama+Tangerang+Kuliner',
        true
    ),
    (
        v_telur_id,
        'Telur Gulung & Cilor Viral Pasar Lama',
        'telur-gulung-cilor-viral',
        'Jajanan Viral',
        'Jajanan nostalgia favorit anak muda, digoreng garing keemasan dengan saus asam manis pedas gurih racikan spesial.',
        'Pintu Masuk Barat Pasar Lama',
        'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
        '16:00 - 23:00 WIB',
        'https://maps.google.com/?q=Pasar+Lama+Tangerang',
        true
    )
    ON CONFLICT (slug) DO NOTHING;

    -- 2. SEED MENUS
    INSERT INTO public.menus (tenant_id, name, description, price, discount_price, image_url, is_best_seller)
    VALUES
    -- Sate H. Ishak
    (
        v_sate_id,
        'Sate Ayam Daging (10 Tusuk + Lontong)',
        'Daging dada ayam pilihan empuk tanpa lemak dipadu lontong pulen, disiram bumbu kacang medok dan taburan bawang goreng harum.',
        32000,
        28000,
        'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=600&q=80',
        true
    ),
    (
        v_sate_id,
        'Sate Kulit Ayam Krispi (10 Tusuk)',
        'Kulit ayam dibakar kering di luar namun juicy di dalam dengan bumbu rempah manis gurih menggoda selera.',
        25000,
        NULL,
        'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80',
        false
    ),
    (
        v_sate_id,
        'Sate Telur Puyuh Bumbu Manis (5 Tusuk)',
        'Telur puyuh bacem manis legit dengan aroma daun salam dan lengkuas yang meresap sempurna hingga ke dalam.',
        15000,
        NULL,
        'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=80',
        false
    ),

    -- Crepes Jumbo Kisamaun
    (
        v_crepes_id,
        'Crepes Jumbo Choco Banana Cheese Special',
        'Ukuran jumbo 40cm dengan adonan renyah wangi vanila, isian pisang raja manis, keju cheddar parut melimpah, dan Nutella leleh.',
        25000,
        20000,
        'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80',
        true
    ),
    (
        v_crepes_id,
        'Crepes Crispy Red Velvet Cream Cheese',
        'Kulit crepes warna merah velvet alami dengan olesan krim keju gurih manis dan remukan biskuit red velvet renyah.',
        22000,
        NULL,
        'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80',
        false
    ),

    -- Es Buntin
    (
        v_es_id,
        'Es Campur Buntin Spesial Komplit',
        'Es serut tinggi mengerucut dengan sari santan segar, alpukat matang pohon, nangka harum, kolang-kaling kenyal, dan sirup khas Benteng.',
        18000,
        15000,
        'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
        true
    ),
    (
        v_es_id,
        'Es Teler Santan Gurih Manis',
        'Kombinasi nangka, alpukat mentega, daging kelapa muda, dan kental manis dengan es batu serut dingin menyegarkan.',
        16000,
        NULL,
        'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=80',
        false
    ),

    -- Laksa Tangerang
    (
        v_laksa_id,
        'Laksa Komplit Ayam Dada & Telur Rebus',
        'Mie tepung beras buatan tangan disiram kuah kari santan gurih hangat berempah dengan suwiran ayam kampung dan telur rebus.',
        30000,
        27000,
        'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
        true
    ),

    -- Kue Rangi & Pancong
    (
        v_kue_id,
        'Pancong Lumer Setengah Matang Keju Coklat',
        'Kue pancong gurih kelapa dengan bagian tengah lumer lembut yang lumer di mulut saat dinikmati selagi hangat di malam hari.',
        18000,
        NULL,
        'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=600&q=80',
        true
    ),
    (
        v_kue_id,
        'Kue Rangi Saus Gula Aren Kental (1 Porsi)',
        'Kue sagu kelapa garing beraroma arang disiram saus gula aren cair kental yang legit legit wangi pandan.',
        12000,
        10000,
        'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
        false
    ),

    -- Telur Gulung
    (
        v_telur_id,
        'Paket Telur Gulung Jumbo (10 Tusuk)',
        'Telur ayam berbumbu digulung presisi dengan tusuk bambu menghasilkan tekstur lembut di dalam dan krispi di luar.',
        15000,
        NULL,
        'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
        true
    ),
    (
        v_telur_id,
        'Cilor Bumbu Tabur Balado Pedas Daun Jeruk',
        'Aci telur kenyal gurih digoreng cetakan bulat disajikan dengan bubuk balado gurih pedas dan aroma segar daun jeruk.',
        12000,
        10000,
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
        false
    )
    ON CONFLICT DO NOTHING;

    -- 3. SEED PROMOS
    INSERT INTO public.promos (tenant_id, title, subtitle, badge_text, gmaps_url, is_featured, valid_until, is_active)
    VALUES
    (
        v_crepes_id,
        'Promo Festival Jajanan Malam: Crepes Jumbo Diskon 20%',
        'Tunjukkan halaman direktori kuliner ini ke kasir Crepes Jumbo Kisamaun dan dapatkan potongan langsung!',
        'Diskon 20%',
        'https://maps.google.com/?q=Pasar+Lama+Tangerang+Crepes',
        true,
        now() + INTERVAL '30 days',
        true
    ),
    (
        v_sate_id,
        'Sate H. Ishak Porsi Spesial Hemat Rp 4.000',
        'Nikmati kelezatan sate legenda Pasar Lama dengan harga spesial setiap pembelian paket sate + lontong pulen.',
        'Hemat Rp 4.000',
        'https://maps.google.com/?q=Pasar+Lama+Tangerang+Sate+Ishak',
        true,
        now() + INTERVAL '14 days',
        true
    ),
    (
        v_es_id,
        'Es Buntin Segar: Diskon Rp 3.000 Es Campur Komplit',
        'Penawar dahaga sehabis keliling pasar malam kuliner, potongan harga spesial menu andalan peranakan Benteng.',
        'Promo Spesial',
        'https://maps.google.com/?q=Klenteng+Boen+Tek+Bio+Tangerang',
        false,
        now() + INTERVAL '20 days',
        true
    )
    ON CONFLICT DO NOTHING;

    -- 4. SEED DAILY CLICK STATS (Data realistis untuk statistik kalender & per toko)
    INSERT INTO public.daily_click_stats (tenant_id, stat_date, menu_clicks, gmaps_clicks, promo_clicks)
    VALUES
    -- Hari ini
    (v_sate_id, CURRENT_DATE, 142, 68, 45),
    (v_crepes_id, CURRENT_DATE, 189, 74, 92),
    (v_es_id, CURRENT_DATE, 98, 41, 23),
    (v_laksa_id, CURRENT_DATE, 76, 35, 12),
    (v_kue_id, CURRENT_DATE, 115, 48, 20),
    (v_telur_id, CURRENT_DATE, 134, 52, 38),

    -- Kemarin (CURRENT_DATE - 1)
    (v_sate_id, CURRENT_DATE - 1, 160, 82, 51),
    (v_crepes_id, CURRENT_DATE - 1, 210, 88, 105),
    (v_es_id, CURRENT_DATE - 1, 105, 49, 28),
    (v_laksa_id, CURRENT_DATE - 1, 88, 42, 16),
    (v_kue_id, CURRENT_DATE - 1, 128, 55, 24),
    (v_telur_id, CURRENT_DATE - 1, 145, 60, 42),

    -- 2 Hari lalu (CURRENT_DATE - 2)
    (v_sate_id, CURRENT_DATE - 2, 130, 60, 39),
    (v_crepes_id, CURRENT_DATE - 2, 175, 70, 84),
    (v_es_id, CURRENT_DATE - 2, 85, 36, 19),
    (v_laksa_id, CURRENT_DATE - 2, 69, 30, 10),
    (v_kue_id, CURRENT_DATE - 2, 95, 40, 18),
    (v_telur_id, CURRENT_DATE - 2, 120, 48, 30),

    -- 3 Hari lalu (CURRENT_DATE - 3)
    (v_sate_id, CURRENT_DATE - 3, 110, 55, 34),
    (v_crepes_id, CURRENT_DATE - 3, 150, 65, 76),
    (v_es_id, CURRENT_DATE - 3, 72, 30, 15),
    (v_laksa_id, CURRENT_DATE - 3, 60, 25, 8),
    (v_kue_id, CURRENT_DATE - 3, 88, 35, 14),
    (v_telur_id, CURRENT_DATE - 3, 105, 40, 25)
    ON CONFLICT (tenant_id, stat_date) DO NOTHING;

END $$;
