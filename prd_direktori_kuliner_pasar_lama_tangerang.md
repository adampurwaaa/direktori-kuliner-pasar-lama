# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Direktori Kuliner Digital Pasar Lama Tangerang

| Atribut | Detail |
| :--- | :--- |
| **Versi Dokumen** | 1.3 (Final) |
| **Tanggal** | 22 November 2026 |
| **Status** | Siap Eksekusi AntiGravity |
| **Target Platform** | Web Responsif (Mobile-First & Desktop) |
| **Arsitektur** | High-Traffic Ready |

---

## 1. Ringkasan Eksekutif & Tujuan Produk
**Direktori Kuliner Digital Pasar Lama Tangerang** adalah aplikasi web direktori kuliner berbasis *mobile-first* yang dirancang untuk mempermudah pengunjung menemukan berbagai tenant maupun pedagang kaki lima, melihat daftar menu bergambar beserta deskripsi dan harganya, memantau promo atau diskon aktif, serta mendapatkan navigasi langsung ke lokasi lapak melalui Google Maps.

Di sisi pengelola, sistem ini menyediakan **Dashboard Admin terpisah** yang dilindungi autentikasi untuk mengatur data toko, menu (termasuk foto dan deskripsi item), serta materi iklan/promo dari pedagang, sekaligus memantau performa interaksi pengunjung melalui **statistik diagram batang berbasis rentang waktu kalender** maupun **statistik rincian klik per toko**.

---

## 2. Target Pengguna (User Personas)
* **Pengunjung / Pembeli (Public User):** Wisatawan kuliner dan masyarakat sekitar yang mengunjungi Pasar Lama Tangerang menggunakan ponsel pintar maupun laptop. Membutuhkan akses instan tanpa login untuk melihat daftar jajanan viral, makanan berat, minuman, mengecek harga sebelum antre, menemukan promo aktif, serta membuka lokasi lapak di Google Maps.
* **Administrator Pengelola (Admin):** Pengelola platform yang menerima permintaan pemasangan promo atau iklan dari pedagang. Membutuhkan halaman login terpisah yang aman, kontrol penuh manajemen tenant, menu, dan materi promo, serta akses laporan statistik klik sebagai bukti performa kepada pedagang.

---

## 3. Kebutuhan Fungsional (Functional Requirements)

### 3.1 Tampilan Pengunjung (Halaman Publik — `/`)
* **Akses Langsung Tanpa Login:** Saat tautan utama dibuka, pengunjung langsung melihat etalase direktori tanpa menampilkan form maupun tautan halaman login admin.
* **Banner Iklan & Promo Unggulan:** Bagian khusus di area atas halaman yang menampilkan promo atau diskon aktif dari tenant (diatur oleh admin) beserta tombol arah lokasi toko.
* **Pencarian & Filter Kategori:** Kolom pencarian cepat berdasarkan nama toko maupun nama menu, disertai filter kategori (`Semua`, `Jajanan Viral`, `Makanan Berat`, `Minuman`, `Dessert`).
* **Kartu Tenant & Eksplorasi Menu Dua Tingkat:**
  * **Halaman/Tampilan Detail Toko:** Saat kartu tenant atau tombol "Lihat Menu" diklik, pengunjung melihat profil toko, promo aktif toko, tombol Google Maps, serta daftar seluruh menu lengkap dengan **foto thumbnail tiap menu**, pratinjau singkat, label terlaris/diskon, dan harga.
  * **Tampilan/Modal Detail Menu:** Saat salah satu item menu di dalam toko diklik, sistem menampilkan **foto menu berukuran besar**, nama menu, badge diskon (jika ada), **deskripsi lengkap menu**, serta perbandingan harga diskon dan harga asli.
* **Integrasi Google Maps:** Tombol navigasi langsung menuju koordinat lokasi spesifik tiap toko di Google Maps maupun peta kawasan Pasar Lama Tangerang.
* **Pengaturan Tema (Dark Mode):** Tombol pengalih antara mode terang (Light Mode) dan mode gelap (Dark Mode) agar nyaman dibaca pada siang maupun malam hari.

