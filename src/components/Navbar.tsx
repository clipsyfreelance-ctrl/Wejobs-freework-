import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { AvatarDisplay } from './AvatarDisplay';
import { User, NotificationItem } from '../types';
import {
  Bell,
  Check,
  LogOut,
  User as UserIcon,
  Briefcase,
  Wallet,
  ShieldCheck,
  FileText,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenAdminLogin: () => void;
  onLogout: () => void;
  currentRoute: string;
  onNavigate: (route: string) => void;
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  onMarkAllNotificationsRead: () => void;
  onMarkNotificationRead?: (id: string) => void;
  availableBalance: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenLogin,
  onOpenRegister,
  onOpenAdminLogin,
  onLogout,
  currentRoute,
  onNavigate,
  notifications = [],
  unreadNotificationCount = 0,
  onMarkAllNotificationsRead,
  onMarkNotificationRead,
  availableBalance = 0,
}) => {
  const safeNotifications = notifications || [];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread'>('all');

  const navLinks = [
    { label: 'Explore Jobs', route: '/tasks' },
    { label: 'Monthly Challenge 🏆', route: '/challenge' },
    { label: 'Categories', route: '/categories' },
    { label: 'About', route: '/about' },
    { label: 'FAQ', route: '/faq' },
    { label: 'Sponsors', route: '/sponsors' },
    { label: 'Help Center', route: '/help' },
  ];

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-[#0c1527]/95 border-b border-blue-100/90 dark:border-blue-950/80 shadow-xs transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo with 5-Click Admin Shortcut */}
          <div className="flex items-center gap-8">
            <BrandLogo
              size="md"
              onAdminTrigger={() => {
                onOpenAdminLogin();
              }}
            />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.route}
                  onClick={() => onNavigate(link.route)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-xl transition-all cursor-pointer ${
                    currentRoute === link.route
                      ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 font-bold border border-orange-200/60 dark:border-orange-900/40 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-blue-950/40'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Authenticated Controls */}
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Available Balance Pill */}
                <button
                  onClick={() => onNavigate('/balance')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all cursor-pointer shadow-xs"
                  title="Your Available Balance (USD)"
                >
                  <Wallet className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>${availableBalance.toFixed(2)} USD</span>
                </button>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setUserDropdownOpen(false);
                    }}
                    className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer border border-transparent hover:border-blue-100 dark:hover:border-blue-900/50"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotificationCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#0c1527] animate-pulse shadow-sm">
                        {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Popover */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl border border-blue-100 dark:border-blue-900/80 bg-white dark:bg-[#0e172a] py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="flex items-center justify-between px-4 pb-2 border-b border-blue-50 dark:border-blue-950">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            Notifications
                          </span>
                          {unreadNotificationCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                              {unreadNotificationCount} new
                            </span>
                          )}
                        </div>
                        {unreadNotificationCount > 0 && (
                          <button
                            onClick={onMarkAllNotificationsRead}
                            className="text-xs text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                          >
                            <Check className="w-3 h-3" /> Mark all read
                          </button>
                        )}
                      </div>

                      {/* Filter subtabs (All vs Unread) */}
                      <div className="flex items-center gap-1 px-3 pt-2 pb-1 text-xs">
                        <button
                          type="button"
                          onClick={() => setNotifFilter('all')}
                          className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                            notifFilter === 'all'
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          All ({notifications.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setNotifFilter('unread')}
                          className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                            notifFilter === 'unread'
                              ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400'
                              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Unread ({unreadNotificationCount})
                        </button>
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-blue-50 dark:divide-blue-950">
                        {(() => {
                          const listToRender = safeNotifications.filter((n) => {
                            if (notifFilter === 'unread') return !n.read && !n.isRead;
                            return true;
                          });

                          if (listToRender.length === 0) {
                            return (
                              <div className="py-8 text-center text-xs text-neutral-400">
                                {notifFilter === 'unread'
                                  ? 'Tidak ada notifikasi belum dibaca'
                                  : 'Belum ada notifikasi'}
                              </div>
                            );
                          }

                          return listToRender.map((notif) => {
                            const isUnread = !notif.read && !notif.isRead;
                            return (
                              <div
                                key={notif.id}
                                onClick={() => {
                                  if (isUnread && onMarkNotificationRead) {
                                    onMarkNotificationRead(notif.id);
                                  }
                                  if (notif.link) {
                                    onNavigate(notif.link);
                                    setNotificationsOpen(false);
                                  }
                                }}
                                className={`p-3 text-left transition-colors cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 ${
                                  isUnread
                                    ? 'bg-orange-50/60 dark:bg-orange-950/30 border-l-2 border-orange-500'
                                    : ''
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                                    <span>{notif.title}</span>
                                  </p>
                                  {isUnread && (
                                    <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-1" />
                                  )}
                                </div>
                                <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 line-clamp-2">
                                  {notif.message}
                                </p>
                                <span className="text-[10px] text-neutral-400 mt-1 block">
                                  {new Date(notif.createdAt).toLocaleDateString([], {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar Menu Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                      setNotificationsOpen(false);
                    }}
                    className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-orange-500/40 transition-all cursor-pointer"
                  >
                    <AvatarDisplay
                      user={user}
                      avatarType={user.avatarType}
                      builtinAvatarId={user.builtinAvatarId}
                      avatarId={user.avatarId}
                      customAvatarUrl={user.customAvatarUrl}
                      name={user.fullName}
                      size="sm"
                      showStatus
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl border border-blue-100 dark:border-blue-900/80 bg-white dark:bg-[#0e172a] py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2.5 border-b border-blue-50 dark:border-blue-950 bg-blue-50/40 dark:bg-blue-950/20">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {user.fullName}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {user.email}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold rounded-full uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {user.role}
                        </span>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            onNavigate('/dashboard');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <Briefcase className="w-4 h-4 text-orange-500" />
                          <span>Dashboard</span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('/my-tasks');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span>My Tasks & Submissions</span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('/balance');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <Wallet className="w-4 h-4 text-emerald-500" />
                          <span>Balance & Payouts</span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('/profile');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span>Profile & Avatars</span>
                        </button>

                        {/* If Admin / Super Admin */}
                        {(user.role === 'admin' || user.role === 'super_admin') && (
                          <button
                            onClick={() => {
                              onNavigate('/admin');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-950/70 flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-orange-600" />
                            <span>Admin Dashboard</span>
                          </button>
                        )}
                      </div>

                      <div className="pt-1 border-t border-blue-50 dark:border-blue-950">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Guest Controls */
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="px-4 py-1.5 text-xs sm:text-sm font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-500/25 transition-all cursor-pointer hover:shadow-md"
                >
                  Start Earning
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-blue-100 dark:border-blue-950 bg-white dark:bg-[#0c1527] px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.route}
              onClick={() => {
                onNavigate(link.route);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                currentRoute === link.route
                  ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40'
              }`}
            >
              {link.label}
            </button>
          ))}

          {!user && (
            <div className="pt-2 flex flex-col gap-2 border-t border-blue-100 dark:border-blue-950 mt-2">
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-sm font-bold rounded-xl border border-blue-200 dark:border-blue-800 text-slate-800 dark:text-slate-200 hover:bg-blue-50"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  onOpenRegister();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-sm font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-md"
              >
                Start Earning (Free Account)
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

