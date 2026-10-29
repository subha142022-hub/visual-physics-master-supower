import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, MicOff, Sparkles, User, RefreshCw, Volume2, HelpCircle } from 'lucide-react';
import { ClassLevel } from '../../types/physics';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AITutorProps {
  currentClass: ClassLevel;
}

export const AITutor: React.FC<AITutorProps> = ({ currentClass }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `নমস্কার! আমি তোমার ফিজিক্স শিক্ষক। 
পদার্থবিজ্ঞানের যেকোনো ধারণা—গতি, নিউটনের সূত্র, মহাকর্ষ, আলো, ওহমের সূত্র বা কোনো অঙ্ক বুঝতে কোনো সমস্যা হলে আমাকে সহজ বাংলায় জিজ্ঞেস করতে পারো। 

আমি ছবি, বাস্তব উদাহরণ ও ধাপে ধাপে সূত্র প্রয়োগ করে তোমাকে বুঝিয়ে দেব!`,
      timestamp: 'এখনই',
    },
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const quickQuestions = [
    'বেগ আর দ্রুতি কি একই জিনিস?',
    "নিউটনের দ্বিতীয় সূত্র ও F=ma সহজ করে বোঝাও",
    "ওহমের সূত্র ও জলের পাইপের উপমা কী?",
    "অবতল দর্পণে দাঁতের ডাক্তাররা কীভাবে বড় দাঁত দেখেন?",
    "চাঁদে কোনো বস্তুর ভর ও ভারের পরিবর্তন কী হয়?",
  ];

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (queryToSend?: string) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          className: currentClass,
        }),
      });

      const data = await res.json();
      const aiReplyText = data.reply || 'দুঃখিত, উত্তরটি প্রস্তুত করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।';

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'কানেকশন বিঘ্নিত হয়েছে। তবে মনে রাখবে, পদার্থবিজ্ঞান বোঝার মূল চাবিকাঠি হলো বাস্তব জীবনের সাথে সমীকরণ মেলানো!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice speech-to-text integration
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('আপনার ব্রাউজারে ভয়েস রিকগনিশন সক্রিয় নয়। অনুগ্রহ করে লিখে প্রশ্ন করুন।');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'bn-IN'; // West Bengal Bengali
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col h-[650px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              পদার্থবিজ্ঞানের এআই শিক্ষক (Physics AI Tutor)
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              সহজ বাংলা ব্যাখ্যা · ধাপে ধাপে যুক্তি · কোনো দ্বিধা ছাড়া প্রশ্ন করো
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'welcome-reset',
                sender: 'ai',
                text: 'চ্যাট পরিষ্কার করা হয়েছে। তোমার নতুন প্রশ্নটি বলো!',
                timestamp: 'এখনই',
              },
            ])
          }
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          নতুন চ্যাট
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${
              m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                m.sender === 'user'
                  ? 'bg-sky-600 text-white'
                  : 'bg-indigo-600 text-white'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-tr-none'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60 shadow-2xs whitespace-pre-line'
              }`}
            >
              {m.text}
              <div
                className={`text-[10px] mt-1.5 font-mono ${
                  m.sender === 'user' ? 'text-sky-200 text-right' : 'text-slate-400 text-left'
                }`}
              >
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>শিক্ষক উত্তর চিন্তা করছেন এবং বাস্তব উদাহরণ সাজাচ্ছেন...</span>
            </div>
          </div>
        )}

      </div>

      {/* Suggested Quick Question Chips */}
      <div className="py-2 flex items-center gap-1.5 overflow-x-auto text-xs whitespace-nowrap scrollbar-none border-t border-slate-100 dark:border-slate-800">
        <span className="text-[11px] text-slate-400 font-medium shrink-0">দ্রুত প্রশ্ন:</span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-700 dark:text-slate-300 transition-colors text-[11px] shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                isListening
                  ? 'কথা বলুন, আপনার কথা শোনা হচ্ছে...'
                  : 'সহজ বাংলায় যেকোনো পদার্থবিজ্ঞানের প্রশ্ন জিজ্ঞাসা করুন...'
              }
              className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white ${
                isListening
                  ? 'border-red-500 ring-2 ring-red-300 animate-pulse'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            />
          </div>

          {/* Voice Input Microphone Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-3 rounded-xl border transition-colors ${
              isListening
                ? 'bg-red-500 text-white border-red-600 animate-bounce'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="মাইক্রোফোনে বাংলায় প্রশ্ন বলুন"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-colors shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
