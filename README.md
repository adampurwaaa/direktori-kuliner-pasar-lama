# Direktori Kuliner Digital Pasar Lama Tangerang

Aplikasi web direktori kuliner modern berbasis Next.js App Router, TypeScript, Tailwind CSS, Lucide Icons, dan Supabase. Dibangun khusus untuk memandu pengunjung Pasar Lama Tangerang menemukan tenant makanan/minuman, melihat daftar menu beserta foto dan harga resmi, memantau promo aktif, serta mendapatkan rute Google Maps. Dilengkapi Dashboard Admin terproteksi dengan analitik diagram batang dan statistik klik per toko.

---

## 🚀 Fitur Utama

1. **Antarmuka Pengunjung Publik (`/`)**:
   - Langsung memuat direktori tanpa login.
   - Banner Promo & Diskon Unggulan (dengan tracking klik promo).
   - Pencarian real-time & Filter Kategori (`Semua`, `Jajanan Viral`, `Makanan Berat`, `Minuman`, `Dessert`).
   - Eksplorasi Menu Dua Tingkat:
     - **Tingkat 1**: Klik Toko membuka modal profil toko + rincian menu lengkap bergambar + tombol rute Google Maps (tracking klik menu & maps).
     - **Tingkat 2**: Klik item menu membuka modal foto makanan resolusi besar, deskripsi porsi/bahan, badge promo, dan harga resmi.
   - Tema Light Mode (`#FAF8F5`, `#D9531E`) & Dark Mode (`#12100E`, `#F97316`).

2. **Dashboard Khusus Admin (`/admin/dashboard`)**:
   - Terproteksi autentikasi via Supabase Auth & Next.js Middleware.
   - Halaman login khusus di `/admin/login`.
   - **Tab Manajemen Tenant / Toko**: Tambah, edit, non-aktifkan, dan hapus tenant beserta foto cover dan link maps.
   - **Tab Manajemen Daftar Menu**: Filter per toko, CRUD menu lengkap (nama, deskripsi, harga normal, diskon, foto, badge Best Seller).
   - **Tab Iklan & Promo**: Kelola banner penawaran khusus dan diskon tenant.
   - **Tab Laporan & Statistik Klik**:
     - KPI Total Klik (Lihat Menu, Google Maps, Banner Promo).
     - Filter Kalender bebas ("Dari Tanggal" s/d "Sampai Tanggal"), Filter Tenant, dan Jenis Klik.
     - Diagram Batang responsif dengan pengelompokan ("Per Tanggal", "Per Bulan", "Per Tahun").
     - **Tabel Statistik Klik Per Toko**: Rincian jumlah klik menu, maps, promo, total klik, progress bar kontribusi persentase, dan tombol aksi "Fokus Toko".

3. **High-Traffic & Performance**:
   - Agregasi klik harian via tabel `daily_click_stats` (unik per `tenant_id` dan `stat_date`) dan RPC function PostgreSQL `increment_tenant_click`.
   - ISR (Incremental Static Regeneration) dengan revalidasi edge berkala.
   - Optimasi gambar Next.js (WebP & responsive sizing).

---

## 🛠️ Panduan Menjalankan Proyek

### 1. Salin Konfigurasi Environment
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Isi variabel dengan kredensial Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
*(Catatan: Aplikasi memiliki fallback data realistis bawaan, sehingga tetap berjalan mulus meskipun Supabase belum dikonfigurasi).*

### 2. Eksekusi Skema Database di Supabase
1. Buka dashboard Supabase project Anda di [supabase.com](https://supabase.com).
2. Masuk ke menu **SQL Editor**.
3. Buka dan jalankan seluruh isi file [`supabase/schema.sql`](supabase/schema.sql).
4. Buka dan jalankan file [`supabase/seed.sql`](supabase/seed.sql) untuk mengisi data dummy Pasar Lama yang realistis.

### 3. Buat Akun Admin
1. Di Dashboard Supabase, buka tab **Authentication** -> **Users**.
2. Klik **Add User** -> **Create User**.
3. Masukkan email dan kata sandi untuk admin pengelola.

*(Jika dalam mode demo offline tanpa Supabase, Anda dapat masuk menggunakan akun demo: `admin@pasarlama.id` / `admin123`).*

### 4. Menjalankan di Lingkungan Lokal
```bash
# Instal dependensi (jika belum)
npm install

# Jalankan server pengembangan
npm run dev
```
Buka browser di:
- **Pengunjung:** `http://localhost:3000/`
- **Admin Login:** `http://localhost:3000/admin/login`

### 5. Build Produksi & Deploy ke Vercel
```bash
npm run build
```
Untuk deploy ke Vercel:
1. Hubungkan repository GitHub ke [Vercel](https://vercel.com).
2. Tambahkan Environment Variables `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Klik **Deploy**.
