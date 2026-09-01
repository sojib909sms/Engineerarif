import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Paperclip, FileText, CheckCircle2, ShieldCheck, Download, ExternalLink, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { ENGINEER_INFO } from '../data/portfolioData';
import { inquiryStore } from '../services/inquiryStore';

interface ContactSectionProps {
  preselectedService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ preselectedService }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: preselectedService || 'AutoCAD 2D Working Drawings & Detailing',
    budget: '$100 - $500',
    message: '',
    attachedFileName: '',
    attachmentType: '',
    attachmentSize: '',
    attachmentDataUrl: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdRefId, setCreatedRefId] = useState('');

  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, subject: preselectedService }));
    }
  }, [preselectedService]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      const formattedSize = file.size > 1024 * 1024 ? `${sizeInMB} MB` : `${Math.round(file.size / 1024)} KB`;

      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ 
          ...prev, 
          attachedFileName: file.name,
          attachmentType: file.type || 'application/octet-stream',
          attachmentSize: formattedSize,
          attachmentDataUrl: (reader.result as string) || ''
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAttachment = () => {
    setFormData(prev => ({
      ...prev,
      attachedFileName: '',
      attachmentType: '',
      attachmentSize: '',
      attachmentDataUrl: ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const createdInquiry = inquiryStore.addInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company || 'Private Client',
        service: formData.subject,
        budget: formData.budget,
        message: formData.message,
        attachmentName: formData.attachedFileName,
        attachmentType: formData.attachmentType,
        attachmentSize: formData.attachmentSize,
        attachmentDataUrl: formData.attachmentDataUrl
      });

      setCreatedRefId(createdInquiry.id);
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const handleDownloadSampleDrawing = () => {
    const content = `%DWG-ENGINEERING-SAMPLE-HEADER
Project: Standard Residential Floor Plan & Column Layout
Scale: 1/4" = 1'-0"
Layer Structure: A-WALL, A-DOOR, A-WIND, S-COL, S-BEAM, S-GRID, S-DIM
Designer: MD Arif Mia (Civil Engineering Designer)
Specialization: AutoCAD 2D & 3D Drafting, 3ds Max Modeling

SPECIFICATIONS:
Standard Architectural & Structural Layout Sheets
Civil Engineering Construction Detailing

NOTES:
1. All drawings drafted in AutoCAD 2024.
2. Field verify all site dimensions prior to execution.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'MD_Arif_Mia_Sample_AutoCAD_Drawing_Spec.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="contact" className="py-20 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wider uppercase font-mono">
            <Mail className="w-4 h-4 text-blue-400" />
            Get In Touch & Project Consultation
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Contact {ENGINEER_INFO.name}
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Send your project blueprints, architectural sketches, floor plans, or 3D visualization requests for a prompt quote.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Info Card */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Info Card */}
            <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 shadow-xl text-left">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                Direct Communication Channels
              </h3>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 font-mono block">Direct Email:</span>
                    <a href={`mailto:${ENGINEER_INFO.email}`} className="font-semibold text-white hover:text-blue-400 transition-colors">
                      {ENGINEER_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="w-full">
                    <span className="text-xs text-slate-400 font-mono block">Phone & WhatsApp:</span>
                    <div className="flex items-center justify-between gap-2">
                      <a href={`tel:${ENGINEER_INFO.phone}`} className="font-semibold text-white hover:text-blue-400 transition-colors">
                        {ENGINEER_INFO.phone}
                      </a>
                      <a
                        href={ENGINEER_INFO.social.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded font-mono shadow transition-colors"
                      >
                        Chat WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <ExternalLink className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div className="w-full space-y-1">
                    <span className="text-xs text-slate-400 font-mono block">Social Profiles:</span>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                      <a href={ENGINEER_INFO.social.facebook} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 hover:text-white border border-blue-700/50 transition-colors">
                        Facebook
                      </a>
                      <a href={ENGINEER_INFO.social.linkedin} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 hover:text-white border border-blue-800 transition-colors">
                        LinkedIn
                      </a>
                      <a href={ENGINEER_INFO.social.twitter} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 hover:text-white border border-sky-800 transition-colors">
                        Twitter (X)
                      </a>
                      <a href={ENGINEER_INFO.social.instagram} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded bg-pink-950 text-pink-300 hover:text-white border border-pink-800 transition-colors">
                        Instagram
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 font-mono block">Location:</span>
                    <span className="font-semibold text-white">{ENGINEER_INFO.location}</span>
                  </div>
                </div>
              </div>

              {/* Quick Response Time Guarantee */}
              <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-500/30 text-xs text-blue-300 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Fast Turnaround & Quick Communication
                </div>
                <p className="text-slate-300">
                  Send your drawings or floor plan inquiries and receive a prompt response within a few hours.
                </p>
              </div>

              {/* Sample Download Button */}
              <button
                onClick={handleDownloadSampleDrawing}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 border border-slate-700 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>Download Sample AutoCAD Drawing Specs</span>
              </button>
            </div>

          </div>

          {/* Right Column: Quote & Inquiry Form */}
          <div className="lg:col-span-7 bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl text-left">
            {submitted ? (
              <div className="py-12 text-center space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-2xl font-extrabold text-white">Inquiry & Blueprint Sent Successfully!</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Thank you, <strong>{formData.name}</strong>. MD Arif Mia has received your project details regarding <strong>"{formData.subject}"</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-md mx-auto text-xs font-mono text-slate-300 space-y-2 text-left">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Inquiry Ref ID:</span>
                    <strong className="text-blue-400">{createdRefId || '#INQ-10495'}</strong>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Automated Notification Sent To:</span>
                    <strong className="text-emerald-400 font-sans text-[11px]">arif.mia02@uttarauniversity.edu.bd</strong>
                  </div>
                  {formData.attachedFileName && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Attached File:</span>
                      <strong className="text-white truncate max-w-[180px]">{formData.attachedFileName}</strong>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  MD Arif Mia will review your specifications and contact you via phone (<strong className="text-slate-200">{formData.phone || 'provided number'}</strong>) or email shortly.
                </p>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      company: '',
                      subject: 'AutoCAD 2D Working Drawings & Detailing',
                      budget: '$100 - $500',
                      message: '',
                      attachedFileName: '',
                      attachmentType: ''
                    });
                  }}
                  className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Submit Another Project Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    Project Scope & Quote Form
                  </h3>
                  <span className="text-xs font-mono text-blue-400 bg-blue-950 px-2.5 py-1 rounded border border-blue-800">
                    Direct Inquiry
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-slate-300">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Architect or Client Name"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-slate-300">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. client@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-slate-300">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+880 1..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-medium text-slate-300">Company / Organization</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="e.g. Residential Construction Co."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-medium text-slate-300">Service Requested *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="AutoCAD 2D Drafting & Floor Plans">AutoCAD 2D Drafting & Architectural Floor Plans</option>
                    <option value="AutoCAD 3D Modeling">AutoCAD 3D Modeling & Building Concepts</option>
                    <option value="3ds Max Realistic Visualization">3ds Max Photorealistic Interior & Exterior Renders</option>
                    <option value="Working Drawings & Site Details">Working Drawings & Construction Site Details</option>
                    <option value="Site Plan & Quantity Estimation">Site Layout Plan & Basic Material Estimation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-medium text-slate-300">Estimated Project Budget Range</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['<$100', '$100 - $500', '$500 - $1,500', '$1,500+'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, budget: b }))}
                        className={`py-2 px-2 text-xs rounded-lg border font-mono transition-colors ${
                          formData.budget === b
                            ? 'bg-blue-600 text-white border-blue-400 font-bold'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-medium text-slate-300">Project Details & Instructions *</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe plot dimensions, floor count, drawing details, or 3ds Max rendering preferences..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                  ></textarea>
                </div>

                {/* File Attachment Dropzone */}
                <div className="space-y-1">
                  <label className="text-xs font-mono font-medium text-slate-300">Attach CAD Sketch, Floor Plan or Hand Drawing (Optional)</label>
                  {formData.attachedFileName ? (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/50 flex items-center justify-between gap-3 shadow-inner">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                          <Paperclip className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 text-left">
                          <div className="text-xs font-bold text-white truncate max-w-[220px] sm:max-w-xs font-mono">
                            {formData.attachedFileName}
                          </div>
                          <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-2">
                            <span>Ready to upload</span>
                            {formData.attachmentSize && <span>• {formData.attachmentSize}</span>}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveAttachment}
                        className="px-2.5 py-1 text-xs rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-colors cursor-pointer shrink-0 font-mono"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-slate-800 hover:border-blue-500 rounded-xl p-4 text-center bg-slate-950/60 transition-colors">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <Paperclip className="w-5 h-5 text-blue-400" />
                        <span className="text-xs text-slate-300 font-medium">
                          Click or drop DWG, DXF, JPG, PNG or PDF files here
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">Full file & specifications will be sent directly to Admin Panel</span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 border border-blue-400/30 cursor-pointer"
                >
                  {loading ? (
                    <span className="animate-pulse">Sending Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry to {ENGINEER_INFO.name}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
