## ✨ Fitur Utama yang Dikembangkan

* **🔒 Autentikasi & Otorisasi JWT (JSON Web Tokens):**
    * Implementasi `authMiddleware` untuk memproteksi rute privat (CRUD film).
    * Integrasi Axios Interceptors di sisi Frontend (React) untuk menyematkan token secara otomatis pada setiap *request*.
    * Penanganan *error* otomatis jika token *expired* atau *invalid* (otomatis *logout*).
* **🔍 Optimasi Query Parameters (Search & Sort):**
    * Memodifikasi *endpoint* `GET /movies` untuk menerima parameter dinamis dari URL.
    * Menerapkan fitur **Search** (menggunakan *operator* `LIKE` via Knex.js) dan **Sort** (`ORDER BY`) tanpa membebani sisi *client*.
* **📧 Verifikasi Email Otomatis:**
    * Integrasi `nodemailer` dan `uuid` pada alur registrasi.
    * Pembuatan *endpoint* khusus `/verifikasi-email` untuk memvalidasi token unik pengguna baru yang dikirimkan melalui email.
* **🖼️ Upload Gambar ke Server (Multer):**
    * Konfigurasi *middleware* `multer` untuk menangani *file upload* gambar poster film.
    * Pembuatan *endpoint* `POST /upload` dengan sistem penyimpanan lokal (folder `uploads`) yang di-ekspos sebagai *static files* menggunakan Express.
* **🔄 Integrasi Penuh Frontend & Backend:**
    * Transisi dari *hardcoded data* di React menjadi pemanggilan API dinamis.
    * Sistem proteksi rute di sisi *client* (Redirect ke `/login` jika belum terautentikasi).
