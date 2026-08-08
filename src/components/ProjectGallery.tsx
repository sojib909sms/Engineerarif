import React, { useState, useEffect } from 'react';
import { Project, ProjectCategory } from '../types';
import { portfolioStore } from '../services/portfolioStore';
import { LayoutGrid, Layers, Sparkles, Camera, Box, Search, Filter, Eye, FileText, CheckCircle2, SlidersHorizontal, Download, ZoomIn, ChevronDown } from 'lucide-react';

interface ProjectGalleryProps {
  onOpenLightbox: (project: Project) => void;
  selectedCategory: ProjectCategory;
  onSelectCategory: (category: ProjectCategory) => void;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  onOpenLightbox,
  selectedCategory,
  onSelectCategory
}) => {
  const [projects, setProjects] = useState<Project[]>(portfolioStore.getProjects());
  const [searchQuery, setSearchQuery] = useState('');
  const [clayToggleMap, setClayToggleMap] = useState<{ [key: string]: boolean }>({});
  const [showAllProjects, setShowAllProjects] = useState(false);

  useEffect(() => {
    const unsubscribe = portfolioStore.subscribe(() => {
      setProjects(portfolioStore.getProjects());
    });
    return unsubscribe;
  }, []);

  const filterTabs = [
    { id: 'all', label: 'All Works', icon: LayoutGrid, count: projects.length },
    { id: 'autocad-2d', label: 'AutoCAD 2D Projects', icon: FileText, count: projects.filter(p => p.category === 'autocad-2d').length },
    { id: 'autocad-3d', label: 'AutoCAD 3D Models', icon: Box, count: projects.filter(p => p.category === 'autocad-3d').length },
    { id: '3dsmax', label: '3ds Max Visuals', icon: Sparkles, count: projects.filter(p => p.category === '3dsmax').length },
    { id: 'photography', label: 'Site Photography', icon: Camera, count: projects.filter(p => p.category === 'photography').length },
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.software.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const toggleClayRender = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setClayToggleMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const visibleProjects = showAllProjects ? filteredProjects : filteredProjects.slice(0, 3);

  return (
    <section id="projects" className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wider uppercase font-mono">
            <LayoutGrid className="w-4 h-4 text-blue-400" />
            Civil & Structural Portfolio Matrix
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            AutoCAD 2D, 3D & 3ds Max Project Showcase
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Explore stamped structural blueprints, parametric 3D CAD assemblies, photorealistic V-Ray renders, and field site photography.
          </p>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="space-y-6">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onSelectCategory(tab.id as ProjectCategory);
                    setShowAllProjects(false);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-blue-800 text-white' : 'bg-slate-900 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowAllProjects(false);
              }}
              placeholder="Search by drawing title, rebar, V-Ray, steel, or code..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowAllProjects(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <p className="text-slate-400 text-base font-mono">No matching engineering projects found for "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('all');
                setShowAllProjects(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleProjects.map((project) => {
                const isClayActive = clayToggleMap[project.id];
                const displayImage = isClayActive && project.clayRenderImage ? project.clayRenderImage : project.mainImage;

                return (
                  <div
                    key={project.id}
                    onClick={() => onOpenLightbox(project)}
                    className="group bg-slate-950 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-600/10 flex flex-col justify-between overflow-hidden cursor-pointer"
                  >
                    <div className="space-y-4">
                      {/* Card Media Preview Container */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-900 border-b border-slate-800">
                        <img
                          src={displayImage}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                          <span className="px-2.5 py-1 rounded bg-slate-950/90 text-blue-300 border border-slate-700 text-xs font-mono font-bold shadow backdrop-blur-sm">
                            {project.categoryLabel}
                          </span>

                          {project.featured && (
                            <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-xs font-semibold shadow">
                              ★ Featured
                            </span>
                          )}
                        </div>

                        {/* 3ds Max Clay/Wireframe Toggle Button */}
                        {project.clayRenderImage && (
                          <div className="absolute bottom-3 left-3 z-10">
                            <button
                              onClick={(e) => toggleClayRender(project.id, e)}
                              className="px-2.5 py-1 rounded bg-slate-950/90 text-xs font-mono font-semibold text-blue-300 hover:text-white border border-blue-500/40 hover:bg-blue-600 transition-colors shadow flex items-center gap-1 cursor-pointer"
                            >
                              <SlidersHorizontal className="w-3.5 h-3.5" />
                              <span>{isClayActive ? 'View Final Render' : 'Clay Wireframe'}</span>
                            </button>
                          </div>
                        )}

                        {/* Hover Zoom Prompt Icon */}
                        <div className="absolute inset-0 bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                            <ZoomIn className="w-6 h-6" />
                          </div>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-5 space-y-3 text-left">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                          <span>{project.client}</span>
                          <span>{project.year} • {project.location}</span>
                        </div>

                        <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-blue-400 transition-colors leading-snug">
                          {project.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                          {project.subtitle || project.description}
                        </p>

                        {/* CAD Layers Preview Tag Bar */}
                        {project.layers && (
                          <div className="pt-1 flex items-center gap-1.5 overflow-x-auto text-xs font-mono text-slate-400">
                            <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span>CAD Layers:</span>
                            <span className="text-slate-300 font-semibold">{project.layers.length} Layers</span>
                          </div>
                        )}

                        {/* Software Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {project.software.map((sw, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                            >
                              {sw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Action */}
                    <div className="px-5 pb-5 pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        <span>Inspect Drawing & Specifications</span>
                      </span>
                      <span className="font-mono">→</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View All Projects Button */}
            {filteredProjects.length > 3 && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setShowAllProjects(!showAllProjects)}
                  className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all transform hover:-translate-y-0.5 border border-blue-400/40 cursor-pointer"
                >
                  <LayoutGrid className="w-5 h-5 text-blue-200" />
                  <span>{showAllProjects ? 'Show Less' : `View All (${filteredProjects.length} Projects)`}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showAllProjects ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
