import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  FileText, 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Download, 
  MessageSquare, 
  Paperclip, 
  User as UserIcon, 
  Building2, 
  DollarSign, 
  Send, 
  Eye, 
  X, 
  RefreshCw, 
  Sparkles, 
  Check, 
  ExternalLink,
  Layers,
  ChevronRight,
  LogOut,
  AlertCircle,
  Plus,
  Edit2,
  BarChart3,
  Users,
  Timer,
  Globe,
  Briefcase,
  Star,
  Activity,
  Box,
  DraftingCompass,
  RotateCcw
} from 'lucide-react';
import { Inquiry, InquiryStatus, Project, EngineeringService, Testimonial, EngineerInfo, ProjectCategory } from '../types';
import { inquiryStore } from '../services/inquiryStore';
import { authStore, ADMIN_EMAIL, ADMIN_PASSWORD } from '../services/authStore';
import { portfolioStore } from '../services/portfolioStore';
import { analyticsStore, AnalyticsSummary } from '../services/analyticsStore';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>(ADMIN_EMAIL);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<EngineeringService[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [engineerInfo, setEngineerInfo] = useState<EngineerInfo>(portfolioStore.getEngineerInfo());
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(analyticsStore.getSummary());

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const [activeTab, setActiveTab] = useState<'inquiries' | 'analytics' | 'projects' | 'services' | 'testimonials' | 'settings'>('inquiries');
  const [replyText, setReplyText] = useState<string>('');
  const [adminNoteInput, setAdminNoteInput] = useState<string>('');
  const [actionNotification, setActionNotification] = useState<string>('');

  // Modals for Edit/Add
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [editingService, setEditingService] = useState<Partial<EngineeringService> | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkAuthAndLoad();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setInterval(() => {
        setAnalytics(analyticsStore.getSummary());
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isAuthenticated]);

  const checkAuthAndLoad = () => {
    const currentUser = authStore.getCurrentUser();
    if (authStore.isAdmin(currentUser)) {
      setIsAuthenticated(true);
      setLoginError('');
      loadData();
    } else {
      setIsAuthenticated(false);
    }
  };

  const loadData = () => {
    setInquiries(inquiryStore.getInquiries());
    setProjects(portfolioStore.getProjects());
    setServices(portfolioStore.getServices());
    setTestimonials(portfolioStore.getTestimonials());
    setEngineerInfo(portfolioStore.getEngineerInfo());
    setAnalytics(analyticsStore.getSummary());
  };

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanEmail = adminEmail.trim().toLowerCase();
    if (cleanEmail !== ADMIN_EMAIL.toLowerCase()) {
      setLoginError(`Access Denied: Only ${ADMIN_EMAIL} is authorized.`);
      return;
    }

    if (adminPassword !== ADMIN_PASSWORD) {
      setLoginError('Invalid Password for Admin Account.');
      return;
    }

    const res = authStore.login(cleanEmail, adminPassword);
    if (res.success && res.user && res.user.role === 'admin') {
      setIsAuthenticated(true);
      setLoginError('');
      loadData();
    } else {
      setLoginError(res.error || 'Authentication failed.');
    }
  };

  const handleLogoutAdmin = () => {
    authStore.logout();
    setIsAuthenticated(false);
    setAdminPassword('');
  };

  const showToast = (msg: string) => {
    setActionNotification(msg);
    setTimeout(() => {
      setActionNotification('');
    }, 3500);
  };

  const handleStatusChange = (id: string, newStatus: InquiryStatus) => {
    inquiryStore.updateStatus(id, newStatus);
    setInquiries(inquiryStore.getInquiries());
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry(prev => prev ? { ...prev, status: newStatus } : null);
    }
    showToast(`Inquiry #${id} status updated to "${newStatus.toUpperCase()}".`);
  };

  const handleSaveAdminNotes = (id: string) => {
    inquiryStore.updateAdminNotes(id, adminNoteInput);
    setInquiries(inquiryStore.getInquiries());
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry(prev => prev ? { ...prev, adminNotes: adminNoteInput } : null);
    }
    showToast(`Admin notes saved for Inquiry #${id}.`);
  };

  const handleAddReply = (id: string) => {
    if (!replyText.trim()) return;
    inquiryStore.addReply(id, replyText);
    setInquiries(inquiryStore.getInquiries());
    if (selectedInquiry && selectedInquiry.id === id) {
      const updatedList = inquiryStore.getInquiries();
      const updatedItem = updatedList.find(item => item.id === id);
      if (updatedItem) setSelectedInquiry(updatedItem);
    }
    showToast(`Automated email reply recorded and dispatched to client.`);
    setReplyText('');
  };

  const handleDeleteInquiry = (id: string) => {
    if (window.confirm(`Are you sure you want to delete inquiry ${id}?`)) {
      inquiryStore.deleteInquiry(id);
      setInquiries(inquiryStore.getInquiries());
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
      showToast(`Inquiry ${id} deleted successfully.`);
    }
  };

  // --- PROJECT CRUD ---
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject.mainImage) return;

    if (editingProject.id) {
      portfolioStore.updateProject(editingProject as Project);
      showToast(`Project "${editingProject.title}" updated successfully.`);
    } else {
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        title: editingProject.title || 'New Project',
        category: (editingProject.category as ProjectCategory) || 'autocad-2d',
        categoryLabel: editingProject.category === '3dsmax' ? '3ds Max Visualization' : editingProject.category === 'autocad-3d' ? 'AutoCAD 3D Projects' : editingProject.category === 'photography' ? 'Photography' : 'AutoCAD 2D Projects',
        subtitle: editingProject.subtitle || '',
        description: editingProject.description || '',
        client: editingProject.client || 'Client',
        year: editingProject.year || '2025',
        location: editingProject.location || 'Dhaka, Bangladesh',
        mainImage: editingProject.mainImage || '',
        software: editingProject.software || ['AutoCAD 2024'],
        specifications: editingProject.specifications || {},
        tags: editingProject.tags || ['AutoCAD 2D'],
        featured: editingProject.featured || false
      };
      portfolioStore.addProject(newProj);
      showToast(`New project "${newProj.title}" added to website portfolio!`);
    }

    setProjects(portfolioStore.getProjects());
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete project "${title}"?`)) {
      portfolioStore.deleteProject(id);
      setProjects(portfolioStore.getProjects());
      showToast(`Project "${title}" removed from website.`);
    }
  };

  // --- SERVICE CRUD ---
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) return;

    if (editingService.id) {
      portfolioStore.updateService(editingService as EngineeringService);
      showToast(`Service "${editingService.title}" updated successfully.`);
    } else {
      const newSrv: EngineeringService = {
        id: `srv-${Date.now()}`,
        title: editingService.title || 'New Service',
        category: editingService.category || 'CAD Services',
        iconName: editingService.iconName || 'DraftingCompass',
        summary: editingService.summary || '',
        deliverables: editingService.deliverables || ['Architectural Plan PDF / DWG'],
        turnaroundDays: editingService.turnaroundDays || '2 - 4 Days',
        startingRate: editingService.startingRate || '$150',
        popular: editingService.popular || false
      };
      portfolioStore.addService(newSrv);
      showToast(`Service "${newSrv.title}" added to website!`);
    }

    setServices(portfolioStore.getServices());
    setIsServiceModalOpen(false);
    setEditingService(null);
  };

  const handleDeleteService = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete service "${title}"?`)) {
      portfolioStore.deleteService(id);
      setServices(portfolioStore.getServices());
      showToast(`Service "${title}" removed from website.`);
    }
  };

  // --- TESTIMONIAL CRUD ---
  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial?.clientName || !editingTestimonial.quote) return;

    if (editingTestimonial.id) {
      portfolioStore.updateTestimonial(editingTestimonial as Testimonial);
      showToast(`Testimonial from ${editingTestimonial.clientName} updated.`);
    } else {
      const newTest: Testimonial = {
        id: `test-${Date.now()}`,
        clientName: editingTestimonial.clientName || 'Client Name',
        role: editingTestimonial.role || 'Project Director',
        company: editingTestimonial.company || 'Construction Co.',
        avatarUrl: editingTestimonial.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: editingTestimonial.rating || 5,
        quote: editingTestimonial.quote || '',
        projectType: editingTestimonial.projectType || 'Residential Building Plan',
        date: editingTestimonial.date || '2025'
      };
      portfolioStore.addTestimonial(newTest);
      showToast(`Testimonial from ${newTest.clientName} added!`);
    }

    setTestimonials(portfolioStore.getTestimonials());
    setIsTestimonialModalOpen(false);
    setEditingTestimonial(null);
  };

  const handleDeleteTestimonial = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete testimonial from "${name}"?`)) {
      portfolioStore.deleteTestimonial(id);
      setTestimonials(portfolioStore.getTestimonials());
      showToast(`Testimonial from ${name} deleted.`);
    }
  };

  // --- ENGINEER INFO UPDATE ---
  const handleSaveEngineerInfo = (e: React.FormEvent) => {
    e.preventDefault();
    portfolioStore.updateEngineerInfo(engineerInfo);
    showToast('Engineer profile and contact settings saved!');
  };

  const handleResetWebsiteDefaults = () => {
    if (window.confirm('Reset all website projects, services, and testimonials to default initial data?')) {
      portfolioStore.resetToDefaults();
      loadData();
      showToast('Website portfolio data reset to default.');
    }
  };

  const formatSeconds = (sec: number) => {
    if (sec < 60) return `${sec}s`;
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    if (mins < 60) return `${mins}m ${remainingSec}s`;
    const hrs = (sec / 3600).toFixed(1);
    return `${hrs} hours`;
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = 
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatusFilter === 'all' || inq.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-7xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header Bar */}
        <div className="bg-slate-950 border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>MD Arif Mia — Advanced Admin Portal</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-mono font-semibold">
                  MASTER CONTROL
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Primary Email: <strong className="text-blue-300">arif.mia02@uttarauniversity.edu.bd</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <button
                onClick={handleLogoutAdmin}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
                title="Lock Dashboard"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span className="hidden sm:inline">Lock Portal</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Toast Alert */}
        {actionNotification && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold font-mono py-2 px-4 text-center animate-in fade-in duration-200 shrink-0">
            ✓ {actionNotification}
          </div>
        )}

        {/* Login Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center space-y-6 max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/30 shadow-lg">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-white">Admin Authentication</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your authorized credentials for <strong className="text-blue-300">{ADMIN_EMAIL}</strong>.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-slate-300">Admin Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => { setAdminEmail(e.target.value); setLoginError(''); }}
                    placeholder={ADMIN_EMAIL}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-medium text-slate-300">Admin Master Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => { setAdminPassword(e.target.value); setLoginError(''); }}
                    placeholder="Enter Admin Password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Log In to Master Dashboard</span>
              </button>
            </form>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono space-y-1 text-left">
              <div className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Admin Credentials Configured:
              </div>
              <div>• Email: <strong className="text-white">{ADMIN_EMAIL}</strong></div>
              <div>• Password: <strong className="text-white">Ss6580765807@</strong></div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Navigation Tabs Header */}
            <div className="bg-slate-950/80 border-b border-slate-800 px-4 pt-3 flex items-center justify-between overflow-x-auto shrink-0">
              <div className="flex items-center space-x-1 sm:space-x-2">
                
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`px-3.5 py-2.5 rounded-t-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
                    activeTab === 'inquiries'
                      ? 'bg-slate-900 text-blue-400 border-t-2 border-blue-500'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span>Inquiries ({inquiries.length})</span>
                  {newInquiriesCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {newInquiriesCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3.5 py-2.5 rounded-t-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
                    activeTab === 'analytics'
                      ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-500'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span>Traffic & Browsing Analytics</span>
                </button>

                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-3.5 py-2.5 rounded-t-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
                    activeTab === 'projects'
                      ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-500'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <DraftingCompass className="w-4 h-4 text-emerald-400" />
                  <span>Edit Projects ({projects.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('services')}
                  className={`px-3.5 py-2.5 rounded-t-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
                    activeTab === 'services'
                      ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>Services ({services.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('testimonials')}
                  className={`px-3.5 py-2.5 rounded-t-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
                    activeTab === 'testimonials'
                      ? 'bg-slate-900 text-purple-400 border-t-2 border-purple-500'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Star className="w-4 h-4 text-purple-400" />
                  <span>Testimonials ({testimonials.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-3.5 py-2.5 rounded-t-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
                    activeTab === 'settings'
                      ? 'bg-slate-900 text-slate-200 border-t-2 border-slate-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Profile Settings</span>
                </button>

              </div>

              <button
                onClick={loadData}
                className="p-1.5 mb-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer shrink-0"
                title="Refresh All Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* TAB 1: CLIENT INQUIRIES */}
            {activeTab === 'inquiries' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                
                {/* Stats Header */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <div className="text-slate-400 text-xs font-mono">Total Inquiries</div>
                    <div className="text-2xl font-extrabold text-white font-mono mt-1">{inquiries.length}</div>
                    <div className="text-[11px] text-blue-400 font-mono mt-0.5">CAD & Site Quotes</div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-rose-900/40">
                    <div className="text-rose-300 text-xs font-mono">New / Unread</div>
                    <div className="text-2xl font-extrabold text-rose-400 font-mono mt-1">{newInquiriesCount}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">Requires Action</div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-900/40">
                    <div className="text-amber-300 text-xs font-mono">In Progress</div>
                    <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
                      {inquiries.filter(i => i.status === 'in-progress').length}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">Active CAD Work</div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-900/40">
                    <div className="text-emerald-300 text-xs font-mono">Completed</div>
                    <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                      {inquiries.filter(i => i.status === 'completed').length}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">Delivered Drawings</div>
                  </div>
                </div>

                {/* Filter & Search */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search client, email, service..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto">
                    {['all', 'new', 'contacted', 'in-progress', 'completed', 'archived'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setSelectedStatusFilter(st)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                          selectedStatusFilter === st
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inquiries Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Inquiry Item Cards */}
                  <div className="lg:col-span-5 space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {filteredInquiries.length === 0 ? (
                      <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs space-y-2">
                        <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                        <div>No inquiries found matching your filter criteria.</div>
                      </div>
                    ) : (
                      filteredInquiries.map((inq) => (
                        <div
                          key={inq.id}
                          onClick={() => {
                            setSelectedInquiry(inq);
                            setAdminNoteInput(inq.adminNotes || '');
                          }}
                          className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 text-left ${
                            selectedInquiry?.id === inq.id
                              ? 'bg-slate-800/90 border-blue-500 shadow-md ring-1 ring-blue-500'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono font-bold text-blue-400">{inq.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              inq.status === 'new' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                              inq.status === 'in-progress' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                              inq.status === 'completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                              'bg-slate-800 text-slate-300'
                            }`}>
                              {inq.status}
                            </span>
                          </div>

                          <div className="font-bold text-sm text-white flex items-center justify-between">
                            <span>{inq.name}</span>
                            <span className="text-xs font-mono text-emerald-400">{inq.budget}</span>
                          </div>

                          <div className="text-xs text-slate-400 font-mono line-clamp-1">
                            {inq.service}
                          </div>

                          {inq.attachmentName && (
                            <div className="flex items-center gap-1 text-[11px] text-blue-300 font-mono bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60 w-fit">
                              <Paperclip className="w-3 h-3 text-blue-400" />
                              <span className="truncate max-w-[180px]">{inq.attachmentName}</span>
                            </div>
                          )}

                          <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-1 border-t border-slate-900">
                            <span>{new Date(inq.createdAt).toLocaleString()}</span>
                            <span>Delivered to arif.mia02@...</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Right Column: Selected Inquiry View */}
                  <div className="lg:col-span-7 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-5 text-left">
                    {selectedInquiry ? (
                      <div className="space-y-5">
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-white">{selectedInquiry.name}</span>
                              <span className="text-xs font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                                {selectedInquiry.id}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">
                              Submitted: {new Date(selectedInquiry.createdAt).toLocaleString()}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <select
                              value={selectedInquiry.status}
                              onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value as InquiryStatus)}
                              className="bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
                            >
                              <option value="new">NEW / UNREAD</option>
                              <option value="contacted">CONTACTED</option>
                              <option value="in-progress">IN PROGRESS</option>
                              <option value="completed">COMPLETED</option>
                              <option value="archived">ARCHIVED</option>
                            </select>

                            <button
                              onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                              className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-colors"
                              title="Delete Inquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                            <span className="text-slate-400">Email Address:</span>
                            <div className="font-bold text-white">
                              <a href={`mailto:${selectedInquiry.email}`} className="text-blue-400 hover:underline">
                                {selectedInquiry.email}
                              </a>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                            <span className="text-slate-400">Phone / WhatsApp:</span>
                            <div className="font-bold text-white flex items-center justify-between">
                              <span>{selectedInquiry.phone || 'N/A'}</span>
                              {selectedInquiry.phone && (
                                <a
                                  href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-700"
                                >
                                  WhatsApp Chat
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                            <span className="text-slate-400">Service Requested:</span>
                            <div className="font-bold text-white">{selectedInquiry.service}</div>
                          </div>

                          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                            <span className="text-slate-400">Budget Range:</span>
                            <div className="font-bold text-emerald-400">{selectedInquiry.budget}</div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Project Message & Specifications:</span>
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                            {selectedInquiry.message}
                          </div>
                        </div>

                        {selectedInquiry.attachmentName && (
                          <div className="space-y-1">
                            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Attached Blueprint / File:</span>
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-2">
                                <Paperclip className="w-4 h-4 text-blue-400" />
                                <span className="font-mono text-white font-bold">{selectedInquiry.attachmentName}</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                                {selectedInquiry.attachmentType || 'Document / DWG'}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="space-y-1 pt-2 border-t border-slate-800">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Internal Admin Notes:</span>
                            <button
                              onClick={() => handleSaveAdminNotes(selectedInquiry.id)}
                              className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-mono font-bold rounded cursor-pointer"
                            >
                              Save Notes
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={adminNoteInput}
                            onChange={(e) => setAdminNoteInput(e.target.value)}
                            placeholder="Add private engineering notes, site inspection dates, or fee quotes..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none font-mono"
                          ></textarea>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-800">
                          <span className="text-xs font-mono font-bold text-slate-400 uppercase block">Send Direct Response:</span>
                          
                          {selectedInquiry.replies && selectedInquiry.replies.length > 0 && (
                            <div className="space-y-1.5 max-h-32 overflow-y-auto mb-2">
                              {selectedInquiry.replies.map((rep) => (
                                <div key={rep.id} className="p-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 space-y-0.5">
                                  <div className="text-[10px] text-blue-400 flex items-center justify-between">
                                    <span>Sent to {rep.sentTo}</span>
                                    <span>{new Date(rep.date).toLocaleString()}</span>
                                  </div>
                                  <div>{rep.text}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Type response to ${selectedInquiry.email}...`}
                              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                            />
                            <button
                              onClick={() => handleAddReply(selectedInquiry.id)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Dispatch</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="py-20 text-center space-y-3 text-slate-400">
                        <Eye className="w-10 h-10 text-slate-600 mx-auto" />
                        <div className="text-sm font-bold text-slate-300">Select an inquiry to view full details and attachments.</div>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: VISITOR TRAFFIC & TIME ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-left">
                
                {/* Traffic Counter Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  
                  <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/30 shadow-lg relative overflow-hidden">
                    <div className="flex items-center justify-between text-cyan-400 text-xs font-mono font-bold">
                      <span>LIVE VISITORS NOW</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    </div>
                    <div className="text-3xl font-extrabold text-white font-mono mt-2 flex items-baseline gap-1">
                      {analytics.activeVisitorsCount}
                      <span className="text-xs text-emerald-400 font-sans font-normal">online</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-1">
                      Active browsing users right now
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-lg">
                    <div className="text-slate-400 text-xs font-mono font-bold">TODAY'S VISITORS</div>
                    <div className="text-3xl font-extrabold text-white font-mono mt-2">
                      {analytics.todayVisits}
                    </div>
                    <div className="text-[11px] text-blue-400 font-mono mt-1">
                      Total unique visits today
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-lg">
                    <div className="text-slate-400 text-xs font-mono font-bold">TOTAL ALL-TIME VISITS</div>
                    <div className="text-3xl font-extrabold text-white font-mono mt-2">
                      {analytics.totalVisits}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-1">
                      Cumulative website traffic
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 shadow-lg">
                    <div className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                      <Timer className="w-3.5 h-3.5 text-emerald-400" /> BROWSING TIME TODAY
                    </div>
                    <div className="text-2xl font-extrabold text-white font-mono mt-2">
                      {formatSeconds(analytics.todayTimeSpentSeconds)}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-1">
                      Avg session: {formatSeconds(analytics.averageSessionSeconds)}
                    </div>
                  </div>

                </div>

                {/* Session Duration & Traffic Breakdown Banner */}
                <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      Website Visitors & Engagement Duration Summary
                    </h4>
                    <span className="text-xs font-mono text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800 font-bold">
                      REAL-TIME TRACKER ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    সিস্টেমটি স্বয়ংক্রিয়ভাবে প্রতিদিনের ভিজিটর সংখ্যা, বর্তমানে কতজন ওয়েবসাইট ব্রাউজ করছেন এবং তারা গড়ে কত মিনিট সময় কাটাচ্ছেন তা হিসাব রাখছে।
                  </p>
                </div>

                {/* Recent Session Logs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
                      Recent Visitor Browsing Sessions Log ({analytics.sessions.length})
                    </h4>
                    <button
                      onClick={() => {
                        analyticsStore.resetAnalytics();
                        setAnalytics(analyticsStore.getSummary());
                        showToast('Analytics logs reset.');
                      }}
                      className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset Analytics
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {analytics.sessions.map((sess) => (
                      <div key={sess.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-cyan-400">{sess.id}</span>
                            <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                              {sess.device}
                            </span>
                          </div>
                          <span className="text-slate-400">{new Date(sess.startTime).toLocaleString()}</span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[11px]">
                          <span className="text-emerald-400 font-bold">
                            Browsing Duration: {formatSeconds(sess.durationSeconds)}
                          </span>
                          <span className="text-slate-400 truncate max-w-xs">
                            Sections Viewed: {sess.pageViews.join(', ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: MANAGE PROJECTS (CRUD) */}
            {activeTab === 'projects' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-left">
                
                <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <DraftingCompass className="w-4 h-4 text-emerald-400" />
                      Manage Website Portfolio Projects ({projects.length})
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      Add, edit, or delete AutoCAD 2D, 3D, and 3ds Max projects shown on the live website.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingProject({
                        category: 'autocad-2d',
                        title: '',
                        subtitle: '',
                        description: '',
                        client: 'Client Name',
                        year: '2025',
                        location: 'Dhaka, Bangladesh',
                        mainImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
                        software: ['AutoCAD 2024'],
                        specifications: { "Project Type": "Residential Layout" },
                        tags: ['AutoCAD 2D'],
                        featured: false
                      });
                      setIsProjectModalOpen(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Project</span>
                  </button>
                </div>

                {/* Projects List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all">
                      <div className="relative h-40 overflow-hidden bg-slate-900">
                        <img src={proj.mainImage} alt={proj.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-cyan-300 font-mono text-[10px] font-bold uppercase border border-slate-700">
                          {proj.category}
                        </span>
                        {proj.featured && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px]">
                            FEATURED
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-2 flex-1">
                        <div className="font-bold text-sm text-white line-clamp-1">{proj.title}</div>
                        <div className="text-xs text-slate-400 font-mono line-clamp-2">{proj.description}</div>
                        <div className="text-[11px] text-blue-400 font-mono">Client: {proj.client} ({proj.year})</div>
                      </div>

                      <div className="p-3 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            setEditingProject(proj);
                            setIsProjectModalOpen(true);
                          }}
                          className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-mono rounded-lg flex items-center justify-center gap-1 border border-slate-700 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProject(proj.id, proj.title)}
                          className="py-1.5 px-3 bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-bold rounded-lg border border-rose-800 cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB 4: MANAGE SERVICES (CRUD) */}
            {activeTab === 'services' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-left">
                
                <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-amber-400" />
                      Manage Engineering Services ({services.length})
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      Edit service prices, turnaround times, and deliverables.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingService({
                        title: '',
                        category: 'CAD Services',
                        iconName: 'DraftingCompass',
                        summary: '',
                        deliverables: ['AutoCAD DWG & High-Res PDF'],
                        turnaroundDays: '2 - 4 Days',
                        startingRate: '$150',
                        popular: false
                      });
                      setIsServiceModalOpen(true);
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-600/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Service</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((srv) => (
                    <div key={srv.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-amber-400 font-bold uppercase">{srv.category}</span>
                          <span className="text-xs font-mono font-extrabold text-emerald-400">{srv.startingRate}</span>
                        </div>
                        <h5 className="font-bold text-white text-sm">{srv.title}</h5>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">{srv.summary}</p>
                        <div className="text-[11px] font-mono text-slate-500">
                          Turnaround: <span className="text-slate-300">{srv.turnaroundDays}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-900">
                        <button
                          onClick={() => {
                            setEditingService(srv);
                            setIsServiceModalOpen(true);
                          }}
                          className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded-lg flex items-center justify-center gap-1 border border-slate-700 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Edit Service</span>
                        </button>

                        <button
                          onClick={() => handleDeleteService(srv.id, srv.title)}
                          className="py-1.5 px-3 bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-bold rounded-lg border border-rose-800 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB 5: MANAGE TESTIMONIALS (CRUD) */}
            {activeTab === 'testimonials' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-left">
                
                <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Star className="w-4 h-4 text-purple-400" />
                      Manage Client Reviews & Testimonials ({testimonials.length})
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      Add, update, or remove client feedback displayed on the website.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingTestimonial({
                        clientName: '',
                        role: 'Project Director',
                        company: 'Real Estate Ltd.',
                        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                        rating: 5,
                        quote: '',
                        projectType: 'Residential Building Drawings',
                        date: '2025'
                      });
                      setIsTestimonialModalOpen(true);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-purple-600/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Testimonial</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {testimonials.map((t) => (
                    <div key={t.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <img src={t.avatarUrl} alt={t.clientName} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                          <div>
                            <div className="font-bold text-white text-xs">{t.clientName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{t.role}, {t.company}</div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 italic font-sans leading-relaxed">"{t.quote}"</p>
                        <div className="text-[10px] font-mono text-purple-400">Project: {t.projectType}</div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-900">
                        <button
                          onClick={() => {
                            setEditingTestimonial(t);
                            setIsTestimonialModalOpen(true);
                          }}
                          className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded-lg flex items-center justify-center gap-1 border border-slate-700 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-purple-400" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteTestimonial(t.id, t.clientName)}
                          className="py-1.5 px-3 bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-bold rounded-lg border border-rose-800 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB 6: PROFILE SETTINGS */}
            {activeTab === 'settings' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-left">
                
                <form onSubmit={handleSaveEngineerInfo} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 max-w-2xl">
                  <h4 className="font-bold text-white text-base flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    Engineer Contact & Site Settings
                  </h4>

                  <div className="space-y-3 text-xs font-mono">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold">Engineer Full Name</label>
                      <input
                        type="text"
                        value={engineerInfo.name}
                        onChange={(e) => setEngineerInfo({ ...engineerInfo, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold">Primary Notification Email</label>
                      <input
                        type="email"
                        value={engineerInfo.email}
                        onChange={(e) => setEngineerInfo({ ...engineerInfo, email: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold">Phone / WhatsApp Number</label>
                      <input
                        type="text"
                        value={engineerInfo.phone}
                        onChange={(e) => setEngineerInfo({ ...engineerInfo, phone: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-bold">Bio Summary / Core Expertise</label>
                      <textarea
                        rows={3}
                        value={engineerInfo.shortIntro}
                        onChange={(e) => setEngineerInfo({ ...engineerInfo, shortIntro: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 font-sans"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={handleResetWebsiteDefaults}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg border border-slate-700 cursor-pointer"
                    >
                      Reset All Data Defaults
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-colors cursor-pointer"
                    >
                      Save Profile Settings
                    </button>
                  </div>
                </form>

              </div>
            )}

          </div>
        )}

      </div>

      {/* EDIT PROJECT MODAL */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4">
          <form onSubmit={handleSaveProject} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-xl space-y-4 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingProject.id ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
              </h3>
              <button type="button" onClick={() => setIsProjectModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="e.g. Duplex Villa Floor Plan & 3D Render"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Category *</label>
                <select
                  value={editingProject.category || 'autocad-2d'}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as ProjectCategory })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                >
                  <option value="autocad-2d">AutoCAD 2D Projects</option>
                  <option value="autocad-3d">AutoCAD 3D Projects</option>
                  <option value="3dsmax">3ds Max Visualization</option>
                  <option value="photography">Photography</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  value={editingProject.mainImage || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, mainImage: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Client</label>
                  <input
                    type="text"
                    value={editingProject.client || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Year</label>
                  <input
                    type="text"
                    value={editingProject.year || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsProjectModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-lg"
              >
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT SERVICE MODAL */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4">
          <form onSubmit={handleSaveService} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingService.id ? 'Edit Engineering Service' : 'Add New Service'}
              </h3>
              <button type="button" onClick={() => setIsServiceModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Category</label>
                <input
                  type="text"
                  value={editingService.category || ''}
                  onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Starting Rate</label>
                <input
                  type="text"
                  value={editingService.startingRate || ''}
                  onChange={(e) => setEditingService({ ...editingService, startingRate: e.target.value })}
                  placeholder="$150 or BDT quote"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Summary</label>
                <textarea
                  rows={2}
                  value={editingService.summary || ''}
                  onChange={(e) => setEditingService({ ...editingService, summary: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsServiceModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-600 text-white font-bold text-xs rounded-lg shadow-lg"
              >
                Save Service
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT TESTIMONIAL MODAL */}
      {isTestimonialModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4">
          <form onSubmit={handleSaveTestimonial} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingTestimonial.id ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button type="button" onClick={() => setIsTestimonialModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={editingTestimonial.clientName || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, clientName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Company / Role</label>
                <input
                  type="text"
                  value={editingTestimonial.company || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Review Quote *</label>
                <textarea
                  rows={3}
                  required
                  value={editingTestimonial.quote || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsTestimonialModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-purple-600 text-white font-bold text-xs rounded-lg shadow-lg"
              >
                Save Testimonial
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
