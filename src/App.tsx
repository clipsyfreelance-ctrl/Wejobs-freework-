import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE } from './apiConfig';
import {
  User,
  Task,
  TaskAssignment,
  Transaction,
  WithdrawalRequest,
  AuditLog,
  NotificationItem,
  FAQItem,
  SponsorItem,
} from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { TasksPage } from './components/TasksPage';
import { CategoriesPage } from './components/CategoriesPage';
import { AboutPage } from './components/AboutPage';
import { FAQPage } from './components/FAQPage';
import { LegalPage } from './components/LegalPage';
import { UserDashboard } from './components/UserDashboard';
import { MyTasksPage } from './components/MyTasksPage';
import { BalancePage } from './components/BalancePage';
import { ProfilePage } from './components/ProfilePage';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModals } from './components/AuthModals';
import { TaskDetailPage } from './components/TaskDetailPage';
import { SponsorsSection } from './components/SponsorsSection';
import { ChallengePage } from './components/ChallengePage';

export default function App() {
  // Theme State
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('wejobs_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Active Route
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const path = window.location.pathname;
    return path && path !== '/' ? path : '/';
  });

  // User Authentication State
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('wejobs_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('wejobs_token') || null;
  });

  // Data States
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignments, setAssignments] = useState<TaskAssignment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [sponsors, setSponsors] = useState<SponsorItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Modals & Popups
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const [selectedDetailTask, setSelectedDetailTask] = useState<Task | null>(null);

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (currentTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('wejobs_theme', currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Browser Navigation / History Support
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((route: string) => {
    window.history.pushState({}, '', route);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch initial system data
  const fetchData = useCallback(async () => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      // 1. Fetch public tasks
      const tasksRes = await fetch(`${API_BASE}/api/tasks`);
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        if (tasksData.tasks) {
          setTasks(tasksData.tasks);
        }
      }

      // 2. Fetch FAQs & Sponsors
      const faqsRes = await fetch(`${API_BASE}/api/faqs`);
      if (faqsRes.ok) {
        const faqsData = await faqsRes.json();
        if (faqsData.faqs) setFaqs(faqsData.faqs);
      }

      const sponsorsRes = await fetch(`${API_BASE}/api/sponsors`);
      if (sponsorsRes.ok) {
        const sponsorsData = await sponsorsRes.json();
        if (sponsorsData.sponsors) setSponsors(sponsorsData.sponsors);
      }

      // 3. Authenticated user data
      if (authToken) {
        const meRes = await fetch(`${API_BASE}/api/auth/me`, { headers });
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.user) {
            setUser(meData.user);
            localStorage.setItem('wejobs_user', JSON.stringify(meData.user));
          }
        }

        const myTasksRes = await fetch(`${API_BASE}/api/my-tasks`, { headers });
        if (myTasksRes.ok) {
          const myTasksData = await myTasksRes.json();
          if (myTasksData.assignments) setAssignments(myTasksData.assignments);
        }

        const ledgerRes = await fetch(`${API_BASE}/api/ledger`, { headers });
        if (ledgerRes.ok) {
          const ledgerData = await ledgerRes.json();
          if (ledgerData.transactions) setTransactions(ledgerData.transactions);
          if (ledgerData.withdrawals) setWithdrawals(ledgerData.withdrawals);
        }

        const notifRes = await fetch(`${API_BASE}/api/notifications`, { headers });
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          if (notifData.notifications) setNotifications(notifData.notifications);
        }

        // Admin-only fetch
        if (user && (user.role === 'admin' || user.role === 'super_admin')) {
          const adminRes = await fetch(`${API_BASE}/api/admin/overview`, { headers });
          if (adminRes.ok) {
            const adminData = await adminRes.json();
            if (adminData.users) setAllUsers(adminData.users);
            if (adminData.auditLogs) setAuditLogs(adminData.auditLogs);
          }
        }
      }
    } catch (err) {
      console.warn('Backend sync in progress:', err);
    }
  }, [authToken, user?.role]);

  useEffect(() => {
    fetchData();
    // Background sync notifications & data every 20 seconds
    const interval = setInterval(() => {
      if (authToken) {
        fetchData();
      }
    }, 20000);
    return () => clearInterval(interval);
  }, [fetchData, authToken]);

  // Auth Handlers
  const handleAuthSuccess = (authenticatedUser: User, token: string, redirectUrl?: string) => {
    setUser(authenticatedUser);
    setAuthToken(token);
    localStorage.setItem('wejobs_user', JSON.stringify(authenticatedUser));
    localStorage.setItem('wejobs_token', token);

    if (redirectUrl) {
      navigate(redirectUrl);
    } else if (authenticatedUser.role === 'super_admin' || authenticatedUser.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('wejobs_user');
    localStorage.removeItem('wejobs_token');
    navigate('/');
  };

  // Claim Task Handler
  const handleClaimTask = async (taskId: string): Promise<boolean> => {
    if (!authToken || !user) {
      setLoginModalOpen(true);
      return false;
    }

    try {
      const res = await fetch(`${API_BASE}/api/tasks/${taskId}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        await fetchData();
        return true;
      } else {
        throw new Error(data.error || 'Failed to claim task.');
      }
    } catch (err: any) {
      throw new Error(err.message || 'Error communicating with server.');
    }
  };

  // Submit Deliverable Work Handler
  const handleSubmitWork = async (
    assignmentId: string,
    submission: {
      fileName: string;
      fileSize: number;
      fileDataUrl?: string;
      note: string;
      referenceLink?: string;
    }
  ): Promise<boolean> => {
    if (!authToken) return false;

    try {
      const res = await fetch(`${API_BASE}/api/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(submission),
      });
      const data = await res.json();
      if (data.success) {
        await fetchData();
        return true;
      } else {
        throw new Error(data.error || 'Failed to upload deliverable.');
      }
    } catch (err: any) {
      throw new Error(err.message || 'Error submitting deliverable.');
    }
  };

  // Request Withdrawal Handler ($100.00 min threshold)
  const handleRequestWithdrawal = async (data: {
    amount: number;
    method: 'bank_transfer' | 'paypal' | 'wise' | 'crypto_usdt';
    accountName: string;
    accountNumber: string;
    bankOrNetworkName?: string;
    note?: string;
  }): Promise<boolean> => {
    if (!authToken) return false;

    try {
      const res = await fetch(`${API_BASE}/api/withdrawals/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        await fetchData();
        return true;
      } else {
        throw new Error(result.error || 'Failed to submit withdrawal request.');
      }
    } catch (err: any) {
      throw new Error(err.message || 'Error requesting withdrawal.');
    }
  };

  // Update Profile Handler
  const handleUpdateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    if (!authToken) return false;

    try {
      const res = await fetch(`${API_BASE}/api/profile/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(profileData),
      });
      const result = await res.json();
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('wejobs_user', JSON.stringify(result.user));
        // Refresh all application state including notifications and ledger
        await fetchData();
        return true;
      } else {
        throw new Error(result.error || 'Failed to update profile.');
      }
    } catch (err: any) {
      throw new Error(err.message || 'Error updating profile.');
    }
  };

  // Admin Actions
  const handleReviewSubmission = async (
    assignmentId: string,
    action: 'accept' | 'request_revision' | 'reject',
    reason?: string
  ): Promise<boolean> => {
    if (!authToken) return false;
    try {
      const res = await fetch(`${API_BASE}/api/admin/assignments/${assignmentId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ action, reason }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleProcessWithdrawal = async (
    withdrawalId: string,
    action: 'complete' | 'reject',
    note?: string
  ): Promise<boolean> => {
    if (!authToken) return false;
    try {
      const res = await fetch(`${API_BASE}/api/admin/withdrawals/${withdrawalId}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ action, note }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleCreateTask = async (taskData: Partial<Task>): Promise<boolean> => {
    if (!authToken) return false;
    try {
      const res = await fetch(`${API_BASE}/api/admin/tasks/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(taskData),
      });
      const data = await res.json();
      if (data.success) {
        await fetchData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleDeleteTask = async (taskId: string): Promise<boolean> => {
    if (!authToken) return false;
    try {
      const res = await fetch(`${API_BASE}/api/admin/tasks/${taskId}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        await fetchData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleUpdateUserRole = async (
    targetUserId: string,
    role: 'freelancer' | 'admin' | 'super_admin'
  ): Promise<boolean> => {
    if (!authToken) return false;
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${targetUserId}/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    if (!authToken) return;
    try {
      await fetch(`${API_BASE}/api/notifications/mark-read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true, isRead: true })));
    } catch {
      // ignore
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    if (!authToken) return;
    try {
      await fetch(`${API_BASE}/api/notifications/${id}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true, isRead: true } : n))
      );
    } catch {
      // ignore
    }
  };

  // Stats calculation
  const totalTasksCount = tasks.length;
  const fullTasksCount = tasks.filter((t) => t.remainingSlots <= 0 || t.status === 'full').length;
  const availableTasksCount = tasks.filter(
    (t) => t.remainingSlots > 0 && t.status === 'available'
  ).length;

  const stats = {
    totalTasks: totalTasksCount,
    fullTasks: fullTasksCount,
    availableTasks: availableTasksCount,
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const availableBalance = user?.availableBalance || 0;

  // Render current view
  const renderCurrentView = () => {
    // Check route base
    const routeBase = currentRoute.split('?')[0];

    switch (routeBase) {
      case '/':
        return (
          <LandingPage
            stats={stats}
            featuredTasks={tasks.slice(0, 6)}
            sponsors={sponsors}
            faqs={faqs}
            trustText="Escrow-Protected Freelance Micro-Jobs"
            onNavigate={navigate}
            onOpenRegister={() => setRegisterModalOpen(true)}
            onSelectTask={(task) => setSelectedDetailTask(task)}
          />
        );

      case '/tasks':
        return (
          <TasksPage
            tasks={tasks}
            stats={stats}
            user={user}
            selectedCategory={new URLSearchParams(window.location.search).get('cat') || 'all'}
            onClaimTask={handleClaimTask}
            onOpenLogin={() => setLoginModalOpen(true)}
            onRefreshTasks={fetchData}
          />
        );

      case '/challenge':
      case '/challenge/september-2026':
      case '/monthly-challenge':
        return (
          <ChallengePage
            user={user}
            onOpenLogin={() => setLoginModalOpen(true)}
            onOpenRegister={() => setRegisterModalOpen(true)}
            onNavigate={navigate}
          />
        );

      case '/categories':
        return <CategoriesPage onNavigate={navigate} />;

      case '/about':
        return <AboutPage onNavigate={navigate} onOpenRegister={() => setRegisterModalOpen(true)} />;

      case '/faq':
      case '/help':
        return <FAQPage faqs={faqs} onNavigate={navigate} />;

      case '/terms':
        return <LegalPage initialTab="terms" onNavigate={navigate} />;

      case '/privacy':
        return <LegalPage initialTab="privacy" onNavigate={navigate} />;

      case '/rules':
        return <LegalPage initialTab="rules" onNavigate={navigate} />;

      case '/sponsors':
        return (
          <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h1 className="text-3xl font-display-serif font-black tracking-tight text-neutral-900 dark:text-white">
                Our Institutional Sponsors & Escrow Backers
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                Institutional sponsors providing direct pre-funded escrow pools for verified freelance writing deliverables.
              </p>
            </div>
            <SponsorsSection sponsors={sponsors} onNavigate={navigate} />
          </div>
        );

      case '/dashboard':
        if (!user) {
          return (
            <div className="py-20 text-center space-y-4">
              <h2 className="text-2xl font-bold">Please Sign In to Access Dashboard</h2>
              <button
                onClick={() => setLoginModalOpen(true)}
                className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-xs"
              >
                Sign In
              </button>
            </div>
          );
        }
        return (
          <UserDashboard
            user={user}
            assignments={assignments}
            transactions={transactions}
            notifications={notifications}
            onNavigate={navigate}
          />
        );

      case '/my-tasks':
        if (!user) {
          return (
            <div className="py-20 text-center space-y-4">
              <h2 className="text-2xl font-bold">Please Sign In to Access My Tasks</h2>
              <button
                onClick={() => setLoginModalOpen(true)}
                className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-xs"
              >
                Sign In
              </button>
            </div>
          );
        }
        return (
          <MyTasksPage
            assignments={assignments}
            user={user}
            onSubmitWork={handleSubmitWork}
            onNavigate={navigate}
          />
        );

      case '/balance':
        if (!user) {
          return (
            <div className="py-20 text-center space-y-4">
              <h2 className="text-2xl font-bold">Please Sign In to View Balance Ledger</h2>
              <button
                onClick={() => setLoginModalOpen(true)}
                className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-xs"
              >
                Sign In
              </button>
            </div>
          );
        }
        return (
          <BalancePage
            user={user}
            transactions={transactions}
            withdrawals={withdrawals}
            onRequestWithdrawal={handleRequestWithdrawal}
            onNavigate={navigate}
          />
        );

      case '/profile':
      case '/verification':
      case '/payment-verification':
      case '/rekening':
        if (!user) {
          return (
            <div className="py-20 text-center space-y-4">
              <h2 className="text-2xl font-bold">Please Sign In to Manage Profile</h2>
              <button
                onClick={() => setLoginModalOpen(true)}
                className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-xs"
              >
                Sign In
              </button>
            </div>
          );
        }
        return (
          <ProfilePage
            user={user}
            onUpdateProfile={handleUpdateProfile}
            onRefreshUserData={fetchData}
            onNavigate={navigate}
            initialTab={
              routeBase === '/verification' ||
              routeBase === '/payment-verification' ||
              routeBase === '/rekening'
                ? 'verification'
                : 'profile'
            }
          />
        );

      case '/admin':
        if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
          return (
            <div className="py-20 text-center space-y-4">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Admin Authentication Required
              </h2>
              <p className="text-xs text-neutral-500">
                Please authenticate with authorized Super Administrator credentials.
              </p>
              <button
                onClick={() => setAdminLoginModalOpen(true)}
                className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-xs"
              >
                Open Admin Portal Login
              </button>
            </div>
          );
        }
        return (
          <AdminDashboard
            currentUser={user}
            tasks={tasks}
            users={allUsers}
            assignments={assignments}
            withdrawals={withdrawals}
            auditLogs={auditLogs}
            faqs={faqs}
            sponsors={sponsors}
            onReviewSubmission={handleReviewSubmission}
            onProcessWithdrawal={handleProcessWithdrawal}
            onCreateTask={handleCreateTask}
            onDeleteTask={handleDeleteTask}
            onUpdateUserRole={handleUpdateUserRole}
            onNavigate={navigate}
          />
        );

      default:
        return (
          <LandingPage
            stats={stats}
            featuredTasks={tasks.slice(0, 6)}
            sponsors={sponsors}
            faqs={faqs}
            trustText="Escrow-Protected Freelance Micro-Jobs"
            onNavigate={navigate}
            onOpenRegister={() => setRegisterModalOpen(true)}
            onSelectTask={(task) => setSelectedDetailTask(task)}
          />
        );
    }
  };

  return (
    <div id="wejobs-app-root" className="min-h-screen flex flex-col bg-[#f4f7fc] dark:bg-[#090e1a] text-slate-900 dark:text-slate-100 selection:bg-orange-500/20 selection:text-orange-900 dark:selection:text-orange-200">
      {/* Universal Artistic Flair Top Bar */}
      <Navbar
        user={user}
        currentTheme={currentTheme}
        onToggleTheme={toggleTheme}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenRegister={() => setRegisterModalOpen(true)}
        onOpenAdminLogin={() => setAdminLoginModalOpen(true)}
        onLogout={handleLogout}
        currentRoute={currentRoute}
        onNavigate={navigate}
        notifications={notifications}
        unreadNotificationCount={unreadNotificationsCount}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onMarkNotificationRead={handleMarkNotificationRead}
        availableBalance={availableBalance}
      />

      {/* Main Content Area */}
      <main className="flex-1">{renderCurrentView()}</main>

      {/* Universal Footer */}
      <Footer onNavigate={navigate} onOpenAdminLogin={() => setAdminLoginModalOpen(true)} />

      {/* Auth Modals Component */}
      <AuthModals
        loginOpen={loginModalOpen}
        registerOpen={registerModalOpen}
        adminLoginOpen={adminLoginModalOpen}
        forgotPasswordOpen={forgotPasswordModalOpen}
        onClose={() => {
          setLoginModalOpen(false);
          setRegisterModalOpen(false);
          setAdminLoginModalOpen(false);
          setForgotPasswordModalOpen(false);
        }}
        onOpenLogin={() => {
          setRegisterModalOpen(false);
          setAdminLoginModalOpen(false);
          setForgotPasswordModalOpen(false);
          setLoginModalOpen(true);
        }}
        onOpenRegister={() => {
          setLoginModalOpen(false);
          setAdminLoginModalOpen(false);
          setForgotPasswordModalOpen(false);
          setRegisterModalOpen(true);
        }}
        onOpenForgotPassword={() => {
          setLoginModalOpen(false);
          setRegisterModalOpen(false);
          setAdminLoginModalOpen(false);
          setForgotPasswordModalOpen(true);
        }}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Task Detail Modal */}
      {selectedDetailTask && (
        <TaskDetailPage
          task={selectedDetailTask}
          user={user}
          onClose={() => setSelectedDetailTask(null)}
          onClaimTask={handleClaimTask}
          onOpenLogin={() => {
            setSelectedDetailTask(null);
            setLoginModalOpen(true);
          }}
        />
      )}
    </div>
  );
}
