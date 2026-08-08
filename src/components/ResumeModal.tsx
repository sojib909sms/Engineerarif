import React from 'react';
import { X, Download, Printer, ShieldCheck, Award, Briefcase, GraduationCap, Building2, Phone, Mail, MapPin } from 'lucide-react';
import { ENGINEER_INFO, CAREER_MILESTONES } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCV = () => {
    const cvContent = `CURRICULUM VITAE
--------------------------------------------------
${ENGINEER_INFO.name}
${ENGINEER_INFO.title}
${ENGINEER_INFO.peLicense}
Email: ${ENGINEER_INFO.email} | Phone: ${ENGINEER_INFO.phone} | Location: ${ENGINEER_INFO.location}

PROFESSIONAL SUMMARY
${ENGINEER_INFO.bioSummary}

EDUCATION & CERTIFICATIONS
${ENGINEER_INFO.education.map(e => `- ${e.degree}, ${e.institution} (${e.year})`).join('\n')}

CERTIFICATIONS:
${ENGINEER_INFO.certifications.map(c => `- ${c}`).join('\n')}

CAREER EXPERIENCE:
${CAREER_MILESTONES.map(m => `
${m.role} @ ${m.company} (${m.period}) - ${m.location}
${m.description}
Key Accomplishments:
${m.achievements.map(a => `  * ${a}`).join('\n')}
`).join('\n')}

SOFTWARE & TOOLS:
- AutoCAD 2D/3D (Mastery)
- 3ds Max + V-Ray & Corona
- STAAD.Pro V8i & ETABS v21
- Revit Structure & Civil 3D
- Adobe Photoshop CC
--------------------------------------------------
Stamped PE Verification: State Licensing Board #84920`;

    const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'MD_Arif_Mia_Civil_Engineering_Designer_CV.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative border border-slate-300">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base sm:text-lg text-white">Curriculum Vitae — Civil Engineering Designer</h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print CV"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownloadCV}
              className="p-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download CV</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CV Body Content */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 text-left bg-white font-sans text-slate-800">
          
          {/* Header Contact Block */}
          <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{ENGINEER_INFO.name}</h1>
              <p className="text-sm font-semibold text-blue-700">{ENGINEER_INFO.title}</p>
              <p className="text-xs font-mono text-slate-500 font-bold">{ENGINEER_INFO.peLicense}</p>
            </div>

            <div className="text-xs font-mono space-y-1 text-slate-600">
              <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-600" /> {ENGINEER_INFO.email}</div>
              <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-blue-600" /> {ENGINEER_INFO.phone}</div>
              <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-blue-600" /> {ENGINEER_INFO.location}</div>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono font-bold text-blue-900 uppercase tracking-wider border-b border-blue-100 pb-1">
              Professional Summary
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {ENGINEER_INFO.bioSummary}
            </p>
          </div>

          {/* Experience Timeline */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono font-bold text-blue-900 uppercase tracking-wider border-b border-blue-100 pb-1 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-600" />
              Career & Structural Consulting History
            </h2>

            <div className="space-y-5">
              {CAREER_MILESTONES.map((m, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">{m.role} — <span className="text-blue-700">{m.company}</span></h3>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{m.period}</span>
                  </div>
                  <p className="text-xs text-slate-600">{m.description}</p>
                  <ul className="list-disc list-inside text-xs text-slate-700 pl-1 space-y-0.5">
                    {m.achievements.map((ach, aIdx) => (
                      <li key={aIdx}>{ach}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <h2 className="text-xs font-mono font-bold text-blue-900 uppercase tracking-wider border-b border-blue-100 pb-1 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Education
              </h2>
              {ENGINEER_INFO.education.map((edu, idx) => (
                <div key={idx} className="text-xs space-y-0.5">
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-600">{edu.institution} ({edu.year})</div>
                  <div className="text-blue-700 font-semibold">{edu.honors}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h2 className="text-xs font-mono font-bold text-blue-900 uppercase tracking-wider border-b border-blue-100 pb-1 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-600" />
                Professional Certifications
              </h2>
              <ul className="text-xs text-slate-700 space-y-1">
                {ENGINEER_INFO.certifications.map((cert, idx) => (
                  <li key={idx}>• {cert}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
