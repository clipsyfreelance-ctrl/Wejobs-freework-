export type UserRole = 'user' | 'admin' | 'super_admin';

export type BuiltInAvatarId =
  | 'rabbit'
  | 'fox'
  | 'panda'
  | 'squirrel'
  | 'cat'
  | 'bear'
  | 'penguin'
  | 'hamster'
  | 'lion'
  | 'koala'
  | 'owl'
  | 'wolf'
  | 'deer'
  | 'tiger'
  | 'dolphin'
  | 'dragon'
  | 'cheetah'
  | 'eagle'
  | 'avatar-1'
  | 'avatar-2'
  | 'avatar-3'
  | 'avatar-4'
  | 'avatar-5'
  | 'avatar-6'
  | 'avatar-7'
  | string;

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  bio?: string;
  role: UserRole;
  avatarType: 'builtin' | 'custom';
  builtinAvatarId?: BuiltInAvatarId;
  avatarId?: string;
  customAvatarUrl?: string;
  emailVerified: boolean;
  payoutEligibilityStatus?: 'none' | 'pending' | 'eligible' | 'rejected';
  payoutEligibilityRequestedAt?: string;
  payoutEligibilityReviewedAt?: string;
  payoutEligibilityNote?: string;
  recipientStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  recipientDetails?: {
    method: 'bank' | 'paypal' | 'payoneer' | 'wise' | 'crypto';
    accountName: string;
    accountNumber: string;
    bankOrProviderName: string;
    notes?: string;
  };
  isRestricted?: boolean;
  restrictionReason?: string;
  createdAt: string;
  rating: number;
  reviewCount: number;
  completedJobsCount: number;
  availableBalance?: number;
  pendingBalance?: number;
  balance?: number;
}

export type MainCategory =
  | 'Writing'
  | 'Creative Writing'
  | 'Editing'
  | 'Research & Writing'
  | 'Translation'
  | 'Transcription'
  | 'Data Annotation';

export interface Task {
  id: string;
  title: string;
  slug: string;
  category: MainCategory;
  subtype: string;
  payment: number; // In USD
  estimatedTime: string; // e.g. "45 mins", "2 hours", "1.5 hours"
  wordCount: string; // e.g. "600 - 800 words"
  totalSlots: number; // e.g. 20, 35, 50, 74, 100, 150
  remainingSlots: number;
  deadlineHours: number; // hours to complete once accepted
  clientName: string;
  clientRating: number;
  clientJobsPosted: number;
  description: string;
  objective: string;
  targetAudience: string;
  instructions: string[];
  structure: string[];
  writingStyle: string;
  submissionFormat: string; // "DOCX, PDF, TXT"
  requirements: string[];
  restrictions: string[];
  acceptanceCriteria: string[];
  revisionPolicy: string;
  status: 'available' | 'full' | 'paused';
  featured?: boolean;
  createdAt: string;
}

export type AssignmentStatus =
  | 'in_progress'
  | 'awaiting_submission'
  | 'under_review'
  | 'revision_required'
  | 'accepted'
  | 'rejected'
  | 'completed'
  | 'expired'
  | 'cancelled';

export interface SubmissionVersion {
  versionNumber: number;
  fileName: string;
  fileSize: number;
  fileDataUrl?: string;
  note: string;
  referenceLink?: string;
  submittedAt: string;
  status: 'under_review' | 'revision_required' | 'accepted' | 'rejected';
  reviewFeedback?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  userId: string;
  userEmail: string;
  userFullName: string;
  taskTitle: string;
  category: MainCategory;
  subtype: string;
  payment: number;
  assignedAt: string;
  deadlineAt: string;
  status: AssignmentStatus;
  submissionVersions: SubmissionVersion[];
  currentVersion: number;
  rejectionReason?: string;
  revisionReason?: string;
  completedAt?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'task_earning' | 'withdrawal' | 'bonus' | 'adjustment';
  amount: number; // In USD
  description: string;
  referenceId?: string;
  status: 'completed' | 'pending' | 'reversed';
  createdAt: string;
  balanceAfter: number;
}

export interface UserBalance {
  available: number;
  pending: number;
  totalEarnings: number;
  totalWithdrawn: number;
}

