import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google Gen AI client with proper telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback offline responses for Bengali AI Tutor if API key is not yet set
const getFallbackTutorResponse = (query: string): string => {
  const q = query.toLowerCase();
  if (q.includes('বেগ') && q.includes('দ্রুতি')) {
    return `**দ্রুতি (Speed) ও বেগ (Velocity)-এর মধ্যে মূল পার্থক্য:**

১. **সংজ্ঞা:** 
- একক সময়ে কোনো বস্তু যেকোনো দিকে যে দূরত্ব অতিক্রম করে, তাকে **দ্রুতি** বলে।
- নির্দিষ্ট দিকে কোনো বস্তুর সময়ের সাপেক্ষে অবস্থানের পরিবর্তনের হারকে (সরণ) **বেগ** বলে।

২. **রাশির প্রকারভেদ:**
- দ্রুতি হলো **স্কেলার রাশি** (শুধু মান আছে, কোনো দিক নেই)।
- বেগ হলো **ভেক্টর রাশি** (মান এবং নির্দিষ্ট দিক দুটোই আছে)।

৩. **মান:**
- গতিশীল বস্তুর দ্রুতি কখনো শূন্য বা ঋণাত্মক হতে পারে না।
- গতিশীল বস্তুর বেগ ধনাত্মক, ঋণাত্মক এমনকি শূন্যও হতে পারে (যদি বস্তু যেখান থেকে শুরু করেছিল ঘুরে সেখানেই ফিরে আসে)।

**বাস্তব উদাহরণ:**
একটি গাড়ি ঘন্টায় ৬০ কিমি বেগে চলছে বললে সেটা দ্রুতি। কিন্তু গাড়িটি ঘন্টায় ৬০ কিমি বেগে **পূর্বদিকে** চলছে বললে সেটা বেগ।

💡 *ছোট প্রশ্ন:* তুমি স্কুলে গিয়ে আবার বাড়ি ফিরে আসলে তোমার মোট বেগ কত হবে বল তো?`;
  }

  if (q.includes('নিউটন') && (q.includes('দ্বিতীয়') || q.includes('দ্বিতীয়') || q.includes('2nd'))) {
    return `**নিউটনের দ্বিতীয় গতিসূত্র (Newton's Second Law of Motion):**

**সূত্র:** 
কোনো বস্তুর ভরবেগের পরিবর্তনের হার বস্তুর ওপর প্রযুক্ত বলের সমানুপাতিক এবং বল যেদিকে প্রযুক্ত হয় ভরবেগের পরিবর্তনও সেদিকে ঘটে।

**গাণিতিক রূপ ($F = ma$):**
- $F$ = প্রযুক্ত বল (Applied Force)
- $m$ = বস্তুর ভর (Mass)
- $a$ = বস্তুর ত্বরণ (Acceleration)

**সহজ ভাষায়:**
১. ভারী বস্তুকে (বেশি ভর $m$) ঠেলা বা গতিশীল করতে বেশি বল ($F$) দিতে হয়।
২. হালকা বস্তুতে বল দিলে তা দ্রুত গতি বৃদ্ধি করে (বেশি ত্বরণ $a$ পায়)।

**বাস্তব উদাহরণ:**
একটি ক্রিকেট বল ও একটি টেনিস বল একই বেগে ছুটে আসলে, ক্রিকেট বলটি থামাতে বেশি বল প্রয়োগ করতে হয় কারণ ক্রিকেট বলের ভর বেশি থাকায় তার ভরবেগ বেশি।

💡 *তোমার জন্য প্রশ্ন:* ভর যদি স্থির থাকে, তবে প্রযুক্ত বল দ্বিগুণ করলে ত্বরণ কতগুণ হবে?`;
  }

  if (q.includes('ওহম') || q.includes('ohm') || q.includes('রোধ') || q.includes('বর্তনী')) {
    return `**ওহমের সূত্র (Ohm's Law):**

**সূত্র:**
উষ্ণতা ও অন্যান্য ভৌত অবস্থা অপরিবর্তিত থাকলে, কোনো পরিবাহীর মধ্য দিয়ে তড়িৎপ্রবাহমাত্রা ($I$) ওই পরিবাহীর দুই প্রান্তের বিভবপ্রভেদের ($V$) সমানুপাতিক।

**গাণিতিক সমীকরণ:**
$V = IR$
অথবা, $I = \\frac{V}{R}$

যেখানে:
- $V$ = বিভবপ্রভেদ (Potential Difference) — একক: ভোল্ট (Volt)
- $I$ = তড়িৎপ্রবাহ (Electric Current) — একক: অ্যাম্পিয়ার (Ampere)
- $R$ = পরিবাহীর রোধ (Resistance) — একক: ওহম ($\Omega$)

**সহজ উপমা (জলের পাইপ):**
- জলের ট্যাঙ্কের উচ্চতার চাপ = বিভবপ্রভেদ ($V$)
- পাইপের মধ্যে জলের প্রবাহ = তড়িৎপ্রবাহ ($I$)
- পাইপ সরু হলে জল যেতে যে বাধা দেয় = রোধ ($R$)

চাপ বাড়ালে প্রবাহ বাড়বে, আর বাধা বেশি হলে প্রবাহ কমবে!`;
  }

  return `নমস্কার! আমি তোমার ফিজিক্স টিউটর। তোমার প্রশ্নটি পেলাম: "${query}"।

পদার্থবিজ্ঞানের যেকোনো ধারণা বুঝতে তিনটি জিনিস মাথায় রাখবে:
১. **বাস্তব অভিজ্ঞতা:** আমাদের চারপাশের প্রকৃতি ও জীবনের সাথে নিয়মটি কীভাবে ঘটছে।
২. **সংজ্ঞা ও রাশি:** সেটি স্কেলার না ভেক্টর, তার এসআই (SI) একক কী।
৩. **গাণিতিক সূত্র:** কীভাবে এক রাশির সাথে অন্য রাশির সম্পর্ক তৈরি হচ্ছে।

তুমি চাইলে কোনো নির্দিষ্ট চ্যাপ্টার (যেমন: গতি, নিউটনের সূত্র, আলো, তড়িৎ ইত্যাদি) বা কোনো গাণিতিক অঙ্ক নিয়ে প্রশ্ন করতে পারো। আমি ধাপে ধাপে বুঝিয়ে দেব!`;
};

