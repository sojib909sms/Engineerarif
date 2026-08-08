import React from 'react';
import { Compass, ShieldCheck, ArrowUp, Mail, Phone, MapPin, FileText, Send, Award, Heart, ExternalLink, LogIn, User as UserIcon } from 'lucide-react';
import { ENGINEER_INFO } from '../data/portfolioData';
import { User } from '../types';

interface FooterProps {
  onOpenResume: () => void;
  onOpenAdmin?: () => void;
  onOpenAuth?: () => void;
  currentUser?: User | null;
  onSelectServiceForQuote: (serviceTitle: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenResume, 
  onOpenAdmin, 
  onOpenAuth, 
  currentUser, 
  onSelectServiceForQuote 
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 relative pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md border border-blue-400/30">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  {ENGINEER_INFO.name}
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-400/30 font-medium">CAD & 3D</span>
                </div>
                <p className="text-xs text-slate-400 font-mono uppercase">Civil Engineering Designer</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Civil Engineering Designer specializing in AutoCAD 2D & 3D drafting, 3ds Max modeling, and realistic architectural visualization for residential and commercial projects.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={ENGINEER_INFO.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800 text-xs font-semibold text-emerald-400 hover:text-white transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={ENGINEER_INFO.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-blue-950 border border-blue-800 text-xs font-semibold text-blue-300 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={ENGINEER_INFO.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-blue-950 border border-blue-800 text-xs font-semibold text-blue-300 hover:text-white transition-colors"
              >
                Facebook
              </a>
              <a
                href={ENGINEER_INFO.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-sky-950 border border-sky-800 text-xs font-semibold text-sky-300 hover:text-white transition-colors"
              >
                Twitter (X)
              </a>
              <a
                href={ENGINEER_INFO.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-pink-950 border border-pink-800 text-xs font-semibold text-pink-300 hover:text-white transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
                <a href="#about" className="hover:text-blue-400 transition-colors">About & Bio</a>
              </li>
              <li>
                <a href="#skills" className="hover:text-blue-400 transition-colors">Technical Skills</a>
              </li>
              <li>
                <a href="#software" className="hover:text-blue-400 transition-colors">Software Expertise</a>
              </li>
              <li>
                <a href="#projects" className="hover:text-blue-400 transition-colors">CAD & 3D Project Portfolio</a>
              </li>
              <li>
                <a href="#services" className="hover:text-blue-400 transition-colors">Design Services</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-blue-400 transition-colors">Contact & Quote</a>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Design Services</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li>• AutoCAD 2D Drafting & Floor Plans</li>
              <li>• AutoCAD 3D Building Models</li>
              <li>• 3ds Max Interior & Exterior Renders</li>
              <li>• Working Drawings & Structural Detailing</li>
              <li>• Site Layout & Basic Quantity Takes</li>
              <li>• Photography & AI Visual Concepts</li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Direct Actions</h4>
            <div className="space-y-2">
              <button
                onClick={onOpenResume}
                className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-800 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>View Resume</span>
              </button>

              <a
                href="#contact"
                onClick={() => onSelectServiceForQuote('General Structural Inquiry')}
                className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Get Quote</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300 font-mono">
          <div>
            © {new Date().getFullYear()} {ENGINEER_INFO.name}. Civil Engineering Designer Portfolio.
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white border border-slate-800 transition-all flex items-center space-x-1 cursor-pointer"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Back To Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
