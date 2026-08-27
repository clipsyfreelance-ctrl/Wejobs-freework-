import React, { useState, useEffect } from 'react';
import { API_BASE } from '../apiConfig';
import { User, PaymentAccountVerification, PAYMENT_CHANNELS, PaymentChannelConfig } from '../types';
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileCheck,
  Upload,
  ArrowRight,
  Lock,
  ExternalLink,
  ChevronRight,
  Info,
  Sparkles,
  Check,
  RefreshCw,
  Wallet,
  Smartphone,
  Globe2,
  Trash2,
  FileText,
} from 'lucide-react';

interface PaymentVerificationManagerProps {
  user: User;
  onRefreshUserData?: () => Promise<void>;
  onSelectVerifiedAccountForWithdrawal?: (account: PaymentAccountVerification) => void;
  onNavigate?: (route: string) => void;
}

export const PaymentVerificationManager: React.FC<PaymentVerificationManagerProps> = ({
  user,
  onRefreshUserData,
  onSelectVerifiedAccountForWithdrawal,
  onNavigate,
}) => {
  // Payout Eligibility State
  const [eligibilityStatus, setEligibilityStatus] = useState<string>(user.payoutEligibilityStatus || 'none');
  const [eligibilityNote, setEligibilityNote] = useState<string>(user.payoutEligibilityNote || '');
  const [submittingEligibility, setSubmittingEligibility] = useState(false);
  const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false);
  const [eligibilityReason, setEligibilityReason] = useState('');

  // Payment Account Verifications List
  const [verifications, setVerifications] = useState<PaymentAccountVerification[]>([]);
  const [loadingVerifications, setLoadingVerifications] = useState(false);

  // Verification Form Modal State
  const [selectedChannel, setSelectedChannel] = useState<PaymentChannelConfig | null>(null);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [accountHolderName, setAccountHolderName] = useState(user.fullName || '');
  const [accountNumber, setAccountNumber] = useState('');
  const [proofFile, setProofFile] = useState<{ name: string; url: string } | null>(null);
  const [userNotes, setUserNotes] = useState('');
  const [submittingVerification, setSubmittingVerification] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Info modal for Maintenance / Coming soon channels
  const [channelInfoModal, setChannelInfoModal] = useState<PaymentChannelConfig | null>(null);

  // Sync user state changes
  useEffect(() => {
    setEligibilityStatus(user.payoutEligibilityStatus || 'none');
    setEligibilityNote(user.payoutEligibilityNote || '');
    if (!accountHolderName) {
      setAccountHolderName(user.fullName || '');
    }
  }, [user]);

  // Fetch verified and pending payment accounts
  const fetchVerifications = async () => {
    setLoadingVerifications(true);
    try {
      const token = localStorage.getItem('wejobs_token');
      const res = await fetch(`${API_BASE}/api/payment-verifications/my`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setVerifications(data.verifications || []);
        }
      }
    } catch (err) {
      console.warn('Failed to load payment verifications', err);
    } finally {
      setLoadingVerifications(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setFeedbackToast({ type, message });
    setTimeout(() => setFeedbackToast(null), 5000);
  };

  // Submit Step 1: Payout Eligibility
  const handleRequestEligibility = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingEligibility(true);
    try {
      const token = localStorage.getItem('wejobs_token');
      const res = await fetch(`${API_BASE}/api/payout-eligibility/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ reason: eligibilityReason }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal mengajukan kelayakan payout.');
      }

      setEligibilityStatus('pending');
      setEligibilityModalOpen(false);
      setEligibilityReason('');
      showToast('success', '✅ Pengajuan verifikasi kelayakan berhasil dikirim! Menunggu konfirmasi Super Admin.');
      if (onRefreshUserData) await onRefreshUserData();
    } catch (err: any) {
      showToast('error', err.message || 'Terjadi kesalahan saat mengajukan kelayakan.');
    } finally {
      setSubmittingEligibility(false);
    }
  };

  // Open verification modal for a specific bank/e-wallet
  const handleOpenVerification = (channel: PaymentChannelConfig) => {
    if (channel.status === 'maintenance' || channel.status === 'coming_soon') {
      setChannelInfoModal(channel);
      return;
    }

    if (eligibilityStatus !== 'eligible') {
      showToast(
        'error',
        '⚠️ Anda wajib mengajukan verifikasi kelayakan (Eligible) dan disetujui Admin terlebih dahulu sebelum memverifikasi rekening.'
      );
      return;
    }

    // Check existing verification for prefill
    const existing = verifications.find((v) => v.bankCode === channel.code);
    if (existing) {
      setAccountHolderName(existing.accountHolderName);
      setAccountNumber(existing.accountNumber);
      setUserNotes(existing.userNotes || '');
      if (existing.proofFileName) {
        setProofFile({ name: existing.proofFileName, url: existing.proofUrl || '' });
      } else {
        setProofFile(null);
      }
    } else {
      setAccountHolderName(user.fullName || '');
      setAccountNumber('');
      setUserNotes('');
      setProofFile(null);
    }

    setSelectedChannel(channel);
    setFormError(null);
    setVerificationModalOpen(true);
  };

  // Handle proof file upload simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Ukuran file maksimal 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProofFile({
        name: file.name,
        url: reader.result as string,
      });
      setFormError(null);
    };
    reader.readAsDataURL(file);
  };

  // Submit Step 2: Payment Account Verification
  const handleSubmitAccountVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChannel) return;

    if (!accountHolderName.trim()) {
      setFormError('Nama pemilik rekening wajib diisi sesuai identitas terdaftar.');
      return;
    }

    if (!accountNumber.trim()) {
      setFormError('Nomor rekening / nomor handphone e-wallet wajib diisi.');
      return;
    }

    setSubmittingVerification(true);
    setFormError(null);

    try {
      const token = localStorage.getItem('wejobs_token');
      const res = await fetch(`${API_BASE}/api/payment-verifications/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          bankCode: selectedChannel.code,
          accountHolderName: accountHolderName.trim(),
          accountNumber: accountNumber.trim(),
          proofUrl: proofFile?.url || '',
          proofFileName: proofFile?.name || '',
          userNotes: userNotes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal mengajukan verifikasi rekening.');
      }

      setVerificationModalOpen(false);
      setSelectedChannel(null);
      await fetchVerifications();
      if (onRefreshUserData) await onRefreshUserData();
      showToast(
        'success',
        `✅ Pengajuan verifikasi ${selectedChannel.name} berhasil dikirim! Menunggu konfirmasi Super Admin.`
      );
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan saat memverifikasi rekening.');
    } finally {
      setSubmittingVerification(false);
    }
  };

  const isEligible = eligibilityStatus === 'eligible';

  return (
    <div id="payment-verification-manager" className="space-y-8">
      {/* Toast Alert */}
      {feedbackToast && (
        <div className="fixed top-20 right-6 z-50 max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`p-4 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${
              feedbackToast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-100 border-emerald-700/80'
                : 'bg-rose-950/90 text-rose-100 border-rose-700/80'
            }`}
          >
            {feedbackToast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            )}
            <p className="text-xs font-semibold leading-relaxed">{feedbackToast.message}</p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                Verifikasi Pembayaran & Rekening Penarikan
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
              Alur otorisasi 2 tahap resmi: Ajukan status eligible terlebih dahulu, setelah dikonfirmasi admin, lakukan verifikasi rekening bank atau e-wallet tujuan Anda.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchVerifications}
              disabled={loadingVerifications}
              className="px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingVerifications ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>

        {/* 3 Step Workflow Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              isEligible
                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                : eligibilityStatus === 'pending'
                ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300'
                : 'bg-orange-50/60 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/50 text-orange-900 dark:text-orange-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center font-bold text-[11px]">
                1
              </span>
              <span className="font-bold text-xs">Verifikasi Eligible</span>
            </div>
            <p className="text-[11px] opacity-80 mt-1">
              {isEligible
                ? '✅ Dikonfirmasi Admin'
                : eligibilityStatus === 'pending'
                ? '⏳ Sedang Ditinjau Admin'
                : 'Wajib diajukan ke Admin'}
            </p>
          </div>

          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              verifications.some((v) => v.status === 'verified')
                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                : isEligible
                ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-300'
                : 'bg-neutral-100 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700 text-neutral-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center font-bold text-[11px]">
                2
              </span>
              <span className="font-bold text-xs">Verifikasi Rekening</span>
            </div>
            <p className="text-[11px] opacity-80 mt-1">
              {verifications.some((v) => v.status === 'verified')
                ? `✅ ${verifications.filter((v) => v.status === 'verified').length} Rekening Aktif`
                : isEligible
                ? 'Pilih Bank / E-Wallet di bawah'
                : 'Terkunci (Tunggu Step 1)'}
            </p>
          </div>

          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              user.balance >= 100 && verifications.some((v) => v.status === 'verified')
                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                : 'bg-neutral-100 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700 text-neutral-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center font-bold text-[11px]">
                3
              </span>
              <span className="font-bold text-xs">Withdrawal Pendapatan</span>
            </div>
            <p className="text-[11px] opacity-80 mt-1">
              Min. $100.00 USD (Saldo: ${user.balance.toFixed(2)})
            </p>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* TAHAP 1: KELAYAKAN PAYOUT (ELIGIBLE STATUS) */}
      {/* ========================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-2xl ${
                isEligible
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : eligibilityStatus === 'pending'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300'
              }`}
            >
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Tahap 1</span>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Status Verifikasi Kelayakan (Eligible Payout)
                </h3>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Konfirmasi resmi dari Super Admin untuk memastikan akun memenuhi standar kepatuhan.
              </p>
            </div>
          </div>

          <div>
            {isEligible ? (
              <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>Status: TERVERIFIKASI ELIGIBLE ✅</span>
              </span>
            ) : eligibilityStatus === 'pending' ? (
              <span className="px-4 py-2 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 border border-amber-300 dark:border-amber-800">
                <Clock className="w-4 h-4 animate-spin" />
                <span>Menunggu Konfirmasi Admin ⏳</span>
              </span>
            ) : eligibilityStatus === 'rejected' ? (
              <span className="px-4 py-2 rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs flex items-center gap-1.5 border border-rose-300 dark:border-rose-800">
                <XCircle className="w-4 h-4" />
                <span>Status: DITOLAK ADMIN ❌</span>
              </span>
            ) : (
              <span className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 font-bold text-xs flex items-center gap-1.5 border border-neutral-300 dark:border-neutral-700">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span>Belum Mengajukan Eligible</span>
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Card State for Stage 1 */}
        {isEligible ? (
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-800 dark:text-emerald-200">
            <div className="space-y-1">
              <p className="font-bold">
                Selamat! Akun Anda telah disetujui sebagai Eligible Freelancer oleh Admin.
              </p>
              <p className="text-[11px] opacity-90">
                {eligibilityNote || 'Anda sekarang dapat memilih dan memverifikasi rekening penerima di bawah.'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
              <Check className="w-4 h-4" />
              <span>Step 2 Terbuka</span>
            </div>
          </div>
        ) : eligibilityStatus === 'pending' ? (
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2 text-xs text-amber-900 dark:text-amber-200">
            <p className="font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Permintaan kelayakan Anda sedang dalam proses peninjauan Admin.</span>
            </p>
            <p className="text-[11px] leading-relaxed opacity-90">
              Sesuai ketentuan keamanan WEJOBS, Anda belum dapat mengajukan verifikasi nomor rekening penerima sampai Admin memberikan konfirmasi persetujuan kelayakan pada akun Anda. Proses review biasanya berlangsung 1-12 jam kerja.
            </p>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 text-xs text-neutral-800 dark:text-neutral-200">
              <p className="font-bold text-sm text-neutral-900 dark:text-white">
                Syarat Wajib Penarikan Saldo
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 text-[11px] leading-relaxed max-w-xl">
                Sebelum client dapat mengajukan verifikasi rekening penerima, client wajib mengklik tombol di samping untuk <strong>mengajukan status eligible</strong> kepada Admin.
              </p>
              {eligibilityStatus === 'rejected' && eligibilityNote && (
                <div className="mt-2 p-2.5 rounded-xl bg-rose-100/70 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-[11px]">
                  <strong>Catatan Admin Sebelumnya:</strong> "{eligibilityNote}"
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setEligibilityModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>{eligibilityStatus === 'rejected' ? 'Ajukan Ulang Eligible' : 'Ajukan Eligible Sekarang'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* TAHAP 2: DAFTAR LIST REKENING & STATUS */}
      {/* ========================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Tahap 2</span>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Daftar Pilihan Rekening & Status Verifikasi
                </h3>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Daftar bank & dompet digital resmi WEJOBS. Klik tombol verifikasi pada rekening yang ingin Anda gunakan.
              </p>
            </div>

            {!isEligible && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                <Lock className="w-3.5 h-3.5" />
                <span>Membutuhkan konfirmasi eligible</span>
              </span>
            )}
          </div>
        </div>

        {/* Lock overlay banner if not eligible */}
        {!isEligible && (
          <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-300">
            <Lock className="w-5 h-5 text-neutral-400 flex-shrink-0" />
            <p className="leading-relaxed">
              <strong>Verifikasi Rekening Terkunci:</strong> Anda belum dapat mengajukan verifikasi rekening penerima. Silakan klik tombol <strong>"Ajukan Eligible"</strong> pada Tahap 1 di atas dan tunggu persetujuan Super Admin.
            </p>
          </div>
        )}

        {/* Table / Grid of 11 Payment Channels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PAYMENT_CHANNELS.map((channel) => {
            const userVerification = verifications.find((v) => v.bankCode === channel.code);
            const isVerified = userVerification?.status === 'verified';
            const isPendingReview = userVerification?.status === 'pending';
            const isRejected = userVerification?.status === 'rejected';

            const isActiveChannel = channel.status === 'active';
            const isMaintenance = channel.status === 'maintenance';
            const isComingSoon = channel.status === 'coming_soon';

            return (
              <div
                key={channel.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  isVerified
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                    : isPendingReview
                    ? 'bg-amber-50/30 dark:bg-amber-950/15 border-amber-300 dark:border-amber-800/60'
                    : isActiveChannel
                    ? 'bg-neutral-50/80 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800 hover:border-orange-300 dark:hover:border-orange-800'
                    : 'bg-neutral-100/60 dark:bg-neutral-800/20 border-neutral-200 dark:border-neutral-800/50 opacity-80'
                }`}
              >
                {/* Top Row: Bank Info & Channel Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-750 p-1.5 flex items-center justify-center shadow-xs flex-shrink-0 overflow-hidden">
                      {channel.logoUrl ? (
                        <img
                          src={channel.logoUrl}
                          alt={channel.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback if image fails to load
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling;
                            if (fallback) (fallback as HTMLElement).style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-full h-full rounded-xl items-center justify-center font-black text-xs text-white shadow-xs ${
                          channel.logoUrl ? 'hidden' : 'flex'
                        }`}
                        style={{ backgroundColor: channel.iconColor }}
                      >
                        {channel.category === 'ewallet' ? (
                          <Smartphone className="w-5 h-5" />
                        ) : channel.category === 'international' ? (
                          <Globe2 className="w-5 h-5" />
                        ) : (
                          <Building className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-400">#{channel.id}</span>
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                          {channel.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded-md font-mono text-[10px] bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                          {channel.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {channel.description}
                      </p>
                    </div>
                  </div>

                  {/* Channel Status Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                      isActiveChannel
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : isMaintenance
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}
                  >
                    {channel.statusLabel}
                  </span>
                </div>

                {/* User Verification Detail for this Bank */}
                {userVerification && (
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                        {userVerification.accountHolderName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isVerified
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : isPendingReview
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {isVerified
                          ? '✅ Terverifikasi'
                          : isPendingReview
                          ? '⏳ Menunggu Konfirmasi Admin'
                          : '❌ Ditolak'}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-neutral-500">
                      No: {userVerification.accountNumber}
                    </p>
                    {userVerification.adminFeedback && (
                      <p className="text-[10px] text-neutral-400 italic">
                        Feedback Admin: "{userVerification.adminFeedback}"
                      </p>
                    )}
                  </div>
                )}

                {/* Bottom Action Button */}
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="text-[11px] text-neutral-400">
                    {isVerified
                      ? 'Siap digunakan untuk penarikan'
                      : isPendingReview
                      ? 'Ditinjau oleh Super Admin'
                      : isMaintenance
                      ? 'Saluran perbaikan sementara'
                      : isComingSoon
                      ? 'Segera hadir'
                      : isEligible
                      ? 'Belum diverifikasi'
                      : 'Memerlukan konfirmasi eligible'}
                  </div>

                  <div>
                    {isVerified ? (
                      <div className="flex items-center gap-1.5">
                        {onSelectVerifiedAccountForWithdrawal && (
                          <button
                            type="button"
                            onClick={() => onSelectVerifiedAccountForWithdrawal(userVerification)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
                          >
                            Tarik Dana
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenVerification(channel)}
                          className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                        >
                          Ubah Data
                        </button>
                      </div>
                    ) : isPendingReview ? (
                      <button
                        type="button"
                        onClick={() => handleOpenVerification(channel)}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-700/60 hover:bg-amber-500/30 cursor-pointer"
                      >
                        Lihat Pengajuan
                      </button>
                    ) : isRejected ? (
                      <button
                        type="button"
                        disabled={!isEligible}
                        onClick={() => handleOpenVerification(channel)}
                        className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Ajukan Ulang Verifikasi
                      </button>
                    ) : isActiveChannel ? (
                      <button
                        type="button"
                        disabled={!isEligible}
                        onClick={() => handleOpenVerification(channel)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isEligible
                            ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs hover:scale-102'
                            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verifikasi Rekening</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setChannelInfoModal(channel)}
                        className="px-3.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                      >
                        Informasi
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL 1: FORM PENGAJUAN ELIGIBLE */}
      {/* ========================================== */}
      {eligibilityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Pengajuan Verifikasi Kelayakan (Eligible)
                  </h3>
                  <p className="text-xs text-neutral-500">Tahap 1 Menuju Penarikan Pendapatan</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEligibilityModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-neutral-600 dark:text-neutral-300">
              <p className="leading-relaxed">
                Dengan mengajukan status eligible, Super Admin akan meninjau akun Anda (reputasi, rating penyelesaian tugas, dan validitas profil) untuk memberikan otorisasi penarikan.
              </p>
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span>Nama Lengkap:</span>
                  <span className="text-neutral-900 dark:text-white">{user.fullName}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Email Akun:</span>
                  <span className="text-neutral-900 dark:text-white">{user.email}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Saldo Saat Ini:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    ${user.balance.toFixed(2)} USD
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleRequestEligibility} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Alasan / Catatan Tambahan untuk Admin (Opsional)
                </label>
                <textarea
                  value={eligibilityReason}
                  onChange={(e) => setEligibilityReason(e.target.value)}
                  placeholder="Contoh: Telah menyelesaikan beberapa tugas editorial dan ingin mengonfigurasi rekening penerima untuk pencairan dana."
                  rows={3}
                  className="w-full p-3 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEligibilityModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingEligibility}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  {submittingEligibility ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Mengirim Pengajuan...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Pengajuan ke Admin</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: FORM VERIFIKASI REKENING */}
      {/* ========================================== */}
      {verificationModalOpen && selectedChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-1.5 flex items-center justify-center shadow-xs flex-shrink-0 overflow-hidden">
                  {selectedChannel.logoUrl ? (
                    <img
                      src={selectedChannel.logoUrl}
                      alt={selectedChannel.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling;
                        if (fallback) (fallback as HTMLElement).style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full rounded-xl items-center justify-center font-bold text-xs text-white ${
                      selectedChannel.logoUrl ? 'hidden' : 'flex'
                    }`}
                    style={{ backgroundColor: selectedChannel.iconColor }}
                  >
                    {selectedChannel.category === 'ewallet' ? (
                      <Smartphone className="w-5 h-5" />
                    ) : (
                      <Building className="w-5 h-5" />
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Verifikasi Rekening: {selectedChannel.name}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Kode Saluran: <span className="font-mono">{selectedChannel.code}</span> • {selectedChannel.statusLabel}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setVerificationModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitAccountVerification} className="space-y-4">
              {/* Account Holder Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {selectedChannel.accountHolderLabel || 'Nama Lengkap Pemilik Rekening'} *
                </label>
                <input
                  type="text"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  placeholder="Sesuai nama buku tabungan / KTP / Akun E-Wallet"
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
                <p className="text-[10px] text-neutral-400 mt-1">
                  * Nama pemilik rekening harus sesuai dengan identitas pemilik akun ({user.fullName}).
                </p>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {selectedChannel.accountNumberLabel || 'Nomor Rekening / No HP Terdaftar'} *
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder={
                    selectedChannel.category === 'ewallet'
                      ? '08xxxxxxxxxx'
                      : 'Contoh: 7192830192'
                  }
                  required
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {/* Upload Proof Document (Optional but Recommended) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Bukti Kepemilikan Rekening (Buku Tabungan / Screenshot Profil E-Wallet)
                </label>
                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-4 text-center hover:border-orange-400 transition-colors">
                  {proofFile ? (
                    <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span className="text-xs font-medium text-neutral-900 dark:text-white truncate">
                          {proofFile.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProofFile(null)}
                        className="text-neutral-400 hover:text-rose-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-1.5 cursor-pointer">
                      <Upload className="w-6 h-6 text-neutral-400" />
                      <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                        Klik untuk unggah dokumen
                      </span>
                      <span className="text-[10px] text-neutral-400">PNG, JPG, JPEG (Maks. 5MB)</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* User Notes */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="Contoh: Rekening tabungan utama atau cabang bank"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {/* Security Policy */}
              <div className="p-3 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-800/40 text-[11px] text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
                <Info className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <p>
                  Data rekening ini akan diverifikasi secara manual oleh Super Admin untuk mencegah penyalahgunaan dana dan memastikan pencairan aman.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setVerificationModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingVerification}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  {submittingVerification ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Memproses Pengajuan...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Kirim Verifikasi Rekening</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 3: INFO STATUS SALURAN PERBAIKAN/SEGERA HADIR */}
      {/* ========================================== */}
      {channelInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="relative w-11 h-11 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-1 flex items-center justify-center shadow-xs flex-shrink-0 overflow-hidden">
                  {channelInfoModal.logoUrl ? (
                    <img
                      src={channelInfoModal.logoUrl}
                      alt={channelInfoModal.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling;
                        if (fallback) (fallback as HTMLElement).style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full rounded-lg items-center justify-center text-white font-bold text-xs ${
                      channelInfoModal.logoUrl ? 'hidden' : 'flex'
                    }`}
                    style={{ backgroundColor: channelInfoModal.iconColor }}
                  >
                    <Globe2 className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    {channelInfoModal.name}
                  </h3>
                  <span className="text-xs text-neutral-500">{channelInfoModal.statusLabel}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChannelInfoModal(null)}
                className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-neutral-600 dark:text-neutral-300">
              <p className="leading-relaxed">{channelInfoModal.description}</p>
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-1">
                <p className="font-bold text-neutral-900 dark:text-white">
                  {channelInfoModal.status === 'maintenance'
                    ? 'Pemberitahuan Perbaikan Sistem'
                    : 'Pengembangan Saluran Internasional'}
                </p>
                <p className="text-[11px] text-neutral-500">
                  {channelInfoModal.status === 'maintenance'
                    ? 'Koneksi API perbankan ke institusi ini sedang menjalani audit keamanan reguler. Silakan gunakan saluran aktif seperti BSI Mobile, myBCA, BRImo, DANA, OVO, atau GoPay.'
                    : 'Saluran perbankan lintas negara ini dijadwalkan aktif pada fase pembaruan berikutnya.'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setChannelInfoModal(null)}
                className="px-5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
