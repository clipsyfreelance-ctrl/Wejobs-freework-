import React, { useState } from 'react';
import { Task, User } from '../types';
import {
  X,
  Clock,
  DollarSign,
  Users,
  FileText,
  Star,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  Share2,
  Copy,
  Check,
  TrendingUp,
} from 'lucide-react';

interface TaskDetailPageProps {
  task: Task | null;
  user: User | null;
  onClose: () => void;
  onClaimTask: (taskId: string) => Promise<boolean>;
  onOpenLogin: () => void;
}

export const TaskDetailPage: React.FC<TaskDetailPageProps> = ({
  task,
  user,
  onClose,
  onClaimTask,
  onOpenLogin,
}) => {
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!task) return null;

  const isFull = task.remainingSlots <= 0 || task.status === 'full';

  // Calculate approximate rate per 100 words
  const parsedWords = parseInt(task.wordCount.replace(/[^0-9]/g, ''), 10) || 500;
  const ratePer100Words = ((task.payment / parsedWords) * 100).toFixed(2);

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.origin + `?taskId=${task.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleClaim = async () => {
    if (!user) {
      onOpenLogin();
      return;
    }

    setClaiming(true);
    setClaimError(null);
    try {
      const success = await onClaimTask(task.id);
      if (success) {
        setClaimSuccess(true);
      }
    } catch (err: any) {
      setClaimError(err.message || 'Failed to claim task.');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div
      id="task-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 my-8 text-neutral-900 dark:text-white max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category & Payment Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
              {task.category}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
              {task.subtype}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyShare}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
              title="Copy task link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>

            <div className="text-right">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                ${task.payment.toFixed(2)} USD
              </span>
              <p className="text-[10px] text-neutral-400 font-medium">~${ratePer100Words} / 100 words</p>
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mt-4 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white leading-snug">
            {task.title}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {task.description}
          </p>
        </div>

        {/* Quick Spec Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800 text-xs">
          <div>
            <span className="text-neutral-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Time Estimate
            </span>
            <p className="font-bold text-neutral-900 dark:text-white mt-0.5">
              {task.estimatedTime}
            </p>
          </div>
          <div>
            <span className="text-neutral-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Word Count
            </span>
            <p className="font-bold text-neutral-900 dark:text-white mt-0.5">{task.wordCount}</p>
          </div>
          <div>
            <span className="text-neutral-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Deadline Window
            </span>
            <p className="font-bold text-neutral-900 dark:text-white mt-0.5">
              {task.deadlineHours} Hours
            </p>
          </div>
          <div>
            <span className="text-neutral-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Slot Availability
            </span>
            <p
              className={`font-bold mt-0.5 ${
                isFull ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isFull ? 'FULL (0 Slots)' : `${task.remainingSlots} / ${task.totalSlots} Slots`}
            </p>
          </div>
        </div>

        {/* Client Trust Card (Client Name & Rating - No Private Info) */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-orange-50/40 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-800/40 mb-6 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-500 text-white">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                <span>{task.clientName}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-semibold">
                  Escrow Verified
                </span>
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-[11px] mt-0.5">
                {task.clientJobsPosted} commissions posted on WEJOBS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 font-bold text-amber-500">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{task.clientRating.toFixed(1)}</span>
          </div>
        </div>

        {/* Deep Specifications: Objectives, Target Audience, Instructions, Structure, Acceptance, Restrictions */}
        <div className="space-y-5 text-xs text-neutral-700 dark:text-neutral-300">
          <div>
            <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
              Project Objective
            </h4>
            <p className="leading-relaxed">{task.objective}</p>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
              Target Audience
            </h4>
            <p className="leading-relaxed">{task.targetAudience}</p>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] mb-1.5">
              Step-by-Step Instructions
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-neutral-600 dark:text-neutral-300">
              {task.instructions.map((inst, i) => (
                <li key={i}>{inst}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] mb-1.5">
              Recommended Document Structure
            </h4>
            <div className="space-y-1 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 font-mono text-[11px]">
              {task.structure.map((struct, i) => (
                <p key={i}>{struct}</p>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                Writing Style & Tone
              </h4>
              <p>{task.writingStyle}</p>
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                Submission Format
              </h4>
              <p className="font-semibold text-neutral-900 dark:text-white">{task.submissionFormat}</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] mb-1.5">
              Strict Restrictions & Anti-Fraud
            </h4>
            <ul className="space-y-1 list-disc list-inside text-rose-600 dark:text-rose-400">
              {task.restrictions.map((res, i) => (
                <li key={i}>{res}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] mb-1.5">
              Acceptance & Revision Policy
            </h4>
            <p className="leading-relaxed">{task.revisionPolicy}</p>
          </div>
        </div>

        {/* Claim Error or Success Notice */}
        {claimError && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{claimError}</span>
          </div>
        )}

        {claimSuccess && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>
                Task claimed successfully! Slot has been reserved. You can find it in your My Tasks panel.
              </span>
            </div>
          </div>
        )}

        {/* Action Button Footer */}
        <div className="mt-8 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center sm:text-left">
            <span>Atomic slot reservation ensures fair allocation without race conditions.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Close
            </button>

            {!claimSuccess && (
              <button
                type="button"
                disabled={isFull || claiming}
                onClick={handleClaim}
                className={`w-full sm:w-auto px-8 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isFull
                    ? 'bg-neutral-300 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25'
                }`}
              >
                {claiming ? (
                  <span>Reserving Slot...</span>
                ) : isFull ? (
                  <span>Task Full</span>
                ) : user ? (
                  <span>Take Job & Claim Slot (${task.payment.toFixed(2)} USD)</span>
                ) : (
                  <span>Sign In to Take Job</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
