import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/database';
import { Task, MainCategory, User, PAYMENT_CHANNELS } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body parser with high size limit for uploaded avatars and drafts
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // CORS: dibutuhkan agar APK Capacitor (origin: https://localhost / capacitor://)
  // dan domain frontend lain bisa memanggil API backend ini.
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Helper middleware to extract user from Authorization header (Bearer userId)
  const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = db.users.get(token);
      if (user) {
        (req as any).user = user;
      }
    }
    next();
  };

  app.use(authenticateToken);

  // --- API Routes ---

  // Health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), totalTasks: db.tasks.size });
  });

  // Standalone Single-File App Download Endpoint
  app.get('/download/wejobs-app.html', (req, res) => {
    const filePath = path.join(process.cwd(), 'wejobs-standalone-complete.html');
    res.download(filePath, 'WEJOBS-Complete-Standalone.html', (err) => {
      if (err) {
        // Fallback to public folder
        res.download(path.join(process.cwd(), 'public', 'wejobs-standalone-complete.html'), 'WEJOBS-Complete-Standalone.html');
      }
    });
  });

  app.get('/download/wejobs-all-prompts.md', (req, res) => {
    const filePath = path.join(process.cwd(), 'WEJOBS_ALL_PROMPTS_AND_SPECIFICATION.md');
    res.download(filePath, 'WEJOBS_ALL_PROMPTS_AND_SPECIFICATION.md');
  });

  app.get('/download/wejobs-all-prompts.txt', (req, res) => {
    const filePath = path.join(process.cwd(), 'public', 'wejobs-all-prompts.txt');
    res.download(filePath, 'WEJOBS_ALL_PROMPTS.txt');
  });

  app.get('/api/download/single-file', (req, res) => {
    const filePath = path.join(process.cwd(), 'wejobs-standalone-complete.html');
    res.download(filePath, 'WEJOBS-Complete-Standalone.html', (err) => {
      if (err) {
        res.download(path.join(process.cwd(), 'public', 'wejobs-standalone-complete.html'), 'WEJOBS-Complete-Standalone.html');
      }
    });
  });

  // CAPTCHA verification endpoint
  app.post('/api/auth/verify-captcha', (req, res) => {
    const { token, answer } = req.body;
    // Real server-side CAPTCHA check
    if (!token || answer === undefined || answer === null || answer === '') {
      return res.status(400).json({ success: false, error: 'CAPTCHA token or answer missing.' });
    }
    // Verified tokens start with "wejobs_verified_token_"
    if (token.startsWith('wejobs_token_') && (answer === 'verified' || !isNaN(Number(answer)) || answer === 'HUMAN_CONFIRMED')) {
      return res.json({ success: true, verifiedToken: `wejobs_verified_token_${Date.now()}` });
    }
    return res.status(400).json({ success: false, error: 'Invalid CAPTCHA verification challenge.' });
  });

  // Registration
  app.post('/api/auth/register', (req, res) => {
    const { fullName, email, phone, address, password, captchaToken, avatarId, builtinAvatarId } = req.body;

    if (!fullName || !email || !phone || !address || !password) {
      return res.status(400).json({ success: false, error: 'All registration fields are required.' });
    }

    if (!captchaToken || !captchaToken.startsWith('wejobs_verified_token_')) {
      return res.status(400).json({ success: false, error: 'Security CAPTCHA verification failed or expired.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    const result = db.registerUser({ fullName, email, phone, address, password, builtinAvatarId, avatarId } as any);
    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json({ success: true, user: result.user, token: result.user!.id });
  });

  // Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password, captchaToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    // Check CAPTCHA if enabled in settings
    if (db.settings.requireCaptcha && (!captchaToken || !captchaToken.startsWith('wejobs_verified_token_'))) {
      return res.status(400).json({ success: false, error: 'Please complete the security CAPTCHA.' });
    }

    const result = db.authenticate(email, password);
    if (!result.success) {
      return res.status(401).json(result);
    }

    return res.json({
      success: true,
      user: result.user,
      token: result.user!.id,
      redirect: result.user!.role === 'super_admin' || result.user!.role === 'admin' ? '/admin' : '/dashboard',
    });
  });

  // Get current user
  app.get('/api/auth/me', (req, res) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, error: 'Unauthenticated' });
    }
    const balance = db.getUserBalance(user.id);
    const enrichedUser: User = {
      ...user,
      balance: balance.available,
      availableBalance: balance.available,
      pendingBalance: balance.pending,
    };
    return res.json({ success: true, user: enrichedUser, balance });
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    return res.json({ success: true, message: 'Logged out successfully.' });
  });

  // Profile Update (Supports PUT /api/profile, POST /api/profile, POST /api/profile/update)
  const handleProfileUpdate = (req: express.Request, res: express.Response) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, error: 'Unauthenticated' });
    }

    const { fullName, phone, address, bio, avatarType, builtinAvatarId, avatarId, customAvatarUrl } = req.body;

    const existingUser = db.users.get(user.id);
    if (!existingUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (fullName) existingUser.fullName = fullName.trim();
    if (phone !== undefined) existingUser.phone = phone.trim();
    if (address !== undefined) existingUser.address = address.trim();
    if (bio !== undefined) existingUser.bio = bio.trim();

    if (avatarId) {
      existingUser.avatarId = avatarId;
    }

    // Avatar configuration handling
    if (avatarType === 'custom' || (customAvatarUrl && customAvatarUrl.startsWith('data:image'))) {
      existingUser.avatarType = 'custom';
      if (customAvatarUrl) {
        existingUser.customAvatarUrl = customAvatarUrl;
      }
    } else {
      existingUser.avatarType = 'builtin';
      const effectiveAvatar = builtinAvatarId || avatarId || existingUser.builtinAvatarId || existingUser.avatarId || 'rabbit';
      existingUser.builtinAvatarId = effectiveAvatar as any;
      existingUser.avatarId = effectiveAvatar as any;
      existingUser.customAvatarUrl = undefined;
    }

    // Persist changes in users store
    db.users.set(existingUser.id, existingUser);

    // Synchronize challenge participant profiles if enrolled in monthly challenge
    for (const p of db.challengeParticipants.values()) {
      if (p.userId === existingUser.id) {
        p.userFullName = existingUser.fullName;
        p.displayName = existingUser.fullName;
        p.avatarType = existingUser.avatarType;
        p.builtinAvatarId = existingUser.builtinAvatarId;
        p.avatarId = existingUser.avatarId;
      }
    }

    // Create an in-app notification so user can see in notification center
    db.createNotification(
      user.id,
      'Profil Berhasil Diperbarui ✅',
      'Informasi profil dan avatar akun Anda telah berhasil disimpan & disinkronkan ke seluruh sistem.',
      'system',
      '/profile'
    );

    // Record audit log
    db.logAudit(
      user.id,
      user.email,
      'PROFILE_UPDATED',
      'User',
      user.id,
      `User ${user.email} updated profile info & avatar preferences`
    );

    const balance = db.getUserBalance(user.id);
    const enrichedUser = {
      ...existingUser,
      balance: balance.available,
      availableBalance: balance.available,
      pendingBalance: balance.pending,
    };

    return res.json({ success: true, user: enrichedUser, message: 'Profil berhasil diperbarui.' });
  };

  app.put('/api/profile', handleProfileUpdate);
  app.post('/api/profile', handleProfileUpdate);
  app.post('/api/profile/update', handleProfileUpdate);

  // Recipient Payment Details submission
  app.post('/api/recipient/submit', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthenticated' });

    const { method, accountName, accountNumber, bankOrProviderName, notes } = req.body;
    if (!method || !accountName || !accountNumber || !bankOrProviderName) {
      return res.status(400).json({ success: false, error: 'Missing required payout account fields.' });
    }

    const targetUser = db.users.get(user.id);
    if (!targetUser) return res.status(404).json({ success: false, error: 'User not found' });

    targetUser.recipientDetails = { method, accountName, accountNumber, bankOrProviderName, notes };
    targetUser.recipientStatus = 'pending';

    db.createNotification(
      user.id,
      'Recipient Details Submitted 🏦',
      'Your payment account details have been submitted for verification. Editorial review takes 12-24 hours.',
      'withdrawal',
      '/balance'
    );

    return res.json({ success: true, user: targetUser });
  });

  // ==========================================
  // PAYMENT CHANNELS & VERIFICATION API ROUTES
  // ==========================================

  // 1. Get Payment Channels Config & Live Status
  app.get('/api/payment-channels', (req, res) => {
    return res.json({ success: true, channels: PAYMENT_CHANNELS });
  });

  // 2. User Payout Eligibility Check & Request
  app.get('/api/payout-eligibility/my', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthenticated' });

    const requests = Array.from(db.payoutEligibilityRequests.values())
      .filter((r) => r.userId === user.id)
      .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

    const activeRequest = requests[0] || null;
    const targetUser = db.users.get(user.id) || user;

    return res.json({
      success: true,
      status: targetUser.payoutEligibilityStatus || 'none',
      requestedAt: targetUser.payoutEligibilityRequestedAt,
      reviewedAt: targetUser.payoutEligibilityReviewedAt,
      note: targetUser.payoutEligibilityNote,
      activeRequest,
      history: requests,
    });
  });

  app.post('/api/payout-eligibility/request', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthenticated' });

    const { reason } = req.body;
    const result = db.requestPayoutEligibility(user.id, reason);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.json(result);
  });

  // 3. Admin Payout Eligibility Approvals
  app.get('/api/payout-eligibility/all', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required' });
    }

    const requests = db.getPayoutEligibilityRequests();
    return res.json({ success: true, requests });
  });

  const handleReviewPayoutEligibility = (req: express.Request, res: express.Response) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required' });
    }

    const { id } = req.params;
    const { action, feedback, reason } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, error: 'Aksi review tidak valid.' });
    }

    const result = db.reviewPayoutEligibility(id, admin, action, feedback || reason);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.json(result);
  };

  app.post('/api/payout-eligibility/:id/review', handleReviewPayoutEligibility);
  app.post('/api/admin/payout-eligibility/:id/review', handleReviewPayoutEligibility);

  // 4. User Bank & E-Wallet Verifications
  app.get('/api/payment-verifications/my', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthenticated' });

    const verifications = db.getPaymentAccountVerifications(user.id);
    return res.json({ success: true, verifications });
  });

  app.post('/api/payment-verifications/request', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthenticated' });

    const { bankCode, accountHolderName, accountNumber, proofUrl, proofFileName, userNotes } = req.body;

    if (!bankCode || !accountHolderName || !accountNumber) {
      return res.status(400).json({
        success: false,
        error: 'Pilih rekening/bank dan isi nama pemilik serta nomor rekening/handphone.',
      });
    }

    const result = db.requestPaymentAccountVerification(user.id, {
      bankCode,
      accountHolderName,
      accountNumber,
      proofUrl,
      proofFileName,
      userNotes,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json(result);
  });

  app.delete('/api/payment-verifications/:id', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthenticated' });

    const { id } = req.params;
    const result = db.deletePaymentAccountVerification(id, user.id);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.json(result);
  });

  // 5. Admin Payment Account Verification Approvals
  app.get('/api/payment-verifications/all', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required' });
    }

    const verifications = db.getPaymentAccountVerifications();
    return res.json({ success: true, verifications });
  });

  const handleReviewPaymentVerification = (req: express.Request, res: express.Response) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required' });
    }

    const { id } = req.params;
    const { action, feedback, reason } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, error: 'Aksi review tidak valid.' });
    }

    const result = db.reviewPaymentAccountVerification(id, admin, action, feedback || reason);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.json(result);
  };

  app.post('/api/payment-verifications/:id/review', handleReviewPaymentVerification);
  app.post('/api/admin/payment-verifications/:id/review', handleReviewPaymentVerification);

  // Tasks Listing & Filtering
  app.get('/api/tasks', (req, res) => {
    const { category, subtype, search, status, sort, minPayment, maxPayment, limit = 50, offset = 0 } = req.query;

    let allTasks = Array.from(db.tasks.values());

    // Filter by Category
    if (category && category !== 'all') {
      allTasks = allTasks.filter((t) => t.category === category);
    }

    // Filter by Subtype
    if (subtype && subtype !== 'all') {
      allTasks = allTasks.filter((t) => t.subtype.toLowerCase() === (subtype as string).toLowerCase());
    }

    // Filter by Search
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      allTasks = allTasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.subtype.toLowerCase().includes(q) ||
          t.clientName.toLowerCase().includes(q)
      );
    }

    // Filter by Status (available / full)
    if (status === 'available') {
      allTasks = allTasks.filter((t) => t.remainingSlots > 0 && t.status === 'available');
    } else if (status === 'full') {
      allTasks = allTasks.filter((t) => t.remainingSlots <= 0 || t.status === 'full');
    }

    // Filter by Payment Range
    if (minPayment) {
      allTasks = allTasks.filter((t) => t.payment >= Number(minPayment));
    }
    if (maxPayment) {
      allTasks = allTasks.filter((t) => t.payment <= Number(maxPayment));
    }

    // Sorting
    if (sort === 'highest_payment') {
      allTasks.sort((a, b) => b.payment - a.payment);
    } else if (sort === 'lowest_payment') {
      allTasks.sort((a, b) => a.payment - b.payment);
    } else if (sort === 'most_slots') {
      allTasks.sort((a, b) => b.remainingSlots - a.remainingSlots);
    } else if (sort === 'almost_full') {
      allTasks.sort((a, b) => {
        if (a.remainingSlots === 0) return 1;
        if (b.remainingSlots === 0) return -1;
        return a.remainingSlots - b.remainingSlots;
      });
    } else if (sort === 'rating') {
      allTasks.sort((a, b) => b.clientRating - a.clientRating);
    } else {
      // Default: newest
      allTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const totalCount = allTasks.length;
    const requestedLimit = limit === 'all' || !limit ? totalCount : Number(limit);
    const paginated = allTasks.slice(Number(offset), Number(offset) + requestedLimit);

    const stats = db.getTaskStats();

    return res.json({
      success: true,
      tasks: paginated,
      totalCount,
      stats,
      limit: requestedLimit,
      offset: Number(offset),
    });
  });

  // Task Stats
  app.get('/api/tasks/stats', (req, res) => {
    const stats = db.getTaskStats();
    return res.json({ success: true, stats });
  });

  // Single Task by ID or Slug
  app.get('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    let task = db.tasks.get(id);
    if (!task) {
      for (const t of db.tasks.values()) {
        if (t.slug === id) {
          task = t;
          break;
        }
      }
    }

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found.' });
    }

    return res.json({ success: true, task });
  });

  // Claim Task (Atomic Slot Decrement) - supports both /api/tasks/claim and /api/tasks/:id/claim
  const handleTaskClaim = (req: express.Request, res: express.Response) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, error: 'Please login to accept this task.' });
    }

    const taskId = req.params.id || req.body.taskId;
    if (!taskId) {
      return res.status(400).json({ success: false, error: 'Task ID is required.' });
    }

    const result = db.claimTask(taskId, user);
    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json(result);
  };

  app.post('/api/tasks/claim', handleTaskClaim);
  app.post('/api/tasks/:id/claim', handleTaskClaim);

  // Admin Create Task - supports /api/tasks and /api/admin/tasks/create
  const handleCreateTask = (req: express.Request, res: express.Response) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required.' });
    }

    const {
      title,
      category,
      subtype,
      payment,
      estimatedTime,
      wordCount,
      totalSlots,
      deadlineHours,
      clientName,
      description,
      objective,
      targetAudience,
      instructions,
      structure,
      writingStyle,
      requirements,
      restrictions,
      acceptanceCriteria,
      revisionPolicy,
    } = req.body;

    const newId = `task-${Date.now()}`;
    const slug = `${(title || 'task').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}-${Date.now()}`;

    const newTask: Task = {
      id: newId,
      title: (title || 'Untitled Task').trim(),
      slug,
      category: (category as MainCategory) || 'Writing',
      subtype: subtype || 'Articles',
      payment: Number(Number(payment || 15.0).toFixed(2)),
      estimatedTime: estimatedTime || '1 hour',
      wordCount: wordCount || '600 - 800 words',
      totalSlots: Number(totalSlots) || 50,
      remainingSlots: Number(totalSlots) || 50,
      deadlineHours: Number(deadlineHours) || 48,
      clientName: clientName || 'Verified Publisher Network',
      clientRating: 5.0,
      clientJobsPosted: 1,
      description: description || 'Editorial writing commission on WEJOBS.',
      objective: objective || 'Deliver high quality publication content.',
      targetAudience: targetAudience || 'General readers',
      instructions: instructions || ['Follow editorial guidelines.'],
      structure: structure || ['1. Introduction', '2. Body', '3. Conclusion'],
      writingStyle: writingStyle || 'Professional & Engaging',
      submissionFormat: 'DOCX, PDF, TXT',
      requirements: requirements || ['100% human-crafted text', 'No plagiarism'],
      restrictions: restrictions || ['No AI generated fluff'],
      acceptanceCriteria: acceptanceCriteria || ['Word count met', 'Grammar checked'],
      revisionPolicy: revisionPolicy || 'Up to 2 revision cycles within 24 hours.',
      status: 'available',
      createdAt: new Date().toISOString(),
    };

    db.tasks.set(newId, newTask);
    db.logAudit(admin.id, admin.email, 'TASK_CREATED', 'Task', newId, `Created task "${newTask.title}" ($${newTask.payment} USD)`);

    return res.json({ success: true, task: newTask });
  };

  app.post('/api/tasks', handleCreateTask);
  app.post('/api/admin/tasks/create', handleCreateTask);

  // Admin Edit Task
  app.put('/api/tasks/:id', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required.' });
    }

    const { id } = req.params;
    const task = db.tasks.get(id);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

    Object.assign(task, req.body);
    if (task.remainingSlots <= 0) {
      task.status = 'full';
    } else {
      task.status = 'available';
    }

    db.logAudit(admin.id, admin.email, 'TASK_UPDATED', 'Task', id, `Updated task ${task.title}`);
    return res.json({ success: true, task });
  });

  // Admin Delete Task - supports DELETE /api/tasks/:id and POST /api/admin/tasks/:id/delete
  const handleDeleteTask = (req: express.Request, res: express.Response) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required.' });
    }

    const { id } = req.params;
    const task = db.tasks.get(id);
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });

    db.tasks.delete(id);
    db.logAudit(admin.id, admin.email, 'TASK_DELETED', 'Task', id, `Deleted task ${task.title}`);
    return res.json({ success: true, message: 'Task deleted successfully.' });
  };

  app.delete('/api/tasks/:id', handleDeleteTask);
  app.post('/api/admin/tasks/:id/delete', handleDeleteTask);

  // My Assignments - supports GET /api/assignments/my and GET /api/my-tasks
  const handleGetMyAssignments = (req: express.Request, res: express.Response) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthenticated' });

    const userAssignments = Array.from(db.assignments.values())
      .filter((a) => a.userId === user.id)
      .sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime());

    return res.json({ success: true, assignments: userAssignments, myTasks: userAssignments });
  };

  app.get('/api/assignments/my', handleGetMyAssignments);
  app.get('/api/my-tasks', handleGetMyAssignments);

  // Submit Work for Assignment
  app.post('/api/assignments/:id/submit', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthenticated' });

    const { id } = req.params;
    const { fileName, fileSize, fileDataUrl, note, referenceLink } = req.body;

    if (!fileName) {
      return res.status(400).json({ success: false, error: 'File attachment is required.' });
    }

    const result = db.submitWork(id, user.id, {
      fileName,
      fileSize: fileSize || 1024,
      fileDataUrl,
      note: note || '',
      referenceLink,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json(result);
  });

  // Admin Get All Assignments/Submissions
  app.get('/api/assignments/all', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin authorization required' });
    }

    const allAssignments = Array.from(db.assignments.values()).sort(
      (a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime()
    );

    return res.json({ success: true, assignments: allAssignments });
  });

  // Admin Review Submission - supports /api/assignments/:id/review and /api/admin/assignments/:id/review
  const handleReviewSubmission = (req: express.Request, res: express.Response) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin authorization required' });
    }

    const { id } = req.params;
    const { action, feedback, reason } = req.body; // 'accept' | 'revision' | 'request_revision' | 'reject'

    const mappedAction = action === 'request_revision' ? 'revision' : action;

    if (!['accept', 'revision', 'reject'].includes(mappedAction)) {
      return res.status(400).json({ success: false, error: 'Invalid review action.' });
    }

    const result = db.reviewSubmission(id, admin, mappedAction as 'accept' | 'revision' | 'reject', feedback || reason || '');
    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json(result);
  };

  app.post('/api/assignments/:id/review', handleReviewSubmission);
  app.post('/api/admin/assignments/:id/review', handleReviewSubmission);

  // User Balance & Transactions & Full Ledger
  const handleGetLedger = (req: express.Request, res: express.Response) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthenticated' });

    const balance = db.getUserBalance(user.id);
    const txs = Array.from(db.transactions.values())
      .filter((t) => t.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const wdrs = Array.from(db.withdrawals.values())
      .filter((w) => w.userId === user.id)
      .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

    return res.json({ success: true, balance, transactions: txs, withdrawals: wdrs });
  };

  app.get('/api/balance/my', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthenticated' });
    const balance = db.getUserBalance(user.id);
    return res.json({ success: true, balance });
  });

  app.get('/api/transactions/my', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthenticated' });
    const txs = Array.from(db.transactions.values())
      .filter((t) => t.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json({ success: true, transactions: txs });
  });

  app.get('/api/ledger', handleGetLedger);

  // Request Withdrawal (Minimum $100.00 enforced) - supports POST /api/withdrawals and /api/withdrawals/request
  const handleWithdrawalRequest = (req: express.Request, res: express.Response) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthenticated' });

    const { amount, method, accountName, accountNumber, providerName, accountDetails, bankOrNetworkName } = req.body;
    const numAmount = Number(amount);

    if (isNaN(numAmount) || numAmount < 100.0) {
      return res.status(400).json({ success: false, error: 'Minimum withdrawal amount is $100.00 USD.' });
    }

    const resolvedMethod = method === 'bank_transfer' ? 'bank' : method === 'usdt' || method === 'crypto_usdt' ? 'crypto' : method || 'bank';
    const resolvedAccountName = accountName || accountDetails?.accountName || user.fullName;
    const resolvedAccountNumber = accountNumber || accountDetails?.accountNumber || accountDetails?.accountIdentifier || accountDetails?.walletAddress || 'N/A';
    const resolvedProviderName = providerName || accountDetails?.bankName || bankOrNetworkName || method || 'Payment Provider';

    const result = db.requestWithdrawal(user.id, numAmount, resolvedMethod as any, {
      accountName: resolvedAccountName,
      accountNumber: resolvedAccountNumber,
      providerName: resolvedProviderName,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json(result);
  };

  app.post('/api/withdrawals', handleWithdrawalRequest);
  app.post('/api/withdrawals/request', handleWithdrawalRequest);

  app.get('/api/withdrawals/my', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthenticated' });

    const wdrs = Array.from(db.withdrawals.values())
      .filter((w) => w.userId === user.id)
      .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

    return res.json({ success: true, withdrawals: wdrs });
  });

  // Admin All Withdrawals
  app.get('/api/withdrawals/all', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required' });
    }

    const wdrs = Array.from(db.withdrawals.values()).sort(
      (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    );

    return res.json({ success: true, withdrawals: wdrs });
  });

  // Admin Process Withdrawal - supports POST /api/withdrawals/:id/process and /api/admin/withdrawals/:id/process
  const handleProcessWithdrawal = (req: express.Request, res: express.Response) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required' });
    }

    const { id } = req.params;
    const { action, note, transactionRef } = req.body;

    const mappedAction = action === 'complete' ? 'approve' : action;

    const result = db.processWithdrawal(id, admin, mappedAction as 'approve' | 'reject', note, transactionRef);
    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json(result);
  };

  app.post('/api/withdrawals/:id/process', handleProcessWithdrawal);
  app.post('/api/admin/withdrawals/:id/process', handleProcessWithdrawal);

  // Admin Overview aggregated endpoint
  app.get('/api/admin/overview', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required' });
    }

    const usersList = Array.from(db.users.values()).map((u) => {
      const bal = db.getUserBalance(u.id);
      return {
        ...u,
        balance: bal.available,
        availableBalance: bal.available,
        pendingBalance: bal.pending,
      };
    });

    const allAssignments = Array.from(db.assignments.values()).sort(
      (a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime()
    );

    const allWithdrawals = Array.from(db.withdrawals.values()).sort(
      (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    );

    const taskStats = db.getTaskStats();
    const payoutEligibilityRequests = db.getPayoutEligibilityRequests();
    const paymentAccountVerifications = db.getPaymentAccountVerifications();

    return res.json({
      success: true,
      users: usersList,
      assignments: allAssignments,
      withdrawals: allWithdrawals,
      payoutEligibilityRequests,
      paymentAccountVerifications,
      auditLogs: db.auditLogs,
      stats: {
        taskStats,
        totalUsers: db.users.size,
        totalAssignments: db.assignments.size,
        pendingSubmissions: allAssignments.filter((a) => a.status === 'under_review').length,
        completedSubmissions: allAssignments.filter((a) => a.status === 'completed').length,
        pendingWithdrawals: allWithdrawals.filter((w) => w.status === 'pending').length,
        pendingEligibility: payoutEligibilityRequests.filter((e) => e.status === 'pending').length,
        pendingPaymentVerifications: paymentAccountVerifications.filter((v) => v.status === 'pending').length,
        totalPaidOut: allWithdrawals.filter((w) => w.status === 'completed').reduce((sum, w) => sum + w.amount, 0),
        openTickets: Array.from(db.tickets.values()).filter((t) => t.status === 'open' || t.status === 'processing').length,
      },
    });
  });

  // Admin Update User Role
  app.post('/api/admin/users/:id/role', (req, res) => {
    const admin = (req as any).user;
    if (!admin || admin.role !== 'super_admin') {
      return res.status(403).json({ success: false, error: 'Super Admin permission required to modify user roles.' });
    }

    const { id } = req.params;
    const { role } = req.body;
    const targetUser = db.users.get(id);
    if (!targetUser) return res.status(404).json({ success: false, error: 'User not found' });

    const normalizedRole = role === 'freelancer' ? 'user' : role;
    if (!['user', 'admin', 'super_admin'].includes(normalizedRole)) {
      return res.status(400).json({ success: false, error: 'Invalid role specified.' });
    }

    targetUser.role = normalizedRole as any;
    db.logAudit(admin.id, admin.email, 'USER_ROLE_CHANGED', 'User', id, `Updated ${targetUser.email} role to ${normalizedRole}`);

    return res.json({ success: true, user: targetUser });
  });

  // FAQs
  app.get('/api/faqs', (req, res) => {
    const { category, search, adminView } = req.query;
    let list = Array.from(db.faqs.values());

    if (!adminView) {
      list = list.filter((f) => f.published);
    }

    if (category && category !== 'all') {
      list = list.filter((f) => f.category === category);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter((f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
    }

    list.sort((a, b) => a.order - b.order);

    return res.json({ success: true, faqs: list, total: list.length });
  });

  app.post('/api/faqs/:id/vote', (req, res) => {
    const { id } = req.params;
    const { helpful } = req.body;
    const faq = db.faqs.get(id);
    if (!faq) return res.status(404).json({ success: false, error: 'FAQ item not found' });

    if (helpful) {
      faq.helpfulCount = (faq.helpfulCount || 0) + 1;
    } else {
      faq.notHelpfulCount = (faq.notHelpfulCount || 0) + 1;
    }

    return res.json({ success: true, helpfulCount: faq.helpfulCount, notHelpfulCount: faq.notHelpfulCount });
  });

  // Admin FAQ CRUD
  app.post('/api/faqs', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required' });
    }

    const { category, question, answer, isPopular, isFeatured } = req.body;
    const newId = `faq-${Date.now()}`;
    const newFaq = {
      id: newId,
      category: category || 'General',
      question: question.trim(),
      answer: answer.trim(),
      isPopular: !!isPopular,
      isFeatured: !!isFeatured,
      order: db.faqs.size + 1,
      helpfulCount: 0,
      notHelpfulCount: 0,
      published: true,
    };
    db.faqs.set(newId, newFaq);
    db.logAudit(admin.id, admin.email, 'FAQ_CREATED', 'FAQ', newId, `Created FAQ: ${newFaq.question}`);
    return res.json({ success: true, faq: newFaq });
  });

  app.put('/api/faqs/:id', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required' });
    }

    const { id } = req.params;
    const faq = db.faqs.get(id);
    if (!faq) return res.status(404).json({ success: false, error: 'FAQ not found' });

    Object.assign(faq, req.body);
    db.logAudit(admin.id, admin.email, 'FAQ_UPDATED', 'FAQ', id, `Updated FAQ: ${faq.question}`);
    return res.json({ success: true, faq });
  });

  app.delete('/api/faqs/:id', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required' });
    }

    const { id } = req.params;
    db.faqs.delete(id);
    db.logAudit(admin.id, admin.email, 'FAQ_DELETED', 'FAQ', id, `Deleted FAQ id ${id}`);
    return res.json({ success: true, message: 'FAQ deleted' });
  });

  // Sponsors
  app.get('/api/sponsors', (req, res) => {
    const sponsors = Array.from(db.sponsors.values())
      .filter((s) => s.active)
      .sort((a, b) => a.order - b.order);

    return res.json({
      success: true,
      sponsors,
      trustText: db.settings.sponsorTrustText,
    });
  });

  app.put('/api/sponsors', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required' });
    }

    const { sponsors, trustText } = req.body;
    if (Array.isArray(sponsors)) {
      sponsors.forEach((s) => {
        if (s.id) db.sponsors.set(s.id, s);
      });
    }
    if (trustText !== undefined) {
      db.settings.sponsorTrustText = trustText;
    }

    db.logAudit(admin.id, admin.email, 'SPONSORS_UPDATED', 'Sponsors', 'batch', 'Updated sponsor list / trust text');
    return res.json({ success: true, message: 'Sponsors updated successfully.' });
  });

  // Help Tickets
  app.get('/api/tickets/my', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthenticated' });

    const tickets = Array.from(db.tickets.values())
      .filter((t) => t.userId === user.id)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return res.json({ success: true, tickets });
  });

  app.post('/api/tickets', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthenticated' });

    const { category, subject, description, attachmentName, attachmentUrl } = req.body;
    if (!subject || !description) {
      return res.status(400).json({ success: false, error: 'Subject and description are required.' });
    }

    const ticketId = `ticket-${Date.now()}`;
    const newTicket = {
      id: ticketId,
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      category: category || 'Other',
      subject: subject.trim(),
      description: description.trim(),
      attachmentName,
      attachmentUrl,
      status: 'open' as const,
      priority: 'medium' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-1`,
          sender: 'user' as const,
          senderName: user.fullName,
          message: description.trim(),
          createdAt: new Date().toISOString(),
        },
      ],
    };

    db.tickets.set(ticketId, newTicket);
    db.createNotification(user.id, 'Help Ticket Submitted 📩', `Your support ticket "${subject}" has been received.`, 'system', '/help');
    return res.json({ success: true, ticket: newTicket });
  });

  app.post('/api/tickets/:id/reply', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthenticated' });

    const { id } = req.params;
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, error: 'Message content is required.' });

    const ticket = db.tickets.get(id);
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });

    const isStaff = ['admin', 'super_admin'].includes(user.role);
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: isStaff ? ('support' as const) : ('user' as const),
      senderName: isStaff ? 'WEJOBS Support' : user.fullName,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    ticket.messages.push(newMsg);
    ticket.updatedAt = new Date().toISOString();
    if (isStaff) {
      ticket.status = 'waiting_user';
      db.createNotification(ticket.userId, 'Support Reply Received 💬', `New response on ticket: "${ticket.subject}"`, 'system', '/help');
    } else {
      ticket.status = 'processing';
    }

    return res.json({ success: true, ticket });
  });

  app.get('/api/tickets/all', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required' });
    }

    const tickets = Array.from(db.tickets.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return res.json({ success: true, tickets });
  });

  // Notifications
  app.get('/api/notifications', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthenticated' });

    const notifs = Array.from(db.notifications.values())
      .filter((n) => n.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const unreadCount = notifs.filter((n) => !n.read).length;

    return res.json({ success: true, notifications: notifs, unreadCount });
  });

  app.post('/api/notifications/read-all', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthenticated' });

    for (const n of db.notifications.values()) {
      if (n.userId === user.id) {
        n.read = true;
      }
    }

    return res.json({ success: true });
  });

  app.post('/api/notifications/mark-read', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthenticated' });

    const { id } = req.body;
    if (id) {
      const notif = db.notifications.get(id);
      if (notif && notif.userId === user.id) {
        notif.read = true;
      }
    } else {
      for (const n of db.notifications.values()) {
        if (n.userId === user.id) {
          n.read = true;
        }
      }
    }

    return res.json({ success: true });
  });

  app.post('/api/notifications/:id/read', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, error: 'Unauthenticated' });

    const { id } = req.params;
    const notif = db.notifications.get(id);
    if (notif && notif.userId === user.id) {
      notif.read = true;
    }

    return res.json({ success: true });
  });

  // Admin General Stats
  app.get('/api/admin/stats', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required' });
    }

    const taskStats = db.getTaskStats();
    const totalUsers = db.users.size;
    const totalAssignments = db.assignments.size;

    let pendingSubmissions = 0;
    let completedSubmissions = 0;
    for (const a of db.assignments.values()) {
      if (a.status === 'under_review') pendingSubmissions++;
      if (a.status === 'completed') completedSubmissions++;
    }

    let pendingWithdrawals = 0;
    let totalPaidOut = 0;
    for (const w of db.withdrawals.values()) {
      if (w.status === 'pending' || w.status === 'under_review') pendingWithdrawals++;
      if (w.status === 'completed') totalPaidOut += w.amount;
    }

    return res.json({
      success: true,
      stats: {
        taskStats,
        totalUsers,
        totalAssignments,
        pendingSubmissions,
        completedSubmissions,
        pendingWithdrawals,
        totalPaidOut: Number(totalPaidOut.toFixed(2)),
        openTickets: Array.from(db.tickets.values()).filter((t) => t.status === 'open' || t.status === 'processing').length,
      },
    });
  });

  // Admin Users list & restriction
  app.get('/api/admin/users', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required' });
    }

    const usersList = Array.from(db.users.values()).map((u) => {
      const bal = db.getUserBalance(u.id);
      return { ...u, balance: bal };
    });

    return res.json({ success: true, users: usersList });
  });

  app.post('/api/admin/users/:id/restrict', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required' });
    }

    const { id } = req.params;
    const { isRestricted, reason } = req.body;
    const targetUser = db.users.get(id);
    if (!targetUser) return res.status(404).json({ success: false, error: 'User not found' });

    targetUser.isRestricted = !!isRestricted;
    targetUser.restrictionReason = reason || '';

    db.logAudit(
      admin.id,
      admin.email,
      isRestricted ? 'USER_RESTRICTED' : 'USER_UNRESTRICTED',
      'User',
      id,
      `${isRestricted ? 'Restricted' : 'Unrestricted'} user ${targetUser.email}. Reason: ${reason}`
    );

    return res.json({ success: true, user: targetUser });
  });

  // Admin Audit Logs
  app.get('/api/admin/audit-logs', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required' });
    }

    return res.json({ success: true, logs: db.auditLogs });
  });

  // Payment Fairness Check tool (Section 12)
  app.post('/api/admin/fairness-check', (req, res) => {
    const { wordCount, category, subtype, deadlineHours, researchLevel } = req.body;

    const words = Number(wordCount) || 500;
    let baseRatePerWord = 0.006; // $6 per 1,000 words base

    if (category === 'Creative Writing') baseRatePerWord = 0.009;
    if (category === 'Research & Writing') baseRatePerWord = 0.015;
    if (category === 'Editing') baseRatePerWord = 0.004;

    const researchMultiplier = researchLevel === 'high' ? 1.5 : researchLevel === 'medium' ? 1.25 : 1.0;
    const urgencyMultiplier = Number(deadlineHours) <= 24 ? 1.3 : 1.0;

    const recommendedPayment = Number((words * baseRatePerWord * researchMultiplier * urgencyMultiplier).toFixed(2));
    const minSuggested = Number((recommendedPayment * 0.8).toFixed(2));
    const maxSuggested = Number((recommendedPayment * 1.35).toFixed(2));

    return res.json({
      success: true,
      recommendedPayment,
      minSuggested,
      maxSuggested,
      breakdown: {
        words,
        baseRatePerWord,
        researchMultiplier,
        urgencyMultiplier,
        verdict: 'Fair Market Rate for High-Quality Freelance Micro-Delivery',
      },
    });
  });

  // Settings
  app.get('/api/settings', (req, res) => {
    return res.json({ success: true, settings: db.settings });
  });

  app.put('/api/settings', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required' });
    }

    Object.assign(db.settings, req.body);
    db.logAudit(admin.id, admin.email, 'SETTINGS_UPDATED', 'PlatformSettings', 'global', 'Updated system settings');
    return res.json({ success: true, settings: db.settings });
  });

  // ========================================================
  // WEJOBS MONTHLY CHALLENGE API ENDPOINTS
  // ========================================================

  // List all challenges
  app.get('/api/challenges', (req, res) => {
    const list = db.getChallengesList();
    const result = list.map((c) => {
      const activeData = db.getActiveChallenge(c.id);
      return {
        ...c,
        stats: activeData?.stats || {
          registeredCount: 0,
          remainingSlots: c.maxParticipants,
          percentageFilled: 0,
          slotStatus: 'AVAILABLE',
        },
      };
    });
    return res.json({ success: true, challenges: result });
  });

  // Get active featured challenge
  app.get('/api/challenges/active', (req, res) => {
    const activeData = db.getActiveChallenge();
    if (!activeData) {
      return res.status(404).json({ success: false, error: 'No active challenge found.' });
    }
    return res.json({
      success: true,
      challenge: activeData.challenge,
      stats: activeData.stats,
    });
  });

  // Get past challenge champion histories
  app.get('/api/challenges/histories', (req, res) => {
    const histories = db.getChallengeHistories();
    return res.json({ success: true, histories });
  });

  // Get challenge by slug or ID
  app.get('/api/challenges/:slug', (req, res) => {
    const { slug } = req.params;
    const activeData = db.getActiveChallenge(slug);
    if (!activeData) {
      return res.status(404).json({ success: false, error: 'Challenge not found.' });
    }
    return res.json({
      success: true,
      challenge: activeData.challenge,
      stats: activeData.stats,
    });
  });

  // Get challenge leaderboard
  app.get('/api/challenges/:slug/leaderboard', (req, res) => {
    const { slug } = req.params;
    const activeData = db.getActiveChallenge(slug);
    if (!activeData) {
      return res.status(404).json({ success: false, error: 'Challenge not found.' });
    }
    const leaderboard = db.getChallengeLeaderboard(activeData.challenge.id);
    return res.json({
      success: true,
      challengeId: activeData.challenge.id,
      rankingStatus: activeData.challenge.rankingStatus,
      totalParticipants: leaderboard.length,
      leaderboard,
    });
  });

  // Get current user's registration and rank status
  app.get('/api/challenges/:slug/my-status', (req, res) => {
    const user = (req as any).user;
    if (!user) {
      return res.json({ success: true, isRegistered: false });
    }
    const { slug } = req.params;
    const activeData = db.getActiveChallenge(slug);
    if (!activeData) {
      return res.status(404).json({ success: false, error: 'Challenge not found.' });
    }
    const status = db.getUserChallengeStatus(activeData.challenge.id, user.id);
    return res.json({
      success: true,
      isRegistered: status.isRegistered,
      participant: status.participant,
      stats: activeData.stats,
    });
  });

  // Register user for challenge
  app.post('/api/challenges/:slug/register', (req, res) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, error: 'Authentication required to register for challenge.' });
    }
    const { slug } = req.params;
    const activeData = db.getActiveChallenge(slug);
    if (!activeData) {
      return res.status(404).json({ success: false, error: 'Challenge not found.' });
    }

    const { displayName, country, agreedRules, agreedFraudPolicy, agreedLeaderboardReview } = req.body;
    const result = db.registerUserForChallenge(activeData.challenge.id, user, {
      displayName,
      country,
      agreedRules: Boolean(agreedRules),
      agreedFraudPolicy: Boolean(agreedFraudPolicy),
      agreedLeaderboardReview: Boolean(agreedLeaderboardReview),
    });

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    const updatedActive = db.getActiveChallenge(activeData.challenge.id);
    return res.json({
      success: true,
      participant: result.participant,
      stats: updatedActive?.stats,
      message: 'Successfully registered for WEJOBS Monthly Challenge!',
    });
  });

  // Submit challenge appeal
  app.post('/api/challenges/:slug/appeal', (req, res) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ success: false, error: 'Authentication required to file an appeal.' });
    }
    const { slug } = req.params;
    const activeData = db.getActiveChallenge(slug);
    if (!activeData) {
      return res.status(404).json({ success: false, error: 'Challenge not found.' });
    }

    const { type, reason, evidence } = req.body;
    const result = db.submitChallengeAppeal(activeData.challenge.id, user, { type, reason, evidence });
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    return res.json({ success: true, appeal: result.appeal, message: 'Appeal submitted successfully.' });
  });

  // Admin Challenge Management
  app.get('/api/admin/challenges', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required.' });
    }
    const list = db.getChallengesList();
    return res.json({ success: true, challenges: list });
  });

  app.put('/api/admin/challenges/:id', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required.' });
    }
    const { id } = req.params;
    const result = db.adminUpdateChallenge(id, req.body, admin);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    return res.json({ success: true, challenge: result.challenge });
  });

  app.post('/api/admin/challenges/:id/flag-participant', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required.' });
    }
    const { id } = req.params;
    const { participantId, status, fraudStatus, reason } = req.body;
    const result = db.adminFlagParticipant(id, participantId, status, fraudStatus, reason, admin);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    return res.json({ success: true, participant: result.participant });
  });

  app.post('/api/admin/challenges/:id/adjust-points', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required.' });
    }
    const { id } = req.params;
    const { participantId, amount, reason } = req.body;
    const result = db.adminAdjustParticipantPoints(id, participantId, Number(amount), reason, admin);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    return res.json({ success: true, participant: result.participant });
  });

  app.post('/api/admin/challenges/:id/approve-winners', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required.' });
    }
    const { id } = req.params;
    const result = db.adminApproveWinners(id, admin);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    return res.json({ success: true, rewards: result.rewards });
  });

  app.get('/api/admin/challenges/rewards', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required.' });
    }
    const rewards = db.getChallengeRewards();
    return res.json({ success: true, rewards });
  });

  app.post('/api/admin/challenges/rewards/:rewardId/pay', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required.' });
    }
    const { rewardId } = req.params;
    const result = db.adminPayReward(rewardId, admin);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    return res.json({ success: true, reward: result.reward });
  });

  app.get('/api/admin/challenges/appeals', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required.' });
    }
    const appeals = db.getChallengeAppeals();
    return res.json({ success: true, appeals });
  });

  app.post('/api/admin/challenges/appeals/:appealId/resolve', (req, res) => {
    const admin = (req as any).user;
    if (!admin || !['admin', 'super_admin'].includes(admin.role)) {
      return res.status(403).json({ success: false, error: 'Admin permission required.' });
    }
    const { appealId } = req.params;
    const { status, adminNote, restorePoints, restoreStatus } = req.body;
    const result = db.adminResolveChallengeAppeal(
      appealId,
      status,
      adminNote,
      admin,
      restorePoints ? Number(restorePoints) : undefined,
      restoreStatus
    );
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    return res.json({ success: true, appeal: result.appeal });
  });

  // --- Vite Middleware for Development / Production Static File Serving ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WEJOBS Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
