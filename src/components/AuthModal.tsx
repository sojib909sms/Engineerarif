import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { authStore, ADMIN_EMAIL, ADMIN_PASSWORD } from '../services/authStore';
import { User } from '../types';
import { InteractiveLampRobot, playLampClickSound } from './InteractiveLampRobot';

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
  const [isLit, setIsLit] = useState(false);

  // Form states
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status alerts
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Reset fields when opening modal
  useEffect(() => {
    if (isOpen) {
      resetFields();
      // Start in dormant/unlit state to let user enjoy pulling the cord!
      setIsLit(false);
    }
  }, [isOpen]);

  const resetFields = () => {
    setUsernameOrEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleModeSwitch = (newMode: 'login' | 'register') => {
    setMode(newMode);
    resetFields();
  };

  if (!isOpen) return null;

  // Auto illuminate if user focuses an input
  const handleInputFocus = () => {
    if (!isLit) {
      setIsLit(true);
      playLampClickSound(true);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isLit) {
      setIsLit(true);
      playLampClickSound(true);
    }

    if (!usernameOrEmail || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    const res = authStore.login(usernameOrEmail.trim(), password);
    if (res.success && res.user) {
      onUserChange(res.user);
      if (res.user.role === 'admin') {
        setSuccessMsg('Admin verification confirmed. Welcome MD Arif Mia!');
      } else {
        setSuccessMsg(`Welcome back, ${res.user.name}! Opening your client profile...`);
      }
      setTimeout(() => {
        resetFields();
        onClose();
        if (res.user.role === 'admin') {
          if (onOpenAdmin) onOpenAdmin();
        } else {
          if (onOpenProfile) onOpenProfile();
        }
      }, 700);
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isLit) {
      setIsLit(true);
      playLampClickSound(true);
    }

    if (!name || !usernameOrEmail || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    const res = authStore.register(name, usernameOrEmail, password, phone);
    if (res.success && res.user) {
      onUserChange(res.user);
      setSuccessMsg(`Account created successfully! Welcome ${res.user.name}.`);
      setTimeout(() => {
        resetFields();
        onClose();
        if (onOpenProfile) onOpenProfile();
      }, 900);
    } else {
      setErrorMsg(res.error || 'Registration failed. Please try again.');
    }
  };

  const handleSocialClick = (provider: string) => {
    if (!isLit) {
      setIsLit(true);
      playLampClickSound(true);
    }
    // Informative friendly feedback with 1-click fallback
    setErrorMsg(`Instant ${provider} authentication is ready! Or use the quick 1-click credentials below.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Dynamic Background Neon Light Atmosphere */}
      <div 
        className={`fixed inset-0 pointer-events-none transition-opacity duration-700 -z-10 ${
          isLit 
            ? 'opacity-100 bg-[radial-gradient(circle_at_center,rgba(0,234,175,0.18)_0%,rgba(6,182,212,0.08)_40%,transparent_70%)]' 
            : 'opacity-0'
        }`} 
      />

      {/* Main Glassmorphic Card Container */}
      <div 
        className={`relative w-full max-w-3xl rounded-3xl overflow-hidden border transition-all duration-500 backdrop-blur-2xl shadow-2xl my-auto ${
          isLit 
            ? 'bg-[#0d131f]/95 border-emerald-500/40 shadow-[0_0_55px_rgba(0,234,175,0.3)]' 
            : 'bg-[#0a0f18]/95 border-slate-800 shadow-[0_10px_40px_rgba(0,0,0,0.8)]'
        }`}
      >
        {/* Subtle top neon accent line */}
        <div 
          className={`h-1 w-full transition-all duration-500 ${
            isLit 
              ? 'bg-gradient-to-r from-[#00eaaf] via-[#06b6d4] to-[#0077ff] shadow-[0_0_15px_#00eaaf]' 
              : 'bg-slate-800'
          }`} 
        />

        {/* Close Button */}
        <button
          onClick={() => {
            resetFields();
            onClose();
          }}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-all cursor-pointer hover:rotate-90"
          title="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
          
          {/* LEFT COLUMN: Hanging Lamp with Pull Cord & Cute Robot Mascot */}
          <div className="md:col-span-5 bg-slate-950/70 border-b md:border-b-0 md:border-r border-slate-800/80 flex flex-col justify-between relative overflow-hidden">
            <InteractiveLampRobot 
              isLit={isLit} 
              onToggleLit={() => setIsLit(!isLit)} 
            />
          </div>

          {/* RIGHT COLUMN: Form Container */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between relative z-10">
            
            {/* Header Area */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {mode === 'login' ? 'Welcome Back.' : 'Create Account.'}
                </h2>
                
                {/* Mode Switch Pill Button */}
                <button
                  onClick={() => handleModeSwitch(mode === 'login' ? 'register' : 'login')}
                  className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 border border-slate-700 transition-colors cursor-pointer mr-6 md:mr-0"
                >
                  {mode === 'login' ? 'Register →' : '← Sign In'}
                </button>
              </div>

              <p 
                className={`text-xs font-mono transition-colors duration-300 flex items-center gap-1.5 ${
                  isLit ? 'text-emerald-400 font-semibold' : 'text-slate-400'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${isLit ? 'text-emerald-300 animate-pulse' : 'text-slate-500'}`} />
                <span>
                  {isLit 
                    ? 'Path illuminated • Enter credentials below' 
                    : 'Pull the cord to illuminate your path'}
                </span>
              </p>
            </div>

            {/* Alert Messages */}
            {errorMsg && (
              <div className="mt-3 p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs font-mono flex items-center gap-2 shadow-lg shadow-rose-950/40 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-lg shadow-emerald-950/40 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ================= FORM BODY ================= */}
            <div className="my-4">
              {mode === 'login' ? (
                /* LOGIN FORM */
                <form onSubmit={handleLoginSubmit} className="space-y-4" autoComplete="off">
                  
                  {/* USERNAME / EMAIL */}
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                      EMAIL ADDRESS
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        onFocus={handleInputFocus}
                        placeholder="youremail@gmail.com"
                        autoComplete="off"
                        required
                        className={`w-full bg-[#111827] border rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition-all ${
                          isLit 
                            ? 'border-slate-700 focus:border-[#00eaaf] focus:ring-1 focus:ring-[#00eaaf] shadow-[0_0_15px_rgba(0,234,175,0.15)]' 
                            : 'border-slate-800 focus:border-slate-600'
                        }`}
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                      PASSWORD
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={handleInputFocus}
                        placeholder="••••••••••••"
                        autoComplete="new-password"
                        required
                        className={`w-full bg-[#111827] border rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 outline-none transition-all ${
                          isLit 
                            ? 'border-slate-700 focus:border-[#00eaaf] focus:ring-1 focus:ring-[#00eaaf] shadow-[0_0_15px_rgba(0,234,175,0.15)]' 
                            : 'border-slate-800 focus:border-slate-600'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 p-1 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 font-mono transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 shadow-xl"
                    style={{
                      background: 'linear-gradient(45deg, #00eaaf, #0077ff)',
                      boxShadow: isLit ? '0 0 25px rgba(0, 234, 175, 0.5)' : '0 4px 15px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <span>SIGN IN</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </form>
              ) : (
                /* REGISTRATION FORM */
                <form onSubmit={handleRegisterSubmit} className="space-y-3" autoComplete="off">
                  
                  {/* FULL NAME */}
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                      FULL NAME *
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={handleInputFocus}
                        placeholder="e.g. Engr. Tanvir Ahmed"
                        autoComplete="off"
                        required
                        className={`w-full bg-[#111827] border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all ${
                          isLit ? 'border-slate-700 focus:border-[#00eaaf] focus:ring-1 focus:ring-[#00eaaf]' : 'border-slate-800'
                        }`}
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                      EMAIL ADDRESS *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        onFocus={handleInputFocus}
                        placeholder="client@uttaraconstruction.com"
                        autoComplete="off"
                        required
                        className={`w-full bg-[#111827] border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all ${
                          isLit ? 'border-slate-700 focus:border-[#00eaaf] focus:ring-1 focus:ring-[#00eaaf]' : 'border-slate-800'
                        }`}
                      />
                    </div>
                  </div>

                  {/* PHONE */}
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                      PHONE NUMBER (OPTIONAL)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onFocus={handleInputFocus}
                        placeholder="+880 1700-000000"
                        autoComplete="off"
                        className={`w-full bg-[#111827] border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all ${
                          isLit ? 'border-slate-700 focus:border-[#00eaaf] focus:ring-1 focus:ring-[#00eaaf]' : 'border-slate-800'
                        }`}
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div className="space-y-1 text-left">
                    <label className="block text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                      CREATE PASSWORD *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={handleInputFocus}
                        placeholder="••••••••••••"
                        autoComplete="new-password"
                        required
                        className={`w-full bg-[#111827] border rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all ${
                          isLit ? 'border-slate-700 focus:border-[#00eaaf] focus:ring-1 focus:ring-[#00eaaf]' : 'border-slate-800'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 p-1 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 font-mono transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 shadow-xl mt-2"
                    style={{
                      background: 'linear-gradient(45deg, #00eaaf, #0077ff)',
                      boxShadow: isLit ? '0 0 25px rgba(0, 234, 175, 0.5)' : '0 4px 15px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <span>CREATE ACCOUNT</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </form>
              )}
            </div>

            {/* Social Logins matching video */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="h-[1px] flex-1 bg-slate-800" />
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">or continue with</span>
                <div className="h-[1px] flex-1 bg-slate-800" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Google Button */}
                <button
                  type="button"
                  onClick={() => handleSocialClick('Google')}
                  className="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 text-slate-300 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-slate-500"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>

                {/* GitHub Button */}
                <button
                  type="button"
                  onClick={() => handleSocialClick('GitHub')}
                  className="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 text-slate-300 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-slate-500"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              {/* Bottom Toggle Link */}
              <div className="text-center pt-2">
                {mode === 'login' ? (
                  <p className="text-xs text-slate-400">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('register')}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 cursor-pointer"
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('login')}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 cursor-pointer"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>

              {/* Verified Security Notice */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-500 pt-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Protected by Engineer Arif Mia CAD Portal Security</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
