import {
  User,
  Task,
  TaskAssignment,
  Transaction,
  WithdrawalRequest,
  FAQItem,
  SponsorItem,
  SupportTicket,
  NotificationItem,
  AuditLog,
  PlatformSettings,
  UserBalance,
  SubmissionVersion,
  Challenge,
  ChallengeParticipant,
  ChallengeReward,
  ChallengeAppeal,
  ChallengeChampionHistory,
  ParticipantStatus,
  RankingStatus,
  RewardStatus,
  PayoutEligibilityRequest,
  PaymentAccountVerification,
  PAYMENT_CHANNELS,
} from '../src/types';
import { generateSeedTasks, INITIAL_FAQS, INITIAL_SPONSORS, INITIAL_SETTINGS } from './seedData';
import {
  INITIAL_CHALLENGES,
  INITIAL_CHAMPION_HISTORIES,
  generateSeedParticipants,
} from './challengeSeed';
import fs from 'fs';
import path from 'path';

// Password hashing simulation (Salted SHA256 simulation representing Argon2id in runtime)
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `argon2id$v=19$m=65536,t=3,p=4$salt_${Math.abs(hash).toString(16)}$${Buffer.from(password).toString('base64')}`;
}

export class DatabaseStore {
  public users: Map<string, User> = new Map();
  public userPasswords: Map<string, string> = new Map(); // userId -> hashedPassword
  public tasks: Map<string, Task> = new Map();
  public assignments: Map<string, TaskAssignment> = new Map();
  public transactions: Map<string, Transaction> = new Map();
  public withdrawals: Map<string, WithdrawalRequest> = new Map();
  public faqs: Map<string, FAQItem> = new Map();
  public sponsors: Map<string, SponsorItem> = new Map();
  public tickets: Map<string, SupportTicket> = new Map();
  public notifications: Map<string, NotificationItem> = new Map();
  public payoutEligibilityRequests: Map<string, PayoutEligibilityRequest> = new Map();
  public paymentAccountVerifications: Map<string, PaymentAccountVerification> = new Map();
  public auditLogs: AuditLog[] = [];
  public settings: PlatformSettings = { ...INITIAL_SETTINGS };

  // WEJOBS MONTHLY CHALLENGE STORAGE MAPS
  public challenges: Map<string, Challenge> = new Map();
  public challengeParticipants: Map<string, ChallengeParticipant> = new Map(); // participantId -> ChallengeParticipant
  public challengeRewards: Map<string, ChallengeReward> = new Map();
  public challengeAppeals: Map<string, ChallengeAppeal> = new Map();
  public challengeHistories: Map<string, ChallengeChampionHistory> = new Map();

  private initialized = false;

  constructor() {
    this.init();
  }

