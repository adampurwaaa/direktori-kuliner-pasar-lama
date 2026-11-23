import { Tenant, MenuItem, Promo, DailyClickStat } from '@/types/database';

export const DUMMY_TENANTS: Tenant[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Sate Ayam H. Ishak',
    slug: 'sate-ayam-h-ishak',
    category: 'Makanan Berat',
    description: 'Legenda kuliner Pasar Lama sejak 1954. Daging ayam empuk disiram bumbu kacang gurih pekat bercitarasa khas peranakan Benteng.',
    location_note: 'Jl. Kisamaun No. 42 (Dekat Gerbang Utama Pasar Lama)',
    cover_image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80',
    open_hours: '16:00 - 22:30 WIB',
    gmaps_url: 'https://maps.google.com/?q=Pasar+Lama+Tangerang+Sate+Ishak',
    is_active: true,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Crepes Jumbo Kisamaun',
    slug: 'crepes-jumbo-kisamaun',
    category: 'Jajanan Viral',
    description: 'Crepes berukuran ekstra renyah dengan topping premium melimpah seperti Nutella, keju parut tebal, dan pisang karamel legit.',
    location_note: 'Jl. Kisamaun (Depan Toko Roti Roppan Pasar Lama)',
    cover_image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
    open_hours: '16:30 - 23:00 WIB',
    gmaps_url: 'https://maps.google.com/?q=Pasar+Lama+Tangerang+Crepes',
    is_active: true,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Es Buntin Peranakan Benteng',
    slug: 'es-buntin-peranakan-benteng',
    category: 'Minuman',
    description: 'Minuman es legendaris dengan es serut gunung, sirup pandan merah buatan sendiri, kelapa kopyor, dan jelly segar penghapus dahaga.',
    location_note: 'Jl. Bhakti No. 12 (Samping Klenteng Boen Tek Bio)',
    cover_image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    open_hours: '15:00 - 22:00 WIB',
    gmaps_url: 'https://maps.google.com/?q=Klenteng+Boen+Tek+Bio+Tangerang',
    is_active: true,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Laksa Tangerang Ny. Giok',
    slug: 'laksa-tangerang-ny-giok',
    category: 'Makanan Berat',
    description: 'Kekayaan kuliner Tangerang berkuah santan kental gurih, mie tepung beras kenyal, potongan ayam kampung, dan taburan kacang hijau empuk.',
    location_note: 'Kawasan Kuliner Belakang Pasar Lama',
    cover_image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    open_hours: '16:00 - 23:00 WIB',
    gmaps_url: 'https://maps.google.com/?q=Pasar+Lama+Tangerang+Laksa',
    is_active: true,
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Kue Rangi & Pancong Mang Udin',
    slug: 'kue-rangi-pancong-mang-udin',
    category: 'Dessert',
    description: 'Kue tradisional khas Betawi-Sunda dipanggang di atas bara arang kayu. Pancong lumer aneka rasa dan rangi siram gula aren kental legit.',
    location_note: 'Jl. Kisamaun (Tengah Deretan Kuliner Kaki Lima)',
    cover_image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80',
    open_hours: '17:00 - 23:30 WIB',
    gmaps_url: 'https://maps.google.com/?q=Pasar+Lama+Tangerang+Kuliner',
    is_active: true,
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    name: 'Telur Gulung & Cilor Viral',
    slug: 'telur-gulung-cilor-viral',
    category: 'Jajanan Viral',
    description: 'Jajanan nostalgia favorit anak muda, digoreng garing keemasan dengan saus asam manis pedas gurih racikan spesial.',
    location_note: 'Pintu Masuk Barat Pasar Lama',
    cover_image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
    open_hours: '16:00 - 23:00 WIB',
    gmaps_url: 'https://maps.google.com/?q=Pasar+Lama+Tangerang',
    is_active: true,
  },
];

