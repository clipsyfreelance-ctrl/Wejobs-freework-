import React from 'react';
import { BrandLogo } from './BrandLogo';
import {
  ShieldCheck,
  Globe,
  DollarSign,
  Lock,
  Layers,
  HeartHandshake,
  Compass,
  FileCheck2,
  Users,
  Clock,
  TrendingUp,
  Award,
  Calendar,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: string) => void;
  onOpenRegister: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenRegister }) => {
  return (
    <div id="about-page" className="py-12 sm:py-16 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Title */}
        <div className="text-center space-y-4">
          <BrandLogo size="lg" showTagline className="justify-center" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-white tracking-tight mt-4 font-serif-title">
            Tentang WEJOBS
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Platform micro-job dan editorial freelance terpercaya yang menghubungkan penulis, editor, penerjemah, dan peneliti dengan mitra penerbit terverifikasi di seluruh dunia.
          </p>
        </div>

        {/* 1. Platform Identity & Structure */}
        <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 mb-2">
            <Globe className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Platform Editorial Freelance Modern
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            WEJOBS dirancang khusus untuk memenuhi kebutuhan produksi konten tertulis berkualitas tinggi. Berbeda dari pasar freelance konvensional yang menuntut perang harga atau proposal spekulatif panjang tanpa kepastian, WEJOBS menyusun setiap kebutuhan penerbit ke dalam unit pekerjaan terstruktur dengan jumlah kata yang pasti, imbalan USD tetap, dan kuota slot terbatas yang transparan. Penulis cukup memilih pekerjaan yang sesuai, mengklaim slot, dan mengirimkan naskah sesuai parameter editorial.
          </p>
        </div>

        {/* 2. Perkembangan WEJOBS dari Tahun 2022 Sampai Sekarang (Timeline) */}
        <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Perkembangan WEJOBS (2022 — Sekarang)
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Perjalanan inovasi platform dalam memberdayakan para pekerja lepas dan kurator konten global.
              </p>
            </div>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
            {/* 2022 */}
            <div className="relative pl-10 space-y-1.5">
              <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-orange-500 flex items-center justify-center text-[11px] font-black text-orange-600">
                22
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                  Tahun 2022
                </span>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Awal Mula & Konseptualisasi
                </h4>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                WEJOBS diinisiasi sebagai solusi sederhana untuk menghubungkan pekerja lepas independen dengan penugasan digital berskala mikro. Tahap awal ini fokus pada riset kebutuhan penerbit independen dan memvalidasi metode penugasan berbasis slot instan.
              </p>
            </div>

            {/* 2023 */}
            <div className="relative pl-10 space-y-1.5">
              <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-orange-500 flex items-center justify-center text-[11px] font-black text-orange-600">
                23
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                  Tahun 2023
                </span>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Fokus Spesialisasi Editorial & Kepenulisan
                </h4>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Platform memperluas dan memfokuskan model kerjanya pada disiplin konten berbasis teks: penulisan artikel SEO, penulisan kreatif (novel & cerita pendek), penyuntingan tata bahasa, terjemahan dokumen, dan ringkasan riset literatur.
              </p>
            </div>

            {/* 2024 */}
            <div className="relative pl-10 space-y-1.5">
              <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-orange-500 flex items-center justify-center text-[11px] font-black text-orange-600">
                24
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                  Tahun 2024
                </span>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Pengembangan Alur Kerja Escrow & Akun Freelancer
                </h4>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Mengintegrasikan alur peninjauan naskah bertahap (Versioned Submissions v1-v3), verifikasi rekening penarikan dana terstandarisasi, dan penerapan jaminan saldo escrow USD di mana setiap pekerjaan yang terbit telah memiliki alokasi dana yang dikunci.
              </p>
            </div>

            {/* 2025 */}
            <div className="relative pl-10 space-y-1.5">
              <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-orange-500 flex items-center justify-center text-[11px] font-black text-orange-600">
                25
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                  Tahun 2025
                </span>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Ekspansi Skala Platform & Kemitraan Penerbit
                </h4>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Memperluas kemitraan dengan 10 konsorsium media dan penerbit digital besar, menghadirkan integrasi multi-metode pembayaran (Transfer Bank, PayPal, Wise, USDT), pusat bantuan terpadu (Help Desk Tickets), dan verifikasi anti-fraud berlapis.
              </p>
            </div>

            {/* 2026 */}
            <div className="relative pl-10 space-y-1.5">
              <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px] font-black shadow-md">
                26
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  Tahun 2026 (Sekarang)
                </span>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  WEJOBS Hari Ini: Komunitas Terdepan & Ekosistem Global
                </h4>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                WEJOBS kini beroperasi penuh sebagai ekosistem freelance editorial terpercaya dengan <strong>14.221 pekerja terdaftar</strong>, <strong>4.421 pekerjaan aktif</strong> di berbagai kategori spesialisasi, serta lebih dari <strong>$1.728.000,00+ telah dibayarkan</strong> secara aman dan tepat waktu kepada para kontributor di seluruh dunia.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Masalah yang Diselesaikan & Keuntungan bagi Penulis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 mb-1">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              Kepastian & Transparansi Kerja
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Kami menghapus ketidakpastian dalam dunia freelance. Setiap pekerjaan mencantumkan instruksi yang gamblang, batasan kata, batas waktu pengerjaan, dan besaran komisi dalam mata uang USD tanpa ada potongan komisi tersembunyi dari saldo tugas Anda.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 mb-1">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              Perlindungan Escrow Terjamin
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Seluruh dana imbalan telah dikunci di muka dalam saldo escrow sebelum pekerjaan dipublikasikan ke katalog. Begitu hasil kerja Anda disetujui oleh editor, saldo otomatis masuk ke dompet Anda dan siap ditarik saat mencapai $100.00 USD.
            </p>
          </div>
        </div>

        {/* 4. Prinsip Keamanan & Transparansi */}
        <div className="p-8 rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Prinsip Keamanan & Integritas</h2>
              <p className="text-xs text-neutral-400">
                Standar pengamanan data dan akuntabilitas transaksi pada platform WEJOBS.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-neutral-300">
            <div className="p-4 rounded-xl bg-neutral-800/60 space-y-2">
              <h4 className="font-bold text-white text-sm">Kriptografi Kata Sandi Argon2id</h4>
              <p className="text-neutral-400 leading-relaxed">
                Seluruh kredensial akun diamankan menggunakan algoritma hashing standar industri. Teks kata sandi asli tidak pernah disimpan dalam sistem.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-800/60 space-y-2">
              <h4 className="font-bold text-white text-sm">Verifikasi Manusia & Anti-Bot</h4>
              <p className="text-neutral-400 leading-relaxed">
                Tantangan CAPTCHA interaktif dan verifikasi data rekening memastikan seluruh pengguna yang berpartisipasi adalah pekerja manusia sungguhan.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-800/60 space-y-2">
              <h4 className="font-bold text-white text-sm">Standar Orisinalitas & Anti-Plagiasi</h4>
              <p className="text-neutral-400 leading-relaxed">
                Kami menghargai karya kreatif otentik. Pemeriksaan kualitas melindungi integritas penerbit dan memberikan imbalan sepadan bagi penulis berkualitas.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-800/60 space-y-2">
              <h4 className="font-bold text-white text-sm">Catatan Audit Buku Besar</h4>
              <p className="text-neutral-400 leading-relaxed">
                Setiap persetujuan tugas, penarikan dana, dan penyesuaian saldo tercatat dalam riwayat buku besar (ledger) yang transparan dan dapat diunduh dalam format CSV.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Ajakan Bertindak */}
        <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 max-w-xl">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                Mulai Kerjakan Pekerjaan yang Sesuai Keahlian Anda
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Bergabunglah bersama 14.221 penulis freelance lainnya dan akses 4.421 peluang penulisan dengan imbalan USD terjamin.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenRegister}
                className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-colors cursor-pointer whitespace-nowrap"
              >
                Daftar Sebagai Penulis
              </button>
              <button
                onClick={() => onNavigate('/tasks')}
                className="px-6 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                Jelajahi Pekerjaan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