  public init() {
    if (this.initialized) return;

    // 1. Seed Super Admin Account as required in Section 24
    const superAdminId = 'user-super-admin-01';
    const superAdminUser: User = {
      id: superAdminId,
      fullName: 'Super Admin',
      email: 'berkahkita937@gmail.com',
      phone: '+6281234567890',
      address: 'Jakarta Capital Special Region, Indonesia',
      bio: 'Platform Lead & Head of Editorial Quality at WEJOBS.',
      role: 'super_admin',
      avatarType: 'builtin',
      builtinAvatarId: 'fox',
      emailVerified: true,
      recipientStatus: 'verified',
      recipientDetails: {
        method: 'bank',
        accountName: 'Super Admin Operational',
        accountNumber: '8820948123',
        bankOrProviderName: 'Bank Central Asia (BCA)',
      },
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      rating: 5.0,
      reviewCount: 48,
      completedJobsCount: 48,
    };
    this.users.set(superAdminId, superAdminUser);
    this.userPasswords.set(superAdminId, hashPassword('berkah313'));

    // 2. Seed a Verified Freelancer Member User for immediate testing & demo
    const demoUserId = 'user-freelancer-demo';
    const demoUser: User = {
      id: demoUserId,
      fullName: 'Alex Santoso',
      email: 'alex.writer@wejobs.com',
      phone: '+6285712345678',
      address: 'Bandung, West Java, Indonesia',
      bio: 'Technical Copywriter & Creative Fiction Enthusiast with 4+ years of professional editorial experience.',
      role: 'user',
      avatarType: 'builtin',
      builtinAvatarId: 'panda',
      emailVerified: true,
      payoutEligibilityStatus: 'eligible',
      payoutEligibilityRequestedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      payoutEligibilityReviewedAt: new Date(Date.now() - 9 * 86400000).toISOString(),
      payoutEligibilityNote: 'Memenuhi seluruh kriteria verifikasi kelayakan payout.',
      recipientStatus: 'verified',
      recipientDetails: {
        method: 'bank',
        accountName: 'Alex Santoso',
        accountNumber: '7192830192',
        bankOrProviderName: 'BSI Mobile',
        notes: 'Verifikasi BSI Mobile Utama',
      },
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      rating: 4.95,
      reviewCount: 19,
      completedJobsCount: 19,
    };
    this.users.set(demoUserId, demoUser);
    this.userPasswords.set(demoUserId, hashPassword('wejobs123'));

    // Seed verified payment accounts for demo user (BSI Mobile and DANA)
    const demoBsiVerification: PaymentAccountVerification = {
      id: 'pacc-demo-bsi-1',
      userId: demoUserId,
      userEmail: demoUser.email,
      userName: demoUser.fullName,
      bankCode: 'bsi',
      bankName: 'BSI Mobile',
      channelStatus: 'active',
      channelNote: 'Bank Syariah Indonesia Mobile Banking & Transfer',
      accountHolderName: 'Alex Santoso',
      accountNumber: '7192830192',
      proofUrl: '',
      proofFileName: 'Buku_Tabungan_BSI.jpg',
      userNotes: 'Rekening penerima utama untuk payroll',
      status: 'verified',
      requestedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
      reviewedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      reviewedBy: 'Super Admin',
      adminFeedback: 'Rekening aktif dan nama sesuai identitas.',
    };
    this.paymentAccountVerifications.set(demoBsiVerification.id, demoBsiVerification);

    // Seed another user waiting for Payout Eligibility confirmation
    const pendingUserId = 'user-pending-eligibility-01';
    const pendingUser: User = {
      id: pendingUserId,
      fullName: 'Rina Kusuma',
      email: 'rina.kusuma@gmail.com',
      phone: '+6281398765432',
      address: 'Surabaya, East Java, Indonesia',
      bio: 'Content Writer and Academic Researcher specializing in Science & Tech.',
      role: 'user',
      avatarType: 'builtin',
      builtinAvatarId: 'cat',
      emailVerified: true,
      payoutEligibilityStatus: 'pending',
      payoutEligibilityRequestedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      recipientStatus: 'unverified',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      rating: 4.88,
      reviewCount: 8,
      completedJobsCount: 8,
    };
    this.users.set(pendingUserId, pendingUser);
    this.userPasswords.set(pendingUserId, hashPassword('wejobs123'));

    // Seed pending eligibility request
    const pendingEligReq: PayoutEligibilityRequest = {
      id: 'pelig-seed-01',
      userId: pendingUserId,
      userEmail: pendingUser.email,
      userName: pendingUser.fullName,
      userBalance: 145.0,
      completedJobsCount: 8,
      reason: 'Telah menyelesaikan 8 tugas penulisan dan ingin mengajukan pencairan saldo $145.00 USD.',
      status: 'pending',
      requestedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    };
    this.payoutEligibilityRequests.set(pendingEligReq.id, pendingEligReq);

    // Seed another user waiting for Bank Account verification (myBCA)
    const bcaUserId = 'user-pending-bank-02';
    const bcaUser: User = {
      id: bcaUserId,
      fullName: 'Budi Darmawan',
      email: 'budi.darmawan@yahoo.com',
      phone: '+6281122334455',
      address: 'Yogyakarta, Indonesia',
      bio: 'Professional Indonesian-English translator.',
      role: 'user',
      avatarType: 'builtin',
      builtinAvatarId: 'dog',
      emailVerified: true,
      payoutEligibilityStatus: 'eligible',
      payoutEligibilityRequestedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      payoutEligibilityReviewedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      recipientStatus: 'pending',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      rating: 4.9,
      reviewCount: 12,
      completedJobsCount: 12,
    };
    this.users.set(bcaUserId, bcaUser);
    this.userPasswords.set(bcaUserId, hashPassword('wejobs123'));

    const pendingBcaVerification: PaymentAccountVerification = {
      id: 'pacc-seed-bca-01',
      userId: bcaUserId,
      userEmail: bcaUser.email,
      userName: bcaUser.fullName,
      bankCode: 'bca',
      bankName: 'myBCA',
      channelStatus: 'active',
      channelNote: 'BCA Mobile / myBCA Virtual & Real Account',
      accountHolderName: 'Budi Darmawan',
      accountNumber: '5271890241',
      proofUrl: '',
      proofFileName: 'KTP_dan_Buku_Tabungan_BCA.png',
      userNotes: 'Rekening myBCA aktif transaksi harian',
      status: 'pending',
      requestedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    };
    this.paymentAccountVerifications.set(pendingBcaVerification.id, pendingBcaVerification);

    // Add initial transactions for demo user ($124.50 earned, $0 withdrawn => balance $124.50, allowing real withdrawal testing >= $100)
    const initialEarnings = [
      { amount: 18.5, desc: 'Accepted: Comprehensive Research Paper Summary' },
      { amount: 24.0, desc: 'Accepted: B2B SaaS Thought Leadership Article' },
      { amount: 32.0, desc: 'Accepted: Sci-Fi Short Story Narrative' },
      { amount: 15.0, desc: 'Accepted: Structural Editing on Executive Memoir' },
      { amount: 35.0, desc: 'Accepted: Academic Literature Review Digest' },
    ];

    let runningBal = 0;
    initialEarnings.forEach((item, index) => {
      runningBal += item.amount;
      const txId = `tx-demo-${index + 1}`;
      this.transactions.set(txId, {
        id: txId,
        userId: demoUserId,
        type: 'task_earning',
        amount: item.amount,
        description: item.desc,
        status: 'completed',
        createdAt: new Date(Date.now() - (10 - index) * 86400000).toISOString(),
        balanceAfter: runningBal,
      });
    });

    // 3. Seed the 4,421 Tasks
    const seedTasks = generateSeedTasks();
    seedTasks.forEach((t) => this.tasks.set(t.id, t));

    // 4. Seed FAQs
    INITIAL_FAQS.forEach((f) => this.faqs.set(f.id, f));

    // 5. Seed Sponsors
    INITIAL_SPONSORS.forEach((s) => this.sponsors.set(s.id, s));

    // 6. Seed sample notifications for demo user
    const sampleNotifications: NotificationItem[] = [
      {
        id: 'notif-1',
        userId: demoUserId,
        title: 'Task Accepted & Credited! 💰',
        message: 'Your submission for "Academic Literature Review Digest" was accepted. $35.00 has been added to your Available Balance.',
        type: 'payment',
        read: false,
        link: '/balance',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'notif-2',
        userId: demoUserId,
        title: 'Payout Recipient Verified ✅',
        message: 'Your PayPal USD account (alex.writer@wejobs.com) has been verified. You can now request withdrawals starting from $100.00 USD.',
        type: 'withdrawal',
        read: true,
        link: '/balance',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'notif-3',
        userId: demoUserId,
        title: 'New High-Reward Writing Jobs Available',
        message: '14 new tasks were posted in Creative Writing and Research & Writing today.',
        type: 'job',
        read: true,
        link: '/tasks',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ];
    sampleNotifications.forEach((n) => this.notifications.set(n.id, n));

    // 7. Seed WEJOBS Monthly Challenges, dynamic participants, and previous champions
    INITIAL_CHALLENGES.forEach((c) => this.challenges.set(c.id, c));
    INITIAL_CHAMPION_HISTORIES.forEach((h) => this.challengeHistories.set(h.id, h));

    // Generate seed participants (327 dynamic participants)
    const seedParticipants = generateSeedParticipants('chal-2026-09');
    seedParticipants.forEach((p) => this.challengeParticipants.set(p.id, p));

    // Also add challenge registration notification for demo user
    this.createNotification(
      demoUserId,
      `🏆 You're registered for the September 2026 Monthly Challenge!`,
      `Your Participant ID is WMC-202609-0027. Complete writing tasks to earn challenge points and compete for the $1,000 USD Grand Prize.`,
      'job',
      '/challenge/september-2026'
    );

    // 8. Initial Audit Log
    this.logAudit(
      superAdminId,
      'berkahkita937@gmail.com',
      'SYSTEM_INITIALIZED',
      'Platform',
      'system',
      'Initialized WEJOBS engine with 4,421 tasks, 10 sponsor logos, 40+ FAQs, WEJOBS Monthly Challenge ($1,750 prize pool), and Super Admin seed.'
    );

    this.initialized = true;
  }

  // --- Audit Logger ---
  public logAudit(
    adminId: string,
    adminEmail: string,
    action: string,
    targetEntity: string,
    targetId: string,
    details: string
  ) {
    const log: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      adminId,
      adminEmail,
      action,
      targetEntity,
      targetId,
      details,
      ipAddress: '127.0.0.1',
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
  }

  // --- Auth & User Management ---
  public verifyPassword(providedPassword: string, storedHash: string): boolean {
    const expected = hashPassword(providedPassword);
    return expected === storedHash;
  }

  public registerUser(data: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    role?: 'user';
  }): { success: boolean; user?: User; error?: string } {
    const emailLower = data.email.trim().toLowerCase();
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === emailLower) {
        return { success: false, error: 'An account with this email address already exists.' };
      }
    }

    const starterAvatars: any[] = ['rabbit', 'fox', 'panda', 'squirrel', 'cat', 'bear', 'penguin', 'hamster', 'lion', 'koala', 'owl'];
    const randomAvatar = starterAvatars[Math.floor(Math.random() * starterAvatars.length)];

    const userId = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newUser: User = {
      id: userId,
      fullName: data.fullName.trim(),
      email: emailLower,
      phone: data.phone.trim(),
      address: data.address.trim(),
      role: 'user',
      avatarType: 'builtin',
      builtinAvatarId: (data as any).builtinAvatarId || (data as any).avatarId || randomAvatar,
      avatarId: (data as any).avatarId || (data as any).builtinAvatarId || randomAvatar,
      emailVerified: true, // auto-verify for instant workflow
      recipientStatus: 'unverified',
      createdAt: new Date().toISOString(),
      rating: 5.0,
      reviewCount: 0,
      completedJobsCount: 0,
    };

    this.users.set(userId, newUser);
    this.userPasswords.set(userId, hashPassword(data.password));

    // Welcome Notification
    this.createNotification(
      userId,
      'Welcome to WEJOBS! 🎉',
      'Your freelancer account is now active. Browse 4,180+ open writing tasks and earn USD.',
      'system',
      '/tasks'
    );

    return { success: true, user: newUser };
  }

  public authenticate(email: string, password: string): { success: boolean; user?: User; error?: string } {
    const emailLower = email.trim().toLowerCase();
    let matchedUser: User | null = null;

    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === emailLower) {
        matchedUser = u;
        break;
      }
    }

    if (!matchedUser) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const storedHash = this.userPasswords.get(matchedUser.id);
    if (!storedHash || !this.verifyPassword(password, storedHash)) {
      return { success: false, error: 'Invalid email or password.' };
    }

    if (matchedUser.isRestricted) {
      return {
        success: false,
        error: `Account is temporarily restricted: ${matchedUser.restrictionReason || 'Security audit in progress.'}`,
      };
    }

    return { success: true, user: matchedUser };
  }

  // --- Task Operations & Dynamic Counts ---
  public getTaskStats() {
    let total = 0;
    let full = 0;
    let available = 0;
    let totalSlots = 0;
    let totalRemainingSlots = 0;

    for (const t of this.tasks.values()) {
      total++;
      totalSlots += t.totalSlots;
      totalRemainingSlots += t.remainingSlots;
      if (t.remainingSlots <= 0 || t.status === 'full') {
        full++;
      } else {
        available++;
      }
    }

    return {
      totalTasks: total,
      fullTasks: full,
      availableTasks: available,
      totalSlots,
      totalRemainingSlots,
    };
  }

  // Atomic Slot Allocation
  public claimTask(taskId: string, user: User): { success: boolean; assignment?: TaskAssignment; error?: string } {
    const task = this.tasks.get(taskId);
    if (!task) {
      return { success: false, error: 'Task not found.' };
    }

    if (task.remainingSlots <= 0 || task.status === 'full') {
      return { success: false, error: 'This task has reached maximum capacity (FULL).' };
    }

    // Check if user already has an active assignment for this task
    for (const a of this.assignments.values()) {
      if (a.taskId === taskId && a.userId === user.id && ['in_progress', 'awaiting_submission', 'under_review', 'revision_required'].includes(a.status)) {
        return { success: false, error: 'You already have this task actively assigned to your queue.' };
      }
    }

    // Check maximum active tasks limit (e.g. 5)
    let activeCount = 0;
    for (const a of this.assignments.values()) {
      if (a.userId === user.id && ['in_progress', 'awaiting_submission', 'under_review', 'revision_required'].includes(a.status)) {
        activeCount++;
      }
    }

    if (activeCount >= 5) {
      return { success: false, error: 'You have reached your maximum active tasks limit (5). Submit or finish your existing tasks first.' };
    }

    // Atomic decrement
    task.remainingSlots = Math.max(0, task.remainingSlots - 1);
    if (task.remainingSlots === 0) {
      task.status = 'full';
    }

    const assignmentId = `asgn-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const deadlineDate = new Date(Date.now() + task.deadlineHours * 3600000).toISOString();

    const assignment: TaskAssignment = {
      id: assignmentId,
      taskId: task.id,
      userId: user.id,
      userEmail: user.email,
      userFullName: user.fullName,
      taskTitle: task.title,
      category: task.category,
      subtype: task.subtype,
      payment: task.payment,
      assignedAt: new Date().toISOString(),
      deadlineAt: deadlineDate,
      status: 'in_progress',
      submissionVersions: [],
      currentVersion: 0,
    };

    this.assignments.set(assignmentId, assignment);

    this.createNotification(
      user.id,
      `Task Claimed: ${task.title}`,
      `You have claimed this task. You have ${task.deadlineHours} hours to submit your deliverable.`,
      'job',
      `/my-tasks`
    );

    return { success: true, assignment };
  }

  // Submit Work with Versioning (v1, v2, v3)
  public submitWork(
    assignmentId: string,
    userId: string,
    submission: {
      fileName: string;
      fileSize: number;
      fileDataUrl?: string;
      note: string;
      referenceLink?: string;
    }
  ): { success: boolean; assignment?: TaskAssignment; error?: string } {
    const assignment = this.assignments.get(assignmentId);
    if (!assignment) {
      return { success: false, error: 'Assignment not found.' };
    }

    if (assignment.userId !== userId) {
      return { success: false, error: 'Unauthorized assignment access.' };
    }

    if (!['in_progress', 'awaiting_submission', 'revision_required'].includes(assignment.status)) {
      return { success: false, error: `Cannot submit work when status is '${assignment.status}'.` };
    }

    const nextVersionNum = assignment.submissionVersions.length + 1;
    const newVersion: SubmissionVersion = {
      versionNumber: nextVersionNum,
      fileName: submission.fileName,
      fileSize: submission.fileSize,
      fileDataUrl: submission.fileDataUrl,
      note: submission.note,
      referenceLink: submission.referenceLink,
      submittedAt: new Date().toISOString(),
      status: 'under_review',
    };

    assignment.submissionVersions.push(newVersion);
    assignment.currentVersion = nextVersionNum;
    assignment.status = 'under_review';

    this.createNotification(
      userId,
      `Submission Uploaded (v${nextVersionNum}) 📄`,
      `Your submission for "${assignment.taskTitle}" is now under review by our editorial team.`,
      'submission',
      '/my-tasks'
    );

    return { success: true, assignment };
  }

  // Admin Review Submission (Accept, Request Revision, Reject)
  public reviewSubmission(
    assignmentId: string,
    adminUser: User,
    action: 'accept' | 'revision' | 'reject',
    feedback: string
  ): { success: boolean; assignment?: TaskAssignment; error?: string } {
    const assignment = this.assignments.get(assignmentId);
    if (!assignment) {
      return { success: false, error: 'Assignment not found.' };
    }

    const targetUser = this.users.get(assignment.userId);
    if (!targetUser) {
      return { success: false, error: 'Target user not found.' };
    }

    const latestVersion = assignment.submissionVersions[assignment.submissionVersions.length - 1];

    if (action === 'accept') {
      assignment.status = 'completed';
      assignment.completedAt = new Date().toISOString();
      if (latestVersion) {
        latestVersion.status = 'accepted';
        latestVersion.reviewFeedback = feedback || 'Work meets all quality standards and word count requirements.';
        latestVersion.reviewedAt = new Date().toISOString();
        latestVersion.reviewedBy = adminUser.fullName;
      }

      // Credit User Available Balance via Ledger Transaction
      const userBal = this.getUserBalance(targetUser.id);
      const newBal = Number((userBal.available + assignment.payment).toFixed(2));

      const txId = `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const tx: Transaction = {
        id: txId,
        userId: targetUser.id,
        type: 'task_earning',
        amount: assignment.payment,
        description: `Accepted Task: ${assignment.taskTitle}`,
        referenceId: assignment.id,
        status: 'completed',
        createdAt: new Date().toISOString(),
        balanceAfter: newBal,
      };
      this.transactions.set(txId, tx);

      targetUser.completedJobsCount = (targetUser.completedJobsCount || 0) + 1;
      targetUser.reviewCount = (targetUser.reviewCount || 0) + 1;

      // Automatically hook into WEJOBS Monthly Challenge if user is registered!
      this.awardChallengePointsOnTaskApproval(targetUser.id, assignment);

      this.createNotification(
        targetUser.id,
        `Task Accepted! Earned +$${assignment.payment.toFixed(2)} USD 🎉`,
        `Congratulations! Your submission for "${assignment.taskTitle}" was accepted. Funds are now available for withdrawal.`,
        'payment',
        '/balance'
      );

      this.logAudit(
        adminUser.id,
        adminUser.email,
        'SUBMISSION_ACCEPTED',
        'TaskAssignment',
        assignment.id,
        `Approved submission for user ${targetUser.email} (+$${assignment.payment.toFixed(2)} USD)`
      );
    } else if (action === 'revision') {
      if (!feedback) {
        return { success: false, error: 'Feedback reason is required when requesting a revision.' };
      }
      assignment.status = 'revision_required';
      assignment.revisionReason = feedback;
      if (latestVersion) {
        latestVersion.status = 'revision_required';
        latestVersion.reviewFeedback = feedback;
        latestVersion.reviewedAt = new Date().toISOString();
        latestVersion.reviewedBy = adminUser.fullName;
      }

      this.createNotification(
        targetUser.id,
        `Revision Requested: "${assignment.taskTitle}" ✍️`,
        `Editorial feedback: "${feedback}". Please submit a revised draft.`,
        'submission',
        '/my-tasks'
      );

      this.logAudit(
        adminUser.id,
        adminUser.email,
        'SUBMISSION_REVISION_REQUESTED',
        'TaskAssignment',
        assignment.id,
        `Requested revision: ${feedback}`
      );
    } else if (action === 'reject') {
      if (!feedback) {
        return { success: false, error: 'Rejection reason is required.' };
      }
      assignment.status = 'rejected';
      assignment.rejectionReason = feedback;
      if (latestVersion) {
        latestVersion.status = 'rejected';
        latestVersion.reviewFeedback = feedback;
        latestVersion.reviewedAt = new Date().toISOString();
        latestVersion.reviewedBy = adminUser.fullName;
      }

      this.createNotification(
        targetUser.id,
        `Submission Rejected: "${assignment.taskTitle}" ❌`,
        `Reason: "${feedback}". You may take other open tasks in the marketplace.`,
        'submission',
        '/my-tasks'
      );

      this.logAudit(
        adminUser.id,
        adminUser.email,
        'SUBMISSION_REJECTED',
        'TaskAssignment',
        assignment.id,
        `Rejected submission: ${feedback}`
      );
    }

    return { success: true, assignment };
  }

  // --- Balance & Ledger Calculations ---
  public getUserBalance(userId: string): UserBalance {
    let available = 0;
    let totalEarnings = 0;
    let totalWithdrawn = 0;

    for (const tx of this.transactions.values()) {
      if (tx.userId === userId && tx.status === 'completed') {
        if (tx.type === 'task_earning' || tx.type === 'bonus') {
          available += tx.amount;
          totalEarnings += tx.amount;
        } else if (tx.type === 'withdrawal') {
          available -= tx.amount;
          totalWithdrawn += tx.amount;
        } else if (tx.type === 'adjustment') {
          available += tx.amount;
          if (tx.amount > 0) totalEarnings += tx.amount;
        }
      }
    }

    // Pending earnings from submissions currently under review
    let pending = 0;
    for (const a of this.assignments.values()) {
      if (a.userId === userId && a.status === 'under_review') {
        pending += a.payment;
      }
    }

    return {
      available: Number(Math.max(0, available).toFixed(2)),
      pending: Number(pending.toFixed(2)),
      totalEarnings: Number(totalEarnings.toFixed(2)),
      totalWithdrawn: Number(totalWithdrawn.toFixed(2)),
    };
  }

  // --- Withdrawal Management (Enforcing strictly $100.00 Min) ---
  public requestWithdrawal(
    userId: string,
    amount: number,
    method: 'bank' | 'paypal' | 'payoneer' | 'wise' | 'crypto',
    details: { accountName: string; accountNumber: string; providerName: string }
  ): { success: boolean; withdrawal?: WithdrawalRequest; error?: string } {
    const user = this.users.get(userId);
    if (!user) {
      return { success: false, error: 'User not found.' };
    }

    // Rule: Minimum $100.00
    if (amount < 100.0) {
      return { success: false, error: 'Minimum withdrawal amount is $100.00 USD.' };
    }

    // Rule: Must be Payout Eligible confirmed by Admin
    if (user.payoutEligibilityStatus !== 'eligible') {
      return {
        success: false,
        error: 'Wajib mengajukan dan mendapatkan konfirmasi status Eligible dari Admin sebelum dapat melakukan penarikan.',
      };
    }

    // Rule: Recipient must be verified
    if (user.recipientStatus !== 'verified') {
      return {
        success: false,
        error: 'Rekening penerima Anda belum terverifikasi oleh Admin. Silakan lakukan verifikasi rekening terlebih dahulu.',
      };
    }

    // Rule: Sufficient Available Balance
    const balance = this.getUserBalance(userId);
    if (balance.available < amount) {
      return {
        success: false,
        error: `Insufficient available balance. You requested $${amount.toFixed(2)} USD but have only $${balance.available.toFixed(2)} USD available.`,
      };
    }

    // Check if user is restricted
    if (user.isRestricted) {
      return { success: false, error: 'Account is restricted from withdrawal requests.' };
    }

    const withdrawalId = `wdr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const withdrawal: WithdrawalRequest = {
      id: withdrawalId,
      userId: user.id,
      userEmail: user.email,
      userName: user.fullName,
      amount: Number(amount.toFixed(2)),
      method,
      recipientDetails: details,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    this.withdrawals.set(withdrawalId, withdrawal);

    // Create a pending/deduction transaction entry in ledger
    const txId = `tx-wdr-${Date.now()}`;
    const newBal = Number((balance.available - amount).toFixed(2));
    this.transactions.set(txId, {
      id: txId,
      userId: user.id,
      type: 'withdrawal',
      amount: amount,
      description: `Withdrawal Request to ${details.providerName} (${details.accountNumber})`,
      referenceId: withdrawalId,
      status: 'completed',
      createdAt: new Date().toISOString(),
      balanceAfter: newBal,
    });

    this.createNotification(
      user.id,
      `Withdrawal Submitted: $${amount.toFixed(2)} USD 💳`,
      `Your payout request to ${details.providerName} is now under review. Payouts are usually processed within 24-48 hours.`,
      'withdrawal',
      '/withdrawals'
    );

    return { success: true, withdrawal };
  }

  // Admin Approve / Reject Withdrawal
  public processWithdrawal(
    withdrawalId: string,
    adminUser: User,
    action: 'approve' | 'reject',
    note?: string,
    transactionRef?: string
  ): { success: boolean; withdrawal?: WithdrawalRequest; error?: string } {
    const withdrawal = this.withdrawals.get(withdrawalId);
    if (!withdrawal) {
      return { success: false, error: 'Withdrawal request not found.' };
    }

    if (action === 'approve') {
      withdrawal.status = 'completed';
      withdrawal.processedAt = new Date().toISOString();
      withdrawal.adminNote = note || 'Processed and transferred successfully.';
      withdrawal.transactionRef = transactionRef || `PAY-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

      this.createNotification(
        withdrawal.userId,
        `Withdrawal Completed: $${withdrawal.amount.toFixed(2)} USD Sent! ✅`,
        `Funds have been successfully sent to your ${withdrawal.recipientDetails.providerName} account. Ref: ${withdrawal.transactionRef}`,
        'withdrawal',
        '/withdrawals'
      );

      this.logAudit(
        adminUser.id,
        adminUser.email,
        'WITHDRAWAL_APPROVED',
        'WithdrawalRequest',
        withdrawal.id,
        `Disbursed $${withdrawal.amount.toFixed(2)} USD to ${withdrawal.userName}`
      );
    } else {
      if (!note) {
        return { success: false, error: 'Rejection reason is mandatory when declining a withdrawal.' };
      }
      withdrawal.status = 'rejected';
      withdrawal.processedAt = new Date().toISOString();
      withdrawal.rejectionReason = note;

      // Refund the amount back to user available balance
      const currentBal = this.getUserBalance(withdrawal.userId);
      const refundedBal = Number((currentBal.available + withdrawal.amount).toFixed(2));
      const refundTxId = `tx-refund-${Date.now()}`;
      this.transactions.set(refundTxId, {
        id: refundTxId,
        userId: withdrawal.userId,
        type: 'adjustment',
        amount: withdrawal.amount,
        description: `Refund: Rejected Withdrawal #${withdrawal.id} (${note})`,
        referenceId: withdrawal.id,
        status: 'completed',
        createdAt: new Date().toISOString(),
        balanceAfter: refundedBal,
      });

      this.createNotification(
        withdrawal.userId,
        `Withdrawal Request Rejected: $${withdrawal.amount.toFixed(2)} USD ⚠️`,
        `Reason: "${note}". Funds of $${withdrawal.amount.toFixed(2)} USD have been restored to your Available Balance.`,
        'withdrawal',
        '/withdrawals'
      );

      this.logAudit(
        adminUser.id,
        adminUser.email,
        'WITHDRAWAL_REJECTED',
        'WithdrawalRequest',
        withdrawal.id,
        `Rejected withdrawal $${withdrawal.amount.toFixed(2)}: ${note}`
      );
    }

    return { success: true, withdrawal };
  }

  // --- Payout Eligibility Management ---
  public requestPayoutEligibility(
    userId: string,
    reason?: string
  ): { success: boolean; request?: PayoutEligibilityRequest; user?: User; error?: string } {
    const user = this.users.get(userId);
    if (!user) {
      return { success: false, error: 'User tidak ditemukan.' };
    }

    if (user.payoutEligibilityStatus === 'eligible') {
      return { success: true, user, error: 'Akun Anda sudah berstatus Eligible.' };
    }

    // Check if there is already an active pending request
    for (const req of this.payoutEligibilityRequests.values()) {
      if (req.userId === userId && req.status === 'pending') {
        return {
          success: false,
          error: 'Pengajuan eligible Anda sedang dalam proses peninjauan oleh Admin.',
        };
      }
    }

    const userBal = this.getUserBalance(userId);
    const requestId = `pelig-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const request: PayoutEligibilityRequest = {
      id: requestId,
      userId: user.id,
      userEmail: user.email,
      userName: user.fullName,
      userBalance: userBal.available,
      completedJobsCount: user.completedJobsCount || 0,
      reason: reason || 'Pengajuan verifikasi kelayakan penarikan pendapatan.',
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    this.payoutEligibilityRequests.set(requestId, request);

    // Update user status
    user.payoutEligibilityStatus = 'pending';
    user.payoutEligibilityRequestedAt = request.requestedAt;

    this.createNotification(
      user.id,
      'Pengajuan Eligible Terkirim ⏳',
      'Pengajuan verifikasi kelayakan penarikan pendapatan Anda telah terkirim. Menunggu konfirmasi dari Super Admin.',
      'payment',
      '/balance'
    );

    this.logAudit(
      user.id,
      user.email,
      'PAYOUT_ELIGIBILITY_REQUESTED',
      'PayoutEligibility',
      requestId,
      `User ${user.fullName} requested payout eligibility approval.`
    );

    return { success: true, request, user };
  }

  public reviewPayoutEligibility(
    requestId: string,
    adminUser: User,
    action: 'approve' | 'reject',
    feedback?: string
  ): { success: boolean; request?: PayoutEligibilityRequest; user?: User; error?: string } {
    const request = this.payoutEligibilityRequests.get(requestId);
    if (!request) {
      return { success: false, error: 'Pengajuan eligible tidak ditemukan.' };
    }

    const targetUser = this.users.get(request.userId);
    if (!targetUser) {
      return { success: false, error: 'Target user tidak ditemukan.' };
    }

    if (action === 'approve') {
      request.status = 'approved';
      request.reviewedAt = new Date().toISOString();
      request.reviewedBy = adminUser.fullName;
      request.adminFeedback = feedback || 'Disetujui. Akun memenuhi kriteria kelayakan pembayaran.';

      targetUser.payoutEligibilityStatus = 'eligible';
      targetUser.payoutEligibilityReviewedAt = request.reviewedAt;
      targetUser.payoutEligibilityNote = request.adminFeedback;

      this.createNotification(
        targetUser.id,
        'Selamat! Status Eligible Disetujui ✅',
        'Admin telah mengonfirmasi kelayakan pembayaran Anda. Anda sekarang dapat melanjutkan untuk mengajukan verifikasi rekening penerima.',
        'payment',
        '/balance'
      );

      this.logAudit(
        adminUser.id,
        adminUser.email,
        'PAYOUT_ELIGIBILITY_APPROVED',
        'PayoutEligibility',
        request.id,
        `Approved payout eligibility for ${targetUser.email}`
      );
    } else {
      request.status = 'rejected';
      request.reviewedAt = new Date().toISOString();
      request.reviewedBy = adminUser.fullName;
      request.adminFeedback = feedback || 'Pengajuan belum memenuhi persyaratan kelayakan.';

      targetUser.payoutEligibilityStatus = 'rejected';
      targetUser.payoutEligibilityReviewedAt = request.reviewedAt;
      targetUser.payoutEligibilityNote = request.adminFeedback;

      this.createNotification(
        targetUser.id,
        'Pengajuan Eligible Ditolak ⚠️',
        `Alasan: "${request.adminFeedback}". Anda dapat mengajukan permohonan kembali setelah memenuhi kriteria.`,
        'payment',
        '/balance'
      );

      this.logAudit(
        adminUser.id,
        adminUser.email,
        'PAYOUT_ELIGIBILITY_REJECTED',
        'PayoutEligibility',
        request.id,
        `Rejected payout eligibility for ${targetUser.email}: ${feedback}`
      );
    }

    return { success: true, request, user: targetUser };
  }

  public getPayoutEligibilityRequests(): PayoutEligibilityRequest[] {
    return Array.from(this.payoutEligibilityRequests.values()).sort(
      (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    );
  }

  // --- Payment Account Verification Management ---
  public requestPaymentAccountVerification(
    userId: string,
    data: {
      bankCode: string;
      accountHolderName: string;
      accountNumber: string;
      proofUrl?: string;
      proofFileName?: string;
      userNotes?: string;
    }
  ): { success: boolean; verification?: PaymentAccountVerification; error?: string } {
    const user = this.users.get(userId);
    if (!user) {
      return { success: false, error: 'User tidak ditemukan.' };
    }

    // STRICT REQUIREMENT: User must be confirmed eligible first
    if (user.payoutEligibilityStatus !== 'eligible') {
      return {
        success: false,
        error:
          'Anda wajib mengajukan dan mendapatkan persetujuan Verifikasi Kelayakan Pembayaran (Eligible) dari Admin terlebih dahulu sebelum dapat mengajukan verifikasi rekening penerima.',
      };
    }

    const channel = PAYMENT_CHANNELS.find((c) => c.code === data.bankCode);
    if (!channel) {
      return { success: false, error: 'Saluran rekening atau bank tidak dikenali.' };
    }

    if (channel.status !== 'active') {
      return {
        success: false,
        error: `Saluran ${channel.name} saat ini ${channel.status === 'maintenance' ? 'sedang dalam perbaikan sistem' : 'segera hadir'}. Silakan pilih saluran yang berstatus Aktif.`,
      };
    }

    if (!data.accountHolderName || !data.accountHolderName.trim()) {
      return { success: false, error: 'Nama pemilik rekening wajib diisi.' };
    }

    if (!data.accountNumber || !data.accountNumber.trim()) {
      return { success: false, error: 'Nomor rekening atau nomor handphone wajib diisi.' };
    }

    const verificationId = `pacc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const verification: PaymentAccountVerification = {
      id: verificationId,
      userId: user.id,
      userEmail: user.email,
      userName: user.fullName,
      bankCode: channel.code,
      bankName: channel.name,
      channelStatus: channel.status,
      channelNote: channel.description,
      accountHolderName: data.accountHolderName.trim(),
      accountNumber: data.accountNumber.trim(),
      proofUrl: data.proofUrl || '',
      proofFileName: data.proofFileName || 'Bukti_Rekening.png',
      userNotes: data.userNotes,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    this.paymentAccountVerifications.set(verificationId, verification);

    // Update user recipient status to pending if not already verified
    if (user.recipientStatus !== 'verified') {
      user.recipientStatus = 'pending';
    }

    this.createNotification(
      user.id,
      `Verifikasi Rekening Diajukan: ${channel.name} 📋`,
      `Pengajuan verifikasi rekening ${channel.name} (${data.accountNumber.trim()}) telah diterima dan sedang menunggu konfirmasi admin.`,
      'payment',
      '/balance'
    );

    this.logAudit(
      user.id,
      user.email,
      'RECIPIENT_VERIFICATION_SUBMITTED',
      'PaymentAccountVerification',
      verificationId,
      `Submitted ${channel.name} (${data.accountNumber}) verification request.`
    );

    return { success: true, verification };
  }

  public reviewPaymentAccountVerification(
    verificationId: string,
    adminUser: User,
    action: 'approve' | 'reject',
    feedback?: string
  ): { success: boolean; verification?: PaymentAccountVerification; user?: User; error?: string } {
    const verification = this.paymentAccountVerifications.get(verificationId);
    if (!verification) {
      return { success: false, error: 'Data verifikasi rekening tidak ditemukan.' };
    }

    const targetUser = this.users.get(verification.userId);
    if (!targetUser) {
      return { success: false, error: 'Target user tidak ditemukan.' };
    }

    if (action === 'approve') {
      verification.status = 'verified';
      verification.reviewedAt = new Date().toISOString();
      verification.reviewedBy = adminUser.fullName;
      verification.adminFeedback = feedback || 'Rekening terverifikasi dan aktif.';

      targetUser.recipientStatus = 'verified';
      targetUser.recipientDetails = {
        method: ['dana', 'ovo', 'gopay'].includes(verification.bankCode) ? 'paypal' : 'bank',
        accountName: verification.accountHolderName,
        accountNumber: verification.accountNumber,
        bankOrProviderName: verification.bankName,
        notes: feedback,
      };

      this.createNotification(
        targetUser.id,
        `Rekening ${verification.bankName} Terverifikasi! ✅`,
        `Admin telah mengonfirmasi rekening ${verification.bankName} (${verification.accountNumber}) a.n ${verification.accountHolderName}. Anda kini dapat melakukan penarikan dana.`,
        'payment',
        '/balance'
      );

      this.logAudit(
        adminUser.id,
        adminUser.email,
        'RECIPIENT_VERIFICATION_APPROVED',
        'PaymentAccountVerification',
        verification.id,
        `Approved ${verification.bankName} account for ${targetUser.email}`
      );
    } else {
      verification.status = 'rejected';
      verification.reviewedAt = new Date().toISOString();
      verification.reviewedBy = adminUser.fullName;
      verification.adminFeedback = feedback || 'Data rekening tidak sesuai dengan dokumen.';

      // Check if user still has other verified accounts
      const hasOtherVerified = Array.from(this.paymentAccountVerifications.values()).some(
        (v) => v.userId === targetUser.id && v.id !== verification.id && v.status === 'verified'
      );

      if (!hasOtherVerified) {
        targetUser.recipientStatus = 'rejected';
      }

      this.createNotification(
        targetUser.id,
        `Verifikasi Rekening ${verification.bankName} Ditolak ⚠️`,
        `Alasan: "${verification.adminFeedback}". Silakan periksa kembali data Anda dan ajukan ulang.`,
        'payment',
        '/balance'
      );

      this.logAudit(
        adminUser.id,
        adminUser.email,
        'RECIPIENT_VERIFICATION_REJECTED',
        'PaymentAccountVerification',
        verification.id,
        `Rejected ${verification.bankName} account for ${targetUser.email}: ${feedback}`
      );
    }

    return { success: true, verification, user: targetUser };
  }

  public getPaymentAccountVerifications(userId?: string): PaymentAccountVerification[] {
    const list = Array.from(this.paymentAccountVerifications.values());
    if (userId) {
      return list
        .filter((v) => v.userId === userId)
        .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
    }
    return list.sort(
      (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    );
  }

  public deletePaymentAccountVerification(
    verificationId: string,
    userId: string
  ): { success: boolean; error?: string } {
    const verification = this.paymentAccountVerifications.get(verificationId);
    if (!verification) {
      return { success: false, error: 'Data verifikasi rekening tidak ditemukan.' };
    }
    if (verification.userId !== userId) {
      return { success: false, error: 'Akses ditolak.' };
    }

    this.paymentAccountVerifications.delete(verificationId);
    return { success: true };
  }

  // --- Notifications Helper ---
  public createNotification(
    userId: string,
    title: string,
    message: string,
    type: 'job' | 'submission' | 'payment' | 'withdrawal' | 'security' | 'system',
    link?: string
  ) {
    const notif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      title,
      message,
      type,
      read: false,
      link,
      createdAt: new Date().toISOString(),
    };
    this.notifications.set(notif.id, notif);
  }

  // ==========================================
  // WEJOBS MONTHLY CHALLENGE ENGINE METHODS
  // ==========================================

  public getChallengesList(): Challenge[] {
    return Array.from(this.challenges.values());
  }

  public getActiveChallenge(slugOrId?: string): {
    challenge: Challenge;
    stats: {
      registeredCount: number;
      remainingSlots: number;
      percentageFilled: number;
      slotStatus: 'AVAILABLE' | 'LIMITED' | 'ALMOST_FULL' | 'FULL';
      serverTime: string;
    };
  } | null {
    let matched: Challenge | undefined;

    if (slugOrId) {
      matched = Array.from(this.challenges.values()).find(
        (c) => c.slug === slugOrId || c.id === slugOrId
      );
    }

    if (!matched) {
      // Find default active featured challenge
      matched = Array.from(this.challenges.values()).find(
        (c) => c.status === 'active' && c.isFeatured
      );
    }

    if (!matched) {
      matched = Array.from(this.challenges.values())[0];
    }

    if (!matched) return null;

    // Count dynamic valid participants directly from database
    let validCount = 0;
    for (const p of this.challengeParticipants.values()) {
      if (p.challengeId === matched.id && p.participantStatus !== 'disqualified') {
        validCount++;
      }
    }

    const remainingSlots = Math.max(0, matched.maxParticipants - validCount);
    const percentageFilled = Number(((validCount / matched.maxParticipants) * 100).toFixed(1));

    let slotStatus: 'AVAILABLE' | 'LIMITED' | 'ALMOST_FULL' | 'FULL' = 'AVAILABLE';
    if (remainingSlots <= 0) {
      slotStatus = 'FULL';
    } else if (remainingSlots < 50) {
      slotStatus = 'ALMOST_FULL';
    } else if (remainingSlots < 100) {
      slotStatus = 'LIMITED';
    } else {
      slotStatus = 'AVAILABLE';
    }

    return {
      challenge: matched,
      stats: {
        registeredCount: validCount,
        remainingSlots,
        percentageFilled,
        slotStatus,
        serverTime: new Date().toISOString(),
      },
    };
  }

  public getChallengeLeaderboard(challengeId: string): ChallengeParticipant[] {
    const list: ChallengeParticipant[] = [];

    for (const p of this.challengeParticipants.values()) {
      if (p.challengeId === challengeId) {
        list.push({ ...p });
      }
    }

    // Sort by score descending (if tied, by acceptance rate then rating)
    list.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.acceptanceRate !== a.acceptanceRate) return b.acceptanceRate - a.acceptanceRate;
      return b.averageRating - a.averageRating;
    });

    // Assign ranks dynamically
    list.forEach((item, index) => {
      item.rank = index + 1;
    });

    return list;
  }

  public getUserChallengeStatus(
    challengeId: string,
    userId: string
  ): { isRegistered: boolean; participant?: ChallengeParticipant } {
    for (const p of this.challengeParticipants.values()) {
      if (p.challengeId === challengeId && p.userId === userId) {
        // Find true current rank
        const leaderboard = this.getChallengeLeaderboard(challengeId);
        const ranked = leaderboard.find((item) => item.id === p.id) || p;
        return { isRegistered: true, participant: ranked };
      }
    }
    return { isRegistered: false };
  }

  public registerUserForChallenge(
    challengeId: string,
    user: User,
    data: {
      displayName?: string;
      country?: string;
      agreedRules: boolean;
      agreedFraudPolicy: boolean;
      agreedLeaderboardReview: boolean;
    }
  ): { success: boolean; participant?: ChallengeParticipant; error?: string } {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) {
      return { success: false, error: 'Challenge not found.' };
    }

    // Check user eligibility as required in Section 8
    if (user.isRestricted) {
      return { success: false, error: 'Your account is currently restricted or blocked from participating.' };
    }

    // Check unique(challenge_id, user_id) constraint (Section 9)
    for (const p of this.challengeParticipants.values()) {
      if (p.challengeId === challengeId && p.userId === user.id) {
        return { success: false, error: 'You are already registered for this Monthly Challenge.' };
      }
    }

    // Check registration period
    const now = new Date();
    const regStart = new Date(challenge.registrationStartAt);
    const regEnd = new Date(challenge.registrationEndAt);

    if (now < regStart) {
      return {
        success: false,
        error: `Registration opens on ${regStart.toLocaleDateString()}. Please check back soon.`,
      };
    }

    if (now > regEnd) {
      return {
        success: false,
        error: 'Registration for this challenge is now closed.',
      };
    }

    if (!data.agreedRules || !data.agreedFraudPolicy || !data.agreedLeaderboardReview) {
      return {
        success: false,
        error: 'You must agree to all Monthly Challenge Rules and Fair Play policies to register.',
      };
    }

    // Atomic Slot Reservation Check (Section 22)
    let currentValidCount = 0;
    for (const p of this.challengeParticipants.values()) {
      if (p.challengeId === challengeId && p.participantStatus !== 'disqualified') {
        currentValidCount++;
      }
    }

    if (currentValidCount >= challenge.maxParticipants) {
      return {
        success: false,
        error: 'Sorry, all challenge slots have just been filled.',
      };
    }

    // Generate unique participant ID
    const nextSeq = currentValidCount + 1;
    const participantId = `WMC-202609-${String(nextSeq).padStart(4, '0')}`;
    const country = data.country?.trim() || user.address?.split(',').pop()?.trim() || 'Global Contributor';
    const displayName = data.displayName?.trim() || user.fullName;

    const newParticipant: ChallengeParticipant = {
      id: participantId,
      challengeId: challenge.id,
      userId: user.id,
      userEmail: user.email,
      userFullName: user.fullName,
      displayName,
      avatarType: user.avatarType || 'builtin',
      builtinAvatarId: user.builtinAvatarId || 'panda',
      avatarId: user.avatarId || 'panda',
      country,
      participantStatus: 'registered',
      joinedAt: new Date().toISOString(),
      score: 0,
      rank: nextSeq,
      completedTasksCount: 0,
      acceptanceRate: 100,
      averageRating: user.rating || 5.0,
      fraudStatus: 'clean',
      pointAdjustments: [],
    };

    this.challengeParticipants.set(participantId, newParticipant);

    // Create confirmation notification (Section 24)
    this.createNotification(
      user.id,
      `🏆 You're officially registered for the WEJOBS Monthly Challenge!`,
      `Participant ID: ${participantId}. Win up to $1,000 USD for 1st Place! Start completing tasks to climb the leaderboard.`,
      'job',
      `/challenge/${challenge.slug}`
    );

    this.logAudit(
      user.id,
      user.email,
      'CHALLENGE_REGISTRATION',
      'ChallengeParticipant',
      participantId,
      `User registered for "${challenge.title}". Participant ID: ${participantId}`
    );

    return { success: true, participant: newParticipant };
  }

  public awardChallengePointsOnTaskApproval(userId: string, assignment: TaskAssignment) {
    // Find active challenges
    const activeChallenges = Array.from(this.challenges.values()).filter(
      (c) => c.status === 'active'
    );

    for (const chal of activeChallenges) {
      // Find participant
      let participant: ChallengeParticipant | undefined;
      for (const p of this.challengeParticipants.values()) {
        if (p.challengeId === chal.id && p.userId === userId && p.participantStatus !== 'disqualified') {
          participant = p;
          break;
        }
      }

      if (!participant) continue;

      // Calculate task points based on payment / size tier (Section 12)
      let taskBasePoints = chal.pointRules.mediumTask || 20;
      if (assignment.payment <= 6) {
        taskBasePoints = chal.pointRules.microtask || 5;
      } else if (assignment.payment <= 15) {
        taskBasePoints = chal.pointRules.smallTask || 10;
      } else if (assignment.payment <= 25) {
        taskBasePoints = chal.pointRules.mediumTask || 20;
      } else if (assignment.payment <= 35) {
        taskBasePoints = chal.pointRules.mediumHighTask || 30;
      } else {
        taskBasePoints = chal.pointRules.largeTask || 50;
      }

      // Calculate bonuses
      let bonusPoints = 0;
      // 5-Star Rating bonus (+5)
      bonusPoints += chal.pointRules.rating5Bonus || 5;

      // Accepted without revision (v1) (+5)
      if (assignment.submissionVersions.length <= 1) {
        bonusPoints += chal.pointRules.firstTimeAcceptedBonus || 5;
      }

      // Early completion bonus (+3)
      if (assignment.deadlineAt && new Date() < new Date(assignment.deadlineAt)) {
        bonusPoints += chal.pointRules.earlyCompletionBonus || 3;
      }

      const totalAwarded = taskBasePoints + bonusPoints;
      participant.score += totalAwarded;
      participant.completedTasksCount += 1;
      participant.participantStatus = 'active';

      this.createNotification(
        userId,
        `+${totalAwarded} Challenge Points Earned! ⚡`,
        `Task "${assignment.taskTitle}" awarded +${taskBasePoints} base pts & +${bonusPoints} quality bonuses. You are climbing the Monthly Challenge Leaderboard!`,
        'job',
        `/challenge/${chal.slug}`
      );
    }
  }

  public adminUpdateChallenge(
    challengeId: string,
    updates: Partial<Challenge>,
    adminUser: User
  ): { success: boolean; challenge?: Challenge; error?: string } {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) {
      return { success: false, error: 'Challenge not found.' };
    }

    Object.assign(challenge, updates);
    challenge.updatedAt = new Date().toISOString();

    this.logAudit(
      adminUser.id,
      adminUser.email,
      'CHALLENGE_UPDATED',
      'Challenge',
      challengeId,
      `Updated challenge configuration for "${challenge.title}".`
    );

    return { success: true, challenge };
  }

  public adminFlagParticipant(
    challengeId: string,
    participantId: string,
    status: ParticipantStatus,
    fraudStatus: 'clean' | 'suspicious' | 'confirmed_fraud',
    reason: string,
    adminUser: User
  ): { success: boolean; participant?: ChallengeParticipant; error?: string } {
    const participant = this.challengeParticipants.get(participantId);
    if (!participant || participant.challengeId !== challengeId) {
      return { success: false, error: 'Participant not found.' };
    }

    participant.participantStatus = status;
    participant.fraudStatus = fraudStatus;

    if (status === 'disqualified') {
      participant.disqualificationReason = reason;
      this.createNotification(
        participant.userId,
        'Challenge Disqualification Notice ⚠️',
        `Your participation in the Monthly Challenge was disqualified. Reason: "${reason}". You may file an appeal from the Challenge page.`,
        'security',
        '/challenge'
      );
    } else if (status === 'flagged') {
      participant.flagReason = reason;
      this.createNotification(
        participant.userId,
        'Challenge Account Flagged for Review ⚠️',
        `Your challenge submissions have been flagged for manual verification: "${reason}".`,
        'security',
        '/challenge'
      );
    }

    this.logAudit(
      adminUser.id,
      adminUser.email,
      'CHALLENGE_PARTICIPANT_STATUS_CHANGED',
      'ChallengeParticipant',
      participantId,
      `Changed status to ${status} (${fraudStatus}): ${reason}`
    );

    return { success: true, participant };
  }

  public adminAdjustParticipantPoints(
    challengeId: string,
    participantId: string,
    amount: number,
    reason: string,
    adminUser: User
  ): { success: boolean; participant?: ChallengeParticipant; error?: string } {
    const participant = this.challengeParticipants.get(participantId);
    if (!participant || participant.challengeId !== challengeId) {
      return { success: false, error: 'Participant not found.' };
    }

    participant.score = Math.max(0, participant.score + amount);
    if (!participant.pointAdjustments) participant.pointAdjustments = [];

    participant.pointAdjustments.push({
      id: `adj-${Date.now()}`,
      amount,
      reason,
      createdAt: new Date().toISOString(),
      adminEmail: adminUser.email,
    });

    this.createNotification(
      participant.userId,
      `Challenge Points Adjustment (${amount > 0 ? `+${amount}` : amount} pts)`,
      `Admin adjusted your points: "${reason}". Current score: ${participant.score} pts.`,
      'job',
      '/challenge'
    );

    this.logAudit(
      adminUser.id,
      adminUser.email,
      'CHALLENGE_POINTS_ADJUSTED',
      'ChallengeParticipant',
      participantId,
      `Adjusted points by ${amount > 0 ? `+${amount}` : amount}: ${reason}`
    );

    return { success: true, participant };
  }

  public adminApproveWinners(
    challengeId: string,
    adminUser: User
  ): { success: boolean; rewards?: ChallengeReward[]; error?: string } {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) {
      return { success: false, error: 'Challenge not found.' };
    }

    challenge.rankingStatus = 'final';
    challenge.status = 'completed';

    const leaderboard = this.getChallengeLeaderboard(challengeId).filter(
      (p) => p.participantStatus !== 'disqualified' && p.fraudStatus === 'clean'
    );

    const generatedRewards: ChallengeReward[] = [];

    challenge.prizes.forEach((prize) => {
      let targetWinner: ChallengeParticipant | undefined;

      if (prize.rank) {
        targetWinner = leaderboard[prize.rank - 1];
      } else {
        // Special category prizes
        if (prize.title.includes('Writer')) {
          targetWinner = leaderboard.find((p) => p.rank > 3 && p.averageRating >= 4.9);
        } else if (prize.title.includes('Rising')) {
          targetWinner = leaderboard.find((p) => p.rank > 3 && p.completedTasksCount >= 10);
        } else {
          targetWinner = leaderboard[3] || leaderboard[0];
        }
      }

      if (targetWinner) {
        targetWinner.participantStatus = 'winner';
        const rewardId = `rew-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const reward: ChallengeReward = {
          id: rewardId,
          challengeId: challenge.id,
          userId: targetWinner.userId,
          userFullName: targetWinner.userFullName,
          userEmail: targetWinner.userEmail,
          category: prize.title,
          rank: prize.rank || 0,
          amount: prize.amount,
          currency: 'USD',
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        this.challengeRewards.set(rewardId, reward);
        generatedRewards.push(reward);

        this.createNotification(
          targetWinner.userId,
          `🏆 CONGRATULATIONS! You Won ${prize.title} ($${prize.amount.toFixed(2)} USD)!`,
          `You placed #${targetWinner.rank} in the ${challenge.title}. Your reward of $${prize.amount.toFixed(2)} USD is pending payout approval.`,
          'payment',
          '/challenge'
        );
      }
    });

    this.logAudit(
      adminUser.id,
      adminUser.email,
      'CHALLENGE_WINNERS_APPROVED',
      'Challenge',
      challengeId,
      `Approved final winners and generated ${generatedRewards.length} reward disbursement entries.`
    );

    return { success: true, rewards: generatedRewards };
  }

  public adminPayReward(
    rewardId: string,
    adminUser: User
  ): { success: boolean; reward?: ChallengeReward; error?: string } {
    const reward = this.challengeRewards.get(rewardId);
    if (!reward) {
      return { success: false, error: 'Reward record not found.' };
    }

    if (reward.status === 'paid') {
      return { success: false, error: 'This reward has already been disbursed.' };
    }

    const targetUser = this.users.get(reward.userId);
    if (!targetUser) {
      return { success: false, error: 'Winner user record not found.' };
    }

    // Atomic Balance Ledger Credit (Section 28)
    const userBal = this.getUserBalance(targetUser.id);
    const newBal = Number((userBal.available + reward.amount).toFixed(2));

    const txId = `tx-rew-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const tx: Transaction = {
      id: txId,
      userId: targetUser.id,
      type: 'bonus',
      amount: reward.amount,
      description: `🏆 WEJOBS Monthly Challenge Reward: ${reward.category} ($${reward.amount.toFixed(2)} USD)`,
      referenceId: reward.id,
      status: 'completed',
      createdAt: new Date().toISOString(),
      balanceAfter: newBal,
    };
    this.transactions.set(txId, tx);

    reward.status = 'paid';
    reward.transactionId = txId;
    reward.approvedBy = adminUser.fullName;
    reward.approvedAt = new Date().toISOString();
    reward.paidAt = new Date().toISOString();

    this.createNotification(
      targetUser.id,
      `Reward Paid! +$${reward.amount.toFixed(2)} USD Credited 💰`,
      `Your Monthly Challenge Prize of $${reward.amount.toFixed(2)} USD has been credited directly to your Available Balance.`,
      'payment',
      '/balance'
    );

    this.logAudit(
      adminUser.id,
      adminUser.email,
      'CHALLENGE_REWARD_PAID',
      'ChallengeReward',
      rewardId,
      `Disbursed reward $${reward.amount.toFixed(2)} USD to user ${targetUser.email}. Tx: ${txId}`
    );

    return { success: true, reward };
  }

  public submitChallengeAppeal(
    challengeId: string,
    user: User,
    data: { type: any; reason: string; evidence?: string }
  ): { success: boolean; appeal?: ChallengeAppeal; error?: string } {
    if (!data.reason?.trim()) {
      return { success: false, error: 'Please provide a clear justification for your appeal.' };
    }

    const appealId = `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const appeal: ChallengeAppeal = {
      id: appealId,
      challengeId,
      userId: user.id,
      userFullName: user.fullName,
      userEmail: user.email,
      type: data.type || 'disqualification',
      reason: data.reason.trim(),
      evidence: data.evidence?.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.challengeAppeals.set(appealId, appeal);

    this.createNotification(
      user.id,
      'Challenge Appeal Submitted 📩',
      'Your appeal has been received by our editorial compliance team for review.',
      'system',
      '/challenge'
    );

    return { success: true, appeal };
  }

  public adminResolveChallengeAppeal(
    appealId: string,
    status: 'accepted' | 'rejected',
    adminNote: string,
    adminUser: User,
    restorePoints?: number,
    restoreStatus?: ParticipantStatus
  ): { success: boolean; appeal?: ChallengeAppeal; error?: string } {
    const appeal = this.challengeAppeals.get(appealId);
    if (!appeal) {
      return { success: false, error: 'Appeal not found.' };
    }

    appeal.status = status;
    appeal.adminNote = adminNote;
    appeal.resolvedBy = adminUser.fullName;
    appeal.resolvedAt = new Date().toISOString();

    if (status === 'accepted') {
      // Find participant
      for (const p of this.challengeParticipants.values()) {
        if (p.challengeId === appeal.challengeId && p.userId === appeal.userId) {
          if (restoreStatus) {
            p.participantStatus = restoreStatus;
            p.fraudStatus = 'clean';
          }
          if (restorePoints && restorePoints > 0) {
            p.score += restorePoints;
          }
          break;
        }
      }
    }

    this.createNotification(
      appeal.userId,
      `Appeal Decision: ${status.toUpperCase()} ⚖️`,
      `Your appeal has been ${status === 'accepted' ? 'APPROVED' : 'REJECTED'}. Note: "${adminNote}".`,
      'system',
      '/challenge'
    );

    this.logAudit(
      adminUser.id,
      adminUser.email,
      'CHALLENGE_APPEAL_RESOLVED',
      'ChallengeAppeal',
      appealId,
      `Resolved appeal (${status}): ${adminNote}`
    );

    return { success: true, appeal };
  }

  public getChallengeHistories(): ChallengeChampionHistory[] {
    return Array.from(this.challengeHistories.values());
  }

  public getChallengeRewards(challengeId?: string): ChallengeReward[] {
    const list = Array.from(this.challengeRewards.values());
    if (challengeId) {
      return list.filter((r) => r.challengeId === challengeId);
    }
    return list;
  }

  public getChallengeAppeals(challengeId?: string): ChallengeAppeal[] {
    const list = Array.from(this.challengeAppeals.values());
    if (challengeId) {
      return list.filter((a) => a.challengeId === challengeId);
    }
    return list;
  }
}

export const db = new DatabaseStore();

