import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, Mail, Phone, Building2, Briefcase, FileText, Lock, ShieldCheck, CheckCircle2, AlertCircle, Save, Key, Clock, Send, Award, Image, Sparkles } from 'lucide-react';
import { User, Inquiry } from '../types';
import { authStore, ADMIN_EMAIL } from '../services/authStore';
import { inquiryStore } from '../services/inquiryStore';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserUpdate: (updatedUser: User) => void;
  onOpenAdmin?: () => void;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdate,
  onOpenAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'security' | 'inquiries'>('details');

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Alerts
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Inquiries history
  const [userInquiries, setUserInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setCompany(currentUser.company || '');
      setTitle(currentUser.title || '');
      setBio(currentUser.bio || '');
      setAvatarUrl(currentUser.avatarUrl || AVATAR_OPTIONS[0]);

      // Load inquiries submitted by this user email
      const allInquiries = inquiryStore.getInquiries();
      const userInqs = allInquiries.filter(
        (inq) => inq.email.toLowerCase() === currentUser.email.toLowerCase()
      );
      setUserInquiries(userInqs);
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const isAdmin = authStore.isAdmin(currentUser);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const result = authStore.updateProfile(currentUser.id, {
      name,
      phone,
      company,
      title,
      bio,
      avatarUrl,
    });

    if (result.success && result.user) {
      onUserUpdate(result.user);
      setStatusMsg({ type: 'success', text: 'Profile details updated successfully!' });
      setTimeout(() => setStatusMsg(null), 3000);
    } else {
      setStatusMsg({ type: 'error', text: result.error || 'Failed to update profile details.' });
    }
  };

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
      setStatusMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setStatusMsg(null), 3000);
    } else {
      setStatusMsg({ type: 'error', text: result.error || 'Failed to change password.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <img
              src={avatarUrl || AVATAR_OPTIONS[0]}
              alt={currentUser.name}
              className="w-11 h-11 rounded-xl object-cover border-2 border-blue-500/50 shadow-md"
            />
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">{currentUser.name}</h3>
                {isAdmin ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    ADMIN
                  </span>
                ) : (
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 font-mono font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                    CLIENT PORTAL
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 shrink-0">
          <button
            onClick={() => {
              setActiveTab('details');
              setStatusMsg(null);
            }}
            className={`flex-1 py-3 text-xs font-mono font-bold flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('security');
              setStatusMsg(null);
            }}
            className={`flex-1 py-3 text-xs font-mono font-bold flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security & Password</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('inquiries');
              setStatusMsg(null);
            }}
            className={`flex-1 py-3 text-xs font-mono font-bold flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'inquiries'
                ? 'border-blue-500 text-blue-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Inquiries ({userInquiries.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-left flex-1">

          {/* ADMIN HERO LAUNCHER CARD — ONLY SHOWN IF LOGGED IN AS ADMIN */}
          {isAdmin && onOpenAdmin && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 border border-emerald-500/50 shadow-xl shadow-emerald-950/60 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                    <ShieldCheck className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">অ্যাডমিন অ্যাক্সেস সচল রয়েছে</h4>
                      <span className="text-[10px] bg-emerald-500/30 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-400/40">ADMIN ACTIVE</span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono">MD Arif Mia - Engineering Inquiries & Client Management</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdmin();
                  }}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer border border-emerald-400/40 shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>অ্যাডমিন প্যানেলে প্রবেশ করুন (Open Admin Panel)</span>
                </button>
              </div>
            </div>
          )}
          {statusMsg && (
            <div
              className={`p-3.5 rounded-xl text-xs font-mono flex items-start gap-2 border ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/80 border-rose-800 text-rose-300'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {activeTab === 'details' && (
            <form onSubmit={handleProfileSave} className="space-y-4">
              {/* Avatar Selection */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300 flex items-center gap-1">
                  <Image className="w-3.5 h-3.5 text-blue-400" /> Choose Profile Avatar
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {AVATAR_OPTIONS.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(img)}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                        avatarUrl === img
                          ? 'border-blue-500 scale-105 shadow-lg shadow-blue-500/20'
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
                  <label className="text-xs font-mono text-slate-300">Full Name *</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Email Address (Read-only)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={currentUser.email}
                      disabled
                      className="w-full bg-slate-950/50 border border-slate-800/60 text-slate-400 rounded-xl pl-9 pr-3 py-2.5 text-xs cursor-not-allowed"
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
                      placeholder="e.g. +880 1700-000000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Company / Organization</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Uttara Builders & Developers"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
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
                    placeholder="e.g. Chief Structural Engineer or Private Landowner"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Bio / Project Notes</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  placeholder="Write a brief note or project requirements summary..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md mx-auto">
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Current Password *</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">New Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Update Security Password</span>
              </button>
            </form>
          )}

          {activeTab === 'inquiries' && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Submitted Project Blueprint Inquiries</span>
                <span className="text-blue-400 font-bold">{userInquiries.length} total</span>
              </h4>

              {userInquiries.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <Clock className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">No quote inquiries submitted with this email yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {userInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-blue-400">{inq.id}</span>
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white">{inq.service}</div>
                      <p className="text-xs text-slate-400 line-clamp-2">{inq.message}</p>
                      {inq.attachmentName && (
                        <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1 pt-1 border-t border-slate-900">
                          <Send className="w-3 h-3 text-emerald-400" />
                          <span>Attached file: {inq.attachmentName}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Admin Launcher Link (STRICTLY shown only if isAdmin) */}
          {isAdmin && onOpenAdmin && (
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                <span className="text-emerald-400 font-bold font-mono">Verified Admin Account</span> ({ADMIN_EMAIL})
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="py-2 px-4 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 font-mono text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Open Admin Panel</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
