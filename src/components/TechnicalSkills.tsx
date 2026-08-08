import React, { useState } from 'react';
import { SKILLS_CATEGORIES } from '../data/portfolioData';
import { IconHelper } from './IconHelper';
import { Cpu, Award, CheckCircle2, ChevronRight, Layers, Sparkles, Building2 } from 'lucide-react';

export const TechnicalSkills: React.FC = () => {
  return (
    <section id="skills" className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wider uppercase font-mono">
            <Cpu className="w-4 h-4 text-blue-400" />
            Engineering & Technical Skills
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Technical Skills & Design Expertise
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            A versatile set of core engineering skills spanning 2D CAD drafting, 3D solid modeling, 3ds Max visualization, and site supervision.
          </p>
        </div>

        {/* Skill Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS_CATEGORIES[0].skills.map((skill, index) => (
            <div
              key={index}
              className="bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all hover:translate-y-[-2px] space-y-4 shadow-lg backdrop-blur-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                      <IconHelper name={skill.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">{skill.name}</h3>
                      <span className="text-xs font-mono text-blue-400">{skill.experienceYears} Years Hands-on</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-extrabold text-blue-400 font-mono">{skill.level}%</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {skill.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Skill
                </span>
                <span>Level: High Mastery</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Banner */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Practical Site Execution & Building Code Compliance</h4>
              <p className="text-xs text-slate-400 font-mono">AutoCAD 2D/3D • 3ds Max V-Ray/Corona • Site Execution Working Drawings</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs font-mono text-emerald-400 px-3 py-1.5 rounded bg-emerald-950 border border-emerald-800 font-semibold">
              ✓ 100% Construction-Ready Output
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