// API: AI Physics Tutor
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, contextTopic, className } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!aiClient) {
      // Return high-quality educational fallback
      const reply = getFallbackTutorResponse(message);
      res.json({ reply, source: 'offline-knowledge-base' });
      return;
    }

    const systemInstruction = `You are "Visual Physics Master AI Tutor" (পদার্থবিজ্ঞানের এআই শিক্ষক), an expert, warm, and highly engaging Physics teacher for West Bengal Board (WBBSE - Madhyamik) and CBSE students of Class 9 and Class 10.

CRITICAL INSTRUCTIONS:
1. Language: Answer in simple, natural West Bengal Bengali (পশ্চিমবঙ্গের চলিত বাংলা). Keep scientific terms in English alongside Bengali (e.g. বেগ (Velocity), ত্বরণ (Acceleration), বিভবপ্রভেদ (Potential Difference), রোধ (Resistance), ইত্যাদি). Avoid complex archaic Bengali and avoid Bangladeshi phrasing.
2. Tone: Friendly, patient, encouraging, teacher-to-student tone (যেমন: "খুব সুন্দর প্রশ্ন করেছ!", "চলো ধাপে ধাপে বুঝি")
3. Pedagogical Structure:
   - Start from fundamental intuition and daily life examples (বাস্তব উদাহরণ).
   - Give the clear definition and distinction (e.g., Scalar vs Vector, Distance vs Displacement).
   - Write out formulas clearly with every variable and SI unit explained.
   - Show step-by-step mathematical reasoning without skipping steps.
   - Mention common student misconceptions (সাধারণ ভুল যা ছাত্রছাত্রীরা করে).
   - End with a short comprehension check question (একটি ছোট প্রশ্ন) to keep the student thinking.
4. Current Student context: Class: ${className || 'Class 9/10'}, Topic: ${contextTopic || 'Physics Concepts'}.`;

    const chatContents: any[] = [];
    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        if (h.role === 'user' || h.role === 'model') {
          chatContents.push({
            role: h.role,
            parts: [{ text: h.text }],
          });
        }
      }
    }
    chatContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatContents,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    const reply = response.text || getFallbackTutorResponse(message);
    res.json({ reply, source: 'gemini-3.8-flash' });
  } catch (err: any) {
    console.error('Chat error:', err);
    // Graceful fallback so student is never stuck
    const fallback = getFallbackTutorResponse(req.body?.message || '');
    res.json({ reply: fallback, source: 'offline-fallback', error: err?.message });
  }
});

