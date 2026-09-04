import React, { useState, useEffect } from 'react';
import { ShieldCheck, Award, ArrowRight, Download, Layers, Building2, Sparkles, CheckCircle2, ChevronRight, FileCode2, Camera, Cpu } from 'lucide-react';
import { portfolioStore } from '../services/portfolioStore';
import { EngineerInfo } from '../types';
import { AnimatedRoleTicker } from './AnimatedRoleTicker';

interface HeroProps {
  onOpenResume: () => void;
  onSelectCategory: (category: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume, onSelectCategory }) => {
  const [info, setInfo] = useState<EngineerInfo>(portfolioStore.getEngineerInfo());

  useEffect(() => {
    const unsubscribe = portfolioStore.subscribe(() => {
      setInfo(portfolioStore.getEngineerInfo());
    });
    return unsubscribe;
  }, []);

  return (
    <section id="hero" className="relative min-h-screen bg-slate-950 text-white pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden flex items-center">
      {/* Background Hero Image with Deep Blue Gradient Overlay */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src={info.heroBgImage}
          alt="Civil Engineering Blueprint Background"
          className="w-full h-full object-cover filter brightness-75 contrast-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.15),transparent_50%)]" />
      </div>

      {/* Blueprint Grid Lines Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Engineer Profile & Intro */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Certification / Role Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs sm:text-sm font-medium shadow-inner backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="font-semibold text-white">Civil Engineering Designer & 3D Artist</span>
              <span className="text-slate-400 hidden sm:inline">|</span>
              <span className="text-blue-300 hidden sm:inline font-mono">{info.location}</span>
            </div>

            {/* Main Name & Animated Role Ticker */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight font-sans">
                {info.name}
              </h1>
              
              {/* Advanced Animated CAD Role Ticker Component */}
              <AnimatedRoleTicker roles={info.roles && info.roles.length > 0 ? info.roles : ["Civil Engineer"]} />
            </div>

            {/* Short Introduction */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              {info.shortIntro}
            </p>

            {/* Key Skill Roles Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {(info.roles || []).slice(0, 8).map((role, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300"
                >
                  {role}
                </span>
              ))}
              <span className="px-2.5 py-1 rounded-md bg-blue-950/60 border border-blue-800/60 text-xs font-semibold text-blue-300">
                +9 More Specialized Roles
              </span>
            </div>

            {/* Highlights Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">{info.projectsCompleted}+</div>
                <div className="text-xs text-slate-400 font-medium">Projects Delivered</div>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono">{info.yearsExperience}+ Years</div>
                <div className="text-xs text-slate-400 font-medium">Practical Experience</div>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-slate-900/80 border border-slate-800 p-3 rounded-xl backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">{info.designAccuracy}</div>
                <div className="text-xs text-slate-400 font-medium">Design Accuracy</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#projects"
                onClick={() => {
                  const el = document.getElementById('projects');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all hover:translate-y-[-2px] border border-blue-400/40 cursor-pointer"
              >
                <span>View Portfolio Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenResume}
                className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm sm:text-base border border-slate-700 hover:border-slate-600 transition-all hover:translate-y-[-2px] cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>Download CV</span>
              </button>
            </div>

            {/* Quick Filter Navigation */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Quick Portfolio Tabs:</span>
              <button
                onClick={() => {
                  onSelectCategory('autocad-2d');
                  const el = document.getElementById('projects');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-blue-400 hover:border-blue-500/40 transition-colors cursor-pointer"
              >
                AutoCAD 2D
              </button>
              <button
                onClick={() => {
                  onSelectCategory('autocad-3d');
                  const el = document.getElementById('projects');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-blue-400 hover:border-blue-500/40 transition-colors cursor-pointer"
              >
                AutoCAD 3D
              </button>
              <button
                onClick={() => {
                  onSelectCategory('3dsmax');
                  const el = document.getElementById('projects');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-blue-400 hover:border-blue-500/40 transition-colors cursor-pointer"
              >
                3ds Max Visualization
              </button>
              <button
                onClick={() => {
                  onSelectCategory('photography');
                  const el = document.getElementById('projects');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-blue-400 hover:border-blue-500/40 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Camera className="w-3 h-3 text-cyan-400" />
                Photography
              </button>
            </div>

          </div>

          {/* Right Column: Profile Card & Visual Capabilities */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 opacity-30 blur-xl"></div>

              {/* Card Container */}
              <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-2xl backdrop-blur-md space-y-5">
                
                {/* Profile Header Image */}
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] group border border-slate-800 shadow-md">
                  <img
                    src={info.profileImage}
                    alt={info.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                  {/* Stamp Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-md border border-slate-700 text-xs font-mono text-blue-300 flex items-center gap-1.5 shadow">
                    <Award className="w-3.5 h-3.5 text-blue-400" />
                    AUTOCAD & 3DS MAX VERIFIED
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <div className="text-white font-bold text-base flex items-center justify-between">
                      <span>{info.name}</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Available for Design Projects"></span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono">{info.title.split('|')[0] || 'Civil Engineering Designer'}</p>
                  </div>
                </div>

                {/* Core Expertise Bullet Checklist */}
                <div className="space-y-2 text-left pt-1">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">Core Specializations</div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span><strong>AutoCAD 2D & 3D:</strong> Floor Plans, Elevations, Sections & Structural Models</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span><strong>3ds Max Visualization:</strong> Photorealistic Interior & Exterior 8K Renderings</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span><strong>Site Supervision:</strong> Construction Working Drawings & Field Coordination</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Button */}
                <a
                  href="#contact"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 border border-slate-700 transition-colors"
                >
                  <FileCode2 className="w-4 h-4 text-blue-400" />
                  <span>Request AutoCAD Drawing or 3D Render Quote</span>
                  <ChevronRight className="w-4 h-4" />
                </a>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

