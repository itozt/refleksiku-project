# 📔 Refleksiku: Jurnal Harian Digital

## Tentang Proyek

**Refleksiku** adalah aplikasi web sederhana yang dirancang untuk membantu pengguna mencatat dan merefleksikan kegiatan harian mereka secara terstruktur. Tujuan utama proyek ini adalah menyediakan alat digital yang mudah diakses untuk meningkatkan *mindfulness* dan kesadaran diri.

Aplikasi ini bersifat *serverless* (tanpa *database* server terpisah) karena mengintegrasikan langsung data input ke **Google Sheets** sebagai tempat penyimpanan data yang aman dan mudah dikelola.

## ✨ Fitur Utama

| Fitur | Deskripsi | Status |
| :--- | :--- | :--- |
| **Input Refleksi Harian** | Formulir terstruktur dengan empat pertanyaan refleksi utama, termasuk detail aktivitas Pagi, Siang, Sore, dan Malam. | ✅ Selesai |
| **Penyimpanan Otomatis** | Data refleksi dikirim secara otomatis ke Google Sheets menggunakan Google Apps Script (berfungsi sebagai API). | ✅ Selesai |
| **Kalender & Pencarian** | Fitur untuk memilih tanggal spesifik dan menampilkan refleksi yang telah dicatat pada hari tersebut. | ✅ Selesai |
| **Akses Data Cepat** | Tombol "Lihat Data Refleksi" untuk membuka Google Sheets langsung di *tab* baru. | ✅ Selesai |
| **Responsif** | Tampilan *website* yang optimal dan nyaman digunakan di berbagai perangkat (desktop dan mobile). | ✅ Selesai |

---

## 💻 Teknologi yang Digunakan

* **Frontend:** HTML5, CSS3, JavaScript (Vanilla JS)
* **Styling:** CSS3 dengan *Media Queries* untuk Responsivitas
* **Backend / Data Storage:** Google Sheets API (melalui Google Apps Script)

---

## ⚙️ Struktur Data (Google Sheets)

Website ini menyimpan data ke Google Sheets Anda. Pastikan *header* kolom di baris pertama (*Sheet1*) Google Sheets Anda sesuai dengan urutan ini agar fungsi pencarian dan penyimpanan bekerja dengan benar:

| Kolom | Header Aplikasi |
| :--- | :--- |
| **A** | `Tanggal` |
| **B** | `Aktivitas_Pagi` |
| **C** | `Aktivitas_Siang` |
| **D** | `Aktivitas_Sore` |
| **E** | `Aktivitas_Malam` |
| **F** | `Hal_Baik` |
| **G** | `Kehadiran_Tuhan` |
| **H** | `Rencana_Besok` |

---

## 📌 Panduan Pengaturan (Untuk Pengembang/Pengguna Lain)

Jika Anda ingin menggunakan *template* proyek ini, Anda harus melakukan langkah-langkah *setup* berikut:

### 1. Hubungkan Google Apps Script

1.  Buat Google Sheets baru dan atur *header* kolom (seperti tabel di atas).
2.  Buka **Ekstensi** $\to$ **Apps Script** dan salin kode `doPost` dan `doGet` yang telah dikembangkan dalam proyek ini.
3.  Lakukan **Deployment** sebagai *Web App* dan atur akses ke **"Anyone"** (*Siapa saja*).
4.  Salin **Web app URL** yang dihasilkan.

### 2. Update `script.js`

Buka file `script.js` Anda dan ganti *placeholder* `SCRIPT_URL` dengan URL yang baru Anda dapatkan dari Langkah 1:

```javascript
const SCRIPT_URL = 'PASTE_WEB_APP_URL_ANDA_DI SINI';