### 3.2 Tampilan Khusus Admin (`/admin/login` & `/admin/dashboard`)
* **Autentikasi & Rute Terpisah:** Halaman login berada pada alamat URL khusus (`/admin/login`) dan rute `/admin/dashboard` dilindungi oleh *server-side middleware* sehingga tidak dapat diakses tanpa sesi autentikasi yang sah.
* **Manajemen Tenant / Toko (CRUD):** Menambah, mengubah, mengaktifkan/menonaktifkan, dan menghapus data tenant (nama toko, kategori, deskripsi singkat, catatan lokasi, jam operasional, foto cover, status aktif, serta tautan koordinat Google Maps).
* **Manajemen Menu per Tenant (CRUD):** Memilih tenant terkait, lalu menambah, mengubah, dan menghapus item menu mencakup **foto menu**, **deskripsi lengkap menu**, harga normal (Rp), harga diskon (Rp, opsional), dan penanda menu terlaris (*Best Seller*).
* **Manajemen Iklan & Promo (CRUD):** Mengatur *banner* promo utama maupun label diskon pada kartu tenant berdasarkan permintaan pedagang (tenant terkait, judul promo, subjudul/ketentuan, teks badge diskon, masa berlaku, dan status aktif).
* **Statistik Klik & Performa Interaksi (Tab Statistik Klik):**
  * **Pencatatan Event Klik:** Mencatat interaksi pengunjung saat membuka daftar menu toko (**Klik Lihat Menu**), menekan navigasi lokasi (**Klik Google Maps**), dan menekan banner/kartu promo (**Klik Promo**).
  * **Filter Rentang Kalender & Agregasi:** Kartu ringkasan total klik terfilter, pemilih rentang tanggal kalender bebas (**Dari Tanggal** sampai **Sampai Tanggal**), filter **Tenant** (`Semua Tenant` atau per toko), filter **Jenis Klik**, serta **Diagram Batang** responsif dengan pengelompokan per **Tanggal (Hari)**, **Bulan**, atau **Tahun**.
  * **Statistik Rincian Per Toko (Statistik Klik Per Toko):** Bagian khusus di bawah grafik utama yang menampilkan data terpisah untuk **masing-masing toko** pada rentang tanggal terpilih, mencakup **Nama Toko**, **Kategori**, **Klik Menu**, **Klik Google Maps**, **Klik Promo**, **Total Klik**, *progress bar* persentase kontribusi, serta tombol aksi cepat (**Fokus Toko**) untuk memfilter grafik ke toko tersebut.

---

## 4. Kebutuhan Non-Fungsional (Non-Functional Requirements)
* **Performa & Skalabilitas (High-Traffic Readiness):** Mampu menangani lonjakan ribuan pengunjung secara bersamaan (khususnya pada akhir pekan atau saat ada kuliner viral) menggunakan *Edge Caching* / Incremental Static Regeneration (ISR) dan *database connection pooling*. Pencatatan statistik klik menggunakan fungsi agregasi harian (`daily_click_stats` per `tenant_id` dan `stat_date`) agar proses pencatatan tetap ringan dan aman saat trafik tinggi.
* **Layout Presisi & Responsif:** Penempatan elemen promo, kartu toko, detail menu, dan tombol lokasi dirancang presisi untuk navigasi satu tangan di layar ponsel maupun tampilan multi-kolom di layar laptop.
* **Optimasi Aset Gambar & Kode Bersih:** Foto toko dan foto tiap menu dioptimalkan (format WebP dan *lazy loading*) agar hemat kuota saat diakses di lokasi ramai, dengan struktur kode antarmuka modular yang rapi serta pemisahan konfigurasi lingkungan (`.env.local` / `.env.example`).

---

## 5. Arsitektur Teknologi & Rekomendasi Tech Stack
Untuk menjamin kecepatan akses saat terjadi lonjakan pengunjung serta kemudahan pengelolaan konten oleh admin, arsitektur sistem dirancang dengan pemisahan lapisan tampilan publik ter-cache, panel admin terproteksi, dan layanan penyimpanan data berskala tinggi:

