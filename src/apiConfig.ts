// ============================================================================
// WEJOBS - Konfigurasi Alamat Backend (API_BASE)
// ============================================================================
// Aplikasi ini punya 2 bagian:
//  1. Frontend (React) -> dibungkus jadi APK lewat Capacitor (WebView, TANPA Node.js)
//  2. Backend (Express, server.ts) -> tetap harus jalan di server Node.js sungguhan
//     (hosting online / VPS / Termux + tunnel), karena APK/WebView tidak bisa
//     menjalankan server Node & database in-memory di dalamnya.
//
// Saat build untuk WEB biasa (satu origin dengan backend), biarkan
// VITE_API_BASE_URL kosong -> semua fetch tetap pakai path relatif ('/api/...').
//
// Saat build untuk APK (Capacitor), WAJIB isi VITE_API_BASE_URL dengan URL
// backend yang sudah online, contoh:
//   VITE_API_BASE_URL=https://wejobs-api.onrender.com
//
// Cara set saat build:
//   VITE_API_BASE_URL="https://wejobs-api.onrender.com" npm run build
// ============================================================================

export const API_BASE: string = (import.meta as any).env?.VITE_API_BASE_URL || '';
