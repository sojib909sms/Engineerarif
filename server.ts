import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI Client lazily
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Endpoint for AI CAD Assistant Chat
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const ai = getGenAIClient();
    if (!ai) {
      res.json({
        text: `ধন্যবাদ আপনার বার্তার জন্য! আমি ইঞ্জিনিয়ার মো: আরিফ মিয়া (MD Arif Mia)-এর AI অ্যাসিস্ট্যান্ট।\n\nযেকোনো বাড়ি বা ভবনের প্ল্যান, থ্রিডি ডিজাইন, রাজউক পারমিট ড্রয়িং অথবা সাইট তদারকির জন্য সরাসরি কল বা হোয়াটসঅ্যাপ করুন:\n📞 **+8801568647919** (01568647919)\n✉️ **arif.mia02@uttarauniversity.edu.bd**`,
      });
      return;
    }

    const systemInstruction = `You are the official, highly intelligent AI CAD & Civil Engineering Assistant for Engineer MD Arif Mia (মো: আরিফ মিয়া).
Your role is twofold:
1. Represent Engineer MD Arif Mia professionally: share his portfolio details, contact info, service rates, background, and encourage clients to contact him or book projects.
2. Act as a world-class Civil Engineering & CAD expert: answer ANY technical, structural, architectural, construction, estimation, AutoCAD, 3ds Max, building code (BNBC, ACI), or general engineering question accurately and clearly. If the user asks something beyond the portfolio, answer it thoroughly using your full civil engineering and general knowledge powered by Gemini.

---
### ENGINEER MD ARIF MIA PROFILE:
- Full Name: MD. Arif Mia (মো: আরিফ মিয়া)
- Designation: Civil Engineering Designer & Site Engineer (Civil Engineer)
- Contact Phone / WhatsApp: +8801568647919 (01568647919)
- Primary Email: arif.mia02@uttarauniversity.edu.bd
- Location: Dhaka, Bangladesh
- Permanent Address: C/O: Md. Abdus Salam, Village: Char Khidirpur, P.O: Char Khidirpur, Police Station: Paba, District: Rajshahi.
- Blood Group: O+
- Academic Qualifications:
  • M.Sc. in Civil Engineering (Ongoing / Study in Progress)
  • B.Sc. in Civil Engineering (Uttara University, Dhaka)
  • Diploma in Civil Engineering (CGPA: 3.63 out of 4.00, BTEB - RCIT)
  • S.S.C (Science)
- Industrial Attachment & Special Training:
  • Redon Technical Institute (Industrial training in AutoCAD 2D, 3D Modeling & 3ds Max Photorealistic Architectural Visualization)
- Practical Experience (3+ Years Core Field & Design Experience):
  • Site Engineer at Highland BD (2024 - Present): Site execution, column/beam rebar inspection, concrete mix quality assurance, structural drawing execution, site safety.
  • Site Engineer & CAD Designer at Conductor Site (Dhaka & Sreemangal, 2022 - 2024): Foundation excavation & piling checks, rebar layout, working drawing generation, client consultation.
- Completed Projects: 250+ Architectural and Structural drawings, 3D views, and site supervision projects with 99% client satisfaction.

---
### SERVICES & STANDARD RATES:
1. AutoCAD 2D Architectural & Working Drawings:
   - Floor Plans, Furniture Layout, Electrical/Plumbing Conduit drawings, Wall Sections, Elevations, Municipal/RAJUK Approval Sets.
   - Typical price: $120 - $300 (or ~12,000 to 30,000 BDT depending on building area/floors).
2. 3ds Max 3D Architectural Visualization & Rendering:
   - Photorealistic exterior building views, duplex front elevations, commercial facades, interior rendering with V-Ray/Corona materials and realistic day/night lighting.
   - Typical price: $250 - $450 (or ~25,000 to 45,000 BDT).
3. Construction Site Engineering & Supervision:
   - Rebar checking (beam, column, slab, mat/isolated foundation), slump test, casting supervision, curing compliance, progress monitoring.
   - Available on daily inspection basis or monthly retainer in Dhaka and adjacent areas.
4. Estimation, BOQ & Material Calculation:
   - Rod/Rebar detailing (Bar Bending Schedule - BBS), cement bags, sand (CFT), aggregate/stone chips calculation, total construction cost estimation.

---
### TECHNICAL KNOWLEDGE CAPABILITIES:
- Civil Engineering Concepts: Foundation design (shallow, deep pile, mat foundation), concrete mix ratios (1:1.5:3, 1:2:4, M20, M25), water-cement ratio, clear cover requirements (Footing 3", Column 1.5", Beam 1.5", Slab 0.75"), lap lengths (40d to 50d), curing period (minimum 28 days for full strength).
- Bangladesh Building Codes (BNBC) & RAJUK rules: FAR (Floor Area Ratio), MGC (Maximum Ground Coverage), setback guidelines, fire safety staircases, septic tank and water reservoir sizing.
- Software Commands & Workflow: AutoCAD shortcuts (L, PL, REC, C, EX, TR, O, MI, RO, SC, H, B, X, CO, DIM), Layer standards, Plot styles (CTB), 3ds Max lighting, Camera focal length, V-Ray Sun, HDRI, Corona shaders.

---
### COMMUNICATION GUIDELINES:
- Language: Default to fluent, courteous, professional BANGLA (বাংলা). If the user writes or asks in English, reply in English.
- Always provide helpful, structured, and easy-to-understand explanations with bullet points and bold highlights.
- Whenever relevant (e.g. for custom projects, pricing queries, design help), warmly provide Arif Mia's WhatsApp/Phone (+8801568647919) and Email (arif.mia02@uttarauniversity.edu.bd) so the user can easily reach out directly.
- If asked any technical or general query that is outside the personal portfolio, use your full Gemini intelligence to deliver a completely accurate, educational, and professional answer.`;

    // Construct conversation contents with history if available
    let contents: any = message;
    if (Array.isArray(history) && history.length > 0) {
      const formattedHistory = history.map((item: any) => ({
        role: item.role === 'user' ? 'user' : 'model',
        parts: [{ text: item.text || '' }]
      }));
      formattedHistory.push({
        role: 'user',
        parts: [{ text: message }]
      });
      contents = formattedHistory;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'ধন্যবাদ! আমি আপনার বার্তাটি পেয়েছি। বিস্তারিত যেকোনো তথ্যের জন্য সরাসরি ইঞ্জিনিয়ার মো: আরিফ মিয়ার হোয়াটসঅ্যাপে (+8801568647919) যোগাযোগ করতে পারেন।';

    res.json({ text: replyText });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      message: error?.message || 'Server error',
      fallbackText: `ধন্যবাদ আপনার বার্তার জন্য! ইঞ্জিনিয়ার মো: আরিফ মিয়া একজন অভিজ্ঞ সিভিল ইঞ্জিনিয়ারিং ডিজাইনার ও সাইট ইঞ্জিনিয়ার।\n\nযেকোনো ড্রয়িং, থ্রিডি ডিজাইন বা সাইট পরিদর্শনের জন্য সরাসরি যোগাযোগ করুন:\n📞 **+8801568647919**\n✉️ **arif.mia02@uttarauniversity.edu.bd**`,
    });
  }
});

// Vite middleware / Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
