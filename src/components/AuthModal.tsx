import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, LogIn, UserPlus, AlertCircle, CheckCircle2, Eye, EyeOff, Sparkles, KeyRound, Building2 } from 'lucide-react';
import { authStore, ADMIN_EMAIL, ADMIN_PASSWORD } from '../services/authStore';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserChange: (user: User | null) => void;
  onOpenAdmin?: () => void;
  onOpenProfile?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onUserChange, 
  onOpenAdmin,
  onOpenProfile
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Always clear and reset form state to blank whenever modal opens
  useEffect(() => {
    if (isOpen) {
      resetFields();
    }
  }, [isOpen]);

  const resetFields = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleModeSwitch = (newMode: 'login' | 'register') => {
    setMode(newMode);
    resetFields();
  };

  if (!isOpen) return null;

  const fillAdminCredentials = () => {
    setEmail(ADMIN_EMAIL);
    setPassword(ADMIN_PASSWORD);
    setErrorMsg('');
  };

  const fillClientCredentials = () => {
    setEmail('client@uttaraconstruction.com');
    setPassword('client123');
    setErrorMsg('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    const res = authStore.login(email, password);
    if (res.success && res.user) {
      onUserChange(res.user);
      if (res.user.role === 'admin') {
        setSuccessMsg('Admin login successful! Redirecting to Profile...');
        setTimeout(() => {
          resetFields();
          onClose();
          if (onOpenProfile) {
            onOpenProfile();
          } else if (onOpenAdmin) {
            onOpenAdmin();
          }
        }, 1000);
      } else {
        setSuccessMsg(`Welcome back, ${res.user.name}! Logging in...`);
        setTimeout(() => {
          resetFields();
          onClose();
          if (onOpenProfile) onOpenProfile();
        }, 1000);
      }
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name || !email || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    const res = authStore.register(name, email, password, phone);
    if (res.success && res.user) {
      onUserChange(res.user);
      setSuccessMsg(`Account created successfully! Welcome ${res.user.name}.`);
      setTimeout(() => {
        resetFields();
        onClose();
        if (onOpenProfile) onOpenProfile();
      }, 1000);
    } else {
      setErrorMsg(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* Background Neon Glow Aura */}
      <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="bg-slate-900/95 border border-slate-700/80 rounded-3xl w-full max-w-lg shadow-[0_0_50px_rgba(30,58,138,0.35)] overflow-hidden relative backdrop-blur-2xl">
        
        {/* Top Decorative CAD Blueprint Line Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" />

        {/* Header */}
        <div className="bg-slate-950/80 p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-600/30 border border-blue-400/40 shrink-0">
              <KeyRound className="w-6 h-6 text-cyan-200" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">Account Portal</h3>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-mono font-bold px-2 py-0.5 rounded-full border border-cyan-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> CAD STUDIO
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">MD Arif Mia — Civil Engineering Designer</p>
            </div>
          </div>

          <button
            onClick={() => {
              resetFields();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Custom Segmented Tab Switcher */}
        <div className="p-2 bg-slate-950/60 border-b border-slate-800/80 flex gap-2">
          <button
            onClick={() => handleModeSwitch('login')}
            className={`flex-1 py-3 text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>SIGN IN (লগইন)</span>
          </button>

          <button
            onClick={() => handleModeSwitch('register')}
            className={`flex-1 py-3 text-xs font-mono font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>REGISTER (রেজিস্ট্রেশন)</span>
          </button>
        </div>

        {/* Main Form Body */}
        <div className="p-6 space-y-5 text-left">
          
          {/* Quick Demo Credentials Helper */}
          {mode === 'login' && (
            <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Quick Account Selector:
                </span>
                <span className="text-[10px] text-slate-500">1-Click Auto Fill</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={fillAdminCredentials}
                  className="py-1.5 px-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/50 text-emerald-300 font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Fill Admin Creds</span>
                </button>
                <button
                  type="button"
                  onClick={fillClientCredentials}
                  className="py-1.5 px-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 border border-blue-700/50 text-blue-300 font-mono text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Fill Client Creds</span>
                </button>
              </div>
            </div>
          )}

          {/* Alert Banners */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/90 border border-rose-800 text-rose-300 text-xs font-mono flex items-start gap-2.5 shadow-lg shadow-rose-950/50">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-start gap-2.5 shadow-lg shadow-emerald-950/50">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4" autoComplete="off">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1">
                  <span>Email Address</span>
                  <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. arif.mia02@uttarauniversity.edu.bd"
                    autoComplete="off"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1">
                  <span>Password</span>
                  <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your security password"
                    autoComplete="new-password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-xl shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 border border-blue-400/30"
              >
                <LogIn className="w-4 h-4" />
                <span>SIGN IN TO PORTAL</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5" autoComplete="off">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1">
                  <span>Full Name</span>
                  <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Engr. Tanvir Ahmed"
                    autoComplete="off"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1">
                  <span>Email Address</span>
                  <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. client@uttaraconstruction.com"
                    autoComplete="off"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold">Phone / WhatsApp Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +880 1700-000000"
                    autoComplete="off"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1">
                  <span>Password</span>
                  <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create security password"
                    autoComplete="new-password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-xl shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 border border-blue-400/30"
              >
                <UserPlus className="w-4 h-4" />
                <span>CREATE ACCOUNT (একাউন্ট তৈরি করুন)</span>
              </button>
            </form>
          )}

          {/* Security Banner */}
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 font-mono space-y-1 leading-relaxed">
            <div className="font-bold text-cyan-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Role-Based Security:
            </div>
            <div>
              Standard accounts get Client Inquiry access. Admin Panel is strictly accessible to verified admin credentials.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

