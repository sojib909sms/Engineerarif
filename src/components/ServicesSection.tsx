import React, { useState, useEffect } from 'react';
import { EngineeringService } from '../types';
import { portfolioStore } from '../services/portfolioStore';
import { IconHelper } from './IconHelper';
import { Wrench, CheckCircle2, Clock, DollarSign, Send, ShieldCheck, ArrowRight, ChevronDown, LayoutGrid } from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceForQuote: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForQuote }) => {
  const [services, setServices] = useState<EngineeringService[]>(portfolioStore.getServices());
  const [showAllServices, setShowAllServices] = useState(false);

  useEffect(() => {
    const unsubscribe = portfolioStore.subscribe(() => {
      setServices(portfolioStore.getServices());
    });
    return unsubscribe;
  }, []);

  const handleQuoteClick = (title: string) => {
    onSelectServiceForQuote(title);
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const visibleServices = showAllServices ? services : services.slice(0, 3);

  return (
    <section id="services" className="py-20 bg-slate-50 text-slate-900 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-semibold tracking-wider uppercase font-mono">
            <Wrench className="w-4 h-4 text-blue-600" />
            Engineering Services & Professional Practice
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Civil Engineering & Architectural CAD Services
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Tailored engineering submittals, PE stamped calculations, 2D/3D CAD drafting, and photorealistic 3ds Max visualization packages.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleServices.map((service) => (
              <div
                key={service.id}
                className={`bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl p-6 flex flex-col justify-between space-y-6 relative ${
                  service.popular ? 'border-blue-500 shadow-md ring-1 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-blue-600 text-white text-xs font-mono font-bold shadow">
                    ★ Most Requested
                  </div>
                )}

                <div className="space-y-4 text-left">
                  {/* Service Header */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                      <IconHelper name={service.iconName} className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-semibold text-blue-700">{service.category}</span>
                      <h3 className="font-bold text-lg text-slate-900 leading-snug">{service.title}</h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {service.summary}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="text-xs font-mono font-semibold text-slate-700 uppercase tracking-wider">Key Deliverables</div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {service.deliverables.map((del, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer Info & CTA */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Turnaround: <strong>{service.turnaroundDays}</strong>
                    </span>
                    <span>Est: <strong className="text-blue-700">{service.startingRate}+</strong></span>
                  </div>

                  <button
                    onClick={() => handleQuoteClick(service.title)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm shadow transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Request Custom Quote</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Toggle View All / Show Less Services Button */}
          {services.length > 3 && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setShowAllServices(!showAllServices)}
                className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-sm sm:text-base shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Wrench className="w-5 h-5 text-blue-400" />
                <span>{showAllServices ? 'Show Less Services' : `View All (${services.length} Services)`}</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showAllServices ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