export type PayoutEligibilityStatus = 'none' | 'pending' | 'eligible' | 'rejected';

export interface PayoutEligibilityRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userBalance: number;
  completedJobsCount: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminFeedback?: string;
}

export type PaymentChannelCode =
  | 'bsi'
  | 'bca'
  | 'bri'
  | 'dana'
  | 'ovo'
  | 'gopay'
  | 'us'
  | 'uk'
  | 'vn'
  | 'th'
  | 'my'
  | string;

export interface PaymentChannelConfig {
  id: number;
  name: string;
  code: PaymentChannelCode;
  status: 'active' | 'maintenance' | 'coming_soon';
  statusLabel: string;
  category: 'bank' | 'ewallet' | 'international';
  description: string;
  accountNumberLabel: string;
  accountHolderLabel: string;
  iconColor: string;
  logoUrl: string;
}

export const PAYMENT_CHANNELS: PaymentChannelConfig[] = [
  {
    id: 1,
    name: 'BSI Mobile',
    code: 'bsi',
    status: 'active',
    statusLabel: '✅ Aktif',
    category: 'bank',
    description: 'Bank Syariah Indonesia Mobile Banking & Transfer',
    accountNumberLabel: 'Nomor Rekening BSI (10 Digit)',
    accountHolderLabel: 'Nama Pemilik Rekening sesuai Buku Tabungan / BSI Mobile',
    iconColor: '#00A39D',
    logoUrl: 'https://i.ibb.co.com/N2nsWRF1/images.png',
  },
  {
    id: 2,
    name: 'myBCA',
    code: 'bca',
    status: 'active',
    statusLabel: '✅ Aktif',
    category: 'bank',
    description: 'BCA Mobile / myBCA Virtual & Real Account',
    accountNumberLabel: 'Nomor Rekening BCA (10 Digit)',
    accountHolderLabel: 'Nama Pemilik Rekening sesuai KTP / myBCA',
    iconColor: '#005EAD',
    logoUrl: 'https://i.ibb.co.com/BVx7N9tC/images.jpg',
  },
  {
    id: 3,
    name: 'BRImo',
    code: 'bri',
    status: 'active',
    statusLabel: '✅ Aktif',
    category: 'bank',
    description: 'Bank Rakyat Indonesia Digital Banking BRImo',
    accountNumberLabel: 'Nomor Rekening BRI (15 Digit)',
    accountHolderLabel: 'Nama Pemilik Rekening sesuai BRImo',
    iconColor: '#00529C',
    logoUrl: 'https://i.ibb.co.com/q88Lqb0/images-1.jpg',
  },
  {
    id: 4,
    name: 'DANA',
    code: 'dana',
    status: 'active',
    statusLabel: '✅ Aktif',
    category: 'ewallet',
    description: 'Dompet Digital DANA Indonesia (Premium Account)',
    accountNumberLabel: 'Nomor Handphone Terdaftar DANA (08xx)',
    accountHolderLabel: 'Nama Akun DANA Premium sesuai KTP',
    iconColor: '#118EEA',
    logoUrl: 'https://i.ibb.co.com/355QQMc8/images-2.jpg',
  },
  {
    id: 5,
    name: 'OVO',
    code: 'ovo',
    status: 'active',
    statusLabel: '✅ Aktif',
    category: 'ewallet',
    description: 'OVO Cash & Premier Digital Wallet',
    accountNumberLabel: 'Nomor Handphone Terdaftar OVO (08xx)',
    accountHolderLabel: 'Nama Akun OVO Premier sesuai KTP',
    iconColor: '#4C3494',
    logoUrl: 'https://i.ibb.co.com/xS9r1FFR/images-3.jpg',
  },
  {
    id: 6,
    name: 'GoPay',
    code: 'gopay',
    status: 'active',
    statusLabel: '✅ Aktif',
    category: 'ewallet',
    description: 'GoPay / GoPay Plus Digital Payment',
    accountNumberLabel: 'Nomor Handphone Terdaftar GoPay (08xx)',
    accountHolderLabel: 'Nama Akun GoPay Plus sesuai KTP',
    iconColor: '#00AED6',
    logoUrl: 'https://i.ibb.co.com/CssqQMTm/images-4.jpg',
  },
  {
    id: 7,
    name: 'Bank of America',
    code: 'us',
    status: 'maintenance',
    statusLabel: '🔧 Perbaikan',
    category: 'international',
    description: 'United States. Sedang dalam perbaikan sistem.',
    accountNumberLabel: 'US Routing & Account Number (ACH)',
    accountHolderLabel: 'Account Beneficiary Legal Name',
    iconColor: '#E31837',
    logoUrl: 'https://i.ibb.co.com/FbbgHSwL/images-2.png',
  },
  {
    id: 8,
    name: 'HSBC UK',
    code: 'uk',
    status: 'maintenance',
    statusLabel: '🔧 Perbaikan',
    category: 'international',
    description: 'United Kingdom. Sedang dalam perbaikan sistem.',
    accountNumberLabel: 'UK Sort Code & Account Number / IBAN',
    accountHolderLabel: 'Account Beneficiary Legal Name',
    iconColor: '#DB0011',
    logoUrl: 'https://i.ibb.co.com/Zz5HyXSF/images-1.png',
  },
  {
    id: 9,
    name: 'Vietcombank',
    code: 'vn',
    status: 'coming_soon',
    statusLabel: '⏳ Segera Hadir',
    category: 'international',
    description: 'Vietnam. Akan segera tersedia.',
    accountNumberLabel: 'Vietcombank Account Number',
    accountHolderLabel: 'Full Legal Name',
    iconColor: '#007A33',
    logoUrl: 'https://i.ibb.co.com/zVGrPDY3/images-6.jpg',
  },
  {
    id: 10,
    name: 'Bangkok Bank',
    code: 'th',
    status: 'coming_soon',
    statusLabel: '⏳ Segera Hadir',
    category: 'international',
    description: 'Thailand. Akan segera tersedia.',
    accountNumberLabel: 'Bangkok Bank Account Number',
    accountHolderLabel: 'Full Legal Name',
    iconColor: '#1E3A8A',
    logoUrl: 'https://i.ibb.co.com/nM5dYP2q/images-7.jpg',
  },
  {
    id: 11,
    name: 'Maybank / CIMB',
    code: 'my',
    status: 'coming_soon',
    statusLabel: '⏳ Segera Hadir',
    category: 'international',
    description: 'Malaysia. Akan segera tersedia.',
    accountNumberLabel: 'Maybank / CIMB Account Number',
    accountHolderLabel: 'Full Legal Name',
    iconColor: '#F59E0B',
    logoUrl: 'https://i.ibb.co.com/qLFxBw5c/images-5.jpg',
  },
];

