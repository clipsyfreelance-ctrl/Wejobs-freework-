import React from 'react';
import { BuiltInAvatarId, User } from '../types';

export interface AvatarItem {
  id: BuiltInAvatarId;
  name: string;
  indonesianName: string;
  emoji: string;
  bgGradient: string;
  color: string;
  tagline: string;
  category: 'popular' | 'mammal' | 'wild' | 'creature';
}

export const BUILTIN_AVATARS: AvatarItem[] = [
  // 5 Utama yang diminta pengguna (Kelinci, Rubah, Panda, Tupai, Kucing)
  {
    id: 'rabbit',
    name: 'Rabbit',
    indonesianName: 'Kelinci',
    emoji: '🐰',
    bgGradient: 'from-rose-400 via-pink-500 to-rose-600',
    color: '#ec4899',
    tagline: 'Kreatif, Cepat & Ceria',
    category: 'popular',
  },
  {
    id: 'fox',
    name: 'Fox',
    indonesianName: 'Rubah',
    emoji: '🦊',
    bgGradient: 'from-amber-500 via-orange-500 to-red-600',
    color: '#ea580c',
    tagline: 'Cerdas, Analitis & Kritis',
    category: 'popular',
  },
  {
    id: 'panda',
    name: 'Panda',
    indonesianName: 'Panda',
    emoji: '🐼',
    bgGradient: 'from-slate-700 via-zinc-800 to-neutral-950',
    color: '#334155',
    tagline: 'Tenang, Fokus & Penuh Esensi',
    category: 'popular',
  },
  {
    id: 'squirrel',
    name: 'Squirrel',
    indonesianName: 'Tupai',
    emoji: '🐿️',
    bgGradient: 'from-amber-600 via-yellow-600 to-orange-700',
    color: '#d97706',
    tagline: 'Gesit, Produktif & Banyak Ide',
    category: 'popular',
  },
  {
    id: 'cat',
    name: 'Cat',
    indonesianName: 'Kucing',
    emoji: '🐱',
    bgGradient: 'from-yellow-400 via-amber-500 to-orange-500',
    color: '#f59e0b',
    tagline: 'Mandiri, Teliti & Elegan',
    category: 'popular',
  },

  // Pilihan Variasi Hewan Menarik Lainnya
  {
    id: 'bear',
    name: 'Bear',
    indonesianName: 'Beruang',
    emoji: '🐻',
    bgGradient: 'from-amber-800 via-amber-900 to-stone-950',
    color: '#78350f',
    tagline: 'Kuat, Konsisten & Berbobot',
    category: 'mammal',
  },
  {
    id: 'penguin',
    name: 'Penguin',
    indonesianName: 'Penguin',
    emoji: '🐧',
    bgGradient: 'from-sky-400 via-blue-600 to-indigo-900',
    color: '#0284c7',
    tagline: 'Rapi, Disiplin & Terstruktur',
    category: 'creature',
  },
  {
    id: 'hamster',
    name: 'Hamster',
    indonesianName: 'Hamster',
    emoji: '🐹',
    bgGradient: 'from-amber-300 via-orange-400 to-rose-400',
    color: '#f97316',
    tagline: 'Penuh Semangat & Cermat',
    category: 'mammal',
  },
  {
    id: 'lion',
    name: 'Lion',
    indonesianName: 'Singa',
    emoji: '🦁',
    bgGradient: 'from-yellow-500 via-amber-600 to-orange-700',
    color: '#b45309',
    tagline: 'Pemimpin & Tulisan Berani',
    category: 'wild',
  },
  {
    id: 'koala',
    name: 'Koala',
    indonesianName: 'Koala',
    emoji: '🐨',
    bgGradient: 'from-emerald-600 via-teal-700 to-slate-800',
    color: '#059669',
    tagline: 'Santai, Harmonis & Mindful',
    category: 'mammal',
  },
  {
    id: 'owl',
    name: 'Owl',
    indonesianName: 'Burung Hantu',
    emoji: '🦉',
    bgGradient: 'from-indigo-600 via-purple-700 to-slate-900',
    color: '#4f46e5',
    tagline: 'Bijaksana, Riset & Visioner',
    category: 'creature',
  },
  {
    id: 'wolf',
    name: 'Wolf',
    indonesianName: 'Serigala',
    emoji: '🐺',
    bgGradient: 'from-slate-500 via-blue-900 to-slate-950',
    color: '#1e3a8a',
    tagline: 'Loyal, Tajam & Strategis',
    category: 'wild',
  },
  {
    id: 'deer',
    name: 'Deer',
    indonesianName: 'Rusa',
    emoji: '🦌',
    bgGradient: 'from-emerald-700 via-green-800 to-stone-900',
    color: '#047857',
    tagline: 'Anggun, Puitis & Artistik',
    category: 'wild',
  },
  {
    id: 'tiger',
    name: 'Tiger',
    indonesianName: 'Harimau',
    emoji: '🐯',
    bgGradient: 'from-orange-500 via-red-600 to-amber-700',
    color: '#c2410c',
    tagline: 'Dinamis, Berkarakter & Tegas',
    category: 'wild',
  },
  {
    id: 'dolphin',
    name: 'Dolphin',
    indonesianName: 'Lumba-Lumba',
    emoji: '🐬',
    bgGradient: 'from-cyan-400 via-teal-500 to-blue-700',
    color: '#06b6d4',
    tagline: 'Komunikatif, Ramah & Ceria',
    category: 'creature',
  },
  {
    id: 'dragon',
    name: 'Dragon',
    indonesianName: 'Naga',
    emoji: '🐲',
    bgGradient: 'from-emerald-600 via-red-700 to-amber-600',
    color: '#dc2626',
    tagline: 'Legendaris & Masterpiece',
    category: 'creature',
  },
  {
    id: 'cheetah',
    name: 'Cheetah',
    indonesianName: 'Citah',
    emoji: '🐆',
    bgGradient: 'from-amber-400 via-yellow-500 to-orange-600',
    color: '#d97706',
    tagline: 'Super Cepat & Tepat Waktu',
    category: 'wild',
  },
  {
    id: 'eagle',
    name: 'Eagle',
    indonesianName: 'Elang',
    emoji: '🦅',
    bgGradient: 'from-sky-600 via-blue-700 to-slate-900',
    color: '#2563eb',
    tagline: 'Fokus Tajam & Presisi Tinggi',
    category: 'wild',
  },
];

