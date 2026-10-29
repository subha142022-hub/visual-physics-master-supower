import { FormulaItem } from '../types/physics';

export const allFormulas: FormulaItem[] = [
  // --- Class 9: Motion ---
  {
    id: 'f-v-u-at',
    formula: 'v = u + at',
    nameBengali: 'গতির প্রথম সমীকরণ (বেগ ও সময়)',
    nameEnglish: 'First Equation of Motion',
    chapterId: 'ch9-motion',
    classLevel: 'class-9',
    resultSymbol: 'v',
    resultUnit: 'm/s',
    symbolMeanings: [
      { symbol: 'v', meaningBengali: 'অন্তিম বেগ (Final Velocity)', unit: 'm/s' },
      { symbol: 'u', meaningBengali: 'প্রাথমিক বেগ (Initial Velocity)', unit: 'm/s' },
      { symbol: 'a', meaningBengali: 'সমত্বরণ (Acceleration)', unit: 'm/s²' },
      { symbol: 't', meaningBengali: 'সময় (Time elapsed)', unit: 's' },
    ],
    siUnit: 'মিটার/সেকেন্ড (m/s)',
    exampleProblem: {
      questionBengali: 'একটি গাড়ি স্থির অবস্থা থেকে শুরু করে ৩ m/s² সমত্বরণে ৫ সেকেন্ড চলল। গাড়ির অন্তিম বেগ কত?',
      given: 'u = 0 m/s, a = 3 m/s², t = 5 s',
      solution: 'v = u + at = 0 + (3 × 5) = 15 m/s',
    },
    variables: [
      { symbol: 'u', nameBengali: 'প্রাথমিক বেগ (u)', nameEnglish: 'Initial Velocity', unit: 'm/s', defaultValue: 0, min: 0, max: 50, step: 1 },
      { symbol: 'a', nameBengali: 'ত্বরণ (a)', nameEnglish: 'Acceleration', unit: 'm/s²', defaultValue: 3, min: -10, max: 20, step: 0.5 },
      { symbol: 't', nameBengali: 'সময় (t)', nameEnglish: 'Time', unit: 's', defaultValue: 5, min: 0.5, max: 60, step: 0.5 },
    ],
    calculate: (inputs) => {
      const u = inputs.u ?? 0;
      const a = inputs.a ?? 0;
      const t = inputs.t ?? 0;
      const v = u + a * t;
      return {
        result: Math.round(v * 100) / 100,
        unit: 'm/s',
        steps: [
          `১. সূত্র: v = u + at`,
          `২. মান বসানো: v = ${u} + (${a} × ${t})`,
          `৩. গণনা: v = ${u} + ${Math.round(a * t * 100) / 100} = ${Math.round(v * 100) / 100} m/s`,
        ],
      };
    },
  },
  {
    id: 'f-s-ut-half-at2',
    formula: 's = ut + ½at²',
    nameBengali: 'গতির দ্বিতীয় সমীকরণ (সরণ ও সময়)',
    nameEnglish: 'Second Equation of Motion',
    chapterId: 'ch9-motion',
    classLevel: 'class-9',
    resultSymbol: 's',
    resultUnit: 'm',
    symbolMeanings: [
      { symbol: 's', meaningBengali: 'অতিক্রান্ত দূরত্ব / সরণ (Displacement)', unit: 'm' },
      { symbol: 'u', meaningBengali: 'প্রাথমিক বেগ', unit: 'm/s' },
      { symbol: 't', meaningBengali: 'সময়', unit: 's' },
      { symbol: 'a', meaningBengali: 'ত্বরণ', unit: 'm/s²' },
    ],
    siUnit: 'মিটার (m)',
    exampleProblem: {
      questionBengali: 'একটি ট্রেন ৪ m/s প্রাথমিক বেগে চলে ২ m/s² ত্বরণে ৬ সেকেন্ডে কতটা দূরত্ব যাবে?',
      given: 'u = 4 m/s, a = 2 m/s², t = 6 s',
      solution: 's = (4 × 6) + 0.5 × 2 × 6² = 24 + 36 = 60 m',
    },
    variables: [
      { symbol: 'u', nameBengali: 'প্রাথমিক বেগ (u)', nameEnglish: 'Initial Velocity', unit: 'm/s', defaultValue: 4, min: 0, max: 50, step: 1 },
      { symbol: 'a', nameBengali: 'ত্বরণ (a)', nameEnglish: 'Acceleration', unit: 'm/s²', defaultValue: 2, min: 0, max: 20, step: 0.5 },
      { symbol: 't', nameBengali: 'সময় (t)', nameEnglish: 'Time', unit: 's', defaultValue: 6, min: 1, max: 30, step: 1 },
    ],
    calculate: (inputs) => {
      const u = inputs.u ?? 0;
      const a = inputs.a ?? 0;
      const t = inputs.t ?? 0;
      const s = u * t + 0.5 * a * t * t;
      return {
        result: Math.round(s * 100) / 100,
        unit: 'm',
        steps: [
          `১. সূত্র: s = ut + ½at²`,
          `২. মান বসানো: s = (${u} × ${t}) + (0.5 × ${a} × ${t}²)`,
          `৩. গণনা: s = ${u * t} + ${0.5 * a * t * t} = ${Math.round(s * 100) / 100} m`,
        ],
      };
    },
  },
  // --- Class 9: Force & Newton's Laws ---
  {
    id: 'f-f-ma',
    formula: 'F = ma',
    nameBengali: 'নিউটনের দ্বিতীয় গতিসূত্র (বল)',
    nameEnglish: "Newton's Second Law of Motion",
    chapterId: 'ch9-force',
    classLevel: 'class-9',
    resultSymbol: 'F',
    resultUnit: 'N',
    symbolMeanings: [
      { symbol: 'F', meaningBengali: 'প্রযুক্ত বল (Force)', unit: 'N (Newton)' },
      { symbol: 'm', meaningBengali: 'বস্তুর ভর (Mass)', unit: 'kg' },
      { symbol: 'a', meaningBengali: 'সৃষ্ট ত্বরণ (Acceleration)', unit: 'm/s²' },
    ],
    siUnit: 'নিউটন (N = kg·m/s²)',
    exampleProblem: {
      questionBengali: '৫ কেজি ভরের একটি ব্লকে ৪ m/s² ত্বরণ সৃষ্টি করতে কত বল লাগবে?',
      given: 'm = 5 kg, a = 4 m/s²',
      solution: 'F = m × a = 5 × 4 = 20 N',
    },
    variables: [
      { symbol: 'm', nameBengali: 'ভর (m)', nameEnglish: 'Mass', unit: 'kg', defaultValue: 5, min: 0.1, max: 100, step: 0.5 },
      { symbol: 'a', nameBengali: 'ত্বরণ (a)', nameEnglish: 'Acceleration', unit: 'm/s²', defaultValue: 4, min: 0.1, max: 50, step: 0.5 },
    ],
    calculate: (inputs) => {
      const m = inputs.m ?? 1;
      const a = inputs.a ?? 1;
      const F = m * a;
      return {
        result: Math.round(F * 100) / 100,
        unit: 'N',
        steps: [
          `১. সূত্র: F = m × a`,
          `২. মান বসানো: F = ${m} kg × ${a} m/s²`,
          `৩. গণনা: F = ${Math.round(F * 100) / 100} N`,
        ],
      };
    },
  },
  {
    id: 'f-p-mv',
    formula: 'p = mv',
    nameBengali: 'রৈখিক ভরবেগ',
    nameEnglish: 'Linear Momentum',
    chapterId: 'ch9-force',
    classLevel: 'class-9',
    resultSymbol: 'p',
    resultUnit: 'kg·m/s',
    symbolMeanings: [
      { symbol: 'p', meaningBengali: 'ভরবেগ (Momentum)', unit: 'kg·m/s' },
      { symbol: 'm', meaningBengali: 'ভর (Mass)', unit: 'kg' },
      { symbol: 'v', meaningBengali: 'বেগ (Velocity)', unit: 'm/s' },
    ],
    siUnit: 'কিলোগ্রাম-মিটার/সেকেন্ড (kg·m/s)',
    exampleProblem: {
      questionBengali: '১৫০০ কেজি ভরের একটি গাড়ি ২০ m/s বেগে চললে তার ভরবেগ কত?',
      given: 'm = 1500 kg, v = 20 m/s',
      solution: 'p = m × v = 1500 × 20 = 30000 kg·m/s',
    },
    variables: [
      { symbol: 'm', nameBengali: 'ভর (m)', nameEnglish: 'Mass', unit: 'kg', defaultValue: 1500, min: 1, max: 5000, step: 50 },
      { symbol: 'v', nameBengali: 'বেগ (v)', nameEnglish: 'Velocity', unit: 'm/s', defaultValue: 20, min: 0, max: 100, step: 1 },
    ],
    calculate: (inputs) => {
      const m = inputs.m ?? 1;
      const v = inputs.v ?? 1;
      const p = m * v;
      return {
        result: Math.round(p * 100) / 100,
        unit: 'kg·m/s',
        steps: [
          `১. সূত্র: p = m × v`,
          `২. মান বসানো: p = ${m} kg × ${v} m/s`,
          `৩. ফল: p = ${Math.round(p * 100) / 100} kg·m/s`,
        ],
      };
    },
  },
  // --- Class 9: Work, Energy & Power ---
  {
    id: 'f-ke-half-mv2',
    formula: 'KE = ½mv²',
    nameBengali: 'গতিশক্তি',
    nameEnglish: 'Kinetic Energy',
    chapterId: 'ch9-work-energy',
    classLevel: 'class-9',
    resultSymbol: 'KE',
    resultUnit: 'J',
    symbolMeanings: [
      { symbol: 'KE', meaningBengali: 'গতিশক্তি (Kinetic Energy)', unit: 'J (Joule)' },
      { symbol: 'm', meaningBengali: 'ভর (Mass)', unit: 'kg' },
      { symbol: 'v', meaningBengali: 'বেগ (Velocity)', unit: 'm/s' },
    ],
    siUnit: 'জুল (Joule, J)',
    exampleProblem: {
      questionBengali: '২ কেজি ভরের একটি বল ১০ m/s বেগে চললে তার গতিশক্তি কত?',
      given: 'm = 2 kg, v = 10 m/s',
      solution: 'KE = 0.5 × 2 × 10² = 100 J',
    },
    variables: [
      { symbol: 'm', nameBengali: 'ভর (m)', nameEnglish: 'Mass', unit: 'kg', defaultValue: 2, min: 0.1, max: 100, step: 0.5 },
      { symbol: 'v', nameBengali: 'বেগ (v)', nameEnglish: 'Velocity', unit: 'm/s', defaultValue: 10, min: 0, max: 50, step: 1 },
    ],
    calculate: (inputs) => {
      const m = inputs.m ?? 1;
      const v = inputs.v ?? 1;
      const ke = 0.5 * m * v * v;
      return {
        result: Math.round(ke * 100) / 100,
        unit: 'J',
        steps: [
          `১. সূত্র: KE = ½mv²`,
          `২. মান বসানো: KE = 0.5 × ${m} × (${v})²`,
          `৩. গণনা: KE = 0.5 × ${m} × ${v * v} = ${Math.round(ke * 100) / 100} J`,
        ],
      };
    },
  },
  {
    id: 'f-pe-mgh',
    formula: 'PE = mgh',
    nameBengali: 'অভিকর্ষীয় স্থিতিশক্তি',
    nameEnglish: 'Gravitational Potential Energy',
    chapterId: 'ch9-work-energy',
    classLevel: 'class-9',
    resultSymbol: 'PE',
    resultUnit: 'J',
    symbolMeanings: [
      { symbol: 'PE', meaningBengali: 'স্থিতিশক্তি (Potential Energy)', unit: 'J' },
      { symbol: 'm', meaningBengali: 'ভর', unit: 'kg' },
      { symbol: 'g', meaningBengali: 'অভিকর্ষজ ত্বরণ (সাধারণত ৯.৮ বা ১০)', unit: 'm/s²' },
      { symbol: 'h', meaningBengali: 'উচ্চতা (Height)', unit: 'm' },
    ],
    siUnit: 'জুল (Joule, J)',
    exampleProblem: {
      questionBengali: '৫ কেজি ভরের একটি পাথরকে ১০ মিটার উঁচুতে তুললে তাতে কত স্থিতিশক্তি সঞ্চিত হবে? (g = 9.8 m/s²)',
      given: 'm = 5 kg, g = 9.8 m/s², h = 10 m',
      solution: 'PE = 5 × 9.8 × 10 = 490 J',
    },
    variables: [
      { symbol: 'm', nameBengali: 'ভর (m)', nameEnglish: 'Mass', unit: 'kg', defaultValue: 5, min: 0.1, max: 100, step: 0.5 },
      { symbol: 'g', nameBengali: 'অভিকর্ষজ ত্বরণ (g)', nameEnglish: 'Gravity', unit: 'm/s²', defaultValue: 9.8, min: 9.7, max: 10, step: 0.1 },
      { symbol: 'h', nameBengali: 'উচ্চতা (h)', nameEnglish: 'Height', unit: 'm', defaultValue: 10, min: 0.5, max: 100, step: 0.5 },
    ],
    calculate: (inputs) => {
      const m = inputs.m ?? 1;
      const g = inputs.g ?? 9.8;
      const h = inputs.h ?? 1;
      const pe = m * g * h;
      return {
        result: Math.round(pe * 100) / 100,
        unit: 'J',
        steps: [
          `১. সূত্র: PE = m × g × h`,
          `২. মান বসানো: PE = ${m} × ${g} × ${h}`,
          `৩. গণনা: PE = ${Math.round(pe * 100) / 100} J`,
        ],
      };
    },
  },
  // --- Class 9: Sound ---
  {
    id: 'f-v-f-lambda',
    formula: 'v = f · λ',
    nameBengali: 'তরঙ্গ বেগ সমীকরণ',
    nameEnglish: 'Wave Equation',
    chapterId: 'ch9-sound',
    classLevel: 'class-9',
    resultSymbol: 'v',
    resultUnit: 'm/s',
    symbolMeanings: [
      { symbol: 'v', meaningBengali: 'তরঙ্গের বেগ (Wave Velocity)', unit: 'm/s' },
      { symbol: 'f', meaningBengali: 'কম্পাঙ্ক (Frequency)', unit: 'Hz' },
      { symbol: 'λ', meaningBengali: 'তরঙ্গদৈর্ঘ্য (Wavelength)', unit: 'm' },
    ],
    siUnit: 'মিটার/সেকেন্ড (m/s)',
    exampleProblem: {
      questionBengali: 'একটি শব্দ তরঙ্গের কম্পাঙ্ক ২৫৬ Hz এবং বায়ুতে এর তরঙ্গদৈর্ঘ্য ১.৩ মিটার হলে শব্দের বেগ কত?',
      given: 'f = 256 Hz, λ = 1.3 m',
      solution: 'v = f × λ = 256 × 1.3 = 332.8 m/s',
    },
    variables: [
      { symbol: 'f', nameBengali: 'কম্পাঙ্ক (f)', nameEnglish: 'Frequency', unit: 'Hz', defaultValue: 256, min: 20, max: 20000, step: 10 },
      { symbol: 'lambda', nameBengali: 'তরঙ্গদৈর্ঘ্য (λ)', nameEnglish: 'Wavelength', unit: 'm', defaultValue: 1.3, min: 0.05, max: 10, step: 0.05 },
    ],
    calculate: (inputs) => {
      const f = inputs.f ?? 100;
      const lambda = inputs.lambda ?? 1;
      const v = f * lambda;
      return {
        result: Math.round(v * 100) / 100,
        unit: 'm/s',
        steps: [
          `১. সূত্র: v = f × λ`,
          `২. মান বসানো: v = ${f} Hz × ${lambda} m`,
          `৩. গণনা: v = ${Math.round(v * 100) / 100} m/s`,
        ],
      };
    },
  },
  // --- Class 10: Electricity ---
  {
    id: 'f-v-ir',
    formula: 'V = IR',
    nameBengali: 'ওহমের সূত্র',
    nameEnglish: "Ohm's Law",
    chapterId: 'ch10-electricity',
    classLevel: 'class-10',
    resultSymbol: 'V',
    resultUnit: 'V',
    symbolMeanings: [
      { symbol: 'V', meaningBengali: 'বিভবপ্রভেদ (Potential Difference)', unit: 'V (Volt)' },
      { symbol: 'I', meaningBengali: 'তড়িৎপ্রবাহ (Current)', unit: 'A (Ampere)' },
      { symbol: 'R', meaningBengali: 'রোধ (Resistance)', unit: 'Ω (Ohm)' },
    ],
    siUnit: 'ভোল্ট (V)',
    exampleProblem: {
      questionBengali: 'একটি ১০ Ω রোধের মধ্য দিয়ে ২ A কারেন্ট প্রবাহিত হলে পরিবাহীর দুই প্রান্তের বিভবপ্রভেদ কত?',
      given: 'R = 10 Ω, I = 2 A',
      solution: 'V = I × R = 2 × 10 = 20 V',
    },
    variables: [
      { symbol: 'I', nameBengali: 'তড়িৎপ্রবাহ (I)', nameEnglish: 'Current', unit: 'A', defaultValue: 2, min: 0.1, max: 20, step: 0.1 },
      { symbol: 'R', nameBengali: 'রোধ (R)', nameEnglish: 'Resistance', unit: 'Ω', defaultValue: 10, min: 0.5, max: 500, step: 0.5 },
    ],
    calculate: (inputs) => {
      const I = inputs.I ?? 1;
      const R = inputs.R ?? 1;
      const V = I * R;
      return {
        result: Math.round(V * 100) / 100,
        unit: 'V',
        steps: [
          `১. সূত্র: V = I × R`,
          `২. মান বসানো: V = ${I} A × ${R} Ω`,
          `৩. গণনা: V = ${Math.round(V * 100) / 100} V`,
        ],
      };
    },
  },
  {
    id: 'f-p-vi',
    formula: 'P = VI',
    nameBengali: 'বৈদ্যুতিক ক্ষমতা',
    nameEnglish: 'Electric Power',
    chapterId: 'ch10-electricity',
    classLevel: 'class-10',
    resultSymbol: 'P',
    resultUnit: 'W',
    symbolMeanings: [
      { symbol: 'P', meaningBengali: 'বৈদ্যুতিক ক্ষমতা (Power)', unit: 'W (Watt)' },
      { symbol: 'V', meaningBengali: 'বিভবপ্রভেদ (Voltage)', unit: 'V' },
      { symbol: 'I', meaningBengali: 'তড়িৎপ্রবাহ (Current)', unit: 'A' },
    ],
    siUnit: 'ওয়াট (Watt, W)',
    exampleProblem: {
      questionBengali: '২২০ V লাইনে যুক্ত একটি বাল্বের মধ্য দিয়ে ০.৫ A বিদ্যুৎ প্রবাহিত হলে বাল্বটির ক্ষমতা কত?',
      given: 'V = 220 V, I = 0.5 A',
      solution: 'P = V × I = 220 × 0.5 = 110 W',
    },
    variables: [
      { symbol: 'V', nameBengali: 'ভোল্টেজ (V)', nameEnglish: 'Voltage', unit: 'V', defaultValue: 220, min: 1, max: 440, step: 5 },
      { symbol: 'I', nameBengali: 'তড়িৎপ্রবাহ (I)', nameEnglish: 'Current', unit: 'A', defaultValue: 0.5, min: 0.05, max: 30, step: 0.05 },
    ],
    calculate: (inputs) => {
      const V = inputs.V ?? 220;
      const I = inputs.I ?? 1;
      const P = V * I;
      return {
        result: Math.round(P * 100) / 100,
        unit: 'W',
        steps: [
          `১. সূত্র: P = V × I`,
          `২. মান বসানো: P = ${V} V × ${I} A`,
          `৩. গণনা: P = ${Math.round(P * 100) / 100} W`,
        ],
      };
    },
  },
  {
    id: 'f-h-i2rt',
    formula: 'H = I²Rt',
    nameBengali: "জুলের তাপীয় ফল সূত্র (উৎপন্ন তাপ)",
    nameEnglish: "Joule's Law of Heating",
    chapterId: 'ch10-electricity',
    classLevel: 'class-10',
    resultSymbol: 'H',
    resultUnit: 'J',
    symbolMeanings: [
      { symbol: 'H', meaningBengali: 'উৎপন্ন তাপ শক্তি (Heat Energy)', unit: 'J (Joule)' },
      { symbol: 'I', meaningBengali: 'তড়িৎপ্রবাহ', unit: 'A' },
      { symbol: 'R', meaningBengali: 'রোধ', unit: 'Ω' },
      { symbol: 't', meaningBengali: 'সময়', unit: 's' },
    ],
    siUnit: 'জুল (Joule, J) অথবা ক্যালোরি (যদি ৪.২ দিয়ে ভাগ করা হয়)',
    exampleProblem: {
      questionBengali: '৫ Ω রোধের একটি পরিবাহীতে ২ A কারেন্ট ১০ সেকেন্ড চললে কত জুল তাপ উৎপন্ন হবে?',
      given: 'I = 2 A, R = 5 Ω, t = 10 s',
      solution: 'H = I² × R × t = (2)² × 5 × 10 = 4 × 50 = 200 J',
    },
    variables: [
      { symbol: 'I', nameBengali: 'কারেন্ট (I)', nameEnglish: 'Current', unit: 'A', defaultValue: 2, min: 0.1, max: 15, step: 0.1 },
      { symbol: 'R', nameBengali: 'রোধ (R)', nameEnglish: 'Resistance', unit: 'Ω', defaultValue: 5, min: 1, max: 100, step: 1 },
      { symbol: 't', nameBengali: 'সময় (t)', nameEnglish: 'Time', unit: 's', defaultValue: 10, min: 1, max: 120, step: 1 },
    ],
    calculate: (inputs) => {
      const I = inputs.I ?? 1;
      const R = inputs.R ?? 1;
      const t = inputs.t ?? 1;
      const H = I * I * R * t;
      return {
        result: Math.round(H * 100) / 100,
        unit: 'J',
        steps: [
          `১. সূত্র: H = I² × R × t`,
          `২. মান বসানো: H = (${I})² × ${R} × ${t}`,
          `৩. গণনা: H = ${I * I} × ${R} × ${t} = ${Math.round(H * 100) / 100} J`,
        ],
      };
    },
  },
  // --- Class 10: Light & Optics ---
  {
    id: 'f-mirror-formula',
    formula: '1/f = 1/v + 1/u',
    nameBengali: 'গোলীয় দর্পণের সাধারণ সমীকরণ',
    nameEnglish: 'Mirror Formula',
    chapterId: 'ch10-light-reflection',
    classLevel: 'class-10',
    resultSymbol: 'v',
    resultUnit: 'cm',
    symbolMeanings: [
      { symbol: 'f', meaningBengali: 'ফোকাস দূরত্ব (Focal length)', unit: 'cm' },
      { symbol: 'v', meaningBengali: 'প্রতিবিম্ব দূরত্ব (Image distance)', unit: 'cm' },
      { symbol: 'u', meaningBengali: 'বস্তু দূরত্ব (Object distance)', unit: 'cm' },
    ],
    siUnit: 'মিটার (m) বা সেন্টিমিটার (cm)',
    exampleProblem: {
      questionBengali: 'একটি অবতল দর্পণের ফোকাস দূরত্ব -১০ cm। বস্তুটিকে দর্পণ থেকে -১৫ cm দূরে রাখলে প্রতিবিম্ব কোথায় তৈরি হবে?',
      given: 'f = -10 cm, u = -15 cm',
      solution: '1/v = 1/f - 1/u = -1/10 - (-1/15) = -1/10 + 1/15 = -1/30 ⇒ v = -30 cm (সদ প্রতিবিম্ব)',
    },
    variables: [
      { symbol: 'f', nameBengali: 'ফোকাস দূরত্ব (f)', nameEnglish: 'Focal length', unit: 'cm', defaultValue: -10, min: -50, max: 50, step: 1 },
      { symbol: 'u', nameBengali: 'বস্তু দূরত্ব (u)', nameEnglish: 'Object distance', unit: 'cm', defaultValue: -15, min: -100, max: -2, step: 1 },
    ],
    calculate: (inputs) => {
      const f = inputs.f ?? -10;
      const u = inputs.u ?? -15;
      // 1/v = 1/f - 1/u
      const invV = 1 / f - 1 / u;
      if (Math.abs(invV) < 0.0001) {
        return {
          result: Infinity,
          unit: 'cm (অসীম দূরত্বে)',
          steps: [`১. 1/v = 1/f - 1/u`, `২. 1/v ≈ 0`, `৩. প্রতিবিম্ব অসীমে গঠিত হবে।`],
        };
      }
      const v = 1 / invV;
      return {
        result: Math.round(v * 100) / 100,
        unit: 'cm',
        steps: [
          `১. সূত্র: 1/f = 1/v + 1/u ⇒ 1/v = 1/f - 1/u`,
          `২. মান বসানো: 1/v = (1 / ${f}) - (1 / ${u})`,
          `৩. হিসাব: v = ${Math.round(v * 100) / 100} cm`,
          v < 0 ? '৪. ঋণাত্মক চিহ্ন নির্দেশ করে প্রতিবিম্বটি সদ ও দর্পণের সামনে অবস্থিত।' : '৪. ধনাত্মক চিহ্ন নির্দেশ করে প্রতিবিম্বটি অসদ ও দর্পণের পেছনে অবস্থিত।',
        ],
      };
    },
  },
  {
    id: 'f-snell-law',
    formula: 'μ = sin(i) / sin(r)',
    nameBengali: 'স্নেলের সূত্র (প্রতিসরাঙ্ক)',
    nameEnglish: "Snell's Law (Refractive Index)",
    chapterId: 'ch10-light-refraction',
    classLevel: 'class-10',
    resultSymbol: 'μ',
    resultUnit: '(এককহীন)',
    symbolMeanings: [
      { symbol: 'μ', meaningBengali: 'প্রতিসরাঙ্ক (Refractive Index)', unit: 'একক নেই' },
      { symbol: 'i', meaningBengali: 'আপতন কোণ (Angle of incidence)', unit: 'ডিগ্রি (°)' },
      { symbol: 'r', meaningBengali: 'প্রতিসরণ কোণ (Angle of refraction)', unit: 'ডিগ্রি (°)' },
    ],
    siUnit: 'এককহীন বিশুদ্ধ সংখ্যা',
    exampleProblem: {
      questionBengali: 'আলো বায়ু থেকে একটি মাধ্যমে প্রবেশের সময় আপতন কোণ ৪৫° এবং প্রতিসরণ কোণ ৩০° হলে মাধ্যমটির প্রতিসরাঙ্ক কত?',
      given: 'i = 45°, r = 30°',
      solution: 'μ = sin(45°) / sin(30°) = (1/√2) / (1/2) = √2 ≈ 1.414',
    },
    variables: [
      { symbol: 'i', nameBengali: 'আপতন কোণ (i)', nameEnglish: 'Angle of incidence', unit: '°', defaultValue: 45, min: 1, max: 89, step: 1 },
      { symbol: 'r', nameBengali: 'প্রতিসরণ কোণ (r)', nameEnglish: 'Angle of refraction', unit: '°', defaultValue: 30, min: 1, max: 89, step: 1 },
    ],
    calculate: (inputs) => {
      const iDeg = inputs.i ?? 45;
      const rDeg = inputs.r ?? 30;
      const iRad = (iDeg * Math.PI) / 180;
      const rRad = (rDeg * Math.PI) / 180;
      const mu = Math.sin(iRad) / Math.sin(rRad);
      return {
        result: Math.round(mu * 1000) / 1000,
        unit: '',
        steps: [
          `১. সূত্র: μ = sin(i) / sin(r)`,
          `২. মান বসানো: μ = sin(${iDeg}°) / sin(${rDeg}°)`,
          `৩. sin(${iDeg}°) = ${Math.round(Math.sin(iRad) * 1000) / 1000}, sin(${rDeg}°) = ${Math.round(Math.sin(rRad) * 1000) / 1000}`,
          `৪. প্রতিসরাঙ্ক μ = ${Math.round(mu * 1000) / 1000}`,
        ],
      };
    },
  },
];