export function getPaymentChannelByCode(code: string): PaymentChannelConfig | undefined {
  return PAYMENT_CHANNELS.find((c) => c.code.toLowerCase() === code.toLowerCase());
}

export interface PaymentAccountVerification {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  bankCode: string;
  bankName: string;
  channelStatus: 'active' | 'maintenance' | 'coming_soon';
  channelNote: string;
  accountHolderName: string;
  accountNumber: string;
  proofUrl?: string;
  proofFileName?: string;
  userNotes?: string;
  status: 'pending' | 'verified' | 'rejected';
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminFeedback?: string;
}

export type WithdrawalStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'processing'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number; // Min $100.00
  method: 'bank' | 'paypal' | 'payoneer' | 'wise' | 'crypto';
  recipientDetails: {
    accountName: string;
    accountNumber: string;
    providerName: string;
  };
  status: WithdrawalStatus;
  requestedAt: string;
  processedAt?: string;
  adminNote?: string;
  rejectionReason?: string;
  transactionRef?: string;
}

export interface FAQItem {
  id: string;
  category:
    | 'Account'
    | 'Profile & Avatar'
    | 'Jobs'
    | 'Submission'
    | 'Payment'
    | 'Withdrawal'
    | 'Security'
    | 'Rules'
    | 'Technical Issues'
    | 'Clients/Task Owners';
  question: string;
  answer: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  order: number;
  helpfulCount: number;
  notHelpfulCount: number;
  published: boolean;
  relatedIds?: string[];
}

