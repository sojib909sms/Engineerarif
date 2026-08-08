import React, { useState } from 'react';
import { Project, CADLayer } from '../types';
import { X, Layers, Download, CheckCircle2, ChevronLeft, ChevronRight, SlidersHorizontal, ShieldCheck, FileText, Info, Award, ZoomIn, Building2, MapPin, Calendar, HardHat } from 'lucide-react';

interface LightboxModalProps {
  project: Project | null;
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ project, onClose, onNavigate }) => {
  if (!project) return null;

  const [activeTab, setActiveTab] = useState<'drawing' | 'specs' | 'layers' | 'calculations'>('drawing');
  const [layersState, setLayersState] = useState<CADLayer[]>(project.layers || []);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const imagesList = project.galleryImages && project.galleryImages.length > 0
    ? project.galleryImages
    : [project.mainImage];

  const currentImage = imagesList[selectedImageIndex] || project.mainImage;

  const toggleLayer = (layerIndex: number) => {
    setLayersState(prev => prev.map((l, idx) => idx === layerIndex ? { ...l, visible: !l.visible } : l));
  };

  const handleDownloadSpec = () => {
    const content = `ENGINEERING SPECIFICATION SHEET
Project: ${project.title}
Client: ${project.client}
Location: ${project.location}
Year: ${project.year}
Drawing No: ${project.cadDetails?.drawingNumber || 'SPEC-CAD-001'}
Code Compliance: ${project.cadDetails?.codeCompliance || 'ACI 318 / AISC 360'}

SPECIFICATIONS:
${Object.entries(project.specifications).map(([k, v]) => `${k}: ${v}`).join('\n')}

STRUCTURAL CALCULATION SUMMARY:
${project.structuralCalcSummary ? Object.entries(project.structuralCalcSummary).map(([k, v]) => `${k}: ${v}`).join('\n') : 'N/A'}

Engineered by: Eng. Alex Mercer, PE #84920`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.id}-Engineering-SpecSheet.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="space-y-0.5 text-left">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-xs font-mono font-bold">
                {project.categoryLabel}
              </span>
              <span className="text-xs text-slate-400 font-mono">{project.client} ({project.year})</span>
            </div>
            <h3 className="font-bold text-base sm:text-xl text-white tracking-tight">{project.title}</h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadSpec}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Spec Sheet</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Left Column: Image / CAD Canvas Viewer */}
          <div className="lg:col-span-8 bg-slate-950 p-4 flex flex-col justify-between space-y-4 border-b lg:border-b-0 lg:border-r border-slate-800 min-h-[340px] lg:min-h-[500px] relative">
            
            {/* Primary Displayed Image */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-2 group">
              <img
                src={currentImage}
                alt={project.title}
                className="max-h-[60vh] w-auto object-contain rounded-lg shadow-xl"
                referrerPolicy="no-referrer"
              />

              {/* Navigation Arrows on Image */}
              <button
                onClick={() => onNavigate('prev')}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white border border-slate-700 shadow-lg transition-all"
                title="Previous Project"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => onNavigate('next')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white border border-slate-700 shadow-lg transition-all"
                title="Next Project"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Gallery Thumbnails */}
            {imagesList.length > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-1 overflow-x-auto">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx ? 'border-blue-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* CAD Layer Status Bar if 2D/3D */}
            {layersState.length > 0 && (
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300 font-mono">
                <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                  <Layers className="w-4 h-4" />
                  CAD Layer Inspector:
                </span>
                <span>{layersState.filter(l => l.visible).length} / {layersState.length} Layers Active</span>
              </div>
            )}

          </div>

          {/* Right Column: Tabbed Technical Inspector Panel */}
          <div className="lg:col-span-4 p-5 bg-slate-900 flex flex-col justify-between space-y-5 text-left">
            
            {/* Inspector Tabs */}
            <div className="space-y-4">
              <div className="flex items-center space-x-1 border-b border-slate-800 pb-2 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('drawing')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors whitespace-nowrap ${
                    activeTab === 'drawing' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Project Summary
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors whitespace-nowrap ${
                    activeTab === 'specs' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Technical Specs
                </button>
                {layersState.length > 0 && (
                  <button
                    onClick={() => setActiveTab('layers')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors whitespace-nowrap ${
                      activeTab === 'layers' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    CAD Layers ({layersState.length})
                  </button>
                )}
                {project.structuralCalcSummary && (
                  <button
                    onClick={() => setActiveTab('calculations')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors whitespace-nowrap ${
                      activeTab === 'calculations' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Structural Calcs
                  </button>
                )}
              </div>

              {/* Tab Content: Project Summary */}
              {activeTab === 'drawing' && (
                <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                  <p className="leading-relaxed text-slate-300">
                    {project.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Client Organization:</span>
                      <span className="font-semibold text-white">{project.client}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Location:</span>
                      <span className="font-semibold text-white">{project.location}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Year Completed:</span>
                      <span className="font-semibold text-white">{project.year}</span>
                    </div>
                    {project.cadDetails && (
                      <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono">
                        <span className="text-slate-400">Drawing Scale:</span>
                        <span className="font-semibold text-blue-400">{project.cadDetails.scale}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 space-y-1.5">
                    <div className="text-xs font-mono font-semibold text-slate-400 uppercase">Software Tools Used</div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.software.map((sw, i) => (
                        <span key={i} className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700">
                          {sw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content: Technical Specs */}
              {activeTab === 'specs' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">Project Specifications Sheet</h4>
                  <div className="space-y-2 font-mono text-xs text-slate-300">
                    {Object.entries(project.specifications).map(([key, value]) => (
                      <div key={key} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
                        <div className="text-slate-400 text-[11px]">{key}</div>
                        <div className="text-white font-semibold">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Content: CAD Layers Inspector */}
              {activeTab === 'layers' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Toggle CAD Drawing Layers</span>
                    <span>Standardized Layer Palette</span>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    {layersState.map((layer, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleLayer(idx)}
                        className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                          layer.visible ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-950/40 border-slate-900 text-slate-600 line-through'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-3 h-3 rounded-full border border-slate-700" style={{ backgroundColor: layer.color }}></span>
                          <span className="font-semibold">{layer.name}</span>
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {layer.visible ? 'ON' : 'OFF'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab Content: Structural Calculations */}
              {activeTab === 'calculations' && project.structuralCalcSummary && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-300 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      PE Stamped Calculation Verified
                    </div>
                    <p className="text-[11px] text-slate-300">Analysis performed in STAAD.Pro V8i / ETABS v21.</p>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(project.structuralCalcSummary).map(([k, v]) => (
                      <div key={k} className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                        <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="text-white font-bold">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => onNavigate('prev')}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
              >
                ← Previous Project
              </button>
              <button
                onClick={() => onNavigate('next')}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
              >
                Next Project →
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
