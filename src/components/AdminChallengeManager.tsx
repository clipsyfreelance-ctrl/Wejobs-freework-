import React, { useState, useEffect } from 'react';
import { API_BASE } from '../apiConfig';
import {
  User,
  Challenge,
  ChallengeParticipant,
  ChallengeReward,
  ChallengeAppeal,
  ParticipantStatus,
  RankingStatus,
} from '../types';
import {
  Trophy,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  Users,
  Search,
  Filter,
  Plus,
  Minus,
  Edit2,
  Lock,
  Unlock,
  Check,
  X,
  Send,
  Zap,
  Award,
} from 'lucide-react';
import { AvatarDisplay } from './AvatarDisplay';

interface AdminChallengeManagerProps {
  currentUser: User;
}

export const AdminChallengeManager: React.FC<AdminChallengeManagerProps> = ({
  currentUser,
}) => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<ChallengeParticipant[]>([]);
  const [rewards, setRewards] = useState<ChallengeReward[]>([]);
  const [appeals, setAppeals] = useState<ChallengeAppeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState<'roster' | 'rewards' | 'appeals' | 'settings'>('roster');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'flagged' | 'disqualified' | 'clean'>('all');

  // Action Modals
  const [selectedParticipant, setSelectedParticipant] = useState<ChallengeParticipant | null>(null);
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [flagStatus, setFlagStatus] = useState<ParticipantStatus>('flagged');
  const [fraudStatus, setFraudStatus] = useState<'clean' | 'suspicious' | 'confirmed_fraud'>('suspicious');
  const [flagReason, setFlagReason] = useState('');

  const [pointsModalOpen, setPointsModalOpen] = useState(false);
  const [pointsAmount, setPointsAmount] = useState<number>(10);
  const [pointsReason, setPointsReason] = useState('');

  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchChallengeData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/challenges/active`);
      const data = await res.json();
      if (data.success && data.challenge) {
        setChallenge(data.challenge);
        setStats(data.stats);

        // Fetch leaderboard
        const lbRes = await fetch(`${API_BASE}/api/challenges/${data.challenge.slug}/leaderboard`);
        const lbData = await lbRes.json();
        if (lbData.success) {
          setLeaderboard(lbData.leaderboard || []);
        }
      }

      // Fetch admin rewards
      const rewRes = await fetch(`${API_BASE}/api/admin/challenges/rewards`, {
        headers: { Authorization: `Bearer ${currentUser.id}` },
      });
      const rewData = await rewRes.json();
      if (rewData.success) {
        setRewards(rewData.rewards || []);
      }

      // Fetch admin appeals
      const appRes = await fetch(`${API_BASE}/api/admin/challenges/appeals`, {
        headers: { Authorization: `Bearer ${currentUser.id}` },
      });
      const appData = await appRes.json();
      if (appData.success) {
        setAppeals(appData.appeals || []);
      }
    } catch (err) {
      console.error('Failed to load admin challenge data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallengeData();
  }, [currentUser]);

  const handleUpdateStatus = async (newStatus: 'active' | 'ended' | 'verifying' | 'completed') => {
    if (!challenge) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/challenges/${challenge.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.id}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMessage({ type: 'success', text: `Challenge status set to ${newStatus.toUpperCase()}` });
        fetchChallengeData();
      }
    } catch {
      setFeedbackMessage({ type: 'error', text: 'Failed to update challenge status.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleFlagParticipant = async () => {
    if (!challenge || !selectedParticipant) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/challenges/${challenge.id}/flag-participant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.id}`,
        },
        body: JSON.stringify({
          participantId: selectedParticipant.id,
          status: flagStatus,
          fraudStatus,
          reason: flagReason || 'Manual compliance review action.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMessage({ type: 'success', text: `Participant ${selectedParticipant.displayName} updated.` });
        setFlagModalOpen(false);
        fetchChallengeData();
      }
    } catch {
      setFeedbackMessage({ type: 'error', text: 'Failed to flag participant.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdjustPoints = async () => {
    if (!challenge || !selectedParticipant) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/challenges/${challenge.id}/adjust-points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.id}`,
        },
        body: JSON.stringify({
          participantId: selectedParticipant.id,
          amount: pointsAmount,
          reason: pointsReason || 'Administrative point correction.',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMessage({ type: 'success', text: `Adjusted points by ${pointsAmount > 0 ? `+${pointsAmount}` : pointsAmount} for ${selectedParticipant.displayName}.` });
        setPointsModalOpen(false);
        fetchChallengeData();
      }
    } catch {
      setFeedbackMessage({ type: 'error', text: 'Failed to adjust points.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveWinners = async () => {
    if (!challenge) return;
    if (!window.confirm('Are you sure you want to approve winners? This freezes the provisional rankings, sets rankingStatus to FINAL, and generates reward payout ledger records.')) {
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/challenges/${challenge.id}/approve-winners`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${currentUser.id}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMessage({ type: 'success', text: 'Winners finalized! 6 Reward disbursement entries generated.' });
        fetchChallengeData();
      }
    } catch {
      setFeedbackMessage({ type: 'error', text: 'Failed to approve winners.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handlePayReward = async (rewardId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/challenges/rewards/${rewardId}/pay`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${currentUser.id}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMessage({ type: 'success', text: 'Prize funds credited directly into winner Available Balance ledger!' });
        fetchChallengeData();
      }
    } catch {
      setFeedbackMessage({ type: 'error', text: 'Failed to pay reward.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveAppeal = async (appealId: string, status: 'accepted' | 'rejected') => {
    const adminNote = prompt(`Enter resolution justification for this appeal (${status.toUpperCase()}):`, status === 'accepted' ? 'Points restored after editorial validation.' : 'Appeal rejected based on submission logs.');
    if (!adminNote) return;

    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/challenges/appeals/${appealId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.id}`,
        },
        body: JSON.stringify({
          status,
          adminNote,
          restorePoints: status === 'accepted' ? 20 : 0,
          restoreStatus: status === 'accepted' ? 'active' : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackMessage({ type: 'success', text: `Appeal ${status.toUpperCase()} resolved.` });
        fetchChallengeData();
      }
    } catch {
      setFeedbackMessage({ type: 'error', text: 'Failed to resolve appeal.' });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredParticipants = (leaderboard || []).filter((p) => {
    const matchesSearch =
      (p.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.country || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.id || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'flagged') return p.participantStatus === 'flagged' || p.fraudStatus === 'suspicious';
    if (statusFilter === 'disqualified') return p.participantStatus === 'disqualified' || p.fraudStatus === 'confirmed_fraud';
    if (statusFilter === 'clean') return p.participantStatus === 'active' && p.fraudStatus === 'clean';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Stats & Controls */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-white space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-neutral-950 flex items-center justify-center font-black text-2xl shadow-lg">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">{challenge?.title || 'WEJOBS Monthly Challenge'}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                  challenge?.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-neutral-800 text-neutral-300'
                }`}>
                  {challenge?.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-800 text-neutral-400">
                  Ranking: {challenge?.rankingStatus.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Slug: <code className="text-orange-400">{challenge?.slug}</code> • Grand Prize: <strong className="text-amber-300">$1,000 USD (1st)</strong> • Total: $1,750 USD
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleApproveWinners}
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-neutral-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Award className="w-4 h-4" />
              <span>Finalize Winners & Generate Payouts</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-neutral-850 p-4 rounded-2xl border border-neutral-800">
            <span className="text-xs text-neutral-400 block font-medium">Registered Participants</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">{stats?.registeredCount || leaderboard.length}</span>
              <span className="text-xs text-neutral-400">/ {challenge?.maxParticipants || 500} Slots</span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-orange-500 h-full" style={{ width: `${stats?.percentageFilled || 65.4}%` }} />
            </div>
          </div>

          <div className="bg-neutral-850 p-4 rounded-2xl border border-neutral-800">
            <span className="text-xs text-neutral-400 block font-medium">Remaining Slots</span>
            <span className="text-2xl font-black text-emerald-400 block mt-1">
              {stats?.remainingSlots || 173} Slots
            </span>
            <span className="text-[11px] text-neutral-500">Atomic database protection</span>
          </div>

          <div className="bg-neutral-850 p-4 rounded-2xl border border-neutral-800">
            <span className="text-xs text-neutral-400 block font-medium">Pending Rewards</span>
            <span className="text-2xl font-black text-amber-400 block mt-1">
              {rewards.filter((r) => r.status === 'pending').length} Pending
            </span>
            <span className="text-[11px] text-neutral-500">{rewards.filter((r) => r.status === 'paid').length} Paid</span>
          </div>

          <div className="bg-neutral-850 p-4 rounded-2xl border border-neutral-800">
            <span className="text-xs text-neutral-400 block font-medium">Open Appeals</span>
            <span className="text-2xl font-black text-rose-400 block mt-1">
              {appeals.filter((a) => a.status === 'pending').length} Open
            </span>
            <span className="text-[11px] text-neutral-500">Editorial dispute tickets</span>
          </div>
        </div>

        {/* State Transition Controls */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          <span className="text-neutral-400 font-semibold mr-2">Set Competition State:</span>
          {(['active', 'ended', 'verifying', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => handleUpdateStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-colors cursor-pointer ${
                challenge?.status === st
                  ? 'bg-orange-500 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {feedbackMessage && (
        <div className={`p-4 rounded-2xl text-xs flex items-center justify-between ${
          feedbackMessage.type === 'success'
            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
            : 'bg-rose-950/60 text-rose-300 border border-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{feedbackMessage.text}</span>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="text-xs opacity-60 hover:opacity-100">Dismiss</button>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setSubTab('roster')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            subTab === 'roster' ? 'bg-neutral-800 text-orange-400' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Participants Roster ({leaderboard.length})
        </button>
        <button
          onClick={() => setSubTab('rewards')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            subTab === 'rewards' ? 'bg-neutral-800 text-orange-400' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Rewards & Payout Ledger ({rewards.length})
        </button>
        <button
          onClick={() => setSubTab('appeals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            subTab === 'appeals' ? 'bg-neutral-800 text-orange-400' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Appeals Desk ({appeals.length})
        </button>
      </div>

      {/* SUBTAB 1: ROSTER & LEADERBOARD CONTROLS */}
      {subTab === 'roster' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search participant ID, name, country..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-neutral-800 border border-neutral-700 text-white outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl text-xs bg-neutral-800 border border-neutral-700 text-white outline-none"
              >
                <option value="all">All Statuses ({leaderboard.length})</option>
                <option value="clean">Clean / Active</option>
                <option value="flagged">Flagged / Suspicious</option>
                <option value="disqualified">Disqualified</option>
              </select>
            </div>
          </div>

          {/* Participants Table */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-800 text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-700">
                  <tr>
                    <th className="px-4 py-3 text-center">Rank</th>
                    <th className="px-4 py-3">Participant</th>
                    <th className="px-4 py-3">Email & ID</th>
                    <th className="px-4 py-3 text-center">Score</th>
                    <th className="px-4 py-3 text-center">Tasks</th>
                    <th className="px-4 py-3 text-center">Rating</th>
                    <th className="px-4 py-3 text-center">Fraud Status</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-200">
                  {filteredParticipants.slice(0, 50).map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-850 transition-colors">
                      <td className="px-4 py-3 text-center font-bold">
                        {p.rank === 1 ? '🥇 #1' : p.rank === 2 ? '🥈 #2' : p.rank === 3 ? '🥉 #3' : `#${p.rank}`}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <AvatarDisplay
                            avatarType={p.avatarType}
                            builtinAvatarId={p.builtinAvatarId}
                            avatarId={p.avatarId}
                            fullName={p.displayName}
                            size="sm"
                          />
                          <div>
                            <span className="font-bold text-white block">{p.displayName}</span>
                            <span className="text-[11px] text-neutral-400">{p.country}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-orange-400 text-[11px] block">{p.id}</span>
                        <span className="text-[11px] text-neutral-400">{p.userEmail}</span>
                      </td>
                      <td className="px-4 py-3 text-center font-black text-amber-400">
                        {p.score} pts
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">{p.completedTasksCount}</td>
                      <td className="px-4 py-3 text-center font-semibold text-yellow-400">{p.averageRating.toFixed(2)}★</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.participantStatus === 'disqualified'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : p.participantStatus === 'flagged' || p.fraudStatus === 'suspicious'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}>
                          {p.participantStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedParticipant(p);
                              setPointsAmount(10);
                              setPointsReason('');
                              setPointsModalOpen(true);
                            }}
                            title="Adjust Points"
                            className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-amber-300 cursor-pointer"
                          >
                            +/- Pts
                          </button>
                          <button
                            onClick={() => {
                              setSelectedParticipant(p);
                              setFlagStatus(p.participantStatus);
                              setFraudStatus(p.fraudStatus);
                              setFlagReason('');
                              setFlagModalOpen(true);
                            }}
                            title="Flag / Disqualify"
                            className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-rose-300 cursor-pointer"
                          >
                            Flag
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: REWARDS & PAYOUT LEDGER */}
      {subTab === 'rewards' && (
        <div className="space-y-4">
          <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-white">Prize Disbursement Ledger</h4>
                <p className="text-xs text-neutral-400">
                  Approved prizes are atomically credited directly into the winner's Available Balance in the database.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-neutral-800 px-3 py-1.5 rounded-xl">
                Total Allocated: $1,750.00 USD
              </span>
            </div>

            {rewards.length === 0 ? (
              <div className="py-12 text-center text-neutral-400 text-xs space-y-2">
                <Trophy className="w-8 h-8 text-neutral-600 mx-auto" />
                <p>No rewards generated yet. Click "Finalize Winners & Generate Payouts" when monthly review completes.</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-800">
                {rewards.map((rew) => (
                  <div key={rew.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{rew.category}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          rew.status === 'paid' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                        }`}>
                          {rew.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Winner: <strong className="text-neutral-200">{rew.userFullName}</strong> ({rew.userEmail})
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-lg font-black text-emerald-400">
                        ${rew.amount.toFixed(2)} USD
                      </span>
                      {rew.status === 'pending' ? (
                        <button
                          onClick={() => handlePayReward(rew.id)}
                          disabled={actionLoading}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                        >
                          Disburse Payout
                        </button>
                      ) : (
                        <span className="text-xs text-neutral-500 font-mono">
                          Paid: {rew.transactionId}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: APPEALS DESK */}
      {subTab === 'appeals' && (
        <div className="space-y-4">
          <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-4">
            <h4 className="text-base font-bold text-white">Contestant Appeals & Point Inquiries</h4>

            {appeals.length === 0 ? (
              <div className="py-12 text-center text-neutral-400 text-xs">
                No active appeals submitted.
              </div>
            ) : (
              <div className="space-y-4">
                {appeals.map((app) => (
                  <div key={app.id} className="p-4 rounded-xl bg-neutral-850 border border-neutral-750 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{app.userFullName}</span>
                        <span className="text-neutral-400 text-[11px]">({app.userEmail})</span>
                        <span className="px-2 py-0.5 rounded bg-neutral-700 text-neutral-300 text-[10px] font-bold uppercase">
                          {app.type}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        app.status === 'accepted' ? 'bg-emerald-950 text-emerald-300' : app.status === 'rejected' ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 bg-neutral-900 p-3 rounded-lg border border-neutral-800">
                      "{app.reason}"
                    </p>

                    {app.evidence && (
                      <p className="text-[11px] text-neutral-400">
                        Evidence Reference: <code className="text-orange-400">{app.evidence}</code>
                      </p>
                    )}

                    {app.status === 'pending' && (
                      <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
                        <button
                          onClick={() => handleResolveAppeal(app.id, 'accepted')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                        >
                          Approve Appeal (+20 pts)
                        </button>
                        <button
                          onClick={() => handleResolveAppeal(app.id, 'rejected')}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
                        >
                          Reject Appeal
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Flag / Disqualify Modal */}
      {flagModalOpen && selectedParticipant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-white space-y-4">
            <h3 className="text-base font-bold">Update Participant Status</h3>
            <p className="text-xs text-neutral-400">
              Contender: <strong className="text-white">{selectedParticipant.displayName}</strong> ({selectedParticipant.id})
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Participant Status</label>
                <select
                  value={flagStatus}
                  onChange={(e) => setFlagStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                >
                  <option value="active">Active (Standard)</option>
                  <option value="flagged">Flagged (Under Review)</option>
                  <option value="disqualified">Disqualified (Removed from Leaderboard)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Fraud Detection Tier</label>
                <select
                  value={fraudStatus}
                  onChange={(e) => setFraudStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                >
                  <option value="clean">Clean (No infractions)</option>
                  <option value="suspicious">Suspicious Pattern</option>
                  <option value="confirmed_fraud">Confirmed Fraud / Multiple Accounts</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Reason / Note to Participant</label>
                <textarea
                  rows={3}
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  placeholder="State the reason for this action..."
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setFlagModalOpen(false)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:bg-neutral-800 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleFlagParticipant}
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Points Modal */}
      {pointsModalOpen && selectedParticipant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-white space-y-4">
            <h3 className="text-base font-bold">Manual Point Adjustment</h3>
            <p className="text-xs text-neutral-400">
              Contender: <strong className="text-white">{selectedParticipant.displayName}</strong> • Current: <strong className="text-amber-400">{selectedParticipant.score} pts</strong>
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Point Delta (+ or -)</label>
                <input
                  type="number"
                  value={pointsAmount}
                  onChange={(e) => setPointsAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Reason for Adjustment</label>
                <textarea
                  rows={3}
                  required
                  value={pointsReason}
                  onChange={(e) => setPointsReason(e.target.value)}
                  placeholder="e.g. Compensation for verified review error or contest bonus"
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPointsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:bg-neutral-800 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustPoints}
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs cursor-pointer"
              >
                Apply Point Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
