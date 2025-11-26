<!--
	README styled to match the provided example while preserving
	the original meaning and instructions for this project.
-->

# 🚀 Lofi Food Finder

<div align="center">
	<img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
	<img src="https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white" />
	<img src="https://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
	<img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
	<img src="https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white" />
</div>

<p align="center">
	<strong>Aplikasi pencarian dan berbagi rekomendasi tempat makan kampus — daftar, tambahkan tempat dengan foto & menu, dan beri komentar.</strong>
</p>

---

## 📋 Daftar Isi

- [Identitas](#-identitas)
- [Tentang Aplikasi](#-tentang-aplikasi)
- [Tech Stack](#-tech-stack)
- [Instalasi & Jalankan (Development)](#-instalasi--jalankan-development)
- [API Ringkas](#-api-ringkas)
- [Catatan / Troubleshooting](#-catatan--troubleshooting)

---

## 🧾 Identitas

- Nama: **Ahmad Wildan Fawwaz**
- NRP: **5027241001**

---

## 📖 Tentang Aplikasi

Lofi Food Finder adalah aplikasi web sederhana untuk menemukan dan membagikan rekomendasi tempat makan di sekitar kampus ITS. Pengguna dapat mendaftar, masuk, menambahkan tempat baru (dengan foto, menu, rating), serta memberi komentar beserta gambar pada setiap tempat.

Fitur utama meliputi pendaftaran/login (JWT), penambahan tempat dengan upload gambar, pemfilteran tempat per area, dan sistem komentar dengan gambar.

---

## 🛠 Tech Stack

- Frontend: Vite + React + TypeScript + Tailwind CSS + shadcn-ui
- Backend: Node.js + Express + Mongoose (MongoDB)
- Authentication: JSON Web Token (`jsonwebtoken`)
- File upload: `multer` (gambar disimpan di `backend/uploads` dan disajikan statis)
- Utilities: `bcryptjs`, `nodemon`, `morgan`, `cors`
- Dev/Optional: Docker Compose (opsional untuk menjalankan MongoDB secara cepat)

---

## 🚀 Instalasi & Jalankan (Development)

### Prasyarat

- Node.js (direkomendasikan v18+)
- npm
- MongoDB lokal/cloud atau Docker

### 1) Backend

```bash
cd lofi-food-finder/backend
npm install
# salin file environment dan sesuaikan jika perlu
cp .env.example .env
```

- Jika Anda belum menjalankan MongoDB secara lokal atau cloud, Anda dapat menggunakan Docker Compose (ada `docker-compose.yml` di folder backend):

```bash
cd lofi-food-finder/backend
docker compose up -d
```

Mulai backend (development):

```bash
npm run dev
```

Backend API akan tersedia di: `http://localhost:4000/api`

### 2) Frontend

```bash
cd lofi-food-finder
npm install
npm run dev
```

Frontend (Vite) biasanya tersedia di: `http://localhost:5173`

Catatan: Pastikan backend berjalan (port 4000) sebelum membuka frontend agar panggilan API berhasil.

---

## 🔗 API Ringkas

- `GET /api/health` — health check
- `GET /api/areas` — daftar area
- `POST /api/areas/seed` — seed area default (Keputih, Mulyosari, Gebang, Manyar)
- `GET /api/places?area=<slug|id>` — daftar tempat menurut area
- `POST /api/places` — tambah tempat (multipart/form-data; field `image` untuk foto)
- `GET /api/places/:id` — detail tempat
- `POST /api/auth/register` — registrasi
- `POST /api/auth/login` — login (mengembalikan token)
- `GET /api/comments/:placeId` — daftar komentar untuk tempat
- `POST /api/comments/:placeId` — tambah komentar (multipart/form-data; field `image` opsional)

Gambar yang diupload disajikan statis via: `http://localhost:4000/uploads/<filename>`

---

## 🩺 Catatan & Troubleshooting

- Jika koneksi MongoDB gagal: pastikan instance MongoDB berjalan atau periksa `MONGO_URI` di `.env`.
- Untuk menambahkan area default (jika belum ada), jalankan:

```bash
curl -X POST http://localhost:4000/api/areas/seed
```

- Jika mengalami error terkait paket native (mis. `bcrypt`), proyek ini sudah menggunakan `bcryptjs` agar tidak perlu build native.
- Periksa folder upload untuk memastikan file tersimpan:

```bash
ls -la lofi-food-finder/backend/uploads
```

---

<div align="center">
	<strong>🚀 Happy Vibe Coding! 🚀</strong>
	<br/>
	<sub>Frontend: React + Vite • Backend: Node.js + Express • DB: MongoDB</sub>
</div>

