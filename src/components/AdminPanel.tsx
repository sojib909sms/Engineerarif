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
  RotateCcw,
  ShieldAlert,
  AlertTriangle,
  EyeOff,
  Sliders,
  Cpu,
  Monitor,
  BarChart2,
  TrendingUp,
  Image as ImageIcon,
  Upload,
  Camera,
  Share2,
  SlidersHorizontal,
  CheckSquare,
  FileCode2
} from 'lucide-react';
import { Inquiry, InquiryStatus, Project, EngineeringService, Testimonial, EngineerInfo, ProjectCategory, ProjectStat, SkillCategory, SoftwareTool } from '../types';
import { inquiryStore } from '../services/inquiryStore';
import { authStore, ADMIN_EMAIL, ADMIN_PASSWORD, AUTHORIZED_ADMIN_EMAILS } from '../services/authStore';
import { portfolioStore } from '../services/portfolioStore';
import { analyticsStore, AnalyticsSummary } from '../services/analyticsStore';
import { IconHelper } from './IconHelper';
import { compressImageFile } from '../services/imageUtils';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<EngineeringService[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [engineerInfo, setEngineerInfo] = useState<EngineerInfo>(portfolioStore.getEngineerInfo());
  const [skillsCategories, setSkillsCategories] = useState<SkillCategory[]>(portfolioStore.getSkillsCategories());
  const [softwareTools, setSoftwareTools] = useState<SoftwareTool[]>(portfolioStore.getSoftwareTools());
  const [projectStats, setProjectStats] = useState<ProjectStat[]>(portfolioStore.getProjectStats());
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(analyticsStore.getSummary());

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const [activeTab, setActiveTab] = useState<'inquiries' | 'settings' | 'projects' | 'skills' | 'software' | 'stats' | 'services' | 'testimonials' | 'analytics'>('inquiries');
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

  // Modals for Skills, Software, Stats
  const [editingSkill, setEditingSkill] = useState<{ categoryId: string; skillIndex: number; skill: { name: string; level: number; experienceYears: number; description: string; icon: string; } } | null>(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

  const [editingSoftware, setEditingSoftware] = useState<Partial<SoftwareTool> | null>(null);
  const [isSoftwareModalOpen, setIsSoftwareModalOpen] = useState(false);

  const [editingStat, setEditingStat] = useState<Partial<ProjectStat> | null>(null);
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);

  // File Input Refs for Phone/Computer Uploads
  const projectFileInputRef = React.useRef<HTMLInputElement>(null);
  const testimonialFileInputRef = React.useRef<HTMLInputElement>(null);

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
    setSkillsCategories(portfolioStore.getSkillsCategories());
    setSoftwareTools(portfolioStore.getSoftwareTools());
    setProjectStats(portfolioStore.getProjectStats());
    setAnalytics(analyticsStore.getSummary());
  };

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanEmail = adminEmail.trim().toLowerCase();
    const isAuthorized = AUTHORIZED_ADMIN_EMAILS.some(e => e.toLowerCase() === cleanEmail);
    if (!isAuthorized) {
      setLoginError('প্রবেশাধিকার নেই: এই জিমেইলটি অ্যাডমিন প্যানেলের জন্য অনুমোদিত নয়। শুধুমাত্র নির্ধারিত অ্যাডমিন জিমেইল দিয়েই লগইন করতে পারবেন।');
      return;
    }

    if (adminPassword !== ADMIN_PASSWORD) {
      setLoginError('ভুল পাসওয়ার্ড। অনুগ্রহ করে সঠিক অ্যাডমিন মাস্টার পাসওয়ার্ড দিন।');
      return;
    }

    const res = authStore.login(cleanEmail, adminPassword);
    if (res.success && res.user && res.user.role === 'admin') {
      setIsAuthenticated(true);
      setLoginError('');
      loadData();
      showToast('অ্যাডমিন কন্ট্রোল সেন্টারে স্বাগতম! সফলভাবে লগইন হয়েছে।');
    } else {
      setLoginError(res.error || 'Authentication failed.');
    }
  };

  const handleExportInquiriesCSV = () => {
    if (inquiries.length === 0) {
      showToast('No inquiries available to export.');
      return;
    }
    const headers = ['ID', 'Date', 'Status', 'Client Name', 'Email', 'Phone', 'Company', 'Service', 'Budget', 'Message'];
    const rows = inquiries.map(i => [
      i.id,
      new Date(i.createdAt).toISOString(),
      i.status,
      `"${(i.name || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.phone || '').replace(/"/g, '""')}"`,
      `"${(i.company || '').replace(/"/g, '""')}"`,
      `"${(i.service || '').replace(/"/g, '""')}"`,
      `"${(i.budget || '').replace(/"/g, '""')}"`,
      `"${(i.message || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Arif_Mia_CAD_Inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Inquiries CSV backup downloaded successfully!');
  };

  const handleExportFullBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      engineerInfo: portfolioStore.getEngineerInfo(),
      projects: portfolioStore.getProjects(),
      services: portfolioStore.getServices(),
      testimonials: portfolioStore.getTestimonials(),
      inquiries: inquiryStore.getInquiries(),
      analytics: analyticsStore.getSummary()
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Civil_Engineering_DB_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Full Database JSON Backup exported successfully!');
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
    showToast('Saved! Engineer profile, photos, and contact information updated immediately on live website.');
  };

  // --- SKILL CRUD ---
  const handleOpenEditSkill = (categoryId: string, skillIndex: number) => {
    const cat = skillsCategories.find(c => c.id === categoryId);
    if (!cat) return;
    const skl = cat.skills[skillIndex];
    if (!skl) return;
    setEditingSkill({ categoryId, skillIndex, skill: { ...skl } });
    setIsSkillModalOpen(true);
  };

  const handleOpenAddSkill = (categoryId: string) => {
    setEditingSkill({
      categoryId,
      skillIndex: -1,
      skill: {
        name: '',
        level: 90,
        experienceYears: 3,
        description: '',
        icon: 'DraftingCompass'
      }
    });
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.skill.name) return;

    const updatedCategories = skillsCategories.map(cat => {
      if (cat.id === editingSkill.categoryId) {
        const newSkills = [...cat.skills];
        if (editingSkill.skillIndex >= 0) {
          newSkills[editingSkill.skillIndex] = editingSkill.skill;
        } else {
          newSkills.push(editingSkill.skill);
        }
        return { ...cat, skills: newSkills };
      }
      return cat;
    });

    portfolioStore.updateSkillsCategories(updatedCategories);
    setSkillsCategories(portfolioStore.getSkillsCategories());
    setIsSkillModalOpen(false);
    setEditingSkill(null);
    showToast(`Technical skill "${editingSkill.skill.name}" updated on website!`);
  };

  const handleDeleteSkill = (categoryId: string, skillIndex: number) => {
    const cat = skillsCategories.find(c => c.id === categoryId);
    if (!cat) return;
    const skl = cat.skills[skillIndex];
    if (window.confirm(`Delete skill "${skl.name}"?`)) {
      const updatedCategories = skillsCategories.map(c => {
        if (c.id === categoryId) {
          return { ...c, skills: c.skills.filter((_, idx) => idx !== skillIndex) };
        }
        return c;
      });
      portfolioStore.updateSkillsCategories(updatedCategories);
      setSkillsCategories(portfolioStore.getSkillsCategories());
      showToast(`Skill "${skl.name}" removed from website.`);
    }
  };

  // --- SOFTWARE TOOLS CRUD ---
  const handleSaveSoftware = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSoftware?.name) return;

    let updatedTools = [...softwareTools];
    if (editingSoftware.id) {
      updatedTools = updatedTools.map(t => t.id === editingSoftware.id ? (editingSoftware as SoftwareTool) : t);
      showToast(`Software tool "${editingSoftware.name}" updated!`);
    } else {
      const newTool: SoftwareTool = {
        id: `tool-${Date.now()}`,
        name: editingSoftware.name || 'New CAD Tool',
        category: editingSoftware.category || 'Drafting & Modeling',
        version: editingSoftware.version || '2024',
        proficiency: editingSoftware.proficiency || 95,
        description: editingSoftware.description || '',
        iconName: editingSoftware.iconName || 'Box',
        keyWorkflows: editingSoftware.keyWorkflows || ['2D Drafting', 'Layouts'],
        primaryUse: editingSoftware.primaryUse || 'Daily Production',
        badgeColor: editingSoftware.badgeColor || 'blue'
      };
      updatedTools = [newTool, ...updatedTools];
      showToast(`Software tool "${newTool.name}" added to website!`);
    }

    portfolioStore.updateSoftwareTools(updatedTools);
    setSoftwareTools(portfolioStore.getSoftwareTools());
    setIsSoftwareModalOpen(false);
    setEditingSoftware(null);
  };

  const handleDeleteSoftware = (id: string, name: string) => {
    if (window.confirm(`Delete software tool "${name}" from showcase?`)) {
      const updated = softwareTools.filter(t => t.id !== id);
      portfolioStore.updateSoftwareTools(updated);
      setSoftwareTools(portfolioStore.getSoftwareTools());
      showToast(`Software tool "${name}" removed.`);
    }
  };

  // --- STATS CRUD ---
  const handleSaveStat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStat?.id) return;
    portfolioStore.updateSingleStat(editingStat.id, editingStat);
    setProjectStats(portfolioStore.getProjectStats());
    setIsStatModalOpen(false);
    setEditingStat(null);
    showToast(`Engineering metric "${editingStat.label}" updated on website!`);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'profileImage' | 'heroBgImage') => {
    const file = e.target.files?.[0];
    if (file) {
      showToast('ছবি প্রসেস হচ্ছে... (Optimizing image...)');
      try {
        const maxDim = fieldName === 'heroBgImage' ? 1920 : 1000;
        const compressed = await compressImageFile(file, maxDim, 1200, 0.85);
        setEngineerInfo(prev => ({
          ...prev,
          [fieldName]: compressed
        }));
        showToast('ছবি সফলভাবে লোড হয়েছে! "Save Profile & Photos" চাপলে লাইভ ওয়েবসাইটে সেভ হবে।');
      } catch (err) {
        console.error('Error compressing image:', err);
        showToast('ছবি আপলোড করতে সমস্যা হয়েছে।');
      }
    }
  };

  const handleProjectImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast('ফোন থেকে ছবি প্রসেস হচ্ছে... (Optimizing photo from phone...)');
      try {
        const compressed = await compressImageFile(file, 1600, 1200, 0.84);
        setEditingProject(prev => prev ? { ...prev, mainImage: compressed } : null);
        showToast('ফোন থেকে প্রজেক্টের ছবি সফলভাবে লোড হয়েছে! (Image ready)');
      } catch (err) {
        console.error('Error compressing project photo:', err);
        showToast('ছবি প্রসেসিংয়ে সমস্যা হয়েছে।');
      }
    }
  };

  const handleTestimonialAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast('ক্লায়েন্ট ছবি প্রসেস হচ্ছে...');
      try {
        const compressed = await compressImageFile(file, 500, 500, 0.85);
        setEditingTestimonial(prev => prev ? { ...prev, avatarUrl: compressed } : null);
        showToast('ছবি লোড হয়েছে!');
      } catch (err) {
        console.error('Error compressing avatar:', err);
      }
    }
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-600/30 ring-1 ring-cyan-400/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>MD Arif Mia — Advanced Admin Command Center</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE CAD PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                <span>Active Admin:</span>
                <strong className="text-cyan-300">
                  {authStore.getCurrentUser()?.email || 'Authorized Administrator'}
                </strong>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">Civil Engineering & 3D Drafting</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <>
                <button
                  onClick={handleExportFullBackup}
                  className="hidden md:flex p-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                  title="Export Complete Database Backup (.JSON)"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Backup DB</span>
                </button>

                <button
                  onClick={loadData}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                  title="Refresh All Records"
                >
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                </button>

                <button
                  onClick={handleLogoutAdmin}
                  className="p-2 px-3 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Lock Dashboard & Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Lock Portal</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close"
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

        {/* Login / Access Denial Screen */}
        {!isAuthenticated ? (
          authStore.getCurrentUser() && !authStore.isAdmin(authStore.getCurrentUser()) ? (
            /* CLIENT ACCOUNT LOGGED IN - STRICTLY DENIED */
            <div className="p-8 sm:p-12 text-center space-y-6 max-w-lg mx-auto my-auto">
              <div className="w-20 h-20 rounded-2xl bg-rose-950/80 text-rose-400 flex items-center justify-center mx-auto border border-rose-800 shadow-xl shadow-rose-950/50">
                <ShieldAlert className="w-10 h-10 animate-pulse text-rose-400" />
              </div>

              <div className="space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
                  🚫 অ্যাক্সেস ডিনাইড • ACCESS RESTRICTED
                </div>
                <h3 className="text-2xl font-extrabold text-white">ক্লায়েন্ট অ্যাকাউন্ট শনাক্ত হয়েছে</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  আপনি বর্তমানে <strong className="text-cyan-300 font-mono">{authStore.getCurrentUser()?.email}</strong> একাউন্ট দিয়ে লগইন আছেন।
                </p>
                <p className="text-xs text-rose-300 leading-relaxed font-sans bg-rose-950/40 p-3 rounded-xl border border-rose-900/60">
                  এই অ্যাডমিন প্যানেলটি শুধুমাত্র নির্বাচিত অ্যাডমিন জিমেইলের জন্য সংরক্ষিত। কোনো সাধারণ ক্লায়েন্ট জিমেইল দিয়ে এই প্যানেলে প্রবেশাধিকার নেই।
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 text-left space-y-2">
                <div className="text-slate-300 font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> সিকিউরিটি নিয়মাবলী:
                </div>
                <p className="text-[11px] leading-relaxed">
                  অ্যাডমিন প্যানেলে ঢুকতে হলে বর্তমান ক্লায়েন্ট অ্যাকাউন্ট থেকে লগআউট করে নির্ধারিত অ্যাডমিন জিমেইল দিয়ে লগইন করতে হবে।
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    authStore.logout();
                    setIsAuthenticated(false);
                    setAdminEmail('');
                    setAdminPassword('');
                    showToast('লগআউট সম্পন্ন হয়েছে। অ্যাডমিন একাউন্ট দিয়ে লগইন করুন।');
                  }}
                  className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>লগআউট করে অ্যাকাউন্ট পরিবর্তন করুন</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  প্যানেল বন্ধ করুন
                </button>
              </div>
            </div>
          ) : (
            /* UNLOGGED IN / ADMIN LOGIN SCREEN */
            <div className="p-8 sm:p-12 text-center space-y-6 max-w-md mx-auto my-auto">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/30 shadow-lg ring-1 ring-blue-500/30">
                <Lock className="w-8 h-8 text-cyan-400" />
              </div>

              <div className="space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                  AUTHORIZED ADMIN ACCESS ONLY
                </div>
                <h3 className="text-2xl font-extrabold text-white">অ্যাডমিন কন্ট্রোল সেন্টার</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  শুধুমাত্র অনুমোদিত অ্যাডমিন জিমেইল ও মাস্টার পাসওয়ার্ড প্রদান করে প্রবেশ করুন।
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
                  <label className="text-xs font-mono font-bold text-slate-300">ADMIN GMAIL / EMAIL</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => { setAdminEmail(e.target.value); setLoginError(''); }}
                      placeholder="youradmin@gmail.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-slate-300">ADMIN MASTER PASSWORD</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => { setAdminPassword(e.target.value); setLoginError(''); }}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                      required
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 font-mono uppercase tracking-wider"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>লগইন করুন (Access Admin Center)</span>
                </button>
              </form>
            </div>
          )
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Navigation Tabs Header */}
            <div className="bg-slate-950/90 border-b border-slate-800 px-3 sm:px-4 pt-2.5 flex items-center justify-between overflow-x-auto shrink-0 scrollbar-none gap-2">
              <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-0.5">
                
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`px-3 py-2 rounded-t-xl text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                    activeTab === 'inquiries'
                      ? 'bg-slate-900 text-blue-400 border-t-2 border-blue-500 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                  <span>Inquiries ({inquiries.length})</span>
                  {newInquiriesCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {newInquiriesCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-3 py-2 rounded-t-xl text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                    activeTab === 'settings'
                      ? 'bg-slate-900 text-cyan-300 border-t-2 border-cyan-400 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Profile & Photos</span>
                </button>

                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-3 py-2 rounded-t-xl text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                    activeTab === 'projects'
                      ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-500 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <DraftingCompass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Projects ({projects.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('skills')}
                  className={`px-3 py-2 rounded-t-xl text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                    activeTab === 'skills'
                      ? 'bg-slate-900 text-indigo-400 border-t-2 border-indigo-500 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Skills Detailing</span>
                </button>

                <button
                  onClick={() => setActiveTab('software')}
                  className={`px-3 py-2 rounded-t-xl text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                    activeTab === 'software'
                      ? 'bg-slate-900 text-sky-400 border-t-2 border-sky-500 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5 text-sky-400" />
                  <span>Software Stack ({softwareTools.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('stats')}
                  className={`px-3 py-2 rounded-t-xl text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                    activeTab === 'stats'
                      ? 'bg-slate-900 text-teal-400 border-t-2 border-teal-500 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
                  <span>Practice Stats</span>
                </button>

                <button
                  onClick={() => setActiveTab('services')}
                  className={`px-3 py-2 rounded-t-xl text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                    activeTab === 'services'
                      ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-500 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                  <span>Services ({services.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('testimonials')}
                  className={`px-3 py-2 rounded-t-xl text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                    activeTab === 'testimonials'
                      ? 'bg-slate-900 text-purple-400 border-t-2 border-purple-500 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 text-purple-400" />
                  <span>Testimonials ({testimonials.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-2 rounded-t-xl text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                    activeTab === 'analytics'
                      ? 'bg-slate-900 text-cyan-400 border-t-2 border-cyan-500 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Traffic & Telemetry</span>
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

                {/* Filter, Search & Export Strip */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search client, email, service..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      onClick={handleExportInquiriesCSV}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-mono font-bold rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
                      title="Download All Inquiries as CSV"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">Export CSV</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto">
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
                  <div className="lg:col-span-7 bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-6 text-left shadow-xl">
                    {selectedInquiry ? (
                      <div className="space-y-6">
                        
                        {/* Header with Title, Status & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                          <div>
                            <div className="flex items-center flex-wrap gap-2">
                              <span className="text-xl font-bold text-white tracking-tight">{selectedInquiry.name}</span>
                              <span className="text-xs font-mono text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-800 font-bold">
                                {selectedInquiry.id}
                              </span>
                              {selectedInquiry.company && (
                                <span className="text-xs text-slate-400 font-medium">
                                  ({selectedInquiry.company})
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              <span>Submitted: {new Date(selectedInquiry.createdAt).toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <select
                              value={selectedInquiry.status}
                              onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value as InquiryStatus)}
                              className="bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
                            >
                              <option value="new">🔴 NEW / UNREAD</option>
                              <option value="contacted">🔵 CONTACTED</option>
                              <option value="in-progress">🟡 IN PROGRESS</option>
                              <option value="completed">🟢 COMPLETED</option>
                              <option value="archived">⚪ ARCHIVED</option>
                            </select>

                            <button
                              onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                              className="p-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 transition-colors cursor-pointer"
                              title="Delete Inquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Quick Contact Action Strip */}
                        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                            Direct Client Communication:
                          </span>
                          <div className="flex items-center flex-wrap gap-2">
                            {selectedInquiry.phone && (
                              <a
                                href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম ${selectedInquiry.name}! ইঞ্জিনিয়ার মো: আরিফ মিয়া বলছি। আপনার Inquiry (${selectedInquiry.id}) পেয়েছি। আপনার প্রজেক্টের ড্রয়িং/কাজের বিষয়ে আলোচনা করতে চাচ্ছি।`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition-all shadow-md shadow-emerald-600/20"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                <span>WhatsApp Chat</span>
                              </a>
                            )}
                            <a
                              href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(`Engineer MD Arif Mia - Response to Inquiry ${selectedInquiry.id} (${selectedInquiry.service})`)}&body=${encodeURIComponent(`Dear ${selectedInquiry.name},\n\nThank you for reaching out regarding your project: "${selectedInquiry.service}".\n\nI have reviewed your details and attachments. Let me know a convenient time to discuss your drawing package or site inspection.\n\nBest regards,\nMD Arif Mia\nCivil Engineering Designer & Site Engineer\nPhone/WhatsApp: 01568647919\nEmail: arif.mia02@uttarauniversity.edu.bd`)}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono transition-all shadow-md shadow-blue-600/20"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Email Client</span>
                            </a>
                            {selectedInquiry.phone && (
                              <a
                                href={`tel:${selectedInquiry.phone}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition-all"
                              >
                                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Call: {selectedInquiry.phone}</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Project Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                            <span className="text-slate-400">Email Address:</span>
                            <div className="font-bold text-white">
                              <a href={`mailto:${selectedInquiry.email}`} className="text-blue-400 hover:underline">
                                {selectedInquiry.email}
                              </a>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                            <span className="text-slate-400">Phone / WhatsApp:</span>
                            <div className="font-bold text-white">
                              {selectedInquiry.phone || 'N/A'}
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                            <span className="text-slate-400">Service Requested:</span>
                            <div className="font-bold text-white">{selectedInquiry.service}</div>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                            <span className="text-slate-400">Budget Range:</span>
                            <div className="font-bold text-emerald-400">{selectedInquiry.budget}</div>
                          </div>
                        </div>

                        {/* Project Scope Message */}
                        <div className="space-y-1.5">
                          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                            Project Scope & Detailed Message:
                          </span>
                          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                            {selectedInquiry.message}
                          </div>
                        </div>

                        {/* Attached File & Blueprint Details Section */}
                        {selectedInquiry.attachmentName ? (
                          <div className="space-y-2 pt-1 border-t border-slate-800">
                            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Paperclip className="w-3.5 h-3.5 text-blue-400" />
                                Client Attached File / Blueprint
                              </span>
                              {selectedInquiry.attachmentSize && (
                                <span className="text-emerald-400 font-normal">Size: {selectedInquiry.attachmentSize}</span>
                              )}
                            </span>

                            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center space-x-3 min-w-0">
                                  <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-mono text-white font-bold text-sm truncate max-w-[240px] sm:max-w-xs">
                                      {selectedInquiry.attachmentName}
                                    </div>
                                    <div className="text-[11px] font-mono text-slate-400">
                                      {selectedInquiry.attachmentType || 'Engineering Drawing File'}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {selectedInquiry.attachmentDataUrl ? (
                                    <a
                                      href={selectedInquiry.attachmentDataUrl}
                                      download={selectedInquiry.attachmentName}
                                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/30 cursor-pointer"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                      <span>Download File</span>
                                    </a>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        // Demo mock blueprint generator for pre-seeded sample records
                                        const content = `%DWG-ENGINEERING-BLUEPRINT-ATTACHMENT\nInquiry Ref: ${selectedInquiry.id}\nClient: ${selectedInquiry.name}\nProject Service: ${selectedInquiry.service}\nAttachment Name: ${selectedInquiry.attachmentName}\nClient Message: ${selectedInquiry.message}\nReceived: ${selectedInquiry.createdAt}\nDesignation: Structural & CAD Plan submittal for Engineer MD Arif Mia.`;
                                        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                                        const url = URL.createObjectURL(blob);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.download = selectedInquiry.attachmentName || 'blueprint.txt';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                      }}
                                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/30 cursor-pointer"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                      <span>Download Attachment</span>
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Image Preview if it is an image upload */}
                              {selectedInquiry.attachmentDataUrl && (selectedInquiry.attachmentType?.startsWith('image/') || selectedInquiry.attachmentDataUrl.startsWith('data:image/')) && (
                                <div className="mt-3 pt-3 border-t border-slate-800">
                                  <div className="text-[11px] font-mono text-slate-400 mb-2">Image Preview:</div>
                                  <div className="max-h-64 overflow-hidden rounded-lg border border-slate-800 bg-black/40 flex items-center justify-center p-2">
                                    <img
                                      src={selectedInquiry.attachmentDataUrl}
                                      alt="Attachment preview"
                                      className="max-h-60 object-contain rounded"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-mono text-slate-400 flex items-center gap-2">
                            <Paperclip className="w-4 h-4 text-slate-500" />
                            <span>No file attachment was included in this submission.</span>
                          </div>
                        )}

                        {/* Internal Admin Notes */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-800">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                              Internal Engineering Notes (Private):
                            </span>
                            <button
                              onClick={() => handleSaveAdminNotes(selectedInquiry.id)}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-mono font-bold rounded-lg cursor-pointer transition-colors shadow"
                            >
                              Save Notes
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            value={adminNoteInput}
                            onChange={(e) => setAdminNoteInput(e.target.value)}
                            placeholder="Add private engineering notes, site inspection dates, drawing progress, or fee agreements..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none font-mono"
                          ></textarea>
                        </div>

                        {/* Send Direct Response Panel */}
                        <div className="space-y-2.5 pt-2 border-t border-slate-800">
                          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                            Dispatch Direct Response:
                          </span>
                          
                          {selectedInquiry.replies && selectedInquiry.replies.length > 0 && (
                            <div className="space-y-2 max-h-36 overflow-y-auto mb-2 pr-1">
                              {selectedInquiry.replies.map((rep) => (
                                <div key={rep.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                                  <div className="text-[10px] text-blue-400 flex items-center justify-between">
                                    <span>Sent to {rep.sentTo}</span>
                                    <span>{new Date(rep.date).toLocaleString()}</span>
                                  </div>
                                  <div className="text-slate-200">{rep.text}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Quick Quotation & CAD Response Presets */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                              Quick CAD Response Presets:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                'CAD Requirement Received - Preparing Detailed Quotation',
                                'Please provide plot dimension survey DWG / Sketch',
                                'Site inspection scheduled for structural boundary check',
                                'AutoCAD 2D & 3ds Max 3D Renderings Completed'
                              ].map((preset) => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => setReplyText(preset)}
                                  className="text-[10px] font-mono px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors cursor-pointer"
                                >
                                  + {preset}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Type response to ${selectedInquiry.email}...`}
                              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddReply(selectedInquiry.id);
                                }
                              }}
                            />
                            <button
                              onClick={() => handleAddReply(selectedInquiry.id)}
                              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-md shadow-blue-600/30"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Dispatch</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="py-24 text-center space-y-3 text-slate-400">
                        <Eye className="w-12 h-12 text-slate-600 mx-auto" />
                        <div className="text-sm font-bold text-slate-300">Select an inquiry to view full project specifications and attached CAD files.</div>
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

            {/* TAB: PROFILE, PHOTOS & HERO SETTINGS */}
            {activeTab === 'settings' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-left">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Camera className="w-5 h-5 text-cyan-400" />
                      <span>Engineer Profile, Visual Photos & Hero Settings</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Change engineer name, photos, hero background, contact phone/email and social accounts. Everything connects and updates the live site instantly!
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-md flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Auto-Sync Active
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSaveEngineerInfo} className="space-y-6">
                  
                  {/* Photo & Imagery Card */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
                      <ImageIcon className="w-4 h-4 text-cyan-400" />
                      <span>Profile & Hero Imagery (Direct Photo Editing)</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Profile Avatar */}
                      <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                        <label className="text-slate-200 font-bold text-xs flex items-center justify-between">
                          <span>Primary Profile Photo (Avatar)</span>
                          <span className="text-[10px] text-slate-400 font-mono">Hero & About</span>
                        </label>
                        
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-cyan-500/40 bg-slate-950 shrink-0 shadow-lg">
                            <img
                              src={engineerInfo.profileImage}
                              alt="Profile Preview"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1 space-y-2 text-xs font-mono">
                            <input
                              type="text"
                              value={engineerInfo.profileImage}
                              onChange={(e) => setEngineerInfo({ ...engineerInfo, profileImage: e.target.value })}
                              placeholder="Image URL..."
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500 text-xs"
                            />
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg cursor-pointer text-xs font-bold transition-colors">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload New Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageFileUpload(e, 'profileImage')}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Hero Background Banner */}
                      <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                        <label className="text-slate-200 font-bold text-xs flex items-center justify-between">
                          <span>Hero Banner / Blueprint Grid Background</span>
                          <span className="text-[10px] text-slate-400 font-mono">Hero Section</span>
                        </label>
                        
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-blue-500/40 bg-slate-950 shrink-0 shadow-lg">
                            <img
                              src={engineerInfo.heroBgImage}
                              alt="Hero Background Preview"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1 space-y-2 text-xs font-mono">
                            <input
                              type="text"
                              value={engineerInfo.heroBgImage}
                              onChange={(e) => setEngineerInfo({ ...engineerInfo, heroBgImage: e.target.value })}
                              placeholder="Hero banner image URL..."
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 text-xs"
                            />
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-lg cursor-pointer text-xs font-bold transition-colors">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload Banner Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageFileUpload(e, 'heroBgImage')}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Core Personal & Engineering Identity */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
                      <UserIcon className="w-4 h-4 text-blue-400" />
                      <span>Engineer Identity & Professional Titles</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold">Engineer Full Name *</label>
                        <input
                          type="text"
                          required
                          value={engineerInfo.name}
                          onChange={(e) => setEngineerInfo({ ...engineerInfo, name: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold">Professional Title Headline</label>
                        <input
                          type="text"
                          value={engineerInfo.title}
                          onChange={(e) => setEngineerInfo({ ...engineerInfo, title: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-slate-300 font-bold flex items-center justify-between">
                          <span>Specialization Roles (Comma-separated for animated hero ticker)</span>
                          <span className="text-[10px] text-cyan-400">Animated Ticker</span>
                        </label>
                        <input
                          type="text"
                          value={(engineerInfo.roles || []).join(', ')}
                          onChange={(e) => setEngineerInfo({
                            ...engineerInfo,
                            roles: e.target.value.split(',').map(r => r.trim()).filter(Boolean)
                          })}
                          placeholder="AutoCAD 2D Drafter, 3D Modeler, 3ds Max Visualizer..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold">Office / Site Location</label>
                        <input
                          type="text"
                          value={engineerInfo.location}
                          onChange={(e) => setEngineerInfo({ ...engineerInfo, location: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold">Years of Practical Experience</label>
                        <input
                          type="number"
                          value={engineerInfo.yearsExperience}
                          onChange={(e) => setEngineerInfo({ ...engineerInfo, yearsExperience: parseInt(e.target.value) || 0 })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Info & Social Links */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
                      <Share2 className="w-4 h-4 text-emerald-400" />
                      <span>Contact Channels & Social Media Profiles</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold">Primary Email</label>
                        <input
                          type="email"
                          value={engineerInfo.email}
                          onChange={(e) => setEngineerInfo({ ...engineerInfo, email: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold">Phone Number</label>
                        <input
                          type="text"
                          value={engineerInfo.phone}
                          onChange={(e) => setEngineerInfo({ ...engineerInfo, phone: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold">WhatsApp Direct Link/Number</label>
                        <input
                          type="text"
                          value={engineerInfo.whatsapp}
                          onChange={(e) => setEngineerInfo({ ...engineerInfo, whatsapp: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold">Facebook Profile URL</label>
                        <input
                          type="text"
                          value={engineerInfo.facebook}
                          onChange={(e) => setEngineerInfo({ ...engineerInfo, facebook: e.target.value })}
                          placeholder="https://facebook.com/..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold">LinkedIn Profile URL</label>
                        <input
                          type="text"
                          value={engineerInfo.linkedin}
                          onChange={(e) => setEngineerInfo({ ...engineerInfo, linkedin: e.target.value })}
                          placeholder="https://linkedin.com/in/..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold">GitHub Profile URL</label>
                        <input
                          type="text"
                          value={engineerInfo.github || ''}
                          onChange={(e) => setEngineerInfo({ ...engineerInfo, github: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Intro & Full Bio */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-2">
                      <FileText className="w-4 h-4 text-purple-400" />
                      <span>Biographical Descriptions (Hero & About Section)</span>
                    </h4>

                    <div className="space-y-3 text-xs font-mono">
                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold">Short Introduction (Hero Headline)</label>
                        <textarea
                          rows={2}
                          value={engineerInfo.shortIntro}
                          onChange={(e) => setEngineerInfo({ ...engineerInfo, shortIntro: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-300 font-bold">Complete Engineering Biography (About Section)</label>
                        <textarea
                          rows={4}
                          value={engineerInfo.bioSummary}
                          onChange={(e) => setEngineerInfo({ ...engineerInfo, bioSummary: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500 font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleResetWebsiteDefaults}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl border border-slate-700 cursor-pointer transition-colors"
                    >
                      Reset All Data to System Defaults
                    </button>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Profile & Photos Instantly</span>
                    </button>
                  </div>
                </form>

              </div>
            )}

            {/* TAB: TECHNICAL SKILLS & DETAILING */}
            {activeTab === 'skills' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
                      <span>Technical CAD & Civil Detailing Skills</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Adjust proficiency bars (0-100%), experience years, and descriptions shown in the "Technical Skills" section.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {skillsCategories.map((cat) => (
                    <div key={cat.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <IconHelper name={cat.iconName} className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm">{cat.title}</h4>
                            <span className="text-[10px] text-slate-400 font-mono">{cat.skills.length} Registered Skills</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleOpenAddSkill(cat.id)}
                          className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Skill</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {cat.skills.map((skl, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center space-x-2.5">
                                <div className="p-1.5 rounded-md bg-slate-950 border border-slate-800 text-indigo-400">
                                  <IconHelper name={skl.icon} className="w-4 h-4" />
                                </div>
                                <div>
                                  <h5 className="font-bold text-white text-xs">{skl.name}</h5>
                                  <span className="text-[10px] font-mono text-slate-400">{skl.experienceYears}+ Yrs Practical</span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-1">
                                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60 mr-1">
                                  {skl.level}%
                                </span>
                                <button
                                  onClick={() => handleOpenEditSkill(cat.id, idx)}
                                  className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md cursor-pointer"
                                  title="Edit Skill"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSkill(cat.id, idx)}
                                  className="p-1.5 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 rounded-md cursor-pointer"
                                  title="Delete Skill"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                              <div
                                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all"
                                style={{ width: `${skl.level}%` }}
                              ></div>
                            </div>

                            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
                              {skl.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SOFTWARE STACK & MODELING TOOLS */}
            {activeTab === 'software' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-sky-400" />
                      <span>Software Suite & CAD Tool Stack</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Manage AutoCAD, 3ds Max, V-Ray, Revit, and other design packages displayed on the live site.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingSoftware({
                        name: '',
                        category: '2D & 3D Drafting',
                        version: '2025',
                        proficiency: 95,
                        description: '',
                        iconName: 'Box',
                        keyWorkflows: ['Working Drawings', 'Plan Detailing'],
                        primaryUse: 'Production Drafting',
                        badgeColor: 'blue'
                      });
                      setIsSoftwareModalOpen(true);
                    }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg shadow-sky-600/30 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add CAD Tool</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {softwareTools.map((tool) => (
                    <div
                      key={tool.id}
                      className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors space-y-3 relative group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                            <IconHelper name={tool.iconName} className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-white text-sm">{tool.name}</h4>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                {tool.version}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">{tool.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              setEditingSoftware({ ...tool });
                              setIsSoftwareModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-md cursor-pointer"
                            title="Edit Tool"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSoftware(tool.id, tool.name)}
                            className="p-1.5 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 rounded-md cursor-pointer"
                            title="Delete Tool"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Proficiency */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-400">Mastery Level</span>
                          <span className="text-sky-400 font-bold">{tool.proficiency}%</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-sky-500 h-full rounded-full"
                            style={{ width: `${tool.proficiency}%` }}
                          ></div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2">{tool.description}</p>

                      <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-900">
                        {(tool.keyWorkflows || []).map((wf, wfi) => (
                          <span key={wfi} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                            {wf}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PRACTICE METRICS & STATS */}
            {activeTab === 'stats' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-left">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-teal-400" />
                    <span>Engineering Practice Metrics & Accomplishment Numbers</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click any card to modify the numeric count, label, or subtext displayed in the Statistics strip.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {projectStats.map((stat) => (
                    <div
                      key={stat.id}
                      onClick={() => {
                        setEditingStat({ ...stat });
                        setIsStatModalOpen(true);
                      }}
                      className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-teal-500/50 transition-all cursor-pointer space-y-3 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:scale-110 transition-transform">
                          <IconHelper name={stat.iconName} className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/60 flex items-center gap-1">
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </span>
                      </div>

                      <div>
                        <div className="text-3xl font-extrabold text-white font-mono flex items-baseline">
                          <span>{stat.value}</span>
                          <span className="text-teal-400 text-2xl">{stat.suffix}</span>
                        </div>
                        <h4 className="font-bold text-slate-200 text-sm mt-1">{stat.label}</h4>
                        <p className="text-xs text-slate-400 mt-1 font-sans">{stat.subtext}</p>
                      </div>
                    </div>
                  ))}
                </div>
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

              <div className="space-y-2 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-slate-200 font-bold text-xs flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-cyan-400" />
                    <span>প্রজেক্টের ছবি (Project Image / Drawing) *</span>
                  </label>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800 font-bold">
                    ফোন বা কম্পিউটার
                  </span>
                </div>

                {/* Primary Button to Upload directly from Mobile Gallery or Camera */}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => projectFileInputRef.current?.click()}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer border border-cyan-400/40 transition-all active:scale-98"
                  >
                    <Upload className="w-4 h-4 text-white" />
                    <span>নিজের ফোন থেকে ছবি আপলোড দিন (Upload from Phone Gallery / Camera)</span>
                  </button>
                  <input
                    type="file"
                    ref={projectFileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleProjectImageFileUpload}
                  />
                </div>

                {/* Image Live Preview */}
                {editingProject.mainImage && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 group mt-2">
                    <img
                      src={editingProject.mainImage}
                      alt="Project Preview"
                      className="w-full h-44 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => projectFileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>অন্য ছবি সিলেক্ট করুন (Change Photo)</span>
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-slate-950/90 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1.5 shadow-md">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>ছবি লোড হয়েছে — Save Project বাটনে চাপুন</span>
                    </div>
                  </div>
                )}

                {/* Optional Image URL Input */}
                <div className="pt-2 border-t border-slate-900">
                  <div className="text-[11px] text-slate-400 font-mono mb-1">
                    অথবা অনলাইন ছবির লিঙ্ক পেস্ট করুন (Or paste Image URL):
                  </div>
                  <input
                    type="text"
                    required
                    value={editingProject.mainImage || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, mainImage: e.target.value })}
                    placeholder="https://... বা উপরের বাটনে ক্লিক করে ফোন থেকে ছবি দিন"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
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
                <label className="text-slate-300 font-bold block mb-1">Client Avatar / Photo</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                    <img
                      src={editingTestimonial.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => testimonialFileInputRef.current?.click()}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-mono font-bold rounded-xl border border-purple-500/30 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>ফোন থেকে ছবি আপলোড দিন</span>
                  </button>
                  <input
                    type="file"
                    ref={testimonialFileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleTestimonialAvatarUpload}
                  />
                </div>
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

      {/* EDIT SKILL MODAL */}
      {isSkillModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4">
          <form onSubmit={handleSaveSkill} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
                <span>{editingSkill.skillIndex >= 0 ? 'Edit Technical Skill' : 'Add Technical Skill'}</span>
              </h3>
              <button type="button" onClick={() => setIsSkillModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={editingSkill.skill.name || ''}
                  onChange={(e) => setEditingSkill({
                    ...editingSkill,
                    skill: { ...editingSkill.skill, name: e.target.value }
                  })}
                  placeholder="e.g. AutoCAD 2D Working Drawings"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Proficiency ({editingSkill.skill.level}%)</label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={editingSkill.skill.level || 90}
                    onChange={(e) => setEditingSkill({
                      ...editingSkill,
                      skill: { ...editingSkill.skill, level: parseInt(e.target.value) || 90 }
                    })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={editingSkill.skill.experienceYears || 3}
                    onChange={(e) => setEditingSkill({
                      ...editingSkill,
                      skill: { ...editingSkill.skill, experienceYears: parseInt(e.target.value) || 1 }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Icon Name (Lucide)</label>
                <input
                  type="text"
                  value={editingSkill.skill.icon || 'DraftingCompass'}
                  onChange={(e) => setEditingSkill({
                    ...editingSkill,
                    skill: { ...editingSkill.skill, icon: e.target.value }
                  })}
                  placeholder="DraftingCompass, Layers, Box, Cpu, FileText..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description & Scope</label>
                <textarea
                  rows={3}
                  value={editingSkill.skill.description || ''}
                  onChange={(e) => setEditingSkill({
                    ...editingSkill,
                    skill: { ...editingSkill.skill, description: e.target.value }
                  })}
                  placeholder="Describe standard drafting codes, layers, and practical expertise..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsSkillModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Save Skill to Website
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT SOFTWARE TOOL MODAL */}
      {isSoftwareModalOpen && editingSoftware && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4">
          <form onSubmit={handleSaveSoftware} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Monitor className="w-5 h-5 text-sky-400" />
                <span>{editingSoftware.id ? 'Edit CAD Software Tool' : 'Add CAD Software Tool'}</span>
              </h3>
              <button type="button" onClick={() => setIsSoftwareModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Software Name *</label>
                  <input
                    type="text"
                    required
                    value={editingSoftware.name || ''}
                    onChange={(e) => setEditingSoftware({ ...editingSoftware, name: e.target.value })}
                    placeholder="e.g. AutoCAD 2025"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Version / Release</label>
                  <input
                    type="text"
                    value={editingSoftware.version || ''}
                    onChange={(e) => setEditingSoftware({ ...editingSoftware, version: e.target.value })}
                    placeholder="2024 / 2025"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Category</label>
                  <input
                    type="text"
                    value={editingSoftware.category || ''}
                    onChange={(e) => setEditingSoftware({ ...editingSoftware, category: e.target.value })}
                    placeholder="2D & 3D Drafting / Rendering"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Proficiency ({editingSoftware.proficiency}%)</label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={editingSoftware.proficiency || 95}
                    onChange={(e) => setEditingSoftware({ ...editingSoftware, proficiency: parseInt(e.target.value) || 90 })}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Key Workflows (Comma separated)</label>
                <input
                  type="text"
                  value={(editingSoftware.keyWorkflows || []).join(', ')}
                  onChange={(e) => setEditingSoftware({
                    ...editingSoftware,
                    keyWorkflows: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="Architectural Plans, Structural Detailing, Section Views..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingSoftware.description || ''}
                  onChange={(e) => setEditingSoftware({ ...editingSoftware, description: e.target.value })}
                  placeholder="Primary tool for municipal approval sets and detailing..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsSoftwareModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-sky-600/30 cursor-pointer"
              >
                Save Tool
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT PRACTICE STAT MODAL */}
      {isStatModalOpen && editingStat && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4">
          <form onSubmit={handleSaveStat} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-400" />
                <span>Edit Practice Stat Number</span>
              </h3>
              <button type="button" onClick={() => setIsStatModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Numeric Value *</label>
                  <input
                    type="number"
                    required
                    value={editingStat.value ?? 0}
                    onChange={(e) => setEditingStat({ ...editingStat, value: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono text-base font-bold focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Suffix (e.g. +, %)</label>
                  <input
                    type="text"
                    value={editingStat.suffix || ''}
                    onChange={(e) => setEditingStat({ ...editingStat, suffix: e.target.value })}
                    placeholder="+, %, etc."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono text-base font-bold focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Stat Label Title *</label>
                <input
                  type="text"
                  required
                  value={editingStat.label || ''}
                  onChange={(e) => setEditingStat({ ...editingStat, label: e.target.value })}
                  placeholder="e.g. Detailed Drawings Completed"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Subtext Description</label>
                <input
                  type="text"
                  value={editingStat.subtext || ''}
                  onChange={(e) => setEditingStat({ ...editingStat, subtext: e.target.value })}
                  placeholder="e.g. Civil, Structural & Architectural plans"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsStatModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-teal-600/30 cursor-pointer"
              >
                Update Metric on Website
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
