import React, { useState, useEffect } from 'react';
import { Menu, X, FileText, Send, Building2, Phone, Mail, Award, Compass, ShieldCheck, LogIn, UserPlus, LogOut, User as UserIcon, Sparkles, Bot } from 'lucide-react';
import { portfolioStore } from '../services/portfolioStore';
import { User, EngineerInfo } from '../types';
import { authStore } from '../services/authStore';

interface NavbarProps {
  onOpenResume: () => void;
  onOpenAdmin?: () => void;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
  onOpenAiAssistant?: () => void;
  onLogout?: () => void;
  currentUser?: User | null;
  onSelectServiceForQuote?: (serviceTitle: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenResume, 
  onOpenAdmin, 
  onOpenAuth, 
  onOpenProfile,
  onOpenAiAssistant,
  onLogout, 
  currentUser, 
  onSelectServiceForQuote 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [engineerInfo, setEngineerInfo] = useState<EngineerInfo>(portfolioStore.getEngineerInfo());

  useEffect(() => {
    const unsubscribe = portfolioStore.subscribe(() => {
      setEngineerInfo(portfolioStore.getEngineerInfo());
    });
    return unsubscribe;
  }, []);

  const isAdminUser = authStore.isAdmin(currentUser);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['hero', 'about', 'skills', 'software', 'projects', 'services', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About Me', href: '#about', id: 'about' },
    { name: 'Technical Skills', href: '#skills', id: 'skills' },
    { name: 'Software', href: '#software', id: 'software' },
    { name: 'CAD & 3D Projects', href: '#projects', id: 'projects' },
    { name: 'Design Services', href: '#services', id: 'services' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-800 text-white py-3'
          : 'bg-slate-950/90 text-white border-b border-slate-800/80 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center space-x-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:bg-blue-500 transition-colors border border-blue-400/30">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-base sm:text-lg tracking-tight flex items-center gap-1.5 text-white">
                {engineerInfo.name}
                <span className="text-xs bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-400/30 font-medium">
                  CAD & 3D
                </span>
              </div>
              <p className="text-xs text-slate-400 tracking-wide font-mono uppercase">
                {engineerInfo.title?.split('|')[0] || 'Civil Engineering Designer'}
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeSection === link.id
                    ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center space-x-2">
            
            {/* AI Engineering Assistant Button */}
            {onOpenAiAssistant && (
              <button
                onClick={onOpenAiAssistant}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/50 transition-all cursor-pointer shadow-sm font-mono"
                title="AI CAD & Civil Assistant"
              >
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Assistant</span>
              </button>
            )}

            {/* Show User Account State or Login/Register Button */}
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 rounded-lg p-1 pl-2.5">
                <button
                  onClick={onOpenProfile}
                  className="flex items-center space-x-2 text-xs text-slate-200 hover:text-blue-400 transition-colors cursor-pointer"
                  title="Open Account Profile & Settings"
                >
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-5 h-5 rounded-full object-cover border border-blue-500/50" />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                  )}
                  <span className="font-semibold max-w-[110px] truncate">{currentUser.name}</span>
                  {isAdminUser && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                      ADMIN
                    </span>
                  )}
                </button>

                <button
                  onClick={onLogout}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 transition-all cursor-pointer shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-400" />
                <span>Login / Register</span>
              </button>
            )}

            {/* Admin Panel Button - STRICTLY SHOWN ONLY IF LOGGED IN AS ADMIN EMAIL arif.mia02@uttarauniversity.edu.bd */}
            {isAdminUser && onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition-all cursor-pointer shadow-sm font-mono"
                title="Admin Dashboard & Inquiries Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Panel</span>
              </button>
            )}

            <button
              onClick={onOpenResume}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer shadow-sm hover:border-slate-600"
              title="View & Download Curriculum Vitae"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Resume / CV</span>
            </button>

            <a
              href="#contact"
              onClick={(e) => {
                handleNavClick(e, '#contact');
                if (onSelectServiceForQuote) onSelectServiceForQuote('General Structural Inquiry');
              }}
              className="inline-flex items-center space-x-2 text-xs font-semibold px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md hover:shadow-blue-600/30 transition-all cursor-pointer border border-blue-400/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Get Quote</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {onOpenAiAssistant && (
              <button
                onClick={onOpenAiAssistant}
                className="p-2 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-semibold"
                title="AI Assistant"
              >
                <Bot className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onOpenResume}
              className="p-2 rounded-md bg-slate-800 text-blue-400 border border-slate-700 text-xs font-semibold"
              title="Resume"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 focus:outline-none border border-slate-700"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200 shadow-2xl">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 mb-3 text-xs text-slate-400 font-mono space-y-1">
            <div className="text-white font-semibold flex items-center gap-1">
              <Award className="w-4 h-4 text-blue-400" />
              MD Arif Mia — Civil Engineering Designer
            </div>
            <p>AutoCAD 2D/3D & 3ds Max Visualization</p>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                activeSection === link.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {link.name}
            </a>
          ))}

          <div className="pt-3 border-t border-slate-800 flex flex-col space-y-2">
            {onOpenAiAssistant && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAiAssistant(); }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg bg-cyan-950 text-cyan-300 font-semibold text-sm border border-cyan-800 font-mono cursor-pointer"
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>AI CAD Assistant (এআই অ্যাসিস্ট্যান্ট)</span>
              </button>
            )}

            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <button
                    onClick={() => { setMobileMenuOpen(false); if (onOpenProfile) onOpenProfile(); }}
                    className="flex items-center space-x-2 text-xs text-white hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-5 h-5 rounded-full object-cover border border-blue-500/50" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-blue-400" />
                    )}
                    <span className="font-semibold">{currentUser.name}</span>
                    {isAdminUser && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                        ADMIN
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); if (onLogout) onLogout(); }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); if (onOpenAuth) onOpenAuth(); }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg bg-blue-600/20 text-blue-300 font-semibold text-sm border border-blue-500/40 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-blue-400" />
                <span>Login / Register Account</span>
              </button>
            )}

            {isAdminUser && onOpenAdmin && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg bg-emerald-950/80 text-emerald-300 font-semibold text-sm border border-emerald-800 font-mono cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin Panel</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>View & Download Official CV</span>
            </button>

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Request Structural Estimate</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
