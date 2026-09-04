export type ProjectCategory = 'all' | 'autocad-2d' | 'autocad-3d' | '3dsmax' | 'photography';

export interface CADLayer {
  name: string;
  color: string;
  visible: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  subtitle: string;
  description: string;
  client: string;
  year: string;
  location: string;
  mainImage: string;
  galleryImages?: string[];
  clayRenderImage?: string; // For 3ds Max clay/wireframe comparison
  software: string[];
  specifications: { [key: string]: string };
  layers?: CADLayer[];
  cadDetails?: {
    scale: string;
    paperSize: string;
    codeCompliance: string;
    totalAreaSqFt: number;
    drawingNumber: string;
  };
  structuralCalcSummary?: {
    concreteGrade: string;
    steelGrade: string;
    maxDeflection: string;
    factorOfSafety: string;
    loadType: string;
  };
  tags: string[];
  featured?: boolean;
}

export interface EngineerInfo {
  name: string;
  title: string;
  roles: string[];
  shortIntro: string;
  bioSummary: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  peLicense?: string;
  social: {
    whatsapp: string;
    facebook: string;
    linkedin: string;
    twitter: string;
    instagram: string;
    github?: string;
    fiverr?: string;
  };
  linkedin: string;
  facebook: string;
  twitter: string;
  instagram: string;
  github?: string;
  fiverr?: string;
  yearsExperience: number;
  projectsCompleted: number;
  happyClients: number;
  designAccuracy: string;
  clientSatisfaction: string;
  profileImage: string;
  heroBgImage: string;
  education: {
    degree: string;
    institution: string;
    year: string;
    honors: string;
  }[];
  certifications: string[];
  designSoftware: string[];
}

export interface SkillCategory {
  id: string;
  title: string;
  iconName: string;
  skills: {
    name: string;
    level: number; // 0 - 100
    experienceYears: number;
    description: string;
    icon: string;
  }[];
}

export interface SoftwareTool {
  id: string;
  name: string;
  category: string;
  version: string;
  proficiency: number;
  description: string;
  iconName: string;
  keyWorkflows: string[];
  primaryUse: string;
  badgeColor: string;
}

export interface EngineeringService {
  id: string;
  title: string;
  category: string;
  iconName: string;
  summary: string;
  deliverables: string[];
  turnaroundDays: string;
  startingRate: string;
  popular?: boolean;
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  company: string;
  avatarUrl: string;
  rating: number;
  quote: string;
  projectType: string;
  date: string;
}

export interface CareerMilestone {
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  achievements: string[];
}

export interface ProjectStat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  iconName: string;
  subtext: string;
}

export type InquiryStatus = 'new' | 'contacted' | 'in-progress' | 'completed' | 'archived';

export type UserRole = 'admin' | 'user' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: string;
  phone?: string;
  avatarUrl?: string;
  company?: string;
  title?: string;
  bio?: string;
  location?: string;
  address?: string;
  savedProjectIds?: string[];
  lastLogin?: string;
  website?: string;
}

export interface InquiryReply {
  id: string;
  date: string;
  text: string;
  sentTo: string;
}

export interface Inquiry {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  attachmentName?: string;
  attachmentType?: string;
  attachmentSize?: string;
  attachmentDataUrl?: string; // For base64 preview & download if uploaded
  status: InquiryStatus;
  adminNotes?: string;
  emailSentTo: string;
  emailSentStatus: 'Delivered' | 'Pending';
  replies?: InquiryReply[];
}

export interface OfficialCVExperience {
  period: string;
  role: string;
  company: string;
  location?: string;
  responsibilities: string[];
}

export interface OfficialCVEducation {
  passingYear: string;
  degree: string;
  institute: string;
  board: string;
  group?: string;
  resultLabel: string;
  result: string;
}

export interface OfficialCVLanguage {
  language: string;
  writing: string;
  reading: string;
  speaking: string;
}

export interface OfficialCVData {
  name: string;
  title: string;
  mobile: string;
  email: string;
  address: string;
  photoUrl?: string;
  careerObjective: string;
  confidence: string;
  jobExperience: OfficialCVExperience[];
  industrialAttachment: {
    period: string;
    title: string;
    institute: string;
    location: string;
    responsibilities: string[];
  };
  education: OfficialCVEducation[];
  skills: {
    professional: string;
    operatingSystems: string;
    applications: string;
    internet: string;
  };
  languages: OfficialCVLanguage[];
  personalInfo: {
    name: string;
    fatherName: string;
    motherName: string;
    dateOfBirth: string;
    placeOfBirth: string;
    sex: string;
    religion: string;
    maritalStatus: string;
    nationality: string;
    bloodGroup: string;
    height: string;
  };
  permanentAddress: {
    careOf: string;
    village: string;
    postOffice: string;
    policeStation: string;
    district: string;
  };
  declaration: string;
}

