import React, { useState, useEffect } from 'react';
import { portfolioStore } from '../services/portfolioStore';
import { IconHelper } from './IconHelper';
import { Monitor, Layers, Check, ExternalLink, Command, Cpu, ChevronDown } from 'lucide-react';

export const SoftwareShowcase: React.FC = () => {
  const [tools, setTools] = useState(portfolioStore.getSoftwareTools());
  const [activeToolId, setActiveToolId] = useState<string>(tools[0]?.id || 'soft-01');
  const [showAllTools, setShowAllTools] = useState(false);

  useEffect(() => {
    const unsubscribe = portfolioStore.subscribe(() => {
      const updated = portfolioStore.getSoftwareTools();
      setTools(updated);
    });
    return unsubscribe;
  }, []);

  const visibleTools = showAllTools ? tools : tools.slice(0, 3);


  return (
    <section id="software" className="py-20 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wider uppercase font-mono">
            <Monitor className="w-4 h-4 text-blue-400" />
            Software Stack & CAD Engineering Suites
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Design Software & Modeling Tools
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Professional proficiency across industry-standard CAD, BIM, FEA, and 3D architectural rendering platforms.
          </p>
        </div>

        {/* Software Tools Cards Grid */}
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => setActiveToolId(tool.id)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer space-y-5 flex flex-col justify-between ${
                  activeToolId === tool.id
                    ? 'bg-slate-900 border-blue-500 shadow-xl shadow-blue-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                        <IconHelper name={tool.iconName} className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">{tool.name}</h3>
                        <span className="text-xs font-mono text-slate-400">{tool.category}</span>
                      </div>
                    </div>

                    <span className={`text-xs px-2.5 py-1 rounded-full border font-mono font-bold ${tool.badgeColor}`}>
                      {tool.version}
                    </span>
                  </div>

                  {/* Proficiency Meter */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-slate-400">
                      <span>Proficiency Level</span>
                      <span className="text-blue-400 font-bold">{tool.proficiency}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${tool.proficiency}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {tool.description}
                  </p>

                  {/* Key Workflows */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">Key Workflows & Features</div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {tool.keyWorkflows.map((wf, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{wf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Primary Use Case Footer */}
                <div className="pt-3 border-t border-slate-800/80 bg-slate-950/50 p-3 rounded-xl border">
                  <span className="text-xs text-slate-400 font-mono block">Primary Application:</span>
                  <span className="text-xs font-medium text-blue-300">{tool.primaryUse}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Toggle View All / Show Less Software Tools Button */}
          {tools.length > 3 && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setShowAllTools(!showAllTools)}
                className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 border border-blue-400/40 cursor-pointer"
              >
                <Monitor className="w-5 h-5 text-blue-200" />
                <span>{showAllTools ? 'Show Less Software' : `View All (${tools.length} Software Tools)`}</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showAllTools ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
