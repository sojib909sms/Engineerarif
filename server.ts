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
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const ai = getGenAIClient();
    if (!ai) {
      res.json({
        text: `ধন্যবাদ আপনার বার্তার জন্য! মো: আরিফ মিয়া একজন অভিজ্ঞ সিভিল ইঞ্জিনিয়ারিং ডিজাইনার ও সাইট ইঞ্জিনিয়ার।\n\nআপনার যেকোনো বাড়ি বা বিল্ডিংয়ের প্ল্যান, থ্রিডি ডিজাইন অথবা সাইট তদারকির জন্য সরাসরি কল বা হোয়াটসঅ্যাপ করতে পারেন:\n📞 **01568647919**\n✉️ **arif.mia02@uttarauniversity.edu.bd**`,
      });
      return;
    }

    const systemInstruction = `You are the official AI Assistant for MD Arif Mia, a Civil Engineering Designer & Construction Site Engineer based in Dhaka, Bangladesh (Uttara University B.Sc & NSU M.Sc student).
He has 3+ years of core construction site experience (rebar checking, site layout, foundation inspection) and high-level AutoCAD 2D/3D & 3ds Max photorealistic rendering skills.
Primary email: arif.mia02@uttarauniversity.edu.bd
Phone/WhatsApp: 01568647919 / +8801568647919

Services Offered:
- AutoCAD 2D Floor Plans & Permit Working Drawings ($120 - $300 / BDT rates)
- AutoCAD 3D Building Models & Massing
- 3ds Max V-Ray / Corona Exterior & Interior Renders ($250 - $450)
- Construction Site Supervision, Rebar Checking & Field Quality
- Structural Beam, Column, Slab & Foundation Detailing

Always respond politely, helpfully, and professionally in BANGLA (or English if the user asks in English). Encourage the user to send their project details or contact Engineer Arif on WhatsApp at 01568647919.`;

    const promptText = `${systemInstruction}\n\nUser Question: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
    });

    const replyText = response.text || 'ধন্যবাদ! আমি আপনার প্রশ্নটি পেয়েছি। বিস্তারিত জানতে ইঞ্জিনিয়ার মো: আরিফ মিয়ার হোয়াটসঅ্যাপে (০১৫৬৮৬৪৭৯১৯) যোগাযোগ করতে পারেন।';

    res.json({ text: replyText });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      message: error?.message || 'Server error',
      fallbackText: `ধন্যবাদ আপনার বার্তার জন্য! মো: আরিফ মিয়া একজন অভিজ্ঞ সিভিল ইঞ্জিনিয়ারিং ডিজাইনার ও সাইট ইঞ্জিনিয়ার।\n\nআপনার যেকোনো বাড়ি বা বিল্ডিংয়ের প্ল্যান, থ্রিডি ডিজাইন অথবা সাইট তদারকির জন্য সরাসরি কল বা হোয়াটসঅ্যাপ করতে পারেন:\n📞 **01568647919**\n✉️ **arif.mia02@uttarauniversity.edu.bd**`,
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
