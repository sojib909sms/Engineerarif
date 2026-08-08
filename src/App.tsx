import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { TechnicalSkills } from './components/TechnicalSkills';
import { SoftwareShowcase } from './components/SoftwareShowcase';
import { ProjectGallery } from './components/ProjectGallery';
import { LightboxModal } from './components/LightboxModal';
import { ServicesSection } from './components/ServicesSection';
import { Statistics } from './components/Statistics';
import { Testimonials } from './components/Testimonials';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AiAssistant } from './components/AiAssistant';
import { Project, ProjectCategory, User } from './types';
import { portfolioStore } from './services/portfolioStore';
import { authStore } from './services/authStore';
import { analyticsStore } from './services/analyticsStore';
import { Bot, Sparkles } from 'lucide-react';

export default function App() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [preselectedServiceForQuote, setPreselectedServiceForQuote] = useState<string>('');

  useEffect(() => {
    // Read session user on initial load
    const user = authStore.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    // Ping visitor analytics every 2 seconds to log active duration
    const interval = setInterval(() => {
      analyticsStore.pingActiveSession('Homepage');
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    authStore.logout();
    setCurrentUser(null);
  };

  const handleOpenLightbox = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseLightbox = () => {
    setSelectedProject(null);
  };

  const handleNavigateLightbox = (direction: 'next' | 'prev') => {
    if (!selectedProject) return;

    const allProjects = portfolioStore.getProjects();
    const currentIndex = allProjects.findIndex(p => p.id === selectedProject.id);
    if (currentIndex === -1) return;

    let nextIndex = 0;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % allProjects.length;
    } else {
      nextIndex = (currentIndex - 1 + allProjects.length) % allProjects.length;
    }

    setSelectedProject(allProjects[nextIndex]);
  };

  const handleSelectServiceForQuote = (serviceTitle: string) => {
    setPreselectedServiceForQuote(serviceTitle);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white relative">
      {/* Sticky Navigation Bar */}
      <Navbar
        onOpenResume={() => setIsResumeModalOpen(true)}
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onLogout={handleLogout}
        currentUser={currentUser}
        onSelectServiceForQuote={handleSelectServiceForQuote}
      />

      {/* Main Sections */}
      <main>
        {/* Hero Section */}
        <Hero
          onOpenResume={() => setIsResumeModalOpen(true)}
          onSelectCategory={(cat) => setSelectedCategory(cat as ProjectCategory)}
        />

        {/* About & Credentials Section */}
        <About onOpenResume={() => setIsResumeModalOpen(true)} />

        {/* Technical Engineering Skills */}
        <TechnicalSkills />

        {/* Design Software & CAD Tools */}
        <SoftwareShowcase />

        {/* Portfolio Gallery (AutoCAD 2D, AutoCAD 3D, 3ds Max, Site Photography) */}
        <ProjectGallery
          onOpenLightbox={handleOpenLightbox}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Engineering Services */}
        <ServicesSection onSelectServiceForQuote={handleSelectServiceForQuote} />

        {/* Statistics & Engineering Counters */}
        <Statistics />

        {/* Testimonials */}
        <Testimonials />

        {/* Contact Form & Blueprint Inquiry */}
        <ContactSection preselectedService={preselectedServiceForQuote} />
      </main>

      {/* Floating AI Assistant Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAiAssistantOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-cyan-500/40 border border-cyan-400/40 transition-all duration-300 transform hover:scale-105 cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-cyan-200 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900 animate-ping"></span>
          </div>
          <span className="font-mono">AI CAD Assistant</span>
          <span className="text-[10px] bg-cyan-950/80 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/40 font-mono">
            এআই
          </span>
        </button>
      </div>

      {/* Footer */}
      <Footer
        onOpenResume={() => setIsResumeModalOpen(true)}
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
        onSelectServiceForQuote={handleSelectServiceForQuote}
      />

      {/* AI Assistant Modal */}
      <AiAssistant
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        onOpenQuoteModal={handleSelectServiceForQuote}
      />

      {/* Lightbox Inspector Modal for CAD Drawings & 3ds Max Renders */}
      <LightboxModal
        project={selectedProject}
        onClose={handleCloseLightbox}
        onNavigate={handleNavigateLightbox}
      />

      {/* Printable / Downloadable CV Modal */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />

      {/* Account Login / Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onUserChange={(user) => setCurrentUser(user)}
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Advanced User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUserUpdate={(updated) => setCurrentUser(updated)}
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
      />

      {/* Admin Panel Dashboard for MD Arif Mia */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
      />
    </div>
  );
}
