export interface VisitorSessionLog {
  id: string;
  startTime: string;
  lastActiveTime: string;
  durationSeconds: number;
  dateStr: string; // YYYY-MM-DD
  device: string;
  pageViews: string[];
}

export interface AnalyticsSummary {
  totalVisits: number;
  todayVisits: number;
  activeVisitorsCount: number;
  totalTimeSpentSeconds: number;
  todayTimeSpentSeconds: number;
  averageSessionSeconds: number;
  dailyVisitsHistory: Record<string, number>;
  sessions: VisitorSessionLog[];
}

const ANALYTICS_STORAGE_KEY = 'md_arif_mia_visitor_analytics_v1';
const CURRENT_SESSION_KEY = 'md_arif_mia_current_session_id';

class AnalyticsStore {
  private currentSessionId: string = '';
  private sessionStartTime: number = Date.now();
  private pageViews: Set<string> = new Set(['Home']);

  constructor() {
    this.initSession();
  }

  private getTodayStr(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private initSession() {
    if (typeof window === 'undefined') return;

    let sessionId = sessionStorage.getItem(CURRENT_SESSION_KEY);
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
      sessionStorage.setItem(CURRENT_SESSION_KEY, sessionId);
      this.recordNewVisit(sessionId);
    }
    this.currentSessionId = sessionId;
  }

  private getRawAnalytics(): AnalyticsSummary {
    try {
      const saved = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading analytics storage', e);
    }
    return {
      totalVisits: 148, // Initial baseline
      todayVisits: 12,
      activeVisitorsCount: 1,
      totalTimeSpentSeconds: 43200, // baseline hours
      todayTimeSpentSeconds: 1840,
      averageSessionSeconds: 320,
      dailyVisitsHistory: {
        [this.getTodayStr()]: 12
      },
      sessions: []
    };
  }

  private saveRawAnalytics(data: AnalyticsSummary) {
    try {
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving analytics storage', e);
    }
  }

  private recordNewVisit(sessionId: string) {
    const data = this.getRawAnalytics();
    const today = this.getTodayStr();

    data.totalVisits = (data.totalVisits || 0) + 1;
    data.dailyVisitsHistory[today] = (data.dailyVisitsHistory[today] || 0) + 1;
    data.todayVisits = data.dailyVisitsHistory[today];

    const device = window.innerWidth < 768 ? 'Mobile (Handheld)' : 'Desktop / PC';

    const newSession: VisitorSessionLog = {
      id: sessionId,
      startTime: new Date().toISOString(),
      lastActiveTime: new Date().toISOString(),
      durationSeconds: 1,
      dateStr: today,
      device: device,
      pageViews: ['Home Section']
    };

    data.sessions = [newSession, ...(data.sessions || [])].slice(0, 50); // Keep last 50
    this.saveRawAnalytics(data);
  }

  // Ping every second to track active time on site
  public pingActiveSession(sectionName?: string) {
    if (!this.currentSessionId) this.initSession();

    const data = this.getRawAnalytics();
    const today = this.getTodayStr();

    let session = data.sessions.find(s => s.id === this.currentSessionId);
    if (!session) {
      session = {
        id: this.currentSessionId,
        startTime: new Date().toISOString(),
        lastActiveTime: new Date().toISOString(),
        durationSeconds: 1,
        dateStr: today,
        device: window.innerWidth < 768 ? 'Mobile' : 'Desktop',
        pageViews: ['Home']
      };
      data.sessions.unshift(session);
    }

    session.durationSeconds += 1;
    session.lastActiveTime = new Date().toISOString();

    if (sectionName && !session.pageViews.includes(sectionName)) {
      session.pageViews.push(sectionName);
    }

    data.totalTimeSpentSeconds = (data.totalTimeSpentSeconds || 0) + 1;

    // Recalculate today's time spent
    const todaySessions = data.sessions.filter(s => s.dateStr === today);
    data.todayTimeSpentSeconds = todaySessions.reduce((acc, s) => acc + s.durationSeconds, 0);

    // Active visitors: sessions updated in last 5 minutes
    const fiveMinsAgo = Date.now() - 5 * 60 * 1000;
    const activeSessions = data.sessions.filter(s => new Date(s.lastActiveTime).getTime() > fiveMinsAgo);
    data.activeVisitorsCount = Math.max(1, activeSessions.length);

    // Recalculate average session
    if (data.sessions.length > 0) {
      const sum = data.sessions.reduce((acc, s) => acc + s.durationSeconds, 0);
      data.averageSessionSeconds = Math.round(sum / data.sessions.length);
    }

    this.saveRawAnalytics(data);
  }

  public getSummary(): AnalyticsSummary {
    const data = this.getRawAnalytics();
    const today = this.getTodayStr();
    data.todayVisits = data.dailyVisitsHistory[today] || 1;

    // Cleanup active count
    const fiveMinsAgo = Date.now() - 5 * 60 * 1000;
    const activeSessions = (data.sessions || []).filter(s => new Date(s.lastActiveTime).getTime() > fiveMinsAgo);
    data.activeVisitorsCount = Math.max(1, activeSessions.length);

    return data;
  }

  public getCurrentSessionDuration(): number {
    const data = this.getRawAnalytics();
    const session = data.sessions.find(s => s.id === this.currentSessionId);
    return session ? session.durationSeconds : 0;
  }

  public resetAnalytics() {
    localStorage.removeItem(ANALYTICS_STORAGE_KEY);
  }
}

export const analyticsStore = new AnalyticsStore();
