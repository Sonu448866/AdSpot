import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { api } from '../../services/api';
import { Mail, Lock, Phone, User as UserIcon, Building2, CheckCircle2, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    login,
    register,
    loginWithOtp,
    fastDemoLogin,
  } = useAuth();

  const [tab, setTab] = useState<'login' | 'register' | 'otp'>(authModalTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'advertiser' | 'space_owner'>('advertiser');
  const [companyName, setCompanyName] = useState('');

  // OTP state
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  React.useEffect(() => {
    setTab(authModalTab);
    setError(null);
  }, [authModalTab, isAuthModalOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        phone,
        role,
        businessDetails: {
          companyName: companyName || name,
        },
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/otp/request', { phone: otpPhone });
      setOtpSent(true);
      if (res.data.devOtp) {
        setDevOtp(res.data.devOtp);
        setOtpCode(res.data.devOtp); // Auto-fill for developer convenience
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginWithOtp(otpPhone, otpCode);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (demoRole: 'advertiser' | 'space_owner' | 'admin') => {
    setError(null);
    setLoading(true);
    try {
      await fastDemoLogin(demoRole);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isAuthModalOpen} onClose={closeAuthModal} maxWidth="md">
      <div className="text-center mb-6">
        <img
          src="/assets/Adspot logo.png"
          alt="Adspot Logo"
          className="h-9 mx-auto object-contain mb-2"
        />
        <p className="text-sm text-slate-500">
          {tab === 'login' && 'Sign in to access your saved spots, bookings, and insights'}
          {tab === 'register' && 'Create your Adspot account to book or monetize spaces'}
          {tab === 'otp' && 'Fast sign-in with your mobile phone OTP'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-6 text-sm font-medium">
        <button
          onClick={() => {
            setTab('login');
            setError(null);
          }}
          className={`flex-1 py-2 rounded-lg transition-all ${
            tab === 'login' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => {
            setTab('register');
            setError(null);
          }}
          className={`flex-1 py-2 rounded-lg transition-all ${
            tab === 'register' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sign Up
        </button>
        <button
          onClick={() => {
            setTab('otp');
            setError(null);
          }}
          className={`flex-1 py-2 rounded-lg transition-all ${
            tab === 'otp' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Mobile OTP
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tab 1: Login */}
      {tab === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#FC5701] focus:ring-1 focus:ring-[#FC5701] outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#FC5701] focus:ring-1 focus:ring-[#FC5701] outline-none transition"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" loading={loading} className="w-full">
            Sign In to Adspot
          </Button>
        </form>
      )}

      {/* Tab 2: Register */}
      {tab === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              I want to
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('advertiser')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition ${
                  role === 'advertiser'
                    ? 'border-[#FC5701] bg-orange-50/50 text-[#FC5701]'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Book Ad Spaces
              </button>
              <button
                type="button"
                onClick={() => setRole('space_owner')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition ${
                  role === 'space_owner'
                    ? 'border-[#FC5701] bg-orange-50/50 text-[#FC5701]'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                List My Spaces
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#FC5701] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#FC5701] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#FC5701] outline-none"
              />
            </div>
          </div>

          {role === 'space_owner' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Agency / Company Name
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Apex Outdoor Advertising Ltd"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#FC5701] outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#FC5701] outline-none"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" loading={loading} className="w-full">
            Create Adspot Account
          </Button>
        </form>
      )}

      {/* Tab 3: Mobile OTP */}
      {tab === 'otp' && (
        <div className="space-y-4">
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={otpPhone}
                    onChange={(e) => setOtpPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#FC5701] outline-none"
                  />
                </div>
              </div>
              <Button type="submit" variant="primary" loading={loading} className="w-full">
                Send Verification Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
                <span>OTP sent to {otpPhone}</span>
                {devOtp && <span className="font-mono font-bold bg-white px-2 py-0.5 rounded text-emerald-700">Code: {devOtp}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-widest text-lg font-mono py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-[#FC5701] outline-none"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOtpSent(false)}
                  className="flex-1"
                >
                  Change Number
                </Button>
                <Button type="submit" variant="primary" loading={loading} className="flex-1">
                  Verify & Sign In
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 1-Click Fast Test Accounts for Pair Programming & Testing */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
          1-Click Instant Demo Access
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleDemoClick('advertiser')}
            className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition"
          >
            Advertiser
          </button>
          <button
            type="button"
            onClick={() => handleDemoClick('space_owner')}
            className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition"
          >
            Space Owner
          </button>
          <button
            type="button"
            onClick={() => handleDemoClick('admin')}
            className="py-1.5 px-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg text-xs font-medium text-[#FC5701] transition"
          >
            Admin
          </button>
        </div>
      </div>
    </Modal>
  );
};