// API: Physics Numerical Solver with 8 structured steps
app.post('/api/solve-numerical', async (req, res) => {
  try {
    const { problemText, className, chapter } = req.body;

    if (!problemText) {
      res.status(400).json({ error: 'Problem text is required' });
      return;
    }

    if (!aiClient) {
      res.json({
        steps: {
          given: "প্রদত্ত মানসমূহ সমস্যা থেকে চিহ্নিত করা হলো।",
          toFind: "নির্ণেয় রাশি",
          formula: "উপযুক্ত পদার্থবিজ্ঞানের সূত্র",
          substitution: "সূত্রে মান প্রতিস্থাপন",
          calculation: "গাণিতিক গণনা",
          finalAnswer: "চূড়ান্ত ফল",
          siUnit: "এসআই একক",
          explanationBengali: "এই অঙ্কটিতে নির্দিষ্ট সূত্রটি প্রয়োগ করে ধাপে ধাপে সমাধান করা হলো।"
        },
        rawText: "অফলাইন মোড: লাইভ সমাধান দেখতে আপনার কানেকশন বা এআই সক্রিয় রয়েছে কিনা দেখুন।",
        source: 'offline-template'
      });
      return;
    }

    const prompt = `Solve this Class ${className || '9/10'} Physics numerical problem with absolute mathematical and dimensional accuracy in simple West Bengal Bengali.
Problem: "${problemText}"
Chapter: ${chapter || 'General Physics'}

You MUST structure the solution in the following 8 mandatory steps:
Step 1: Given (প্রদত্ত রাশিমালা - list symbols, values, and units)
Step 2: To Find (কী নির্ণয় করতে হবে)
Step 3: Formula (প্রয়োজনীয় সূত্র)
Step 4: Substitution of values (সূত্রে মান বসানো)
Step 5: Step-by-step Calculation (ধাপে ধাপে হিসাব)
Step 6: Final Answer (চূড়ান্ত উত্তর)
Step 7: SI Unit (সঠিক এসআই একক)
Step 8: Explanation in simple Bengali (সহজ বাংলায় কার্যকারণ ব্যাখ্যা ও সতর্কবার্তা)

Ensure dimensional consistency and check for unit conversions (e.g., km/h to m/s, cm to m, grams to kg).`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Physics numerical solver for West Bengal Board (WBBSE) and CBSE students. Never provide only the final answer. Always show full dimensional units and 8 structured steps in clean Bengali.",
        temperature: 0.2,
      },
    });

    res.json({
      solutionText: response.text,
      source: 'gemini-3.8-flash'
    });
  } catch (err: any) {
    console.error('Solve error:', err);
    res.status(500).json({ error: err?.message || 'Calculation error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasAiKey: Boolean(apiKey) });
});

// Vite middleware in development or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Visual Physics Master server running on port ${port}`);
  });
}

startServer();