// Mapping alias bawaan legacy ke avatar hewan
const ALIAS_MAP: Record<string, BuiltInAvatarId> = {
  'avatar-1': 'rabbit',
  'avatar-2': 'fox',
  'avatar-3': 'panda',
  'avatar-4': 'squirrel',
  'avatar-5': 'cat',
  'avatar-6': 'bear',
  'avatar-7': 'penguin',
  'rabbit': 'rabbit',
  'fox': 'fox',
  'panda': 'panda',
  'squirrel': 'squirrel',
  'cat': 'cat',
  'bear': 'bear',
  'penguin': 'penguin',
  'hamster': 'hamster',
  'lion': 'lion',
  'koala': 'koala',
  'owl': 'owl',
  'wolf': 'wolf',
  'deer': 'deer',
  'tiger': 'tiger',
  'dolphin': 'dolphin',
  'dragon': 'dragon',
  'cheetah': 'cheetah',
  'eagle': 'eagle',
};

export interface AvatarDisplayProps {
  user?: Partial<User> | null;
  avatarType?: 'builtin' | 'custom';
  builtinAvatarId?: BuiltInAvatarId;
  avatarId?: string;
  customAvatarUrl?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showStatus?: boolean;
  statusOnline?: boolean;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  user,
  avatarType,
  builtinAvatarId,
  avatarId,
  customAvatarUrl,
  name,
  size = 'md',
  className = '',
  showStatus = false,
  statusOnline = true,
}) => {
  const [imageError, setImageError] = React.useState(false);

  // Resolve props from user object if provided
  const resolvedType = user?.avatarType || avatarType || (user?.customAvatarUrl || customAvatarUrl ? 'custom' : 'builtin');
  const rawId = (user?.builtinAvatarId || user?.avatarId || builtinAvatarId || avatarId || 'rabbit') as string;
  const resolvedId = ALIAS_MAP[rawId] || rawId || 'rabbit';
  const resolvedCustomUrl = user?.customAvatarUrl || customAvatarUrl;
  const resolvedName = user?.fullName || name || 'User';

  React.useEffect(() => {
    setImageError(false);
  }, [resolvedCustomUrl]);

  const sizeMap = {
    xs: { container: 'w-6 h-6 text-xs', emoji: 'text-xs', dot: 'w-1.5 h-1.5' },
    sm: { container: 'w-8 h-8 text-sm', emoji: 'text-sm', dot: 'w-2 h-2' },
    md: { container: 'w-10 h-10 text-base', emoji: 'text-lg', dot: 'w-2.5 h-2.5' },
    lg: { container: 'w-14 h-14 text-xl', emoji: 'text-2xl', dot: 'w-3 h-3' },
    xl: { container: 'w-20 h-20 text-3xl', emoji: 'text-4xl', dot: 'w-4 h-4' },
    '2xl': { container: 'w-28 h-28 text-4xl', emoji: 'text-5xl', dot: 'w-5 h-5' },
  }[size];

  const currentBuiltin =
    BUILTIN_AVATARS.find((a) => a.id === resolvedId) ||
    BUILTIN_AVATARS.find((a) => a.id === 'rabbit') ||
    BUILTIN_AVATARS[0];

  const shouldShowCustom = resolvedType === 'custom' && !!resolvedCustomUrl && !imageError;

  return (
    <div className={`relative inline-flex items-center justify-center select-none flex-shrink-0 ${className}`}>
      {shouldShowCustom ? (
        <img
          src={resolvedCustomUrl}
          alt={resolvedName}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className={`${sizeMap.container} rounded-full object-cover border-2 border-white dark:border-[#2b2926] shadow-sm`}
        />
      ) : (
        <div
          className={`${sizeMap.container} rounded-full bg-gradient-to-tr ${currentBuiltin.bgGradient} flex items-center justify-center text-white border-2 border-white dark:border-[#2b2926] shadow-sm`}
        >
          <span className={sizeMap.emoji} role="img" aria-label={currentBuiltin.indonesianName || currentBuiltin.name}>
            {currentBuiltin.emoji}
          </span>
        </div>
      )}

      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 ${sizeMap.dot} rounded-full border-2 border-white dark:border-[#141312] ${
            statusOnline ? 'bg-emerald-500' : 'bg-neutral-400'
          }`}
        />
      )}
    </div>
  );
};