| Lapisan Sistem | Teknologi | Peran & Alasan Pemilihan |
| :--- | :--- | :--- |
| **Frontend & Routing** | Next.js (App Router) + TypeScript | Mendukung Server-Side Rendering (SSR) dan Incremental Static Regeneration (ISR) untuk kecepatan akses halaman pengunjung serta pemisahan rute publik dan admin. |
| **Styling & Antarmuka** | Tailwind CSS + Lucide Icons | Menyediakan dukungan tema Light/Dark Mode bawaan dan tata letak responsif presisi di layar ponsel maupun desktop. |
| **Backend, Data & Auth** | Supabase (PostgreSQL, Auth, Storage) | Menyediakan autentikasi admin bawaan, penyimpanan relasional (`tenants`, `menus`, `promos`, `daily_click_stats`), fungsi RPC agregasi klik harian, dan penyimpanan aset gambar. |
| **Proteksi Akses** | Next.js Middleware | Memvalidasi sesi login admin di sisi server sebelum mengizinkan akses ke halaman `/admin/dashboard`. |
| **Jaringan & Caching** | Vercel Edge Network (CDN) | Mendistribusikan halaman publik melalui *Edge Cache* global sehingga lonjakan trafik pengunjung dapat ditangani tanpa membebani server utama. |

### 5.1 Struktur Entitas Data Utama
* **`tenants`**: `id`, `name`, `slug`, `category`, `description`, `location_note`, `cover_image`, `open_hours`, `gmaps_url`, `is_active`, `created_at`
* **`menus`**: `id`, `tenant_id` (FK), `name`, `description`, `price`, `discount_price`, `image_url`, `is_best_seller`, `created_at`
* **`promos`**: `id`, `tenant_id` (FK), `title`, `subtitle`, `badge_text`, `gmaps_url`, `is_featured`, `valid_until`, `is_active`, `created_at`
* **`daily_click_stats`**: `id`, `tenant_id` (FK), `stat_date`, `menu_clicks`, `gmaps_clicks`, `promo_clicks` (unik per `tenant_id` dan `stat_date`)

---

## 6. Alur Pengguna (User Flow)
* **Alur Pengunjung:** Membuka Link Website (`/`) → Melihat Banner Promo & Daftar Tenant → Cari / Filter Kategori → Klik Toko / "Lihat Menu" (Tercatat di Statistik) → Melihat Daftar Menu Bergambar → Klik Item Menu untuk Foto Besar & Deskripsi → Klik "Google Maps" (Tercatat di Statistik) & Menuju Lokasi.
* **Alur Admin & Promo:** Pedagang Menghubungi Admin → Admin Login (`/admin/login`) → Kelola Tenant, Menu (Foto & Deskripsi), dan Banner Promo → Perubahan Tampil Otomatis di Halaman Pengunjung → Admin Memantau Grafik Tren & Statistik Klik Per Toko Berdasarkan Rentang Kalender.

---

## 7. Rencana Tahapan Pengembangan & Kolaborasi AI

| Tahapan | Ruang Lingkup Pekerjaan |
| :--- | :--- |
| **Fase 1** | Inisialisasi struktur proyek Next.js (App Router) + TypeScript + Tailwind CSS, konfigurasi tema Light/Dark Mode, dan struktur folder modular. |
| **Fase 2** | Pembangunan antarmuka pengunjung (Banner Iklan/Promo, Pencarian & Filter Kategori, Grid Kartu Tenant, Tampilan Detail Toko dengan Daftar Menu Bergambar, Modal Detail Foto & Deskripsi Menu, serta Integrasi Google Maps). |
| **Fase 3** | Pembangunan halaman login (`/admin/login`), proteksi `middleware.ts`, serta dashboard admin terproteksi untuk pengelolaan data Tenant, Daftar Menu (lengkap dengan foto & deskripsi), dan Iklan/Promo. |
| **Fase 4** | Implementasi fitur pencatatan klik harian (menu/maps/promo), diagram batang statistik dengan filter kalender rentang waktu (`Dari Tanggal`–`Sampai Tanggal`) dan pengelompokan waktu, serta bagian rincian **Statistik Klik Per Toko**. |
| **Fase 5** | Integrasi skema database Supabase (`schema.sql`, `seed.sql`, RLS, RPC), optimasi kecepatan tampilan melalui *caching* ISR & kompresi gambar, penyiapan konfigurasi *environment*, serta *deployment* ke Vercel via GitHub. |