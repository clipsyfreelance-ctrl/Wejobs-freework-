import React, { useState } from 'react';
import { User, Transaction, WithdrawalRequest, PAYMENT_CHANNELS } from '../types';
import {
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Building,
  CreditCard,
  Send,
  AlertCircle,
  CheckCircle2,
  Lock,
  Wallet,
  Coins,
  History,
  FileCheck,
  Download,
  Printer,
  Copy,
  Check,
  Filter,
} from 'lucide-react';

interface BalancePageProps {
  user: User;
  transactions?: Transaction[];
  withdrawals?: WithdrawalRequest[];
  onRequestWithdrawal: (data: {
    amount: number;
    method: 'bank_transfer' | 'paypal' | 'wise' | 'usdt';
    accountDetails: Record<string, string>;
  }) => Promise<boolean>;
  onNavigate: (route: string) => void;
}

export const BalancePage: React.FC<BalancePageProps> = ({
  user,
  transactions = [],
  withdrawals = [],
  onRequestWithdrawal,
  onNavigate,
}) => {
  const safeTransactions = transactions || [];
  const safeWithdrawals = withdrawals || [];
  const [method, setMethod] = useState<'bank_transfer' | 'paypal' | 'wise' | 'usdt'>(
    'bank_transfer'
  );
  const [amount, setAmount] = useState<number>(user.balance >= 100 ? user.balance : 100);
  const [accountName, setAccountName] = useState(user.fullName || '');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [walletNetwork, setWalletNetwork] = useState('TRC-20');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);
  const [txFilter, setTxFilter] = useState<'all' | 'earnings' | 'withdrawals'>('all');

  const canWithdraw = user.balance >= 100.0;

  // Filter transactions based on selected filter
  const filteredTransactions = safeTransactions.filter((tx) => {
    if (txFilter === 'earnings') return tx.amount > 0;
    if (txFilter === 'withdrawals') return tx.amount < 0 || tx.type.includes('withdrawal');
    return true;
  });

  // Export Ledger to CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ['Transaction ID', 'Date', 'Type', 'Description', 'Status', 'Amount (USD)'];
    const rows = transactions.map((t) => [
      t.id,
      new Date(t.createdAt).toISOString(),
      t.type,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.status,
      t.amount.toFixed(2),
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wejobs_statement_${user.id.substring(0, 8)}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Statement Window
  const handlePrintStatement = () => {
    window.print();
  };

  const handleCopyTxId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedTxId(id);
    setTimeout(() => setCopiedTxId(null), 2000);
  };

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (amount < 100) {
      setError('Minimum withdrawal threshold is $100.00 USD.');
      return;
    }

    if (amount > user.balance) {
      setError(`Requested amount ($${amount.toFixed(2)}) exceeds Available Balance ($${user.balance.toFixed(2)}).`);
      return;
    }

    setLoading(true);
    try {
      const details: Record<string, string> = {
        accountName,
      };

      if (method === 'bank_transfer') {
        if (!bankName || !accountNumber) {
          setError('Bank Name and Account Number are required.');
          setLoading(false);
          return;
        }
        details.bankName = bankName;
        details.accountNumber = accountNumber;
        details.swiftCode = swiftCode;
      } else if (method === 'paypal' || method === 'wise') {
        if (!accountNumber) {
          setError(`Please provide your ${method.toUpperCase()} account email or ID.`);
          setLoading(false);
          return;
        }
        details.accountIdentifier = accountNumber;
      } else if (method === 'usdt') {
        if (!accountNumber) {
          setError('Please provide your USDT wallet address.');
          setLoading(false);
          return;
        }
        details.walletAddress = accountNumber;
        details.network = walletNetwork;
      }

      const success = await onRequestWithdrawal({
        amount,
        method,
        accountDetails: details,
      });

      if (success) {
        setSuccessMessage(`Withdrawal request of $${amount.toFixed(2)} USD submitted successfully!`);
        setAccountNumber('');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit withdrawal request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="balance-page" className="py-8 sm:py-12 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
            Balance Ledger & USD Withdrawals
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Real-time balance breakdown, immutable transaction logs, and payout disbursements.
          </p>
        </div>

        {/* 3 Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-md space-y-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Available For Withdrawal
            </span>
            <p className="text-3xl sm:text-4xl font-black text-emerald-400">
              ${user.balance.toFixed(2)}{' '}
              <span className="text-sm font-semibold text-neutral-400">USD</span>
            </p>
            <p className="text-xs text-neutral-400">
              {canWithdraw ? '✓ Ready to disburse' : `Requires $${(100 - user.balance).toFixed(2)} more to reach $100 min.`}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Pending Editorial Review
            </span>
            <p className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white">
              ${user.pendingBalance.toFixed(2)}{' '}
              <span className="text-sm font-semibold text-neutral-400">USD</span>
            </p>
            <p className="text-xs text-neutral-500">
              Held in escrow until tasks receive editor approval
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Minimum Payout Threshold
            </span>
            <p className="text-3xl sm:text-4xl font-black text-orange-600 dark:text-orange-400">
              $100.00 <span className="text-sm font-semibold text-neutral-400">USD</span>
            </p>
            <p className="text-xs text-neutral-500">
              Strict platform policy with 0% platform commission deductions
            </p>
          </div>
        </div>

        {/* Withdrawal Form & Payouts Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Request Withdrawal Form (Col 1 & 2) */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Request Monetary Disbursement
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Select payment route and confirm recipient details.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                100% Guaranteed Escrow
              </span>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Two-Step Verification Flow Status Banner */}
            <div className={`p-4 rounded-2xl border transition-all space-y-3 ${
              user.payoutEligibilityStatus === 'eligible' && user.recipientStatus === 'verified'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : user.payoutEligibilityStatus === 'pending'
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                : 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900/60 text-orange-900 dark:text-orange-200'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-xl mt-0.5 ${
                    user.payoutEligibilityStatus === 'eligible' && user.recipientStatus === 'verified'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-orange-500/20 text-orange-600 dark:text-orange-400'
                  }`}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm">
                      {user.payoutEligibilityStatus === 'eligible' && user.recipientStatus === 'verified'
                        ? 'Akun & Rekening Telah Terverifikasi Penuh ✅'
                        : user.payoutEligibilityStatus === 'eligible'
                        ? 'Tahap 1 Selesai: Akun Eligible! Lanjut Verifikasi Rekening Penerima'
                        : user.payoutEligibilityStatus === 'pending'
                        ? 'Tahap 1: Pengajuan Eligible Sedang Ditinjau Admin'
                        : 'Syarat Withdrawal: Wajib Ajukan Verifikasi Pembayaran (2 Tahap)'}
                    </h4>
                    <p className="text-[11px] sm:text-xs opacity-90 mt-0.5">
                      {user.payoutEligibilityStatus === 'eligible' && user.recipientStatus === 'verified'
                        ? 'Rekening penerima Anda telah dikonfirmasi oleh Admin. Anda dapat melakukan penarikan dana kapan saja.'
                        : user.payoutEligibilityStatus === 'eligible'
                        ? 'Admin telah menyetujui kelayakan Anda. Silakan verifikasi nomor rekening bank/e-wallet Anda sebelum withdraw.'
                        : user.payoutEligibilityStatus === 'pending'
                        ? 'Pengajuan status eligible Anda sedang dalam antrean review oleh Admin. Harap tunggu konfirmasi admin.'
                        : 'Client wajib klik tombol ajukan eligible terlebih dahulu. Setelah dikonfirmasi admin, baru bisa verifikasi rekening penerima.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('/verification')}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs whitespace-nowrap shadow-xs cursor-pointer flex-shrink-0"
                >
                  {user.payoutEligibilityStatus === 'eligible' && user.recipientStatus === 'verified'
                    ? 'Kelola Rekening'
                    : user.payoutEligibilityStatus === 'eligible'
                    ? 'Verifikasi Rekening →'
                    : user.payoutEligibilityStatus === 'pending'
                    ? 'Lihat Status'
                    : 'Ajukan Verifikasi'}
                </button>
              </div>

              {/* Step indicator pills */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-black/10 dark:border-white/10 text-[11px]">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    user.payoutEligibilityStatus === 'eligible'
                      ? 'bg-emerald-500 text-white'
                      : user.payoutEligibilityStatus === 'pending'
                      ? 'bg-amber-500 text-white'
                      : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200'
                  }`}>
                    1
                  </span>
                  <span>Kelayakan Payout: </span>
                  <span className="font-bold uppercase">
                    {user.payoutEligibilityStatus === 'eligible'
                      ? 'Disetujui ✅'
                      : user.payoutEligibilityStatus === 'pending'
                      ? 'Menunggu Admin ⏳'
                      : 'Belum Diajukan'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 font-medium">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    user.recipientStatus === 'verified'
                      ? 'bg-emerald-500 text-white'
                      : user.recipientStatus === 'pending'
                      ? 'bg-amber-500 text-white'
                      : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200'
                  }`}>
                    2
                  </span>
                  <span>Rekening Bank: </span>
                  <span className="font-bold uppercase">
                    {user.recipientStatus === 'verified'
                      ? 'Terverifikasi ✅'
                      : user.recipientStatus === 'pending'
                      ? 'Sedang Ditinjau ⏳'
                      : user.payoutEligibilityStatus === 'eligible'
                      ? 'Siap Diajukan'
                      : 'Terkunci (Perlu Tahap 1)'}
                  </span>
                </div>
              </div>

              {/* Supported Payment Channels Logo Bar */}
              <div className="pt-2 border-t border-black/10 dark:border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300">
                    Saluran Pembayaran Resmi:
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('/verification')}
                    className="text-[10px] font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                  >
                    Lihat Semua (11 Saluran) →
                  </button>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {PAYMENT_CHANNELS.map((chan) => (
                    <button
                      key={chan.id}
                      type="button"
                      onClick={() => onNavigate('/verification')}
                      title={`${chan.name} (${chan.statusLabel})`}
                      className="group flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/90 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-700 hover:border-orange-400 transition-all cursor-pointer shadow-2xs"
                    >
                      <div className="w-5 h-5 rounded-md overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                        {chan.logoUrl ? (
                          <img
                            src={chan.logoUrl}
                            alt={chan.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain"
                          />
                        ) : null}
                      </div>
                      <span className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                        {chan.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Payout Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'bank_transfer', label: 'Bank Wire / Transfer', icon: <Building className="w-4 h-4" /> },
                    { id: 'paypal', label: 'PayPal (USD)', icon: <CreditCard className="w-4 h-4" /> },
                    { id: 'wise', label: 'Wise (USD)', icon: <Wallet className="w-4 h-4" /> },
                    { id: 'usdt', label: 'USDT (Crypto)', icon: <Coins className="w-4 h-4" /> },
                  ].map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setMethod(m.id as any)}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        method === m.id
                          ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40 text-orange-600 dark:text-orange-300 shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {m.icon}
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Withdrawal Amount (USD) — Min. $100.00
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    min="100"
                    step="0.01"
                    max={user.balance}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                    className="w-full pl-9 pr-24 py-2.5 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setAmount(user.balance)}
                    className="absolute right-2 top-2 px-2.5 py-1 text-xs font-bold rounded-lg bg-neutral-100 dark:bg-neutral-700 text-orange-600 dark:text-orange-400 hover:bg-orange-100 cursor-pointer"
                  >
                    Max Amount
                  </button>
                </div>
              </div>

              {/* Dynamic Fields based on method */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Beneficiary Legal Name
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Full Legal Name on Account"
                  required
                  className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {method === 'bank_transfer' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. Bank Central Asia / Chase"
                      required
                      className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Account / IBAN Number
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Account number"
                      required
                      className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {(method === 'paypal' || method === 'wise') && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {method.toUpperCase()} Account Email / ID
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="account@email.com"
                    required
                    className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              )}

              {method === 'usdt' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Blockchain Network
                    </label>
                    <select
                      value={walletNetwork}
                      onChange={(e) => setWalletNetwork(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      <option value="TRC-20">TRON (TRC-20)</option>
                      <option value="ERC-20">Ethereum (ERC-20)</option>
                      <option value="BEP-20">BNB Chain (BEP-20)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      USDT Wallet Address
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="0x... or T..."
                      required
                      className="w-full px-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading || !canWithdraw}
                  className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {loading
                      ? 'Processing Request...'
                      : canWithdraw
                      ? `Submit Payout Request ($${amount.toFixed(2)} USD)`
                      : `Minimum $100.00 Required (Current: $${user.balance.toFixed(2)})`}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Pending Withdrawal Queue & Guidelines (Col 3) */}
          <div className="space-y-6">
            {/* Status of recent withdrawal requests */}
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-orange-500" />
                <span>Withdrawal Requests ({withdrawals.length})</span>
              </h3>

              {withdrawals.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-4">
                  No active or past withdrawal requests.
                </p>
              ) : (
                <div className="space-y-3 divide-y divide-neutral-100 dark:divide-neutral-800">
                  {withdrawals.map((w) => (
                    <div key={w.id} className="pt-2 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-neutral-900 dark:text-white">
                          ${w.amount.toFixed(2)} USD
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            w.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : w.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {w.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500">
                        {w.method.replace('_', ' ').toUpperCase()} •{' '}
                        {new Date(w.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payout Security Notice */}
            <div className="p-6 rounded-3xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-800/40 text-xs text-neutral-700 dark:text-neutral-300 space-y-2">
              <span className="font-bold flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                <Lock className="w-4 h-4" /> Settlement Guarantee
              </span>
              <p className="leading-relaxed text-[11px]">
                Disbursements are verified and cleared by editorial accounting within 24–48 business
                hours. No platform fees are deducted from your balance.
              </p>
            </div>
          </div>
        </div>

        {/* Transaction History Ledger Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Transaction Ledger & Financial History
                </h2>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Timestamped records of earnings, escrow transitions, and disbursements.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Filter Tabs */}
              <div className="flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs">
                <button
                  type="button"
                  onClick={() => setTxFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                    txFilter === 'all'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  All ({transactions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTxFilter('earnings')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                    txFilter === 'earnings'
                      ? 'bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setTxFilter('withdrawals')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                    txFilter === 'withdrawals'
                      ? 'bg-white dark:bg-neutral-900 text-rose-600 dark:text-rose-400 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  Payouts
                </button>
              </div>

              {/* Action Buttons */}
              <button
                type="button"
                onClick={handleExportCSV}
                disabled={transactions.length === 0}
                className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Download CSV Statement"
              >
                <Download className="w-3.5 h-3.5 text-neutral-500" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={handlePrintStatement}
                className="p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                title="Print Account Statement"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredTransactions.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400">
                No transactions found for the selected filter.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-2">Date & Time</th>
                    <th className="py-3 px-2">Transaction ID</th>
                    <th className="py-3 px-2">Type</th>
                    <th className="py-3 px-2">Description</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Amount (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30">
                      <td className="py-3 px-2 whitespace-nowrap text-neutral-500">
                        {new Date(tx.createdAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-2 font-mono text-[11px] text-neutral-400">
                        <button
                          type="button"
                          onClick={() => handleCopyTxId(tx.id)}
                          className="flex items-center gap-1 hover:text-orange-500 transition-colors cursor-pointer"
                          title="Copy Full Transaction ID"
                        >
                          <span>{tx.id.substring(0, 10)}...</span>
                          {copiedTxId === tx.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3 text-neutral-400 opacity-60 hover:opacity-100" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-2">
                        <span className="capitalize font-semibold text-neutral-700 dark:text-neutral-300">
                          {tx.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-neutral-600 dark:text-neutral-300 max-w-xs truncate">
                        {tx.description}
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 capitalize">
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-black whitespace-nowrap">
                        <span
                          className={
                            tx.amount >= 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }
                        >
                          {tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
