import { Project, EngineeringService, Testimonial, EngineerInfo, ProjectStat, SkillCategory, SoftwareTool } from '../types';
import { PROJECTS_DATA, SERVICES_DATA, TESTIMONIALS_DATA, ENGINEER_INFO, PROJECT_STATS, SKILLS_CATEGORIES, SOFTWARE_TOOLS } from '../data/portfolioData';

const PORTFOLIO_STORAGE_KEY = 'md_arif_mia_portfolio_data_v2';

interface PortfolioStorageState {
  projects: Project[];
  services: EngineeringService[];
  testimonials: Testimonial[];
  engineerInfo: EngineerInfo;
  projectStats: ProjectStat[];
  skillsCategories: SkillCategory[];
  softwareTools: SoftwareTool[];
}

const getInitialData = (): PortfolioStorageState => {
  try {
    const saved = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        projects: parsed.projects && parsed.projects.length > 0 ? parsed.projects : PROJECTS_DATA,
        services: parsed.services && parsed.services.length > 0 ? parsed.services : SERVICES_DATA,
        testimonials: parsed.testimonials && parsed.testimonials.length > 0 ? parsed.testimonials : TESTIMONIALS_DATA,
        engineerInfo: parsed.engineerInfo || ENGINEER_INFO,
        projectStats: parsed.projectStats && parsed.projectStats.length > 0 ? parsed.projectStats : PROJECT_STATS,
        skillsCategories: parsed.skillsCategories && parsed.skillsCategories.length > 0 ? parsed.skillsCategories : SKILLS_CATEGORIES,
        softwareTools: parsed.softwareTools && parsed.softwareTools.length > 0 ? parsed.softwareTools : SOFTWARE_TOOLS
      };
    }
  } catch (err) {
    console.error('Error loading portfolio storage:', err);
  }
  return {
    projects: PROJECTS_DATA,
    services: SERVICES_DATA,
    testimonials: TESTIMONIALS_DATA,
    engineerInfo: ENGINEER_INFO,
    projectStats: PROJECT_STATS,
    skillsCategories: SKILLS_CATEGORIES,
    softwareTools: SOFTWARE_TOOLS
  };
};

class PortfolioStore {
  private data: PortfolioStorageState;
  private listeners: (() => void)[] = [];

  constructor() {
    this.data = getInitialData();
  }

  private save() {
    try {
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(this.data));
      this.notify();
    } catch (err) {
      console.error('Error saving portfolio storage:', err);
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => {
      try {
        l();
      } catch (e) {
        console.error('Listener notification error:', e);
      }
    });
  }

  // --- PROJECTS ---
  public getProjects(): Project[] {
    return this.data.projects;
  }

  public addProject(project: Project) {
    this.data.projects = [project, ...this.data.projects];
    this.save();
  }

  public updateProject(updatedProject: Project) {
    this.data.projects = this.data.projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    this.save();
  }

  public deleteProject(id: string) {
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    this.save();
  }

  // --- SERVICES ---
  public getServices(): EngineeringService[] {
    return this.data.services;
  }

  public addService(service: EngineeringService) {
    this.data.services = [service, ...this.data.services];
    this.save();
  }

  public updateService(updatedService: EngineeringService) {
    this.data.services = this.data.services.map(s => s.id === updatedService.id ? updatedService : s);
    this.save();
  }

  public deleteService(id: string) {
    this.data.services = this.data.services.filter(s => s.id !== id);
    this.save();
  }

  // --- TESTIMONIALS ---
  public getTestimonials(): Testimonial[] {
    return this.data.testimonials;
  }

  public addTestimonial(testimonial: Testimonial) {
    this.data.testimonials = [testimonial, ...this.data.testimonials];
    this.save();
  }

  public updateTestimonial(updatedTestimonial: Testimonial) {
    this.data.testimonials = this.data.testimonials.map(t => t.id === updatedTestimonial.id ? updatedTestimonial : t);
    this.save();
  }

  public deleteTestimonial(id: string) {
    this.data.testimonials = this.data.testimonials.filter(t => t.id !== id);
    this.save();
  }

  // --- ENGINEER INFO ---
  public getEngineerInfo(): EngineerInfo {
    return this.data.engineerInfo;
  }

  public updateEngineerInfo(info: EngineerInfo) {
    this.data.engineerInfo = info;
    this.save();
  }

  // --- PROJECT STATS ---
  public getProjectStats(): ProjectStat[] {
    return this.data.projectStats || PROJECT_STATS;
  }

  public updateProjectStats(stats: ProjectStat[]) {
    this.data.projectStats = stats;
    this.save();
  }

  public updateSingleStat(id: string, updated: Partial<ProjectStat>) {
    this.data.projectStats = (this.data.projectStats || PROJECT_STATS).map(s => s.id === id ? { ...s, ...updated } : s);
    this.save();
  }

  // --- SKILLS ---
  public getSkillsCategories(): SkillCategory[] {
    return this.data.skillsCategories || SKILLS_CATEGORIES;
  }

  public updateSkillsCategories(cats: SkillCategory[]) {
    this.data.skillsCategories = cats;
    this.save();
  }

  // --- SOFTWARE TOOLS ---
  public getSoftwareTools(): SoftwareTool[] {
    return this.data.softwareTools || SOFTWARE_TOOLS;
  }

  public updateSoftwareTools(tools: SoftwareTool[]) {
    this.data.softwareTools = tools;
    this.save();
  }

  // --- FULL IMPORT / BACKUP ---
  public importFullData(data: Partial<PortfolioStorageState>) {
    this.data = {
      projects: data.projects && data.projects.length > 0 ? data.projects : this.data.projects,
      services: data.services && data.services.length > 0 ? data.services : this.data.services,
      testimonials: data.testimonials && data.testimonials.length > 0 ? data.testimonials : this.data.testimonials,
      engineerInfo: data.engineerInfo || this.data.engineerInfo,
      projectStats: data.projectStats || this.data.projectStats,
      skillsCategories: data.skillsCategories || this.data.skillsCategories,
      softwareTools: data.softwareTools || this.data.softwareTools
    };
    this.save();
  }

  // --- RESET TO DEFAULTS ---
  public resetToDefaults() {
    this.data = {
      projects: PROJECTS_DATA,
      services: SERVICES_DATA,
      testimonials: TESTIMONIALS_DATA,
      engineerInfo: ENGINEER_INFO,
      projectStats: PROJECT_STATS,
      skillsCategories: SKILLS_CATEGORIES,
      softwareTools: SOFTWARE_TOOLS
    };
    this.save();
  }
}

export const portfolioStore = new PortfolioStore();

