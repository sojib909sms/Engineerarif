import React, { useState, useEffect } from 'react';
import { Award, BookOpen, GraduationCap, Building2, CheckCircle2, ShieldCheck, Briefcase, Calendar, MapPin, Download } from 'lucide-react';
import { CAREER_MILESTONES } from '../data/portfolioData';
import { portfolioStore } from '../services/portfolioStore';
import { EngineerInfo } from '../types';

interface AboutProps {
  onOpenResume: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenResume }) => {
  const [selectedMilestone, setSelectedMilestone] = useState<number>(0);
  const [engineerInfo, setEngineerInfo] = useState<EngineerInfo>(portfolioStore.getEngineerInfo());

  useEffect(() => {
    const unsubscribe = portfolioStore.subscribe(() => {
      setEngineerInfo(portfolioStore.getEngineerInfo());
    });
    return unsubscribe;
  }, []);

  return (
    <section id="about" className="py-20 bg-slate-50 text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold tracking-wider uppercase font-mono">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            Engineering Background & Specialization
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About {engineerInfo.name}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Specializing in AutoCAD 2D & 3D drafting, 3ds Max architectural visualization, and practical construction site execution.
          </p>
        </div>

        {/* Bio & Credentials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Full Biography */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Civil Engineering Designer Profile
            </h3>
            
            <div className="text-slate-700 leading-relaxed text-sm sm:text-base space-y-4">
              <p>
                {engineerInfo.bioSummary || "I am a dedicated Civil Engineering Designer & Construction Site Engineer with over 3+ years of practical experience. Specializing in AutoCAD 2D/3D drafting and 3ds Max architectural rendering."}
              </p>
            </div>


            {/* Core Values / Pillars */}
            <div className="pt-2">
              <h4 className="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider mb-3">Core Engineering Principles</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-blue-900 text-sm flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Practical & Constructible
                  </div>
                  <p className="text-xs text-slate-600">Ensuring all 2D drawings match real-world construction tolerances.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-blue-900 text-sm flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Precision CAD Detailing
                  </div>
                  <p className="text-xs text-slate-600">Standardized AutoCAD layers, dimension styles, and complete permit sheets.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-blue-900 text-sm flex items-center gap-1.5 mb-1">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    Site Work & Field Coordination
                  </div>
                  <p className="text-xs text-slate-600">Hands-on experience verifying rebar placement and site measurements.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-blue-900 text-sm flex items-center gap-1.5 mb-1">
                    <Award className="w-4 h-4 text-blue-600" />
                    Realistic 3ds Max Renders
                  </div>
                  <p className="text-xs text-slate-600">Photorealistic V-Ray renders with PBR materials and natural lighting.</p>
                </div>
              </div>
            </div>

            {/* Resume Button */}
            <div className="pt-2">
              <button
                onClick={onOpenResume}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all shadow cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>View & Download Curriculum Vitae (CV)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Education & Certifications Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Education Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Education & Qualifications
              </h3>

              <div className="space-y-4">
                {(engineerInfo.education || CAREER_MILESTONES).map((edu, index) => (
                  <div key={index} className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">{edu.degree}</h4>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">{edu.year}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{edu.institution}</p>
                    <p className="text-xs text-blue-700 font-semibold">{edu.honors}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications Box */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Award className="w-5 h-5 text-blue-400" />
                Professional Certifications
              </h3>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                {(engineerInfo.certifications || []).map((cert, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Interactive Career Timeline */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-blue-600" />
                Career & Project Experience
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">Proven track record in CAD drafting, 3D modeling, and construction site supervision.</p>
            </div>

            <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
              {CAREER_MILESTONES.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMilestone(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all whitespace-nowrap cursor-pointer ${
                    selectedMilestone === idx
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {m.period}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Milestone Details */}
          {CAREER_MILESTONES[selectedMilestone] && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start bg-slate-50 p-5 sm:p-6 rounded-xl border border-slate-200">
              <div className="md:col-span-5 space-y-2 border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-6">
                <span className="inline-block px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-mono font-bold">
                  {CAREER_MILESTONES[selectedMilestone].period}
                </span>
                <h4 className="text-lg font-bold text-slate-900">{CAREER_MILESTONES[selectedMilestone].role}</h4>
                <div className="text-sm font-semibold text-blue-700 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  {CAREER_MILESTONES[selectedMilestone].company}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                  <MapPin className="w-3.5 h-3.5" />
                  {CAREER_MILESTONES[selectedMilestone].location}
                </div>
                <p className="text-xs text-slate-600 pt-2 leading-relaxed">
                  {CAREER_MILESTONES[selectedMilestone].description}
                </p>
              </div>

              <div className="md:col-span-7 space-y-3">
                <h5 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider">Key Project Accomplishments</h5>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {CAREER_MILESTONES[selectedMilestone].achievements.map((ach, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
