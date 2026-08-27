import React, { useState, useEffect } from 'react';
import { API_BASE } from '../apiConfig';
import {
  User,
  Challenge,
  ChallengeParticipant,
  ChallengeChampionHistory,
} from '../types';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Users,
  Flame,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  Search,
  Filter,
  Star,
  Zap,
  Gift,
  HelpCircle,
  History,
  Send,
  Check,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { AvatarDisplay } from './AvatarDisplay';
import { ChallengeRegisterModal } from './ChallengeRegisterModal';

interface ChallengePageProps {
  user: User | null;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onNavigate: (route: string) => void;
}

export const ChallengePage: React.FC<ChallengePageProps> = ({
  user,
  onOpenLogin,
  onOpenRegister,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<
    'leaderboard' | 'prizes' | 'rules' | 'history' | 'appeal'
  >('leaderboard');
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [stats, setStats] = useState<{
    registeredCount: number;
    remainingSlots: number;
    percentageFilled: number;
    slotStatus: 'AVAILABLE' | 'LIMITED' | 'ALMOST_FULL' | 'FULL';
    serverTime?: string;
  }>({
    registeredCount: 327,
    remainingSlots: 173,
    percentageFilled: 65.4,
    slotStatus: 'AVAILABLE',
  });
  const [leaderboard, setLeaderboard] = useState<ChallengeParticipant[]>([]);
  const [myParticipant, setMyParticipant] = useState<ChallengeParticipant | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [histories, setHistories] = useState<ChallengeChampionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [leaderboardFilter, setLeaderboardFilter] = useState<'all' | 'top10' | 'top50'>('all');

  // Appeal Form State
  const [appealType, setAppealType] = useState('point_dispute');
  const [appealReason, setAppealReason] = useState('');
  const [appealEvidence, setAppealEvidence] = useState('');
  const [appealSuccess, setAppealSuccess] = useState(false);
  const [appealSubmitting, setAppealSubmitting] = useState(false);
  const [appealError, setAppealError] = useState<string | null>(null);

  // Time remaining countdown simulation
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 15, hours: 21, minutes: 44, seconds: 12 });

  const fetchChallengeData = async () => {
    try {
      setLoading(true);
      // 1. Fetch active challenge
      const chalRes = await fetch(`${API_BASE}/api/challenges/active`);
      const chalData = await chalRes.json();
      if (chalData.success && chalData.challenge) {
        setChallenge(chalData.challenge);
        if (chalData.stats) {
          setStats(chalData.stats);
        }

        // 2. Fetch Leaderboard
        const lbRes = await fetch(`${API_BASE}/api/challenges/${chalData.challenge.slug}/leaderboard`);
        const lbData = await lbRes.json();
        if (lbData.success && lbData.leaderboard) {
          setLeaderboard(lbData.leaderboard);
        }

        // 3. Fetch User Status if logged in
        if (user) {
          const myRes = await fetch(`${API_BASE}/api/challenges/${chalData.challenge.slug}/my-status`, {
            headers: {
              Authorization: `Bearer ${user.id}`,
            },
          });
          const myData = await myRes.json();
          if (myData.success) {
            setIsRegistered(myData.isRegistered);
            setMyParticipant(myData.participant || null);
          }
        }
      }

      // 4. Fetch Histories
      const histRes = await fetch(`${API_BASE}/api/challenges/histories`);
      const histData = await histRes.json();
      if (histData.success && histData.histories) {
        setHistories(histData.histories);
      }
    } catch (err) {
      console.error('Failed to load challenge data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallengeData();
    const interval = setInterval(fetchChallengeData, 20000);
    return () => clearInterval(interval);
  }, [user]);

  // Live Countdown Timer logic
  useEffect(() => {
    const updateCountdown = () => {
      if (!challenge?.challengeEndAt) return;
      const target = new Date(challenge.challengeEndAt).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [challenge]);

  const handleAppealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenLogin();
      return;
    }
    if (!challenge) return;

    setAppealSubmitting(true);
    setAppealError(null);

    try {
      const res = await fetch(`${API_BASE}/api/challenges/${challenge.slug}/appeal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({
          type: appealType,
          reason: appealReason,
          evidence: appealEvidence,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit appeal.');
      }

      setAppealSuccess(true);
      setAppealReason('');
      setAppealEvidence('');
    } catch (err: any) {
      setAppealError(err.message || 'An error occurred while submitting appeal.');
    } finally {
      setAppealSubmitting(false);
    }
  };

  // Filtered Leaderboard
  const safeLeaderboard = leaderboard || [];
  const filteredLeaderboard = safeLeaderboard.filter((p) => {
    const matchesSearch =
      (p.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.country || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.id || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (leaderboardFilter === 'top10') return p.rank <= 10;
    if (leaderboardFilter === 'top50') return p.rank <= 50;
    return true;
  });

  const top3 = safeLeaderboard.slice(0, 3);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white pb-20">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 text-white pt-12 pb-16 sm:pb-20 border-b border-neutral-800">
        {/* Subtle Background Glow Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-orange-600/15 via-amber-500/20 to-yellow-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Left Header Info */}
            <div className="max-w-2xl text-center lg:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold tracking-wide uppercase">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>WEJOBS MONTHLY CHALLENGE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Work. Compete. <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">Earn More.</span>
              </h1>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                Compete with talented freelancers from around the world, complete quality work, earn challenge points, climb the leaderboard, and win monthly rewards.
              </p>

              {/* Grand Prize Highlight */}
              <div className="inline-flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700/80 backdrop-blur-md">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 text-neutral-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
                  🥇
                </div>
                <div className="text-left">
                  <p className="text-xs uppercase font-bold text-amber-300 tracking-wider">1st Place Grand Prize</p>
                  <p className="text-2xl sm:text-3xl font-black text-white">$1,000.00 USD</p>
                </div>
                <div className="hidden sm:block h-10 w-px bg-neutral-700 mx-2" />
                <div className="hidden sm:block text-left">
                  <p className="text-xs uppercase font-bold text-neutral-400">Total Prize Pool</p>
                  <p className="text-xl font-bold text-neutral-200">$1,750.00 USD</p>
                </div>
              </div>
            </div>

            {/* Right Slot & Registration Card */}
            <div className="w-full max-w-md bg-neutral-850/90 rounded-2xl border border-neutral-750 p-6 backdrop-blur-xl shadow-2xl space-y-5">
              {/* Countdown */}
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                  <span className="flex items-center gap-1.5 font-semibold text-neutral-300">
                    <Clock className="w-4 h-4 text-orange-400" />
                    Challenge Ends In:
                  </span>
                  <span className="font-mono text-neutral-300">September 30, 2026</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-neutral-800 rounded-xl p-2 border border-neutral-700/60">
                    <div className="text-xl font-bold text-white font-mono">{timeLeft.days}</div>
                    <div className="text-[10px] uppercase text-neutral-400 font-semibold">Days</div>
                  </div>
                  <div className="bg-neutral-800 rounded-xl p-2 border border-neutral-700/60">
                    <div className="text-xl font-bold text-white font-mono">{timeLeft.hours}</div>
                    <div className="text-[10px] uppercase text-neutral-400 font-semibold">Hours</div>
                  </div>
                  <div className="bg-neutral-800 rounded-xl p-2 border border-neutral-700/60">
                    <div className="text-xl font-bold text-white font-mono">{timeLeft.minutes}</div>
                    <div className="text-[10px] uppercase text-neutral-400 font-semibold">Mins</div>
                  </div>
                  <div className="bg-neutral-800 rounded-xl p-2 border border-neutral-700/60">
                    <div className="text-xl font-bold text-orange-400 font-mono">{timeLeft.seconds}</div>
                    <div className="text-[10px] uppercase text-neutral-400 font-semibold">Secs</div>
                  </div>
                </div>
              </div>

              {/* Slot Progress Bar */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-400" />
                    Slot Capacity
                  </span>
                  <span className="font-bold text-white">
                    {stats.registeredCount} / {challenge?.maxParticipants || 500} Registered
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden border border-neutral-700/50">
                  <div
                    className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, stats.percentageFilled)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="text-emerald-400 font-semibold">
                    {stats.remainingSlots} Slots Remaining ({stats.percentageFilled}% filled)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-medium">
                    {stats.slotStatus}
                  </span>
                </div>
              </div>

              {/* Participation Action Button */}
              {isRegistered ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-300">You Are Participating</p>
                      <p className="text-[11px] text-neutral-400">ID: {myParticipant?.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-white bg-neutral-800 px-2.5 py-1 rounded-lg">
                      Rank #{myParticipant?.rank || 27}
                    </span>
                    <p className="text-[11px] text-amber-400 font-bold mt-1">
                      {myParticipant?.score || 684} pts
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (!user) {
                      onOpenLogin();
                    } else {
                      setRegisterModalOpen(true);
                    }
                  }}
                  disabled={stats.remainingSlots <= 0}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-neutral-950 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Join Monthly Challenge (Free)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-md border border-neutral-200 dark:border-neutral-800 p-2 flex items-center gap-1 sm:gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveTab('prizes')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'prizes'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Prizes & Awards</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Scoring & Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Past Champions</span>
          </button>

          <button
            onClick={() => setActiveTab('appeal')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'appeal'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Appeal & Support</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* TAB 1: LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-8">
            {/* Top 3 Podium Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 pt-4">
              {/* 2nd Place */}
              {top3[1] && (
                <div className="order-2 md:order-1 bg-white dark:bg-neutral-900 rounded-2xl p-6 border-2 border-neutral-300 dark:border-neutral-700 shadow-lg flex flex-col items-center text-center relative mt-0 md:mt-6">
                  <div className="absolute -top-4 px-3 py-1 rounded-full bg-neutral-300 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-black tracking-wider uppercase flex items-center gap-1 shadow-sm">
                    <span>🥈 2nd Place</span>
                  </div>
                  <div className="relative mt-2">
                    <AvatarDisplay
                      avatarType={top3[1].avatarType}
                      builtinAvatarId={top3[1].builtinAvatarId}
                      avatarId={top3[1].avatarId}
                      fullName={top3[1].displayName}
                      size="lg"
                    />
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-neutral-400 text-white font-black text-xs flex items-center justify-center shadow">
                      2
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-3">
                    {top3[1].displayName}
                  </h3>
                  <p className="text-xs text-neutral-500">{top3[1].country}</p>
                  <div className="w-full my-4 h-px bg-neutral-100 dark:bg-neutral-800" />
                  <div className="grid grid-cols-2 gap-2 w-full text-xs">
                    <div className="bg-neutral-50 dark:bg-neutral-800/60 p-2 rounded-xl">
                      <span className="text-neutral-500 block">Points</span>
                      <span className="font-black text-sm text-orange-600 dark:text-orange-400">
                        {top3[1].score} pts
                      </span>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-800/60 p-2 rounded-xl">
                      <span className="text-neutral-500 block">Reward</span>
                      <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        $300 USD
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 1st Place Champion */}
              {top3[0] && (
                <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/30 dark:via-neutral-900 dark:to-neutral-900 rounded-2xl p-6 border-2 border-amber-400 dark:border-amber-500/60 shadow-xl flex flex-col items-center text-center relative -mt-3 md:-mt-4">
                  <div className="absolute -top-4 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                    <Crown className="w-3.5 h-3.5" />
                    <span>🥇 1st Place Champion</span>
                  </div>
                  <div className="relative mt-2">
                    <AvatarDisplay
                      avatarType={top3[0].avatarType}
                      builtinAvatarId={top3[0].builtinAvatarId}
                      avatarId={top3[0].avatarId}
                      fullName={top3[0].displayName}
                      size="xl"
                    />
                    <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-500 text-neutral-950 font-black text-sm flex items-center justify-center shadow-md">
                      1
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-neutral-900 dark:text-white mt-3">
                    {top3[0].displayName}
                  </h3>
                  <p className="text-xs text-neutral-500">{top3[0].country}</p>
                  <div className="w-full my-4 h-px bg-amber-200/50 dark:bg-amber-900/40" />
                  <div className="grid grid-cols-2 gap-2 w-full text-xs">
                    <div className="bg-amber-100/60 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
                      <span className="text-neutral-600 dark:text-neutral-400 block font-medium">Points</span>
                      <span className="font-black text-base text-amber-600 dark:text-amber-400">
                        {top3[0].score} pts
                      </span>
                    </div>
                    <div className="bg-emerald-100/60 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40">
                      <span className="text-neutral-600 dark:text-neutral-400 block font-medium">Prize</span>
                      <span className="font-black text-base text-emerald-600 dark:text-emerald-400">
                        $1,000 USD
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {top3[2] && (
                <div className="order-3 bg-white dark:bg-neutral-900 rounded-2xl p-6 border-2 border-amber-700/40 dark:border-amber-900/50 shadow-lg flex flex-col items-center text-center relative mt-0 md:mt-8">
                  <div className="absolute -top-4 px-3 py-1 rounded-full bg-amber-700/80 text-white text-xs font-black tracking-wider uppercase flex items-center gap-1 shadow-sm">
                    <span>🥉 3rd Place</span>
                  </div>
                  <div className="relative mt-2">
                    <AvatarDisplay
                      avatarType={top3[2].avatarType}
                      builtinAvatarId={top3[2].builtinAvatarId}
                      avatarId={top3[2].avatarId}
                      fullName={top3[2].displayName}
                      size="lg"
                    />
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center shadow">
                      3
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-3">
                    {top3[2].displayName}
                  </h3>
                  <p className="text-xs text-neutral-500">{top3[2].country}</p>
                  <div className="w-full my-4 h-px bg-neutral-100 dark:bg-neutral-800" />
                  <div className="grid grid-cols-2 gap-2 w-full text-xs">
                    <div className="bg-neutral-50 dark:bg-neutral-800/60 p-2 rounded-xl">
                      <span className="text-neutral-500 block">Points</span>
                      <span className="font-black text-sm text-orange-600 dark:text-orange-400">
                        {top3[2].score} pts
                      </span>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-800/60 p-2 rounded-xl">
                      <span className="text-neutral-500 block">Reward</span>
                      <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        $150 USD
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Controls Bar: Search & Filter Tabs */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search freelancer or country..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-orange-500 outline-none text-neutral-900 dark:text-white"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <button
                  onClick={() => setLeaderboardFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    leaderboardFilter === 'all'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  All Participants ({leaderboard.length})
                </button>
                <button
                  onClick={() => setLeaderboardFilter('top10')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    leaderboardFilter === 'top10'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  Top 10
                </button>
                <button
                  onClick={() => setLeaderboardFilter('top50')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    leaderboardFilter === 'top50'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  Top 50
                </button>
              </div>
            </div>

            {/* Full Leaderboard Table */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/80 text-neutral-500 uppercase tracking-wider font-bold border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="px-4 py-3.5 w-16 text-center">Rank</th>
                      <th className="px-4 py-3.5">Freelancer</th>
                      <th className="px-4 py-3.5 text-center">Country</th>
                      <th className="px-4 py-3.5 text-center">Tasks Done</th>
                      <th className="px-4 py-3.5 text-center">Acceptance</th>
                      <th className="px-4 py-3.5 text-center">Rating</th>
                      <th className="px-4 py-3.5 text-right font-black text-neutral-900 dark:text-white">
                        Challenge Points
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {filteredLeaderboard.slice(0, 50).map((participant) => {
                      const isCurrentUser = user && participant.userId === user.id;

                      return (
                        <tr
                          key={participant.id}
                          className={`transition-colors ${
                            isCurrentUser
                              ? 'bg-orange-50/80 dark:bg-orange-950/30 font-semibold'
                              : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                          }`}
                        >
                          {/* Rank */}
                          <td className="px-4 py-3 text-center">
                            {participant.rank === 1 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-black">
                                🥇
                              </span>
                            ) : participant.rank === 2 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 font-black">
                                🥈
                              </span>
                            ) : participant.rank === 3 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-800/20 text-amber-800 dark:text-amber-300 font-black">
                                🥉
                              </span>
                            ) : (
                              <span className="font-bold text-neutral-600 dark:text-neutral-400">
                                #{participant.rank}
                              </span>
                            )}
                          </td>

                          {/* Freelancer Profile */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <AvatarDisplay
                                avatarType={participant.avatarType}
                                builtinAvatarId={participant.builtinAvatarId}
                                avatarId={participant.avatarId}
                                fullName={participant.displayName}
                                size="sm"
                              />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-neutral-900 dark:text-white">
                                    {participant.displayName}
                                  </span>
                                  {isCurrentUser && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-600 text-white">
                                      YOU
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-neutral-400 font-mono">
                                  {participant.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Country */}
                          <td className="px-4 py-3 text-center text-neutral-600 dark:text-neutral-300">
                            {participant.country}
                          </td>

                          {/* Tasks Done */}
                          <td className="px-4 py-3 text-center font-semibold text-neutral-700 dark:text-neutral-300">
                            {participant.completedTasksCount}
                          </td>

                          {/* Acceptance */}
                          <td className="px-4 py-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                            {participant.acceptanceRate}%
                          </td>

                          {/* Rating */}
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center gap-1 text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              {participant.averageRating.toFixed(2)}
                            </span>
                          </td>

                          {/* Points */}
                          <td className="px-4 py-3 text-right">
                            <span className="inline-flex items-center gap-1 font-black text-sm text-orange-600 dark:text-orange-400">
                              <Zap className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                              {participant.score} pts
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRIZES & AWARDS */}
        {activeTab === 'prizes' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Monthly Reward Distribution
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Prizes are awarded at the end of each monthly period and deposited directly to the freelancer Available Balance after KYC verification.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenge?.prizes.map((prize, idx) => (
                <div
                  key={prize.id}
                  className={`rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                    prize.rank === 1
                      ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-400 dark:border-amber-500/60 shadow-lg'
                      : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">
                        {prize.rank === 1
                          ? '🥇'
                          : prize.rank === 2
                          ? '🥈'
                          : prize.rank === 3
                          ? '🥉'
                          : prize.icon === 'star'
                          ? '⭐'
                          : prize.icon === 'rocket'
                          ? '🚀'
                          : '💎'}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                        {prize.rank ? `Rank #${prize.rank}` : 'Special Award'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{prize.title}</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">{prize.description}</p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-baseline justify-between">
                    <span className="text-xs text-neutral-400 font-semibold uppercase">Prize Amount</span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      ${prize.amount.toFixed(2)} USD
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Payout & Terms Banner */}
            <div className="p-6 rounded-2xl bg-neutral-100 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Guaranteed Cash Payout via Available Balance
                </h4>
                <p className="text-xs text-neutral-500">
                  Winners receive funds immediately into their WEJOBS Balance, withdrawable to PayPal USD, Bank Transfer, or Crypto with 0% deduction.
                </p>
              </div>
              <button
                onClick={() => onNavigate('/tasks')}
                className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all whitespace-nowrap cursor-pointer"
              >
                Start Completing Tasks
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SCORING & RULES */}
        {activeTab === 'rules' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Points Calculation & Rules
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Points are credited automatically when your submitted work is approved by client and editorial review.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Task Category Points */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 text-orange-600 dark:text-orange-400 font-bold text-sm">
                  <Zap className="w-4 h-4" />
                  <span>Base Task Points</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                    <span className="text-neutral-600 dark:text-neutral-300">Microtask ($1 - $6)</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">+5 Points</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                    <span className="text-neutral-600 dark:text-neutral-300">Small Task ($7 - $15)</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">+10 Points</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                    <span className="text-neutral-600 dark:text-neutral-300">Medium Task ($16 - $25)</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">+20 Points</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                    <span className="text-neutral-600 dark:text-neutral-300">Medium-High ($26 - $35)</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">+30 Points</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                    <span className="text-neutral-600 dark:text-neutral-300">Large Task ($36+)</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">+50 Points</span>
                  </div>
                </div>
              </div>

              {/* Bonus Points */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <Award className="w-4 h-4" />
                  <span>Quality Bonuses</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20">
                    <span className="text-neutral-600 dark:text-neutral-300">5-Star Review Rating</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">+5 Points</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20">
                    <span className="text-neutral-600 dark:text-neutral-300">Accepted without Revision (v1)</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">+5 Points</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20">
                    <span className="text-neutral-600 dark:text-neutral-300">Early Turnaround Delivery</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">+3 Points</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20">
                    <span className="text-neutral-600 dark:text-neutral-300">Positive Client Endorsement</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">+3 Points</span>
                  </div>
                </div>
              </div>

              {/* Deductions & Anti-Fraud */}
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Penalties & Anti-Fraud</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/50 dark:bg-rose-950/20">
                    <span className="text-neutral-600 dark:text-neutral-300">Late Submission Delivery</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">-3 Points</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/50 dark:bg-rose-950/20">
                    <span className="text-neutral-600 dark:text-neutral-300">Rejected Submission (Plagiarism/Low Quality)</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">-5 Points</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/50 dark:bg-rose-950/20">
                    <span className="text-neutral-600 dark:text-neutral-300">Severe Policy Infraction</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">-20 Points</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/50 dark:bg-rose-950/20">
                    <span className="text-neutral-600 dark:text-neutral-300">Multiple Accounts / Scripting</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">DISQUALIFICATION</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PAST CHAMPIONS */}
        {activeTab === 'history' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Past Monthly Challenge Champions
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Recognizing previous winners and prize payouts disbursed across historical monthly competitions.
              </p>
            </div>

            <div className="space-y-6">
              {histories.map((hist) => (
                <div
                  key={hist.id}
                  className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm space-y-6"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <div>
                      <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                        {hist.monthYear} Completed
                      </span>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{hist.challengeTitle}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-neutral-400 block">Participants</span>
                        <span className="font-bold text-neutral-900 dark:text-white">{hist.totalParticipants} Contenders</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block">Prize Disbursed</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">${hist.totalPrizePaid.toFixed(2)} USD</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hist.winners.map((winner, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border flex items-center justify-between ${
                          winner.rank === 1
                            ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/40'
                            : 'bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <AvatarDisplay
                            avatarType="builtin"
                            builtinAvatarId={winner.winnerAvatar as any}
                            fullName={winner.winnerName}
                            size="md"
                          />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-neutral-400">
                              {winner.prizeTitle}
                            </span>
                            <p className="text-sm font-bold text-neutral-900 dark:text-white">{winner.winnerName}</p>
                            <p className="text-[11px] text-neutral-500">{winner.country} • {winner.score} pts</p>
                          </div>
                        </div>
                        <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                          ${winner.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: APPEAL & FAIR PLAY SUPPORT */}
        {activeTab === 'appeal' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Challenge Support & Appeals
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                If you believe points were miscalculated, or wish to dispute an editorial review or flag, submit a verified appeal.
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
              {appealSuccess ? (
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-neutral-900 dark:text-white">Appeal Submitted</h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Our compliance editorial team will review your case against task logs and timestamps within 24 hours.
                  </p>
                  <button
                    onClick={() => setAppealSuccess(false)}
                    className="px-4 py-2 text-xs font-semibold text-orange-600 hover:underline cursor-pointer"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAppealSubmit} className="space-y-4">
                  {appealError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{appealError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Appeal Type
                    </label>
                    <select
                      value={appealType}
                      onChange={(e) => setAppealType(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="point_dispute">Point Calculation Dispute</option>
                      <option value="score_correction">Missing Submission Points</option>
                      <option value="disqualification">Disqualification / Flag Appeal</option>
                      <option value="other">General Fair Play Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Detailed Reason / Statement
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={appealReason}
                      onChange={(e) => setAppealReason(e.target.value)}
                      placeholder="Explain the specific task ID, points expected, or clarification..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Evidence URL or Task Reference (Optional)
                    </label>
                    <input
                      type="text"
                      value={appealEvidence}
                      onChange={(e) => setAppealEvidence(e.target.value)}
                      placeholder="e.g. Task #job-42, Drive link, or timestamp"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={appealSubmitting}
                    className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{appealSubmitting ? 'Submitting Appeal...' : 'Submit Appeal to Editorial Team'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {challenge && (
        <ChallengeRegisterModal
          isOpen={registerModalOpen}
          onClose={() => setRegisterModalOpen(false)}
          challenge={challenge}
          user={user}
          remainingSlots={stats.remainingSlots}
          onSuccess={() => {
            fetchChallengeData();
          }}
          onOpenLogin={onOpenLogin}
        />
      )}
    </div>
  );
};
