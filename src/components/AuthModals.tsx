import React, { useState } from 'react';
import { API_BASE } from '../apiConfig';
import { BrandLogo } from './BrandLogo';
import { CaptchaWidget } from './CaptchaWidget';
import { AvatarDisplay } from './AvatarDisplay';
import { User, BuiltInAvatarId } from '../types';
import { X, Lock, Mail, User as UserIcon, Phone, MapPin, AlertCircle, ShieldAlert, CheckCircle2, KeyRound } from 'lucide-react';

interface AuthModalsProps {
  loginOpen: boolean;
  registerOpen: boolean;
  adminLoginOpen: boolean;
  forgotPasswordOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenForgotPassword: () => void;
  onAuthSuccess: (user: User, token: string, redirectUrl?: string) => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  loginOpen,
  registerOpen,
  adminLoginOpen,
  forgotPasswordOpen,
  onClose,
  onOpenLogin,
  onOpenRegister,
  onOpenForgotPassword,
  onAuthSuccess,
}) => {
  // Login States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginCaptchaToken, setLoginCaptchaToken] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register States
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAvatarId, setRegAvatarId] = useState<string>('rabbit');
  const [regCaptchaToken, setRegCaptchaToken] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Admin Login States
  const [adminEmail, setAdminEmail] = useState('berkahkita937@gmail.com');
  const [adminPassword, setAdminPassword] = useState('berkah313');
  const [adminCaptchaToken, setAdminCaptchaToken] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Forgot Password States
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginCaptchaToken) {
      setLoginError('Please complete the security CAPTCHA verification.');
      return;
    }

    setLoginLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          captchaToken: loginCaptchaToken,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        onAuthSuccess(data.user, data.token, data.redirect);
        onClose();
      } else {
        setLoginError(data.error || 'Failed to authenticate.');
      }
    } catch (err) {
      setLoginError('Network error connecting to WEJOBS server.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    if (!agreeTerms || !agreePrivacy) {
      setRegError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    if (!regCaptchaToken) {
      setRegError('Please complete the anti-bot CAPTCHA verification.');
      return;
    }

    setRegLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regFullName,
          email: regEmail,
          phone: regPhone,
          address: regAddress,
          password: regPassword,
          avatarId: regAvatarId,
          builtinAvatarId: regAvatarId,
          captchaToken: regCaptchaToken,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        onAuthSuccess(data.user, data.token, '/dashboard');
        onClose();
      } else {
        setRegError(data.error || 'Failed to create account.');
      }
    } catch (err) {
      setRegError('Network connection error.');
    } finally {
      setRegLoading(false);
    }
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    if (!adminCaptchaToken) {
      setAdminError('Please complete the security challenge.');
      return;
    }

    setAdminLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminEmail,
          password: adminPassword,
          captchaToken: adminCaptchaToken,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        if (data.user.role !== 'admin' && data.user.role !== 'super_admin') {
          setAdminError('Unauthorized: Account does not have administrative privileges.');
          return;
        }
        onAuthSuccess(data.user, data.token, '/admin');
        onClose();
      } else {
        setAdminError(data.error || 'Invalid admin credentials.');
      }
    } catch (err) {
      setAdminError('Network error connecting to admin service.');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSubmitted(true);
    }, 600);
  };

  if (!loginOpen && !registerOpen && !adminLoginOpen && !forgotPasswordOpen) return null;

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150"
    >
      {/* 1. Member Login Modal */}
      {loginOpen && (
        <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 my-8 text-neutral-900 dark:text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <BrandLogo size="md" className="justify-center" />
            <h3 className="text-xl font-bold mt-4 text-neutral-900 dark:text-white">
              Sign In to Your Account
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Access writing tasks, track submissions, and withdraw USD earnings.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={onOpenForgotPassword}
                  className="text-xs text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Required CAPTCHA Section */}
            <CaptchaWidget
              onVerified={(token) => setLoginCaptchaToken(token)}
              onReset={() => setLoginCaptchaToken('')}
            />

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold text-sm transition-colors shadow-sm shadow-orange-500/30 cursor-pointer"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Credentials Info */}
          <div className="mt-4 p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
            <span>Demo Member:</span>
            <button
              type="button"
              onClick={() => {
                setLoginEmail('alex.writer@wejobs.com');
                setLoginPassword('wejobs123');
              }}
              className="text-orange-600 dark:text-orange-400 font-semibold hover:underline cursor-pointer"
            >
              Auto-Fill (alex.writer@wejobs.com)
            </button>
          </div>

          <div className="mt-5 text-center text-xs text-neutral-500 dark:text-neutral-400">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={onOpenRegister}
              className="font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
            >
              Register as Freelancer
            </button>
          </div>
        </div>
      )}

      {/* 2. Freelancer Registration Modal */}
      {registerOpen && (
        <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 my-8 text-neutral-900 dark:text-white max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <BrandLogo size="md" className="justify-center" />
            <h3 className="text-xl font-bold mt-4 text-neutral-900 dark:text-white">
              Create Your Freelancer Account
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Start claiming open writing jobs and earning real USD payouts.
            </p>
          </div>

          {regError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{regError}</span>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Full Legal Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@email.com"
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+62 812..."
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Residential Address & Country
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="City, State, Country"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 6 chars"
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Starter Animal Avatar Picker */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Pilih Karakter Avatar Awal
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'rabbit', label: 'Kelinci', emoji: '🐰' },
                  { id: 'fox', label: 'Rubah', emoji: '🦊' },
                  { id: 'panda', label: 'Panda', emoji: '🐼' },
                  { id: 'squirrel', label: 'Tupai', emoji: '🐿️' },
                  { id: 'cat', label: 'Kucing', emoji: '🐱' },
                ].map((av) => (
                  <button
                    type="button"
                    key={av.id}
                    onClick={() => setRegAvatarId(av.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      regAvatarId === av.id
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 ring-2 ring-orange-500 shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300'
                    }`}
                  >
                    <AvatarDisplay
                      avatarType="builtin"
                      builtinAvatarId={av.id as any}
                      size="sm"
                    />
                    <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200">
                      {av.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* CAPTCHA */}
            <CaptchaWidget
              onVerified={(token) => setRegCaptchaToken(token)}
              onReset={() => setRegCaptchaToken('')}
            />

            {/* Compliance checkboxes */}
            <div className="space-y-2 pt-1">
              <label className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                  className="mt-0.5 rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
                />
                <span>
                  I agree to the <span className="font-semibold text-neutral-900 dark:text-white">Terms of Service</span>, anti-plagiarism guidelines, and acknowledge the $100.00 USD minimum withdrawal threshold.
                </span>
              </label>

              <label className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  required
                  className="mt-0.5 rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
                />
                <span>
                  I agree to the <span className="font-semibold text-neutral-900 dark:text-white">Privacy Policy</span> and consent to identity verification for monetary payouts.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={regLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold text-sm transition-colors shadow-sm shadow-orange-500/30 cursor-pointer"
            >
              {regLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-neutral-500 dark:text-neutral-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onOpenLogin}
              className="font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
            >
              Sign In here
            </button>
          </div>
        </div>
      )}

      {/* 3. Admin Login Modal (Triggered by 5 Clicks on WEJOBS Logo or Staff Link) */}
      {adminLoginOpen && (
        <div className="relative w-full max-w-md bg-neutral-900 text-white rounded-2xl shadow-2xl border border-neutral-700 p-6 sm:p-8 my-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-3">
              <KeyRound className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black tracking-tight text-white">
              Staff & Editorial Admin Access
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Secured Role-Based Access Control (RBAC) with backend verification & audit logs.
            </p>
          </div>

          {adminError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{adminError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@wejobs.com"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-700 bg-neutral-800 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-700 bg-neutral-800 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* CAPTCHA */}
            <CaptchaWidget
              onVerified={(token) => setAdminCaptchaToken(token)}
              onReset={() => setAdminCaptchaToken('')}
            />

            <button
              type="submit"
              disabled={adminLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-md cursor-pointer"
            >
              {adminLoading ? 'Verifying RBAC Authorization...' : 'Access Admin Suite'}
            </button>
          </form>

          {/* Seed Super Admin Notice & Auto-Fill for Testing */}
          <div className="mt-4 p-3 rounded-lg bg-neutral-800/80 border border-neutral-700/60 text-[11px] text-neutral-400">
            <div className="flex items-center justify-between font-semibold text-orange-400 mb-1">
              <span>Seeded Super Admin Credentials:</span>
              <button
                type="button"
                onClick={() => {
                  setAdminEmail('berkahkita937@gmail.com');
                  setAdminPassword('berkah313');
                }}
                className="text-white bg-neutral-700 hover:bg-neutral-600 px-2 py-0.5 rounded cursor-pointer"
              >
                Auto-Fill
              </button>
            </div>
            <p>Email: <code className="text-neutral-200">berkahkita937@gmail.com</code></p>
            <p>Pass: <code className="text-neutral-200">berkah313</code></p>
          </div>
        </div>
      )}

      {/* 4. Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 my-8 text-neutral-900 dark:text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <BrandLogo size="md" className="justify-center" />
            <h3 className="text-xl font-bold mt-4 text-neutral-900 dark:text-white">
              Reset Your Password
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Enter your registered email address to receive secure reset instructions.
            </p>
          </div>

          {forgotSubmitted ? (
            <div className="text-center py-4 space-y-3">
              <div className="inline-flex p-3 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                Password Reset Email Dispatched
              </p>
              <p className="text-xs text-neutral-500">
                If an account exists for <span className="font-mono text-neutral-700 dark:text-neutral-300">{forgotEmail}</span>, you will receive a password reset token.
              </p>
              <button
                onClick={onOpenLogin}
                className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-orange-500 text-white"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Your Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                {forgotLoading ? 'Sending Token...' : 'Send Password Reset Token'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 cursor-pointer"
                >
                  Cancel and return to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
