import React, { useState } from 'react';
import { ShieldCheck, Lock, DollarSign, Scale, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface LegalPageProps {
  initialTab?: 'terms' | 'privacy' | 'rules' | 'withdrawal_policy';
  onNavigate: (route: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({
  initialTab = 'terms',
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'rules' | 'withdrawal_policy'>(
    initialTab
  );

  return (
    <div id="legal-page" className="py-12 sm:py-16 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
            Trust, Legal & Compliance
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            Binding editorial terms, anti-fraud regulations, and monetary payout standards.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
          {[
            { key: 'terms', label: 'Terms of Service', icon: <Scale className="w-4 h-4" /> },
            { key: 'privacy', label: 'Privacy Policy', icon: <Lock className="w-4 h-4" /> },
            { key: 'rules', label: 'Anti-Plagiarism Rules', icon: <FileText className="w-4 h-4" /> },
            { key: 'withdrawal_policy', label: '$100.00 Min Withdrawal Policy', icon: <DollarSign className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Container */}
        <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm text-xs sm:text-sm text-neutral-750 dark:text-neutral-300 space-y-6 leading-relaxed">
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                WEJOBS Terms of Service (Last Updated: 2026)
              </h2>
              <p>
                Welcome to WEJOBS. By accessing or registering an account on our platform, you agree
                to be bound by these Terms of Service. WEJOBS operates as a specialized micro-job
                escrow marketplace facilitating fixed-price writing commissions.
              </p>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">1. Freelancer Eligibility & Identity</h3>
              <p>
                Writers must provide accurate, verified information during registration. Accounts are
                non-transferable. Only one account per legal human individual is permitted.
              </p>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">2. Atomic Task Allocation & Limits</h3>
              <p>
                Each writing task possesses finite slot capacity. When a user clicks "Take Job", a slot
                is atomically reserved. Freelancers may hold a maximum of 5 active tasks simultaneously.
              </p>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">3. Editorial Review & Acceptance</h3>
              <p>
                Submitted deliverables are evaluated against stated word counts, formatting briefs,
                and originality standards. Editorial decisions (Accept, Revision Required, Reject) are
                final once recorded.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Privacy Policy & Data Protection
              </h2>
              <p>
                Your privacy is paramount. WEJOBS adheres strictly to modern digital data protection
                principles and industry-standard Argon2id cryptographic password hashing.
              </p>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">1. Information We Collect</h3>
              <p>
                We collect your name, email, phone, residential address, and beneficiary payout details
                solely for authentication, tax compliance, and monetary disbursements.
              </p>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">2. Confidentiality of Deliverables</h3>
              <p>
                Uploaded writing drafts and research files are strictly private between the writer and
                the commissioning publisher. We do not sell or index your original writings.
              </p>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Anti-Plagiarism & Human Craftsmanship Standards
              </h2>
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" /> Zero Tolerance on Plagiarism
                </span>
                <p className="text-xs">
                  All submissions are checked against automated similarity databases and citation
                  cross-references.
                </p>
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">1. Originality Requirement</h3>
              <p>
                Every deliverable must be 100% original work created by the registered freelancer. Copying
                content from existing web pages, books, or fellow freelancers without citation is grounds
                for immediate account termination and escrow forfeiture.
              </p>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">2. AI Assistance Transparency</h3>
              <p>
                Unedited raw generative text dumps violate our editorial standards. Writers must craft
                thoughtful, verified prose adhering to factual research citations.
              </p>
            </div>
          )}

          {activeTab === 'withdrawal_policy' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                Monetary Settlement & $100.00 USD Minimum Withdrawal Policy
              </h2>
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Guaranteed USD Settlement
                </span>
                <p className="text-xs">
                  Platform takes 0% commission deductions from writer task rewards.
                </p>
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">1. The $100.00 Minimum Threshold</h3>
              <p>
                To maintain efficient international banking pipelines and reduce small-transaction
                overhead, withdrawal requests require a minimum Available Balance of $100.00 USD.
              </p>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">2. Processing Timeframes</h3>
              <p>
                Withdrawals via Bank Wire, PayPal, Wise, and USDT are processed by accounting within
                24–48 business hours after manual recipient verification.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
