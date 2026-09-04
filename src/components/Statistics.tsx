import React, { useState, useEffect } from 'react';
import { portfolioStore } from '../services/portfolioStore';
import { IconHelper } from './IconHelper';
import { TrendingUp, ShieldCheck, CheckCircle2, Award, Building2 } from 'lucide-react';

export const Statistics: React.FC = () => {
  const [stats, setStats] = useState(portfolioStore.getProjectStats());

  useEffect(() => {
    const unsubscribe = portfolioStore.subscribe(() => {
      setStats(portfolioStore.getProjectStats());
    });
    return unsubscribe;
  }, []);

  return (
    <section className="py-16 bg-slate-950 text-white border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-slate-950 p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Engineering Metrics & Practice Performance
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Quantifiable proof of precision drafting, structural integrity, and project execution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 hover:border-blue-500/40 transition-all text-center space-y-3 shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 mx-auto flex items-center justify-center text-blue-400">
                  <IconHelper name={stat.iconName} className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-xs font-bold text-blue-300">{stat.label}</div>
                </div>

                <p className="text-[11px] text-slate-400 leading-tight">
                  {stat.subtext}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
