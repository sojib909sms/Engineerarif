import { Project, EngineeringService, Testimonial, EngineerInfo } from '../types';
import { PROJECTS_DATA, SERVICES_DATA, TESTIMONIALS_DATA, ENGINEER_INFO } from '../data/portfolioData';

const PORTFOLIO_STORAGE_KEY = 'md_arif_mia_portfolio_data_v1';

interface PortfolioStorageState {
  projects: Project[];
  services: EngineeringService[];
  testimonials: Testimonial[];
  engineerInfo: EngineerInfo;
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
        engineerInfo: parsed.engineerInfo || ENGINEER_INFO
      };
    }
  } catch (err) {
    console.error('Error loading portfolio storage:', err);
  }
  return {
    projects: PROJECTS_DATA,
    services: SERVICES_DATA,
    testimonials: TESTIMONIALS_DATA,
    engineerInfo: ENGINEER_INFO
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
    this.listeners.forEach(l => l());
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

  // --- RESET TO DEFAULTS ---
  public resetToDefaults() {
    this.data = {
      projects: PROJECTS_DATA,
      services: SERVICES_DATA,
      testimonials: TESTIMONIALS_DATA,
      engineerInfo: ENGINEER_INFO
    };
    this.save();
  }
}

export const portfolioStore = new PortfolioStore();
