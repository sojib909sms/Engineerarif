import { Inquiry, InquiryStatus, InquiryReply } from '../types';

const STORAGE_KEY = 'engineer_arif_inquiries_v1';
const PRIMARY_EMAIL = 'arif.mia02@uttarauniversity.edu.bd';

// Pre-seeded initial sample inquiries for realistic admin demonstration
const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'INQ-10491',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    name: 'Engr. Tanvir Ahmed',
    email: 'tanvir.struct@gmail.com',
    phone: '01711223344',
    company: 'Apex Construction Ltd.',
    service: 'AutoCAD 2D Drafting & Architectural Floor Plans',
    budget: '$500 - $1,500',
    message: 'Need complete 5-story residential working drawings, column layout, and rebar schedule in Uttara Dhaka.',
    attachmentName: 'Uttara_Plot_Layout_Sketch.pdf',
    attachmentType: 'application/pdf',
    status: 'new',
    adminNotes: 'High priority client. Requires site rebar checking consultation.',
    emailSentTo: PRIMARY_EMAIL,
    emailSentStatus: 'Delivered',
    replies: []
  },
  {
    id: 'INQ-10488',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    name: 'Architect Sabrina Noor',
    email: 'sabrina.arch@designstudio.bd',
    phone: '01819988776',
    company: 'Urban Arc Studio',
    service: '3ds Max Realistic Visualization',
    budget: '$500 - $1,500',
    message: 'Looking for photorealistic 8K exterior & interior 3ds Max V-Ray rendering for a duplex villa project in Rangpur.',
    attachmentName: 'Duplex_Villa_AutoCAD_3D.dwg',
    attachmentType: 'application/autocad',
    status: 'in-progress',
    adminNotes: 'Draft 3D render sent via WhatsApp on Aug 7.',
    emailSentTo: PRIMARY_EMAIL,
    emailSentStatus: 'Delivered',
    replies: [
      {
        id: 'rep-1',
        date: new Date(Date.now() - 3600000 * 20).toISOString(),
        text: 'Initial quote and 3ds Max camera angles provided. Working on daylight lighting setup.',
        sentTo: 'sabrina.arch@designstudio.bd'
      }
    ]
  },
  {
    id: 'INQ-10475',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    name: 'Md. Rafiqul Islam',
    email: 'rafiqul.property@yahoo.com',
    phone: '01912345678',
    company: 'Islam Real Estate',
    service: 'Working Drawings & Site Details',
    budget: '$100 - $500',
    message: 'Need construction site layout plan, column foundation layout, and beam structural detailing for 3-storied building.',
    attachmentName: 'Foundation_Soil_Report.pdf',
    attachmentType: 'application/pdf',
    status: 'completed',
    adminNotes: 'Final DWG files and site supervision schedule delivered.',
    emailSentTo: PRIMARY_EMAIL,
    emailSentStatus: 'Delivered',
    replies: [
      {
        id: 'rep-2',
        date: new Date(Date.now() - 3600000 * 60).toISOString(),
        text: 'All final DWG CAD files and PDF working sheets sent to email.',
        sentTo: 'rafiqul.property@yahoo.com'
      }
    ]
  }
];

export const inquiryStore = {
  getInquiries(): Inquiry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INQUIRIES));
        return INITIAL_INQUIRIES;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error loading inquiries from localStorage:', e);
      return INITIAL_INQUIRIES;
    }
  },

  addInquiry(newInquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'emailSentTo' | 'emailSentStatus' | 'status'>): Inquiry {
    const inquiries = this.getInquiries();
    const id = `INQ-${Math.floor(10000 + Math.random() * 90000)}`;
    const createdAt = new Date().toISOString();

    const createdInquiry: Inquiry = {
      ...newInquiryData,
      id,
      createdAt,
      status: 'new',
      emailSentTo: PRIMARY_EMAIL,
      emailSentStatus: 'Delivered',
      replies: []
    };

    const updated = [createdInquiry, ...inquiries];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Also trigger automated mail payload log / simulation
    this.sendNotificationEmail(createdInquiry);

    return createdInquiry;
  },

  updateStatus(id: string, status: InquiryStatus): void {
    const inquiries = this.getInquiries();
    const updated = inquiries.map(inq => inq.id === id ? { ...inq, status } : inq);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updateAdminNotes(id: string, notes: string): void {
    const inquiries = this.getInquiries();
    const updated = inquiries.map(inq => inq.id === id ? { ...inq, adminNotes: notes } : inq);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  addReply(id: string, replyText: string): void {
    const inquiries = this.getInquiries();
    const updated = inquiries.map(inq => {
      if (inq.id === id) {
        const newReply: InquiryReply = {
          id: `rep-${Date.now()}`,
          date: new Date().toISOString(),
          text: replyText,
          sentTo: inq.email
        };
        const replies = inq.replies ? [...inq.replies, newReply] : [newReply];
        return { ...inq, replies, status: inq.status === 'new' ? 'contacted' : inq.status };
      }
      return inq;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteInquiry(id: string): void {
    const inquiries = this.getInquiries();
    const updated = inquiries.filter(inq => inq.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  sendNotificationEmail(inquiry: Inquiry) {
    // Log automated mail dispatch
    console.log(`[AUTOMATED MAIL DISPATCH]
To: ${PRIMARY_EMAIL}
Subject: [NEW CAD/SITE INQUIRY] ${inquiry.service} - ${inquiry.name}
Client Name: ${inquiry.name}
Client Email: ${inquiry.email}
Phone/WhatsApp: ${inquiry.phone}
Company: ${inquiry.company}
Budget: ${inquiry.budget}
Attached File: ${inquiry.attachmentName || 'None'}
Message: ${inquiry.message}
Timestamp: ${inquiry.createdAt}`);
  }
};
