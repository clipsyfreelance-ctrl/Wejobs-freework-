import React, { useState, useEffect } from 'react';
import { User, BuiltInAvatarId } from '../types';
import { AvatarDisplay, BUILTIN_AVATARS, AvatarItem } from './AvatarDisplay';
import { PaymentVerificationManager } from './PaymentVerificationManager';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Save,
  ShieldCheck,
  Shuffle,
  Smile,
  Check,
  Loader2,
  X,
  CreditCard,
  Building,
  Sparkles,
} from 'lucide-react';

interface ProfilePageProps {
  user: User;
  onUpdateProfile: (data: Partial<User>) => Promise<boolean>;
  onRefreshUserData?: () => Promise<void>;
  onNavigate: (route: string) => void;
  initialTab?: 'profile' | 'verification';
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onUpdateProfile,
  onRefreshUserData,
  onNavigate,
  initialTab = 'profile',
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'verification'>(initialTab);
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');
  const [bio, setBio] = useState(user.bio || '');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(
    user.builtinAvatarId || user.avatarId || 'rabbit'
  );
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'popular' | 'mammal' | 'wild' | 'creature'>('all');

  const [saving, setSaving] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // Synchronize form fields whenever user object changes
  useEffect(() => {
    setFullName(user.fullName);
    setPhone(user.phone || '');
    setAddress(user.address || '');
    setBio(user.bio || '');
    setSelectedAvatarId(user.builtinAvatarId || user.avatarId || 'rabbit');
  }, [user]);

  const handleSelectAnimalAvatar = async (avatarId: string) => {
    setSelectedAvatarId(avatarId);
    setStatusMessage(null);

    try {
      const success = await onUpdateProfile({
        fullName,
        phone,
        address,
        bio,
        avatarType: 'builtin',
        builtinAvatarId: avatarId as BuiltInAvatarId,
        avatarId: avatarId,
      });
      if (success) {
        setStatusMessage({
          type: 'success',
          text: `Avatar karakter berhasil diganti menjadi ${avatarId.toUpperCase()}!`,
        });
      }
    } catch (err: any) {
      console.warn('Auto-save error:', err);
    }
  };