export const DUMMY_MENUS: MenuItem[] = [
  {
    id: 'm1-1',
    tenant_id: '11111111-1111-1111-1111-111111111111',
    name: 'Sate Ayam Daging (10 Tusuk + Lontong)',
    description: 'Daging dada ayam pilihan empuk tanpa lemak dipadu lontong pulen, disiram bumbu kacang medok dan taburan bawang goreng harum khas Benteng.',
    price: 32000,
    discount_price: 28000,
    image_url: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=600&q=80',
    is_best_seller: true,
  },
  {
    id: 'm1-2',
    tenant_id: '11111111-1111-1111-1111-111111111111',
    name: 'Sate Kulit Ayam Krispi (10 Tusuk)',
    description: 'Kulit ayam dibakar kering di luar namun juicy di dalam dengan bumbu rempah manis gurih menggoda selera.',
    price: 25000,
    discount_price: null,
    image_url: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80',
    is_best_seller: false,
  },
  {
    id: 'm1-3',
    tenant_id: '11111111-1111-1111-1111-111111111111',
    name: 'Sate Telur Puyuh Bumbu Manis (5 Tusuk)',
    description: 'Telur puyuh bacem manis legit dengan aroma daun salam dan lengkuas yang meresap sempurna hingga ke dalam.',
    price: 15000,
    discount_price: null,
    image_url: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=80',
    is_best_seller: false,
  },
  {
    id: 'm2-1',
    tenant_id: '22222222-2222-2222-2222-222222222222',
    name: 'Crepes Jumbo Choco Banana Cheese Special',
    description: 'Ukuran jumbo 40cm dengan adonan renyah wangi vanila, isian pisang raja manis, keju cheddar parut melimpah, dan Nutella leleh.',
    price: 25000,
    discount_price: 20000,
    image_url: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80',
    is_best_seller: true,
  },
  {
    id: 'm2-2',
    tenant_id: '22222222-2222-2222-2222-222222222222',
    name: 'Crepes Crispy Red Velvet Cream Cheese',
    description: 'Kulit crepes warna merah velvet alami dengan olesan krim keju gurih manis dan remukan biskuit red velvet renyah.',
    price: 22000,
    discount_price: null,
    image_url: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80',
    is_best_seller: false,
  },
  {
    id: 'm3-1',
    tenant_id: '33333333-3333-3333-3333-333333333333',
    name: 'Es Campur Buntin Spesial Komplit',
    description: 'Es serut tinggi mengerucut dengan sari santan segar, alpukat matang pohon, nangka harum, kolang-kaling kenyal, dan sirup merah legendaris Benteng.',
    price: 18000,
    discount_price: 15000,
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    is_best_seller: true,
  },
  {
    id: 'm4-1',
    tenant_id: '44444444-4444-4444-4444-444444444444',
    name: 'Laksa Komplit Ayam Dada & Telur Rebus',
    description: 'Mie tepung beras buatan tangan disiram kuah kari santan gurih hangat berempah dengan suwiran ayam kampung dan telur rebus.',
    price: 30000,
    discount_price: 27000,
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    is_best_seller: true,
  },
  {
    id: 'm5-1',
    tenant_id: '55555555-5555-5555-5555-555555555555',
    name: 'Pancong Lumer Setengah Matang Keju Coklat',
    description: 'Kue pancong gurih kelapa dengan bagian tengah lumer lembut yang meleleh saat dinikmati selagi hangat di malam hari.',
    price: 18000,
    discount_price: null,
    image_url: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=600&q=80',
    is_best_seller: true,
  },
  {
    id: 'm6-1',
    tenant_id: '66666666-6666-6666-6666-666666666666',
    name: 'Paket Telur Gulung Jumbo (10 Tusuk)',
    description: 'Telur ayam berbumbu digulung presisi dengan tusuk bambu menghasilkan tekstur lembut di dalam dan krispi di luar dengan saus pedas manis.',
    price: 15000,
    discount_price: null,
    image_url: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
    is_best_seller: true,
  },
];

export const DUMMY_PROMOS: Promo[] = [
  {
    id: 'p-1',
    tenant_id: '22222222-2222-2222-2222-222222222222',
    tenant: DUMMY_TENANTS[1],
    title: 'Promo Jajanan Viral: Crepes Jumbo Diskon 20%',
    subtitle: 'Tunjukkan laman direktori ini ke penjual Crepes Jumbo Kisamaun dan dapatkan potongan langsung!',
    badge_text: 'Diskon 20%',
    gmaps_url: 'https://maps.google.com/?q=Pasar+Lama+Tangerang+Crepes',
    is_featured: true,
    is_active: true,
  },
  {
    id: 'p-2',
    tenant_id: '11111111-1111-1111-1111-111111111111',
    tenant: DUMMY_TENANTS[0],
    title: 'Sate H. Ishak Porsi Spesial Hemat Rp 4.000',
    subtitle: 'Kelezatan sate ayam legendaris dengan kuah kacang medok berpadu lontong pulen.',
    badge_text: 'Hemat Rp 4.000',
    gmaps_url: 'https://maps.google.com/?q=Pasar+Lama+Tangerang+Sate+Ishak',
    is_featured: true,
    is_active: true,
  },
  {
    id: 'p-3',
    tenant_id: '33333333-3333-3333-3333-333333333333',
    tenant: DUMMY_TENANTS[2],
    title: 'Es Buntin: Es Campur Spesial Diskon Rp 3.000',
    subtitle: 'Segarkan malam Pasar Lama Anda dengan es serut khas Benteng.',
    badge_text: 'Spesial',
    gmaps_url: 'https://maps.google.com/?q=Klenteng+Boen+Tek+Bio+Tangerang',
    is_featured: false,
    is_active: true,
  },
];

// Helper generate daily dummy stats for the last 14 days
export const generateDummyStats = (): DailyClickStat[] => {
  const stats: DailyClickStat[] = [];
  const tenants = DUMMY_TENANTS;
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    tenants.forEach((t, idx) => {
      const baseMenu = (idx + 1) * 22 + (14 - i) * 6;
      const baseGmaps = (idx + 1) * 11 + (14 - i) * 3;
      const basePromo = (idx % 2 === 0 ? 1 : 0) * 18 + (14 - i) * 2;

      stats.push({
        id: `stat-${dateStr}-${t.id}`,
        tenant_id: t.id,
        stat_date: dateStr,
        menu_clicks: baseMenu,
        gmaps_clicks: baseGmaps,
        promo_clicks: basePromo,
      });
    });
  }

  return stats;
};
