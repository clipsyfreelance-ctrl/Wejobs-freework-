import React from 'react';
import { User, TaskAssignment, Notification, Transaction } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
import {
  DollarSign,
  Clock,
  CheckCircle2,
  FileText,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Briefcase,
  Wallet,
  Settings,
  Bell,
  ShieldCheck,
  ChevronRight,
  Trophy,
} from 'lucide-react';

interface UserDashboardProps {
  user: User;
  assignments?: TaskAssignment[];
  notifications?: Notification[];
  transactions?: Transaction[];
  onNavigate: (route: string) => void;
  onOpenWithdrawModal?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  assignments = [],
  notifications = [],
  transactions = [],
  onNavigate,
  onOpenWithdrawModal,
}) => {
  const safeAssignments = assignments || [];
  const safeNotifications = notifications || [];

  const activeAssignments = safeAssignments.filter((a) =>
    ['in_progress', 'awaiting_submission', 'revision_required'].includes(a.status)
  );

  const underReviewAssignments = safeAssignments.filter((a) => a.status === 'under_review');
  const completedAssignments = safeAssignments.filter(
    (a) => a.status === 'completed' || a.status === 'accepted'
  );

  const unreadNotifications = safeNotifications.filter((n) => !n.isRead && !n.read);
  const availableBal = user.availableBalance ?? user.balance ?? 0;
  const pendingBal = user.pendingBalance ?? 0;

  return (
    <div id="user-dashboard" className="py-8 sm:py-12 bg-[#fbfaf8] dark:bg-[#141312] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1c1b19] border border-[#e8e6e1] dark:border-[#2b2926] shadow-xs">
          <div className="flex items-center gap-4">
            <AvatarDisplay user={user} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-display-serif text-neutral-900 dark:text-white">
                  Welcome back, {user.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 uppercase border border-orange-200 dark:border-orange-800/60">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {user.email} • Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('/tasks')}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Browse Open Tasks
            </button>
            <button
              onClick={() => onNavigate('/profile')}
              className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
              title="Profile & Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Available Balance */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 text-white border border-neutral-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-sans">
                Available Balance
              </span>
              <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-400">
                ${availableBal.toFixed(2)}{' '}
                <span className="text-xs font-semibold text-neutral-400">USD</span>
              </p>
              <p className="text-[11px] text-neutral-400 mt-1">
                Settled rewards ready for withdrawal
              </p>
            </div>
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
              <span
                className={`font-semibold ${
                  availableBal >= 100 ? 'text-emerald-400' : 'text-neutral-400'
                }`}
              >
                {availableBal >= 100
                  ? 'Eligible to Withdraw'
                  : `$${(100 - availableBal).toFixed(2)} to $100 min.`}
              </span>
              <button
                onClick={() => onNavigate('/balance')}
                className="text-orange-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                Withdraw <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 2: Pending Balance */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1c1b19] border border-[#e8e6e1] dark:border-[#2b2926] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-sans">
                Pending Balance
              </span>
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white">
                ${pendingBal.toFixed(2)}{' '}
                <span className="text-xs font-semibold text-neutral-400">USD</span>
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">
                Locked in escrow pending editorial review
              </p>
            </div>
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
              <span>{underReviewAssignments.length} submissions in review</span>
              <button
                onClick={() => onNavigate('/my-tasks')}
                className="text-orange-600 dark:text-orange-400 font-bold hover:underline cursor-pointer"
              >
                View Status
              </button>
            </div>
          </div>

          {/* Card 3: Total Completed */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1c1b19] border border-[#e8e6e1] dark:border-[#2b2926] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-sans">
                Total Earned Lifetime
              </span>
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white">
                ${(availableBal + 35.0).toFixed(2)}{' '}
                <span className="text-xs font-semibold text-neutral-400">USD</span>
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">
                {completedAssignments.length} completed tasks paid
              </p>
            </div>
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Escrow Guaranteed
              </span>
              <button
                onClick={() => onNavigate('/balance')}
                className="text-orange-600 dark:text-orange-400 font-bold hover:underline cursor-pointer"
              >
                Ledger
              </button>
            </div>
          </div>
        </div>

        {/* Active Tasks In Progress & Notifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Tasks List (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-500" />
                <span>Active Writing Assignments ({activeAssignments.length})</span>
              </h2>
              <button
                onClick={() => onNavigate('/my-tasks')}
                className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
              >
                View All Submissions
              </button>
            </div>

            {activeAssignments.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <FileText className="w-10 h-10 text-neutral-400 mx-auto" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  No active tasks in progress
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Browse the catalog to claim an open writing assignment and start earning.
                </p>
                <button
                  onClick={() => onNavigate('/tasks')}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-orange-500 text-white cursor-pointer"
                >
                  Find Open Writing Tasks
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeAssignments.map((a) => (
                  <div
                    key={a.id}
                    className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                          {a.category}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-600">
                          ${a.payment.toFixed(2)} USD
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                        {a.taskTitle}
                      </h4>
                      <p className="text-xs text-neutral-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" /> Deadline:{' '}
                        {new Date(a.deadlineAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigate('/my-tasks')}
                      className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {a.status === 'revision_required' ? 'Submit Revision' : 'Submit Deliverable'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications & Challenge Panel (Col 3) */}
          <div className="space-y-6">
            {/* Monthly Challenge Promo Widget */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 text-white border border-neutral-800 shadow-md space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-orange-500/20 text-orange-400 border border-orange-500/40">
                  <Trophy className="w-3 h-3 text-yellow-400" />
                  Monthly Challenge
                </span>
                <span className="text-[10px] font-bold text-emerald-400">327 / 500 Slots</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">September 2026 Challenge</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Grand Prize: <strong className="text-amber-300">$1,000.00 USD (1st)</strong></p>
              </div>
              <button
                onClick={() => onNavigate('/challenge')}
                className="w-full py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Lihat Leaderboard & Ikuti</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-500" />
                <span>Notifications</span>
              </h2>
              {unreadNotifications.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                  {unreadNotifications.length} new
                </span>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
              {notifications.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-4">
                  No notifications yet.
                </p>
              ) : (
                notifications.slice(0, 5).map((n) => {
                  const isUnread = !n.isRead && !n.read;
                  return (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl text-xs space-y-1 ${
                        isUnread
                          ? 'bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-800/40'
                          : 'bg-neutral-50 dark:bg-neutral-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-1">
                          {n.title}
                          {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {new Date(n.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-[11px]">
                        {n.message}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