export interface SponsorItem {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  description: string;
  category: string;
  order: number;
  active: boolean;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: 'Billing' | 'Job Issue' | 'Submission Review' | 'Account Verification' | 'Technical Bug' | 'Other';
  subject: string;
  description: string;
  attachmentName?: string;
  attachmentUrl?: string;
  status: 'open' | 'processing' | 'waiting_user' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: 'user' | 'support' | 'admin';
    senderName: string;
    message: string;
    createdAt: string;
  }[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'job' | 'submission' | 'payment' | 'withdrawal' | 'security' | 'system';
  read: boolean;
  isRead?: boolean;
  link?: string;
  createdAt: string;
}

export type Notification = NotificationItem;

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetEntity: string;
  targetId: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface PlatformSettings {
  minWithdrawalAmount: number; // $100.00
  maintenanceMode: boolean;
  requireCaptcha: boolean;
  sponsorTrustText: string;
  autoApprovePayouts: boolean;
  plagiarismThresholdPercent: number;
}

// ==========================================
// WEJOBS MONTHLY CHALLENGE TYPES
// ==========================================

export type ChallengeStatus = 'upcoming' | 'active' | 'ended' | 'verifying' | 'completed';
export type RankingStatus = 'provisional' | 'under_verification' | 'final';
export type ParticipantStatus = 'registered' | 'active' | 'flagged' | 'disqualified' | 'winner';
export type RewardStatus = 'pending' | 'approved' | 'processing' | 'paid' | 'cancelled';

export interface ChallengePrize {
  id: string;
  rank?: number;
  title: string;
  amount: number; // in USD
  description: string;
  icon: 'gold_cup' | 'silver_cup' | 'bronze_cup' | 'star' | 'rocket' | 'diamond';
}

export interface ChallengePointRules {
  microtask: number;
  smallTask: number;
  mediumTask: number;
  mediumHighTask: number;
  largeTask: number;
  rating5Bonus: number;
  firstTimeAcceptedBonus: number;
  earlyCompletionBonus: number;
  positiveReviewBonus: number;
  lateTaskPenalty: number;
  rejectionPenalty: number;
  ruleViolationPenalty: number;
}

export interface Challenge {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  registrationStartAt: string;
  registrationEndAt: string;
  challengeStartAt: string;
  challengeEndAt: string;
  maxParticipants: number;
  prizePool: number;
  prizes: ChallengePrize[];
  pointRules: ChallengePointRules;
  status: ChallengeStatus;
  rankingStatus: RankingStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  userEmail: string;
  userFullName: string;
  displayName: string;
  avatarType: 'builtin' | 'custom';
  builtinAvatarId?: BuiltInAvatarId;
  avatarId?: string;
  country: string;
  participantStatus: ParticipantStatus;
  joinedAt: string;
  score: number;
  rank: number;
  completedTasksCount: number;
  acceptanceRate: number;
  averageRating: number;
  fraudStatus: 'clean' | 'suspicious' | 'confirmed_fraud';
  flagReason?: string;
  disqualificationReason?: string;
  pointAdjustments?: {
    id: string;
    amount: number;
    reason: string;
    createdAt: string;
    adminEmail: string;
  }[];
}

export interface ChallengeReward {
  id: string;
  challengeId: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  category: string;
  rank: number;
  amount: number;
  currency: string;
  status: RewardStatus;
  transactionId?: string;
  approvedBy?: string;
  approvedAt?: string;
  paidAt?: string;
  createdAt: string;
}

export interface ChallengeAppeal {
  id: string;
  challengeId: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  type: 'disqualification' | 'point_deduction' | 'ranking' | 'reward' | 'other';
  reason: string;
  evidence?: string;
  status: 'pending' | 'under_review' | 'accepted' | 'rejected';
  adminNote?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface ChallengeChampionHistory {
  id: string;
  challengeSlug: string;
  challengeTitle: string;
  monthYear: string;
  totalParticipants: number;
  totalPrizePaid: number;
  winners: {
    rank: number;
    prizeTitle: string;
    amount: number;
    winnerName: string;
    winnerAvatar: string;
    country: string;
    score: number;
  }[];
}