  const handleRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * BUILTIN_AVATARS.length);
    const chosen = BUILTIN_AVATARS[randomIndex];
    handleSelectAnimalAvatar(chosen.id);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);
    setIsSavedSuccess(false);

    try {
      const success = await onUpdateProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        bio: bio.trim(),
        avatarType: 'builtin',
        builtinAvatarId: (selectedAvatarId || 'rabbit') as BuiltInAvatarId,
        avatarId: selectedAvatarId || 'rabbit',
      });

      if (success) {
        setIsSavedSuccess(true);
        setStatusMessage({
          type: 'success',
          text: '✅ Semua informasi profil dan avatar berhasil disimpan & sinkron ke seluruh halaman!',
        });
        setTimeout(() => setIsSavedSuccess(false), 4000);
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal memperbarui profil.' });
    } finally {
      setSaving(false);
    }
  };

  const currentSelectedAvatar =
    BUILTIN_AVATARS.find((a) => a.id === selectedAvatarId) || BUILTIN_AVATARS[0];

  const filteredAvatars = BUILTIN_AVATARS.filter((av) => {
    if (categoryFilter === 'all') return true;
    return av.category === categoryFilter;
  });

  const previewUser: User = {
    ...user,
    fullName,
    avatarType: 'builtin',
    builtinAvatarId: selectedAvatarId as BuiltInAvatarId,
    avatarId: selectedAvatarId,
  };

  return (
    <div id="profile-page" className="py-8 sm:py-12 bg-neutral-50 dark:bg-[#141312] min-h-screen relative">
      {/* Floating Instant Toast Notification */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div
            className={`p-4 rounded-2xl shadow-xl flex items-center gap-3 border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-900/95 text-emerald-100 border-emerald-700/80 backdrop-blur-md'
                : 'bg-rose-900/95 text-rose-100 border-rose-700/80 backdrop-blur-md'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            )}
            <p className="text-xs sm:text-sm font-medium flex-1">{statusMessage.text}</p>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pengaturan Akun & Pembayaran</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight mt-1">
            Pengaturan Akun & Verifikasi
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Kelola profil freelancer, pilih karakter avatar hewan favorit, dan atur verifikasi rekening penarikan pendapatan.
          </p>
        </div>

        {/* Profile Tabs Navigation */}
        <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-[#1c1b18] text-orange-600 dark:text-orange-400 border-t-2 border-orange-500 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Biodata & Avatar Hewan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'verification'
                ? 'bg-white dark:bg-[#1c1b18] text-orange-600 dark:text-orange-400 border-t-2 border-orange-500 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verifikasi Pembayaran & Rekening</span>
            {user.payoutEligibilityStatus !== 'eligible' ? (
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            ) : (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                ELIGIBLE
              </span>
            )}
          </button>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-3 transition-all ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
            )}
            <span className="font-medium">{statusMessage.text}</span>
          </div>
        )}

        {/* Tab 1: Profile & Animal Avatar Settings */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-8">
          {/* Active Avatar Overview Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1c1b18] border border-neutral-200 dark:border-[#2b2926] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="overflow-hidden rounded-full p-1 bg-neutral-100 dark:bg-[#24221f] shadow-md flex-shrink-0">
                <AvatarDisplay user={previewUser} size="2xl" />
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Avatar yang Sedang Aktif Saat Ini</span>
                </div>
                <h3 className="text-xl font-black text-neutral-900 dark:text-white">
                  {fullName || 'Nama Lengkap Anda'}
                </h3>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                  <span className="px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 text-xs font-bold text-orange-600 dark:text-orange-400">
                    {currentSelectedAvatar.emoji} {currentSelectedAvatar.indonesianName} ({currentSelectedAvatar.name})
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                    "{currentSelectedAvatar.tagline}"
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRandomAvatar}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 dark:border-[#383531] bg-neutral-50 dark:bg-[#24221f] text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:border-orange-300 transition-colors cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5 text-orange-500" />
                <span>Pilih Avatar Acak</span>
              </button>
            </div>
          </div>

          {/* Section: Koleksi Karakter Avatar Hewan */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1c1b18] border border-neutral-200 dark:border-[#2b2926] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 dark:border-[#2b2926] pb-4">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Smile className="w-5 h-5 text-orange-500" />
                  <span>Pilih Karakter Avatar Hewan</span>
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Klik pada karakter hewan pilihan Anda untuk langsung menggunakannya.
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { key: 'all', label: 'Semua Avatar' },
                { key: 'popular', label: '⭐ Favorit (Kelinci, Rubah, Panda, Tupai, Kucing)' },
                { key: 'mammal', label: 'Mamalia' },
                { key: 'wild', label: 'Satwa Liar' },
                { key: 'creature', label: 'Spesies Unik' },
              ].map((tab) => (
                <button
                  type="button"
                  key={tab.key}
                  onClick={() => setCategoryFilter(tab.key as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    categoryFilter === tab.key
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                      : 'bg-neutral-100 dark:bg-[#24221f] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-[#2b2926]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Avatars Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
              {filteredAvatars.map((av: AvatarItem) => {
                const isSelected = selectedAvatarId === av.id;
                return (
                  <button
                    type="button"
                    key={av.id}
                    onClick={() => handleSelectAnimalAvatar(av.id)}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 ring-2 ring-orange-500 shadow-xs'
                        : 'border-neutral-200 dark:border-[#2b2926] bg-white dark:bg-[#24221f] hover:border-neutral-300 dark:hover:border-[#383531]'
                    }`}
                  >
                    <AvatarDisplay
                      avatarType="builtin"
                      builtinAvatarId={av.id}
                      name={av.indonesianName}
                      size="md"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                          {av.indonesianName}
                        </p>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {av.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                        {av.tagline}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Contact Details & Address Info */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1c1b18] border border-neutral-200 dark:border-[#2b2926] shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              Informasi Kontak & Identitas Pengguna
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#24221f] text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Alamat Email (Login Utama)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800/50 text-neutral-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Nomor WhatsApp / Telepon
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+62..."
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#24221f] text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Domisili / Kota Asal
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Kota, Provinsi, Negara"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#24221f] text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Bio Singkat Freelancer
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Ceritakan keahlian menulis Anda, topik favorit, atau pengalaman..."
                className="w-full p-3 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#24221f] text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-neutral-100 dark:border-[#2b2926]">
              <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Semua perubahan tersimpan langsung ke akun Anda.</span>
              </div>

              <button
                type="submit"
                disabled={saving}
                className={`px-7 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isSavedSuccess
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white'
                }`}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan Semua Perubahan...</span>
                  </>
                ) : isSavedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Berhasil Disimpan!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Semua Pengaturan Profil</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
        )}

        {/* Tab 2: Payment & Bank Account Verification (2-Stage Workflow) */}
        {activeTab === 'verification' && (
          <PaymentVerificationManager
            user={user}
            onRefreshUserData={onRefreshUserData}
            onSelectVerifiedAccountForWithdrawal={(acc) => {
              onNavigate('/balance');
            }}
            onNavigate={onNavigate}
          />
        )}
      </div>
    </div>
  );
};
