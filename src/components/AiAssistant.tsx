import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, X, Bot, User as UserIcon, Loader2, Phone, MessageSquare, ChevronRight, DraftingCompass, Calculator, CheckCircle2, ShieldCheck, Paperclip } from 'lucide-react';
import { ENGINEER_INFO } from '../data/portfolioData';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  actions?: { label: string; action: () => void }[];
}

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuoteModal?: (serviceTitle?: string) => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  isOpen,
  onClose,
  onOpenQuoteModal
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `আসসালামু আলাইকুম! আমি ইঞ্জিনিয়ার মো: আরিফ মিয়া (MD Arif Mia)-এর **AI CAD & Civil Engineering Assistant**। \n\nআমি আপনাকে যেভাবে সাহায্য করতে পারি:\n• AutoCAD 2D নকশা ও ওয়ার্কিং ড্রয়িং প্রাইস ও সার্ভিস ধারণা\n• 3ds Max 3D থ্রিডি ভিউ, এক্সটেরিয়র ও ইন্টেরিয়র রেন্ডারিং খরচ\n• কনস্ট্রাকশন সাইট ইঞ্জিনিয়ারিং, পাইল/ফাউন্ডেশন ও রড (Rebar) বিষয়াদি\n• বাজেট অনুযায়ী ড্রয়িং প্যাকেজ নির্বাচন\n\nআপনি বাংলায় বা ইংরেজিতে যেকোনো প্রশ্ন করতে পারেন!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: '📐 AutoCAD 2D ড্রয়িং খরচ কত?', query: 'AutoCAD 2D floor plan layout and working drawing price and turnaround time?' },
    { label: '🏛️ 3ds Max 3D রেন্ডারিং প্রাইস', query: '3ds Max 3D exterior visualization and photorealistic render cost?' },
    { label: '🏗️ সাইট ইঞ্জিনিয়ারিং অভিজ্ঞতা', query: 'Tell me about Engineer MD Arif Mia background, experience and site supervision skills.' },
    { label: '📞 সরাসরি ইঞ্জিনিয়ারের সাথে যোগাযোগ', query: 'How can I directly contact Engineer MD Arif Mia on WhatsApp or email?' }
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsLoading(true);

    try {
      let aiReply = '';

      // Format last few conversation turns for Gemini context
      const history = messages
        .filter(m => m.id !== 'init-1')
        .slice(-8)
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text
        }));

      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: history
        }),
      });

      if (res.ok) {
        const data = await res.json();
        aiReply = data.text || '';
      } else {
        const data = await res.json().catch(() => ({}));
        if (data.fallbackText) {
          aiReply = data.fallbackText;
        }
      }

      if (!aiReply) {
        // Fallback domain-aware responses
        const lower = textToSend.toLowerCase();
        if (lower.includes('autocad') || lower.includes('2d') || lower.includes('ড্রয়িং') || lower.includes('plan')) {
          aiReply = `**AutoCAD 2D ড্রয়িং সার্ভিস ও খরচের বিবরণ:**\n\n• **ফ্লোর প্ল্যান ও ফার্নিচার লেআউট:** প্রতি বর্গফুটে অথবা রেগুলার প্যাকেজ $১50 (~১৫,০০০ টাকা) থেকে শুরু।\n• **সম্পূর্ণ ওয়ার্কিং ড্রয়িং সেট:** রাজউক/পৌরসভা পারমিট সেট, গাথুনি প্ল্যান, দরজা-জানালা শিডিউল ও সেকশন কভার করে।\n• **ডেলিভারি টাইম:** ২ থেকে ৪ কর্মদিবস।\n\nআপনি চাইলে এখনই "Request Quote" বাটনে চাপ দিয়ে আপনার প্রজেক্টের এরিয়া জানিয়ে বুক করতে পারেন।`;
        } else if (lower.includes('3ds max') || lower.includes('3d') || lower.includes('রেন্ডার') || lower.includes('render')) {
          aiReply = `**3ds Max 3D থ্রিডি ভিউ ও রেন্ডারিং সার্ভিস:**\n\n• **এক্সটেরিয়র থ্রিডি ভিউ (Exterior Render):** ৪K/৮K রেজুলেশন, V-Ray/Corona লাইটিং সহ $৩০০ - $৩৫০।\n• **ইন্টেরিয়র ভিউ (Interior Render):** বেডরুম, ড্রয়িং বা অফিস ডেকোরেশন $২৫০ থেকে শুরু।\n• **ডেলিভারি টাইম:** ৩ থেকে ৫ দিন।`;
        } else if (lower.includes('arif') || lower.includes('experience') || lower.includes('অভিজ্ঞতা') || lower.includes('site')) {
          aiReply = `**ইঞ্জিনিয়ার মো: আরিফ মিয়া সম্পর্কে:**\n\n• **শিক্ষাগত যোগ্যতা:** M.Sc. in Civil Engineering (NSU - অধ্যয়নরত), B.Sc. in Civil Engineering (Uttara University), Diploma in Civil Engineering (RCIT)।\n• **মূল স্পেশালিটি:** ৩+ বছরের মাঠপর্যায়ের কনস্ট্রাকশন সাইট ইঞ্জিনিয়ারিং (রড চেকিং, কলাম-বিম কাস্টিং, সাইট লেআউট) এবং নিখুঁত AutoCAD 2D/3D ড্রয়িং ও 3ds Max আর্কিটেকচারাল রেন্ডারিং।\n• **প্রজেক্ট সফলতা:** ২৫০+ প্রজেক্ট ও ৯৯% ক্লায়েন্ট সন্তুষ্টি।`;
        } else {
          aiReply = `ধন্যবাদ আপনার বার্তার জন্য! মো: আরিফ মিয়া একজন অভিজ্ঞ সিভিল ইঞ্জিনিয়ারিং ডিজাইনার ও সাইট ইঞ্জিনিয়ার।\n\nআপনার যেকোনো বাড়ি বা বিল্ডিংয়ের প্ল্যান, থ্রিডি ডিজাইন অথবা সাইট তদারকির জন্য সরাসরি কল বা হোয়াটসঅ্যাপ করতে পারেন:\n📞 **01568647919**\n✉️ **arif.mia02@uttarauniversity.edu.bd**`;
        }
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('AI response error:', error);
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `ধন্যবাদ আপনার বার্তার জন্য! মো: আরিফ মিয়া একজন অভিজ্ঞ সিভিল ইঞ্জিনিয়ারিং ডিজাইনার ও সাইট ইঞ্জিনিয়ার।\n\nআপনার যেকোনো বাড়ি বা বিল্ডিংয়ের প্ল্যান, থ্রিডি ডিজাইন অথবা সাইট তদারকির জন্য সরাসরি কল বা হোয়াটসঅ্যাপ করতে পারেন:\n📞 **01568647919**\n✉️ **arif.mia02@uttarauniversity.edu.bd**`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-end sm:items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-blue-500/30 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] sm:h-[650px]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-white flex items-center gap-2">
                <span>AI Engineering Assistant</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded border border-cyan-500/30 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                CAD & Civil Design Guide • MD Arif Mia Portfolio
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>Submit Drawing & Quote</span>
            </button>

            <a
              href="https://wa.me/8801568647919"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-slate-950/80 px-3 py-2 border-b border-slate-800/80 overflow-x-auto flex items-center gap-2 shrink-0 no-scrollbar">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.query)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-white text-xs whitespace-nowrap transition-all cursor-pointer shrink-0 font-medium"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] sm:max-w-[75%] p-3.5 rounded-2xl space-y-1.5 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-xs shadow-lg shadow-blue-600/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {msg.text}
                </div>

                <div
                  className={`text-[10px] font-mono text-right ${
                    msg.sender === 'user' ? 'text-blue-200' : 'text-slate-500'
                  }`}
                >
                  {msg.time}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-cyan-400 bg-slate-900 border border-slate-800 p-3 rounded-xl w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span className="font-mono">AI ইঞ্জিনিয়ার উত্তর তৈরি করছে...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Contact / Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 shrink-0 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="AutoCAD, 3ds Max বা ড্রয়িং সম্পর্কে প্রশ্ন করুন..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center transition-all cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Powered by Gemini AI
            </span>
            <a
              href="https://wa.me/8801568647919"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
            >
              <span>Call / WhatsApp: 01568647919</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
