import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  User as UserIcon,
  Mail,
  Phone,
  Building2,
  Briefcase,
  FileText,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  Key,
  Clock,
  Send,
  Sparkles,
  MapPin,
  Bookmark,
  Upload,
  Trash2,
  MessageSquare,
  ExternalLink,
  Calendar,
  PlusCircle,
  Check,
  ChevronRight,
  LogOut,
  FolderCheck,
  Headphones,
  Paperclip,
  Download,
  Eye,
  Layers,
  Search,
  FilePlus,
  RefreshCw,
  HelpCircle,
  Share2
} from 'lucide-react';
import { User, Inquiry, Project } from '../types';
import { authStore, ADMIN_EMAIL } from '../services/authStore';
import { inquiryStore } from '../services/inquiryStore';
import { portfolioStore } from '../services/portfolioStore';
import { compressImageFile } from '../services/imageUtils';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserUpdate: (updatedUser: User) => void;
  onOpenAdmin?: () => void;
  onLogout?: () => void;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
];

const ENGINEERING_SERVICES_LIST = [
  'AutoCAD 2D Drafting & Architectural Floor Plans',
  'AutoCAD 3D Modeling & Sectional Perspective',
  '3ds Max Realistic Visualization & V-Ray Rendering',
  'Structural Steel & Column-Beam Detailing',
  'Civil Working Drawings & Municipal Approval Sets',
  'Site Supervision & Quantity Survey Consultation'
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdate,
  onOpenAdmin,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inquiries' | 'details' | 'saved' | 'security'>('overview');

  // Form states for profile editing
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status message
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Inquiries history
  const [userInquiries, setUserInquiries] = useState<Inquiry[]>([]);
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [clientReplyTexts, setClientReplyTexts] = useState<{ [id: string]: string }>({});

  // Quick New Inquiry Form State
  const [isNewInquiryOpen, setIsNewInquiryOpen] = useState(false);
  const [newInquiryService, setNewInquiryService] = useState(ENGINEERING_SERVICES_LIST[0]);
  const [newInquiryBudget, setNewInquiryBudget] = useState('$500 - $1,500');
  const [newInquiryMessage, setNewInquiryMessage] = useState('');
  const [newInquiryAttachmentName, setNewInquiryAttachmentName] = useState('');

  // File input ref for custom avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inquiryFileInputRef = useRef<HTMLInputElement>(null);

  // Projects store
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setCompany(currentUser.company || '');
      setTitle(currentUser.title || 'Private Client / Property Owner');
      setLocation(currentUser.location || 'Dhaka, Bangladesh');
      setBio(currentUser.bio || '');
      setAvatarUrl(currentUser.avatarUrl || AVATAR_OPTIONS[0]);

      // Load inquiries for this user's email
      loadUserInquiries();

      // Load all projects for saved bookmarks tab
      setAllProjects(portfolioStore.getProjects());
    }
  }, [currentUser, isOpen]);

  const loadUserInquiries = () => {
    if (!currentUser) return;
    const all = inquiryStore.getInquiries();
    const filtered = all.filter(
      (inq) => inq.email.toLowerCase() === currentUser.email.toLowerCase()
    );
    setUserInquiries(filtered);
  };

  if (!isOpen || !currentUser) return null;

  const isAdmin = authStore.isAdmin(currentUser);

  // Calculate Profile Completeness
  const calculateCompleteness = () => {
    let score = 0;
    const checks = [
      Boolean(name.trim()),
      Boolean(currentUser.email),
      Boolean(phone.trim()),
      Boolean(company.trim()),
      Boolean(title.trim()),
      Boolean(location.trim()),
      Boolean(bio.trim()),
      Boolean(avatarUrl)
    ];
    checks.forEach(c => { if (c) score += 12.5; });
    return Math.round(score);
  };

  const completenessScore = calculateCompleteness();

  // Save Profile Details
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const result = authStore.updateProfile(currentUser.id, {
      name: name.trim(),
      phone: phone.trim(),
      company: company.trim(),
      title: title.trim(),
      location: location.trim(),
      bio: bio.trim(),
      avatarUrl,
    });

    if (result.success && result.user) {
      onUserUpdate(result.user);
      setStatusMsg({ type: 'success', text: 'প্রোফাইল তথ্য সফলভাবে সংরক্ষণ করা হয়েছে (Profile details updated successfully!)' });
      setTimeout(() => setStatusMsg(null), 3500);
    } else {
      setStatusMsg({ type: 'error', text: result.error || 'Failed to update profile details.' });
    }
  };

  // Custom Avatar Upload from phone or computer
  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusMsg({ type: 'success', text: 'ফোন থেকে ছবি প্রসেস হচ্ছে... (Optimizing photo...)' });
    try {
      const compressed = await compressImageFile(file, 600, 600, 0.85);
      setAvatarUrl(compressed);
      setStatusMsg({ type: 'success', text: 'ফোন থেকে ছবি লোড হয়েছে! সেভ করতে "Save Profile Changes" চাপুন।' });
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: 'ছবি লোড করতে সমস্যা হয়েছে। অন্য ছবি নির্বাচন করুন।' });
    }
  };

  // Password Change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setStatusMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    const result = authStore.changePassword(currentUser.id, currentPassword, newPassword);
    if (result.success) {
      setStatusMsg({ type: 'success', text: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে (Password changed successfully!)' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setStatusMsg(null), 3500);
    } else {
      setStatusMsg({ type: 'error', text: result.error || 'Current password is incorrect.' });
    }
  };

  // Send follow-up reply to an inquiry
  const handleSendClientReply = (inquiryId: string) => {
    const text = clientReplyTexts[inquiryId]?.trim();
    if (!text) return;

    inquiryStore.addReply(inquiryId, `[Client Follow-up from ${currentUser.name}]: ${text}`);
    setClientReplyTexts(prev => ({ ...prev, [inquiryId]: '' }));
    loadUserInquiries();
    setStatusMsg({ type: 'success', text: 'Follow-up message sent to Chief Engineer MD Arif Mia.' });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // Handle New Inquiry Submission from Inside Profile
  const handleCreateInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInquiryMessage.trim()) return;

    inquiryStore.addInquiry({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone || phone || 'Not provided',
      company: currentUser.company || company || 'Private Individual',
      service: newInquiryService,
      budget: newInquiryBudget,
      message: newInquiryMessage.trim(),
      attachmentName: newInquiryAttachmentName || undefined,
      attachmentType: newInquiryAttachmentName ? 'application/octet-stream' : undefined,
    });

    setNewInquiryMessage('');
    setNewInquiryAttachmentName('');
    setIsNewInquiryOpen(false);
    loadUserInquiries();
    setActiveTab('inquiries');
    setStatusMsg({ type: 'success', text: 'নতুন ড্রয়িং রিকোয়েস্ট সফলভাবে জমা হয়েছে (New inquiry submitted successfully!)' });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // Toggle Save / Bookmark Project
  const handleToggleSaveProject = (projectId: string) => {
    const updated = authStore.toggleSaveProject(currentUser.id, projectId);
    if (updated) {
      onUserUpdate(updated);
    }
  };

  const savedIds = currentUser.savedProjectIds || [];
  const savedProjectsList = allProjects.filter(p => savedIds.includes(p.id));

  // Filtered inquiries
  const filteredInquiries = userInquiries.filter(inq => {
    if (inquiryFilter === 'active') return inq.status === 'new' || inq.status === 'in-progress' || inq.status === 'contacted';
    if (inquiryFilter === 'completed') return inq.status === 'completed';
    return true;
  });

  const activeInquiriesCount = userInquiries.filter(i => i.status === 'new' || i.status === 'in-progress' || i.status === 'contacted').length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col my-auto">
        
        {/* ===================== MODAL HEADER ===================== */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative group shrink-0">
              <img
                src={avatarUrl || AVATAR_OPTIONS[0]}
                alt={currentUser.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-blue-500/60 shadow-lg shadow-blue-500/20"
              />
              <button
                type="button"
                onClick={() => {
                  setActiveTab('details');
                  if (fileInputRef.current) fileInputRef.current.click();
                }}
                title="Change profile photo"
                className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md cursor-pointer border border-slate-900 transition-transform group-hover:scale-110"
              >
                <Upload className="w-3 h-3" />
              </button>
            </div>

            <div className="text-left space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg text-white tracking-tight">{currentUser.name}</h2>
                {isAdmin ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    CHIEF ADMIN
                  </span>
                ) : (
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 font-mono font-bold px-2 py-0.5 rounded-full border border-blue-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    VERIFIED CLIENT
                  </span>
                )}
                <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded-full border border-slate-700">
                  ID: {currentUser.id}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans flex items-center gap-2">
                <span>{currentUser.title || 'Client'}</span>
                {currentUser.company && (
                  <>
                    <span className="text-slate-600">•</span>
                    <span className="text-blue-400">{currentUser.company}</span>
                  </>
                )}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono pt-0.5">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-500" />
                  {currentUser.email}
                </span>
                {currentUser.phone && (
                  <span className="flex items-center gap-1 text-slate-300">
                    <Phone className="w-3 h-3 text-emerald-400" />
                    {currentUser.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => {
                setActiveTab('inquiries');
                setIsNewInquiryOpen(true);
              }}
              className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer border border-blue-400/30 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Request</span>
            </button>

            {onLogout && (
              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 border border-slate-700 transition-colors cursor-pointer"
                title="Log Out of Account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Close Portal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ===================== NAVIGATION TABS ===================== */}
        <div className="flex border-b border-slate-800 bg-slate-950/90 overflow-x-auto shrink-0 scrollbar-thin">
          <button
            onClick={() => { setActiveTab('overview'); setStatusMsg(null); }}
            className={`px-4 sm:px-6 py-3 text-xs font-mono font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-400 bg-slate-900/90'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => { setActiveTab('inquiries'); setStatusMsg(null); }}
            className={`px-4 sm:px-6 py-3 text-xs font-mono font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'inquiries'
                ? 'border-blue-500 text-blue-400 bg-slate-900/90'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>My Inquiries & Orders</span>
            {userInquiries.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500/20 text-blue-300 font-mono">
                {userInquiries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('details'); setStatusMsg(null); }}
            className={`px-4 sm:px-6 py-3 text-xs font-mono font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-400 bg-slate-900/90'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserIcon className="w-4 h-4 text-teal-400" />
            <span>Edit Profile Info</span>
          </button>

          <button
            onClick={() => { setActiveTab('saved'); setStatusMsg(null); }}
            className={`px-4 sm:px-6 py-3 text-xs font-mono font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'saved'
                ? 'border-blue-500 text-blue-400 bg-slate-900/90'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-4 h-4 text-purple-400" />
            <span>Saved CAD Designs</span>
            {savedIds.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-purple-500/20 text-purple-300 font-mono">
                {savedIds.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('security'); setStatusMsg(null); }}
            className={`px-4 sm:px-6 py-3 text-xs font-mono font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-400 bg-slate-900/90'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4 text-rose-400" />
            <span>Security & Password</span>
          </button>
        </div>

        {/* ===================== MODAL CONTENT BODY ===================== */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-left flex-1 bg-slate-900/60">

          {/* Alert Notification Toast */}
          {statusMsg && (
            <div
              className={`p-4 rounded-xl text-xs font-mono flex items-start gap-3 border shadow-lg ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-950/90 border-emerald-700 text-emerald-200'
                  : 'bg-rose-950/90 border-rose-700 text-rose-200'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              )}
              <div className="flex-1 font-sans">{statusMsg.text}</div>
              <button onClick={() => setStatusMsg(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ADMIN LAUNCHER (Shown strictly if admin) */}
          {isAdmin && onOpenAdmin && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 border border-emerald-500/50 shadow-xl space-y-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">System Administrator Active</h4>
                    <p className="text-xs text-slate-300">You are signed in as verified engineer MD Arif Mia.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdmin();
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg cursor-pointer"
                >
                  Open Chief Admin Panel &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 1: OVERVIEW DASHBOARD                                */}
          {/* ======================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-950 to-indigo-950/60 border border-blue-500/30 relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[11px] font-bold border border-blue-500/40">
                      CLIENT PORTAL ACTIVE
                    </span>
                    <span className="text-slate-400 text-xs font-mono">
                      Joined {new Date(currentUser.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    স্বাগতম, {currentUser.name}! (Welcome to your Client Dashboard)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-sans leading-relaxed">
                    Here you can review your custom AutoCAD 2D plans, 3ds Max photorealistic renders, project communications with Engineer MD Arif Mia, and download delivered drawings.
                  </p>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">Total Inquiries</span>
                    <FileText className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-xl font-bold font-mono text-white">{userInquiries.length}</div>
                  <div className="text-[10px] text-slate-500">Submitted quote requests</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">Active Consultations</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl font-bold font-mono text-amber-400">{activeInquiriesCount}</div>
                  <div className="text-[10px] text-slate-500">Under review or drafting</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">Saved CAD Designs</span>
                    <Bookmark className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xl font-bold font-mono text-purple-400">{savedIds.length}</div>
                  <div className="text-[10px] text-slate-500">Bookmarked reference plans</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">Profile Level</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold font-mono text-emerald-400">{completenessScore}%</div>
                  <div className="text-[10px] text-slate-500">Profile completeness</div>
                </div>
              </div>

              {/* Profile Completeness Bar */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                    Profile Completeness: {completenessScore}%
                  </span>
                  <span className="text-slate-400">
                    {completenessScore < 100 ? 'Add company & contact info to reach 100%' : 'All profile fields completed!'}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${completenessScore}%` }}
                  />
                </div>
              </div>

              {/* Assigned Chief CAD Engineer Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold font-mono">
                      AM
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">MD Arif Mia</h4>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                          ASSIGNED CHIEF ENGINEER
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">Civil Engineering Designer & CAD Specialist (Uttara University)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href="https://wa.me/8801568647919"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp Direct</span>
                    </a>
                    <a
                      href="tel:01568647919"
                      className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      <span>Call Now</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>01568647919</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 truncate">
                    <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="truncate">arif.mia02@uttarauniversity.edu.bd</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>Uttara, Dhaka, Bangladesh</span>
                  </div>
                </div>
              </div>

              {/* Recent Inquiries Preview in Overview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>Recent Project Inquiries & Communications</span>
                  </h4>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="text-xs text-blue-400 hover:text-blue-300 font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all ({userInquiries.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {userInquiries.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <Clock className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">You haven't submitted any architectural or CAD quote requests yet.</p>
                    <button
                      onClick={() => {
                        setActiveTab('inquiries');
                        setIsNewInquiryOpen(true);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono font-bold cursor-pointer inline-flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Submit Your First CAD Request</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userInquiries.slice(0, 3).map(inq => (
                      <div
                        key={inq.id}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-left hover:border-slate-700 transition-colors"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-blue-400">{inq.id}</span>
                            <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded">
                              {new Date(inq.createdAt).toLocaleDateString()}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                              inq.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                              inq.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                              'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {inq.status}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-white truncate">{inq.service}</p>
                          <p className="text-xs text-slate-400 truncate max-w-md">{inq.message}</p>
                        </div>

                        <button
                          onClick={() => setActiveTab('inquiries')}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg shrink-0 cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: MY INQUIRIES & ORDERS                             */}
          {/* ======================================================== */}
          {activeTab === 'inquiries' && (
            <div className="space-y-5">
              {/* Top Controls: Filter + Create Request */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                  <button
                    onClick={() => setInquiryFilter('all')}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                      inquiryFilter === 'all' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({userInquiries.length})
                  </button>
                  <button
                    onClick={() => setInquiryFilter('active')}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                      inquiryFilter === 'active' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Active ({activeInquiriesCount})
                  </button>
                  <button
                    onClick={() => setInquiryFilter('completed')}
                    className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
                      inquiryFilter === 'completed' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Completed ({userInquiries.filter(i => i.status === 'completed').length})
                  </button>
                </div>

                <button
                  onClick={() => setIsNewInquiryOpen(!isNewInquiryOpen)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isNewInquiryOpen ? 'Cancel Request Form' : '+ New CAD Drawing Request'}</span>
                </button>
              </div>

              {/* Quick Inline New Request Form */}
              {isNewInquiryOpen && (
                <form
                  onSubmit={handleCreateInquiry}
                  className="p-5 rounded-2xl bg-slate-950 border border-blue-500/40 shadow-xl space-y-4 animate-in fade-in duration-200"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h4 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-2">
                      <FilePlus className="w-4 h-4 text-blue-400" />
                      <span>Submit New Drawing or 3D Rendering Inquiry</span>
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">Dispatched directly to MD Arif Mia</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-mono text-slate-300 block mb-1">Select Engineering Service *</label>
                      <select
                        value={newInquiryService}
                        onChange={(e) => setNewInquiryService(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        {ENGINEERING_SERVICES_LIST.map((svc, i) => (
                          <option key={i} value={svc}>{svc}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-300 block mb-1">Target Budget Range</label>
                      <select
                        value={newInquiryBudget}
                        onChange={(e) => setNewInquiryBudget(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="$100 - $500">$100 - $500 (Basic 2D Plan / Section)</option>
                        <option value="$500 - $1,500">$500 - $1,500 (Complete Working Drawings)</option>
                        <option value="$1,500 - $3,000">$1,500 - $3,000 (3ds Max Photorealistic 8K)</option>
                        <option value="$3,000+">$3,000+ (Full Structural & Architectural Set)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 block mb-1">Project Details, Plot Dimensions & Requirements *</label>
                    <textarea
                      rows={3}
                      required
                      value={newInquiryMessage}
                      onChange={(e) => setNewInquiryMessage(e.target.value)}
                      placeholder="e.g. 5-story residential building in Mirpur-12, total area 3,200 sq.ft. Need AutoCAD column layout, foundation design, and rebar schedule..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (inquiryFileInputRef.current) inquiryFileInputRef.current.click();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer border border-slate-700"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-blue-400" />
                        <span>{newInquiryAttachmentName ? newInquiryAttachmentName : 'Attach Blueprint / Sketch'}</span>
                      </button>
                      <input
                        type="file"
                        ref={inquiryFileInputRef}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setNewInquiryAttachmentName(file.name);
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => setIsNewInquiryOpen(false)}
                        className="px-4 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-mono cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/30 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send to Engineer Arif</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Inquiry List */}
              {filteredInquiries.length === 0 ? (
                <div className="p-10 text-center bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <FileText className="w-10 h-10 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-white">No inquiries found in this category</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Click "New CAD Drawing Request" above to order architectural drafting or 3D visualization.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
                    >
                      {/* Inquiry Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-900">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-bold text-blue-400">{inq.id}</span>
                          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase border ${
                            inq.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : inq.status === 'in-progress'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}>
                            {inq.status === 'completed' ? 'Delivered & Complete' : inq.status === 'in-progress' ? 'Drafting Underway' : 'Reviewing by Arif'}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            Budget: <span className="text-white font-bold">{inq.budget}</span>
                          </span>
                        </div>

                        <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {new Date(inq.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {/* Service & Message */}
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-blue-400" />
                          {inq.service}
                        </h4>
                        <p className="text-xs text-slate-300 font-sans leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                          {inq.message}
                        </p>
                      </div>

                      {/* Attachment indicator if any */}
                      {inq.attachmentName && (
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-blue-950/30 border border-blue-900/50 p-2.5 rounded-xl">
                          <Paperclip className="w-4 h-4 text-blue-400 shrink-0" />
                          <span className="truncate">Attached Drawing: <strong>{inq.attachmentName}</strong></span>
                        </div>
                      )}

                      {/* Official Replies from Engineer MD Arif Mia */}
                      {inq.replies && inq.replies.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-900">
                          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                            Communication Thread ({inq.replies.length})
                          </span>
                          {inq.replies.map((rep, idx) => (
                            <div
                              key={rep.id || idx}
                              className="p-3 rounded-xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/20 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className="font-bold text-emerald-400 flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                  MD Arif Mia (Chief Engineer)
                                </span>
                                <span className="text-slate-500">{new Date(rep.date).toLocaleDateString()}</span>
                              </div>
                              <p className="text-slate-200 font-sans">{rep.text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Client Follow-up Input */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={clientReplyTexts[inq.id] || ''}
                          onChange={(e) => setClientReplyTexts({ ...clientReplyTexts, [inq.id]: e.target.value })}
                          placeholder="Send a question or note regarding this inquiry to Arif..."
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-sans"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendClientReply(inq.id)}
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: EDIT PERSONAL & BUSINESS INFO                     */}
          {/* ======================================================== */}
          {activeTab === 'details' && (
            <form onSubmit={handleProfileSave} className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                    <span>Choose Profile Avatar / Upload Your Photo</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      if (fileInputRef.current) fileInputRef.current.click();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Custom Photo</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFileUpload}
                  />
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {AVATAR_OPTIONS.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(img)}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                        avatarUrl === img
                          ? 'border-blue-500 scale-105 shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/40'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Avatar option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Client Full Name *</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-sans"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Email Address (Registered Account)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={currentUser.email}
                      disabled
                      className="w-full bg-slate-950/60 border border-slate-800 text-slate-400 rounded-xl pl-9 pr-3 py-2.5 text-xs cursor-not-allowed font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Phone / WhatsApp Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1700-000000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Company / Organization / Firm</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Apex Builders, Private Landowner, etc."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Job Title / Designation</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Managing Director, Architect, Homeowner"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">City / Location / Address</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Uttara, Dhaka, Bangladesh"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-sans"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Personal Bio / Engineering Project Scope</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Describe your property details, architectural preferences, or ongoing projects..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 font-mono"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 4: SAVED CAD DESIGNS & BOOKMARKS                     */}
          {/* ======================================================== */}
          {activeTab === 'saved' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Bookmarked CAD Drawings & 3D Renders</h4>
                  <p className="text-xs text-slate-400">Reference drawings and 3D architectural elevations you saved from MD Arif Mia's portfolio.</p>
                </div>
                <span className="text-xs font-mono text-purple-400 font-bold">{savedProjectsList.length} saved</span>
              </div>

              {savedProjectsList.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
                  <h5 className="text-sm font-bold text-white">No drawings saved yet</h5>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    You can bookmark AutoCAD 2D plans or 3ds Max renders below to reference them during your consultation with Engineer Arif.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedProjectsList.map((project) => (
                    <div
                      key={project.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="relative h-36 rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
                          <img
                            src={project.mainImage}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 text-[10px] bg-slate-950/80 text-blue-300 font-mono font-bold px-2 py-0.5 rounded border border-blue-500/30">
                            {project.categoryLabel}
                          </span>
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white truncate">{project.title}</h5>
                          <p className="text-[11px] text-slate-400 truncate">{project.subtitle}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                        <span className="text-[10px] text-slate-500 font-mono">{project.software.join(', ')}</span>
                        <button
                          onClick={() => handleToggleSaveProject(project.id)}
                          className="px-2.5 py-1 text-xs font-mono text-rose-400 hover:bg-rose-950/50 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Browse & Pin More Drawings */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h5 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Browse & Pin Featured Drawings to Your Profile
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {allProjects.slice(0, 3).map((p) => {
                    const isSaved = savedIds.includes(p.id);
                    return (
                      <div key={p.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="h-24 rounded-lg overflow-hidden bg-slate-900">
                          <img src={p.mainImage} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-xs font-bold text-white truncate">{p.title}</p>
                        <button
                          onClick={() => handleToggleSaveProject(p.id)}
                          className={`w-full py-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                            isSaved
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>{isSaved ? 'Saved to Profile' : 'Save to Profile'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: SECURITY & PASSWORD                               */}
          {/* ======================================================== */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-xl mx-auto">
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Current Password *</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">New Password (Min 6 characters) *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Create secure new password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Confirm New Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 font-mono"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Update Account Password</span>
                </button>
              </form>

              {/* Account Security Metadata Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Client Credentials & Session Details</h5>
                <div className="space-y-1 text-slate-400">
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span>Account ID:</span>
                    <span className="text-white font-bold">{currentUser.id}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span>Portal Role:</span>
                    <span className="text-blue-400 uppercase font-bold">{currentUser.role}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span>Account Created:</span>
                    <span className="text-slate-300">{new Date(currentUser.createdAt || Date.now()).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Encryption Protocol:</span>
                    <span className="text-emerald-400">Client-Protected Storage</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ===================== MODAL FOOTER ===================== */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Client Portal Active: {currentUser.name} ({currentUser.email})</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500">Chief Engineer: MD Arif Mia (01568647919)</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg cursor-pointer transition-colors font-bold"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
