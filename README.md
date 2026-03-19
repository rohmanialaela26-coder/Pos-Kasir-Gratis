# 🏪 StoreSync POS

Aplikasi **Point of Sale (POS)** modern berbasis web dengan dukungan **Progressive Web App (PWA)** — bisa diinstall di HP/laptop dan bekerja secara offline!

![StoreSync POS](icons/icon-192.png)

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|-------|-----------|
| 📥 **Barang Masuk** | Scan/input barang yang diterima, update stok otomatis |
| 📤 **Barang Keluar** | Transaksi penjualan, cetak struk, hitung kembalian |
| 📦 **Inventaris** | Manajemen produk, stok, harga, kategori |
| 🕐 **Riwayat** | History semua transaksi masuk & keluar |
| 📊 **Laporan** | Grafik penjualan harian, statistik toko |
| 🚚 **Supplier** | Manajemen supplier & purchase order |
| 🔒 **Login Kasir** | Multi-user dengan role kasir |
| 📱 **PWA** | Install di HP/desktop, kerja offline |

---

## 🚀 Cara Deploy ke GitHub Pages

### 1. Fork / Clone Repository

```bash
git clone https://github.com/username/storesync-pos.git
cd storesync-pos
```

### 2. Push ke GitHub

```bash
git add .
git commit -m "🚀 Initial commit - StoreSync POS PWA"
git push origin main
```

### 3. Aktifkan GitHub Pages

1. Buka repository di GitHub
2. Klik **Settings** → **Pages**
3. Source: pilih **Deploy from a branch**
4. Branch: pilih **main** → folder **/ (root)**
5. Klik **Save**
6. Tunggu ±1 menit, lalu akses: `https://username.github.io/storesync-pos/`

---

## 📱 Install sebagai PWA

### Di Android (Chrome)
1. Buka aplikasi di browser Chrome
2. Tap menu **⋮** → **"Add to Home Screen"**
3. Tap **Install**

### Di iOS (Safari)
1. Buka aplikasi di Safari
2. Tap tombol **Share** (□↑)
3. Pilih **"Add to Home Screen"**
4. Tap **Add**

### Di Desktop (Chrome/Edge)
1. Buka aplikasi di browser
2. Klik ikon **Install** (⊕) di address bar
3. Atau klik tombol **"⬇ Install"** di header aplikasi

---

## 🛠️ Cara Pakai Lokal

Cukup buka `index.html` di browser, **tidak perlu server khusus**.

Untuk testing PWA lengkap (Service Worker), gunakan server lokal:

```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve .

# VS Code
# Install ekstensi "Live Server", klik kanan index.html → Open with Live Server
```

Lalu buka: `http://localhost:8000`

---

## 📁 Struktur File

```
storesync-pos/
├── index.html          # Aplikasi utama (semua kode ada di sini)
├── manifest.json       # PWA manifest (nama, ikon, warna, dll)
├── sw.js               # Service Worker (cache & offline support)
├── generate-icons.py   # Script untuk generate icon PNG
├── .gitignore
├── README.md
└── icons/
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-128.png
    ├── icon-144.png
    ├── icon-152.png
    ├── icon-192.png     ← Ikon utama
    ├── icon-384.png
    └── icon-512.png     ← Ikon splash screen
```

---

## 🔧 Teknologi

- **HTML5 + CSS3 + Vanilla JavaScript** — tanpa framework
- **PWA** — manifest.json + Service Worker
- **LocalStorage** — penyimpanan data lokal di browser
- **Canvas API** — grafik laporan
- **Cache API** — offline support

---

## ⚠️ Catatan

> Data disimpan di **localStorage** browser. Jika browser di-clear, data akan hilang.  
> Untuk produksi, disarankan mengintegrasikan dengan backend database.

---

## 📄 Lisensi

MIT License — bebas digunakan dan dimodifikasi.

---

Made with ❤️ for Indonesian small businesses
