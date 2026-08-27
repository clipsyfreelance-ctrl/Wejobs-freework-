import React, { useState } from 'react';
import { API_BASE } from '../apiConfig';
import { User, Challenge } from '../types';
import {
  Trophy,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Users,
  Check,
} from 'lucide-react';
import { AvatarDisplay } from './AvatarDisplay';

interface ChallengeRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: Challenge;
  user: User | null;
  remainingSlots: number;
  onSuccess: () => void;
  onOpenLogin: () => void;
}

export const ChallengeRegisterModal: React.FC<ChallengeRegisterModalProps> = ({
  isOpen,
  onClose,
  challenge,
  user,
  remainingSlots,
  onSuccess,
  onOpenLogin,
}) => {
  const [displayName, setDisplayName] = useState(user?.fullName || '');
  const [country, setCountry] = useState(
    user?.address?.split(',').pop()?.trim() || 'Indonesia'
  );
  const [agreeRules, setAgreeRules] = useState(false);
  const [agreeFraud, setAgreeFraud] = useState(false);
  const [agreeKYC, setAgreeKYC] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenLogin();
      return;
    }

    if (!agreeRules || !agreeFraud || !agreeKYC) {
      setError('Please accept all 3 Fair Play and Challenge agreements to proceed.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/challenges/${challenge.slug}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.id}`,
        },
        body: JSON.stringify({
          displayName,
          country,
          agreedRules: agreeRules,
          agreedFraudPolicy: agreeFraud,
          agreedLeaderboardReview: agreeKYC,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to register for challenge.');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Trophy className="w-5 h-5 text-yellow-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold">WEJOBS Monthly Challenge</h3>
              <p className="text-xs text-orange-100 font-medium">Free Registration • $1,000 1st Prize</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {!user ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                  Sign In to Join the Challenge
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                  You must be logged in to claim your challenge slot and track points on the live leaderboard.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold shadow-md transition-all cursor-pointer"
              >
                Log In or Create Account
              </button>
            </div>
          ) : (
            <>
              {/* User Avatar & Slot Info */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40">
                <div className="flex items-center gap-3">
                  <AvatarDisplay
                    avatarType={user.avatarType}
                    builtinAvatarId={user.builtinAvatarId}
                    avatarId={user.avatarId}
                    fullName={user.fullName}
                    size="md"
                  />
                  <div>
                    <p className="text-xs font-semibold text-orange-900 dark:text-orange-300">Registered Contributor</p>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">{user.fullName}</p>
                    <p className="text-xs text-neutral-500">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3" />
                    {remainingSlots} Slots Left
                  </span>
                  <p className="text-[11px] text-neutral-500 mt-1">Free Entry</p>
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Leaderboard Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Your Public Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Country / Region
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="e.g. Indonesia, United States"
                  />
                </div>
              </div>

              {/* Fair Play Checkboxes */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                  Fair Play & Competition Agreement
                </p>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={agreeRules}
                    onChange={(e) => setAgreeRules(e.target.checked)}
                    className="mt-0.5 rounded text-orange-600 focus:ring-orange-500 h-4 w-4"
                  />
                  <span className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    I agree to the <strong>WEJOBS Monthly Challenge rules</strong>, task category points, scoring bonuses, and monthly competition deadlines.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={agreeFraud}
                    onChange={(e) => setAgreeFraud(e.target.checked)}
                    className="mt-0.5 rounded text-orange-600 focus:ring-orange-500 h-4 w-4"
                  />
                  <span className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    <strong>Strict Anti-Fraud Guarantee:</strong> All my task submissions will be 100% human-crafted without prohibited automated AI content, fake accounts, or spam.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={agreeKYC}
                    onChange={(e) => setAgreeKYC(e.target.checked)}
                    className="mt-0.5 rounded text-orange-600 focus:ring-orange-500 h-4 w-4"
                  />
                  <span className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    I acknowledge that final leaderboard rankings undergo editorial compliance verification before cash reward disbursement.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || remainingSlots <= 0}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-xl shadow-md shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all cursor-pointer"
                >
                  {submitting ? (
                    <span>Registering Slot...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Free Registration</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
