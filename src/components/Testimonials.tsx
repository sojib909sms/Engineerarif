import React, { useState, useEffect } from 'react';
import { Testimonial } from '../types';
import { portfolioStore } from '../services/portfolioStore';
import { Star, Quote, Building2, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(portfolioStore.getTestimonials());
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = portfolioStore.subscribe(() => {
      setTestimonials(portfolioStore.getTestimonials());
    });
    return unsubscribe;
  }, []);

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[currentIndex % testimonials.length];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wider uppercase font-mono">
            <Quote className="w-4 h-4 text-blue-400" />
            Client Reviews & Verified Endorsements
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            What Clients & Architects Say
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Feedback from construction executives, lead architects, and municipal infrastructure directors.
          </p>
        </div>

        {/* Featured Testimonial Carousel Card */}
        <div className="max-w-4xl mx-auto bg-slate-950 p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative">
          
          <Quote className="w-12 h-12 text-blue-600/30 absolute top-6 right-6 pointer-events-none" />

          {/* Stars */}
          <div className="flex items-center space-x-1 text-amber-400">
            {[...Array(current.rating || 5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400" />
            ))}
          </div>

          {/* Quote Text */}
          <blockquote className="text-base sm:text-xl text-slate-200 italic leading-relaxed font-sans text-left">
            "{current.quote}"
          </blockquote>

          {/* Client Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-center space-x-4">
              <img
                src={current.avatarUrl}
                alt={current.clientName}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow"
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <div className="font-bold text-white text-base flex items-center gap-1.5">
                  {current.clientName}
                  <ShieldCheck className="w-4 h-4 text-blue-400" title="Verified Project Client" />
                </div>
                <div className="text-xs text-slate-400">{current.role}</div>
                <div className="text-xs text-blue-400 font-semibold">{current.company}</div>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs font-mono text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <div className="text-slate-300 font-bold">{current.projectType}</div>
              <div>{current.date}</div>
            </div>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex space-x-1">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    (currentIndex % testimonials.length) === idx ? 'bg-blue-500 w-6' : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-lg bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                title="Previous Review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-lg bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                title="Next Review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
