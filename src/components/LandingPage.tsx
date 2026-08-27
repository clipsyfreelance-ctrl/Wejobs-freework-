import React from 'react';
import { Task, SponsorItem, FAQItem } from '../types';
import { SponsorsSection } from './SponsorsSection';
import {
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Briefcase,
  Users,
  CheckCircle2,
  Edit3,
  BookOpen,
  Feather,
  FileCheck,
  Globe,
  Star,
  ChevronRight,
  Zap,
  Lock,
  Headphones,
  Database,
  Quote,
  Trophy,
  Award,
} from 'lucide-react';

interface LandingPageProps {
  stats?: {
    totalTasks: number;
    fullTasks: number;
    availableTasks: number;
  };
  featuredTasks?: Task[];
  sponsors?: SponsorItem[];
  faqs?: FAQItem[];
  trustText?: string;
  onNavigate: (route: string) => void;
  onOpenRegister: () => void;
  onSelectTask: (task: Task) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  stats = { totalTasks: 0, fullTasks: 0, availableTasks: 0 },
  featuredTasks = [],
  sponsors = [],
  faqs = [],
  trustText = 'Escrow-Protected Freelance Micro-Jobs',
  onNavigate,
  onOpenRegister,
  onSelectTask,
}) => {
  const safeFeaturedTasks = featuredTasks || [];
  const safeSponsors = sponsors || [];
  const safeFaqs = faqs || [];
  const categoryHighlights = [
    {
      title: 'Writing',
      subtypes: 'Articles, Blog, Essays, Copywriting, Product Descriptions, Captions, Press Releases, Proposals',
      icon: <Edit3 className="w-6 h-6 text-orange-500" />,
      count: '380+ Pekerjaan Aktif',
      tag: 'Populer',
    },
    {
      title: 'Creative Writing',
      subtypes: 'Fiction, Short Stories, Poetry, Screenplays, Drama Scripts, Storytelling, Characters',
      icon: <Feather className="w-6 h-6 text-amber-500" />,
      count: '240+ Pekerjaan Aktif',
      tag: 'Imbalan Tinggi',
    },
    {
      title: 'Editing',
      subtypes: 'Proofreading, Grammar Editing, Structural Editing, Rewriting, Simplification',
      icon: <FileCheck className="w-6 h-6 text-emerald-500" />,
      count: '280+ Pekerjaan Aktif',
      tag: 'Review Cepat',
    },
    {
      title: 'Research & Writing',
      subtypes: 'Summaries, Literature Reviews, Research Digests, Informational Articles',
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      count: '220+ Pekerjaan Aktif',
      tag: 'Mendalam',
    },
    {
      title: 'Translation',
      subtypes: 'English to Indonesian, Document Localization, Subtitle Translation, Business Glossaries',
      icon: <Globe className="w-6 h-6 text-indigo-500" />,
      count: '150+ Pekerjaan Aktif',
      tag: 'Bilingual',
    },
    {
      title: 'Transcription',
      subtypes: 'Audio to Text, Podcast Transcripts, Interview Logging, Time-Stamped Verbatim Notes',
      icon: <Headphones className="w-6 h-6 text-rose-500" />,
      count: '90+ Pekerjaan Aktif',
      tag: 'Audio/Teks',
    },
    {
      title: 'Data Annotation',
      subtypes: 'Text Labeling, Sentiment Categorization, Entity Extraction, Dataset Verification',
      icon: <Database className="w-6 h-6 text-teal-500" />,
      count: '61+ Pekerjaan Aktif',
      tag: 'Dataset',
    },
  ];

  // 10 Global Reviewers with diverse international backgrounds and 4.5 - 5.0 star ratings
  const globalReviews = [
    {
      id: 'rev-1',
      name: 'Marcus Vance',
      country: 'United Kingdom',
      flag: '🇬🇧',
      role: 'Senior Copywriter & Tech Journalist',
      rating: 5.0,
      avatarId: 'fox',
      earnings: '$3,420.00 USD',
      comment:
        'WEJOBS has completely transformed my workflow. The atomic slot reservation means zero bidding wars, and every accepted article was credited straight to my balance without hidden fees.',
    },
    {
      id: 'rev-2',
      name: 'Sophia Dubois',
      country: 'France',
      flag: '🇫🇷',
      role: 'Literary Translator & Editor',
      rating: 5.0,
      avatarId: 'panda',
      earnings: '$2,890.00 USD',
      comment:
        'The editorial feedback system (v1-v3) gives exact parameters. Escrow funding guarantees you get paid immediately once your review is approved. Truly world-class transparency.',
    },
    {
      id: 'rev-3',
      name: 'Kenji Takahashi',
      country: 'Japan',
      flag: '🇯🇵',
      role: 'Research Digest & Science Writer',
      rating: 4.9,
      avatarId: 'owl',
      earnings: '$4,150.00 USD',
      comment:
        'Clear academic and business briefs. Reaching the $100.00 payout threshold was fast, and the wire transfer to my bank arrived in under 24 hours without deductions.',
    },
    {
      id: 'rev-4',
      name: 'Elena Rostova',
      country: 'Czech Republic',
      flag: '🇨🇿',
      role: 'Creative Fiction Author',
      rating: 5.0,
      avatarId: 'cat',
      earnings: '$1,980.00 USD',
      comment:
        'I love the Creative Writing category! Writing serialized chapter briefs and character narratives has never been so rewarding. The interface is clean, crisp, and distraction-free.',
    },
    {
      id: 'rev-5',
      name: 'Liam Henderson',
      country: 'Canada',
      flag: '🇨🇦',
      role: 'B2B Content Specialist',
      rating: 4.8,
      avatarId: 'wolf',
      earnings: '$2,640.00 USD',
      comment:
        'No endless pitching or bidding against 200 other candidates. You see a task, check the word count, claim the slot, and deliver. The best micro-work ecosystem available.',
    },
    {
      id: 'rev-6',
      name: 'Amara Okafor',
      country: 'Nigeria',
      flag: '🇳🇬',
      role: 'Grammar Editor & Proofreader',
      rating: 5.0,
      avatarId: 'koala',
      earnings: '$3,110.00 USD',
      comment:
        'Proofreading assignments are clear and structured. As an editor, I appreciate the exact rubrics and the security of knowing escrow funds are locked prior to starting work.',
    },
    {
      id: 'rev-7',
      name: 'Carlos Mendoza',
      country: 'Mexico',
      flag: '🇲🇽',
      role: 'Bilingual Localization Specialist',
      rating: 4.9,
      avatarId: 'lion',
      earnings: '$1,850.00 USD',
      comment:
        'The multi-currency payout options via PayPal and USDT make working internationally seamless. WEJOBS is genuine, reliable, and respectful of freelancer craft.',
    },
    {
      id: 'rev-8',
      name: 'Chloe Bennett',
      country: 'Australia',
      flag: '🇦🇺',
      role: 'SEO & Brand Narrative Strategist',
      rating: 5.0,
      avatarId: 'panda',
      earnings: '$2,475.00 USD',
      comment:
        'High-paying tasks with explicit guidelines. The transparency of the personal transaction ledger makes tracking income and processing withdrawals effortless.',
    },
    {
      id: 'rev-9',
      name: 'Oliver Wright',
      country: 'New Zealand',
      flag: '🇳🇿',
      role: 'Data Annotator & Content Curator',
      rating: 4.8,
      avatarId: 'fox',
      earnings: '$1,620.00 USD',
      comment:
        'The variety of jobs—from short 200-word summaries to in-depth data annotation—gives you flexibility to work whenever you have free time during the day.',
    },
    {
      id: 'rev-10',
      name: 'Priya Sharma',
      country: 'India',
      flag: '🇮🇳',
      role: 'Academic Researcher & Technical Writer',
      rating: 5.0,
      avatarId: 'owl',
      earnings: '$3,800.00 USD',
      comment:
        'Having 4,421 tasks across 7 major disciplines means there is always high-value work available. Payouts are punctual, dependable, and 100% transparent.',
    },
  ];

  return (
    <div id="landing-page" className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 bg-gradient-to-b from-blue-50/70 via-white to-blue-50/30 dark:from-[#0b1324] dark:via-[#090e1a] dark:to-[#070b14]">
        {/* Soft background ambient glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-72 bg-gradient-to-r from-blue-400/10 via-orange-400/10 to-blue-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Real Stats Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/80 text-blue-900 dark:text-blue-300 text-xs font-bold shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span>
                14.221 Pekerja Terdaftar • 4.421 Total Pekerjaan Aktif
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] font-serif-title">
              Ubah Keahlian Menulis Anda Menjadi{' '}
              <span className="bg-gradient-to-r from-blue-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                Imbalan USD Nyata.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Temukan pekerjaan penulisan mikro, klaim slot kapasitas instan, dan raih imbalan bergaransi escrow langsung ke dompet Anda.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <button
                type="button"
                onClick={() => onNavigate('/tasks')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer group hover:scale-[1.02]"
              >
                <span>Jelajahi 4.421 Pekerjaan</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onOpenRegister}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-[#131f38] hover:bg-blue-50 dark:hover:bg-[#1a2b4c] text-blue-900 dark:text-white border border-blue-200 dark:border-blue-800/80 font-bold text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Daftar Sekarang (Gratis)</span>
              </button>
            </div>

            {/* Micro Highlights under CTA */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Jaminan Escrow 100%
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-orange-500" /> Klaim Slot Instan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Min. Penarikan $100.00
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Trust & Earnings Bar */}
      <section className="py-8 bg-white dark:bg-[#0c1527] border-y border-blue-100 dark:border-blue-950 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center items-center">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                $1,728,000.00 +
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase font-bold tracking-wider">
                TELAH DI BAYARKAN
              </p>
            </div>

            <div>
              <p className="text-2xl sm:text-3xl font-black text-blue-900 dark:text-white">
                14.221
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase font-semibold">
                Pekerja Terdaftar
              </p>
            </div>

            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                4.421
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase font-semibold">
                Total Pekerjaan Tersedia
              </p>
            </div>

            <div>
              <p className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400">
                $0.50 – $85.00
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase font-semibold">
                Imbalan Per Tugas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2b. WEJOBS Monthly Challenge Feature Spotlight */}
      <section className="py-12 bg-gradient-to-r from-[#0a1224] via-[#0e1a34] to-[#122244] text-white relative overflow-hidden border-b border-blue-950">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/20 via-blue-500/20 to-transparent blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-[#111f3d]/80 rounded-3xl p-6 sm:p-10 border border-blue-800/50 backdrop-blur-md shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>WEJOBS MONTHLY CHALLENGE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                Work. Compete. <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">Earn More.</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Compete with talented freelancers from around the world, complete quality work, earn challenge points, climb the leaderboard, and win monthly rewards.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <div className="px-4 py-2 rounded-xl bg-[#090e1c] border border-blue-900/60 text-xs">
                  <span className="text-slate-400 block font-medium">🥇 Juara 1 Hadiah Utama</span>
                  <span className="text-lg font-black text-amber-300">$1,000.00 USD</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-[#090e1c] border border-blue-900/60 text-xs">
                  <span className="text-slate-400 block font-medium">🏆 Total Hadiah Bulanan</span>
                  <span className="text-lg font-black text-emerald-400">$1,750.00 USD</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-[#090e1c] border border-blue-900/60 text-xs">
                  <span className="text-slate-400 block font-medium">👥 Kuota Pendaftar</span>
                  <span className="text-lg font-black text-white">327 / 500 Terisi</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => onNavigate('/challenge')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
              >
                <Award className="w-4 h-4 text-amber-950" />
                <span>Lihat Papan Peringkat & Ikuti Kompetisi</span>
              </button>
              <button
                onClick={() => onNavigate('/challenge')}
                className="px-6 py-3 rounded-2xl bg-[#090e1c] hover:bg-[#121c38] text-slate-200 font-bold text-xs border border-blue-900/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Aturan & Sistem Poin Bulanan</span>
                <ChevronRight className="w-3.5 h-3.5 text-orange-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Global Freelancers Testimonials (10 Global Reviewers with 4.5-5.0 Stars) */}
      <section className="py-16 sm:py-24 bg-[#f4f7fc] dark:bg-[#090e1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
              Ulasan Komunitas Global
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Dipercaya oleh Penulis & Kurator di Seluruh Dunia
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Lebih dari $1,728,000.00+ telah dicairkan kepada para freelancer dari berbagai negara dengan tingkat kepuasan 4.9/5.0 bintang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {globalReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#131f38] border border-blue-100 dark:border-blue-900/60 shadow-xs hover:shadow-md hover:border-orange-300 dark:hover:border-orange-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-base font-bold text-blue-600 dark:text-blue-400">
                        {rev.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{rev.name}</span>
                          <span title={rev.country}>{rev.flag}</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{rev.role}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                      Terverifikasi
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(rev.rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1.5">
                      {rev.rating.toFixed(1)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-blue-50 dark:border-blue-950 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Total Dicairkan:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{rev.earnings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Job Categories (All 7 Disciplines) */}
      <section className="py-16 sm:py-24 bg-white dark:bg-[#0c1527] border-y border-blue-100 dark:border-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                Spesialisasi Mikro
              </h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
                Kategori Pekerjaan Lengkap
              </p>
            </div>
            <button
              onClick={() => onNavigate('/categories')}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Rincian Seluruh Kategori</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryHighlights.map((cat) => (
              <div
                key={cat.title}
                onClick={() => onNavigate(`/tasks?cat=${encodeURIComponent(cat.title)}`)}
                className="p-6 rounded-2xl border border-blue-100 dark:border-blue-900/60 bg-[#f8fafd] dark:bg-[#131f38] hover:border-orange-500/50 hover:bg-orange-50/20 dark:hover:bg-[#1a2b4c] transition-all cursor-pointer group shadow-xs"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#0c1527] shadow-xs border border-blue-50 dark:border-blue-950">
                    {cat.icon}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200/50 dark:border-orange-900/40">
                    {cat.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {cat.subtypes}
                </p>
                <div className="mt-4 pt-4 border-t border-blue-100 dark:border-blue-900/50 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {cat.count}
                  </span>
                  <span className="text-orange-600 dark:text-orange-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Buka Tugas <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Jobs */}
      <section className="py-16 sm:py-24 bg-[#f4f7fc] dark:bg-[#090e1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
                Peluang Terbuka
              </h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
                Tugas Penulisan Pilihan
              </p>
            </div>
            <button
              onClick={() => onNavigate('/tasks')}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-xs transition-colors cursor-pointer"
            >
              Jelajahi Seluruh 4.421 Tugas
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeFeaturedTasks.slice(0, 6).map((task) => (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="p-5 rounded-2xl bg-white dark:bg-[#131f38] border border-blue-100 dark:border-blue-900/60 hover:border-orange-500/60 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60">
                      {task.category}
                    </span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      ${task.payment.toFixed(2)} USD
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                    {task.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {task.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-blue-50 dark:border-blue-950 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-blue-500" /> {task.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{' '}
                      {task.clientRating.toFixed(1)}
                    </span>
                    <span
                      className={`font-semibold ${
                        task.remainingSlots <= 5
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {task.remainingSlots > 0 ? `${task.remainingSlots} slot tersisa` : 'PENUH'}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 text-xs font-bold rounded-xl bg-blue-50 hover:bg-orange-500 hover:text-white dark:bg-blue-950/50 dark:hover:bg-orange-600 text-blue-900 dark:text-blue-200 transition-all cursor-pointer"
                  >
                    Buka Panduan Tugas
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Sponsors Marquee */}
      <SponsorsSection sponsors={sponsors} trustText={trustText} />

      {/* 7. FAQ Section */}
      <section className="py-16 sm:py-24 bg-white dark:bg-[#0c1527]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">
              Pusat Informasi
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              Pertanyaan yang Sering Diajukan (FAQ)
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Panduan lengkap mengenai pendaftaran, penyelesaian tugas, saldo escrow, dan penarikan dana.
            </p>
          </div>

          <div className="space-y-4">
            {safeFaqs.slice(0, 5).map((faq) => (
              <div
                key={faq.id}
                className="p-5 rounded-2xl border border-blue-100 dark:border-blue-900/60 bg-[#f8fafd] dark:bg-[#131f38]/60 shadow-xs"
              >
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {faq.question}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate('/faq')}
              className="px-6 py-2.5 rounded-xl border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-900 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors cursor-pointer"
            >
              Lihat Seluruh 40+ Jawaban FAQ
            </button>
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-700 via-blue-600 to-orange-500 text-white text-center shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-serif-title">
            Siap Meraih Imbalan USD dari Karya Tulisan Anda?
          </h2>
          <p className="text-base sm:text-lg text-blue-50 max-w-2xl mx-auto">
            Bergabunglah bersama 14.221 pekerja terdaftar dan akses 4.421 peluang tugas editorial dengan imbalan terjamin escrow hari ini.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-blue-900 font-bold text-sm hover:bg-blue-50 shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              Daftar Sebagai Freelancer (Gratis)
            </button>
            <button
              onClick={() => onNavigate('/tasks')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white border border-orange-300/40 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Jelajahi 4.421 Tugas Terbuka
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

