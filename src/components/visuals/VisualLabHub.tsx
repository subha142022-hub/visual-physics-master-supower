import React, { useState } from 'react';
import { MotionLab } from './MotionLab';
import { NewtonLab } from './NewtonLab';
import { GravitationEnergyLab } from './GravitationEnergyLab';
import { SoundWaveLab } from './SoundWaveLab';
import { OpticsLab } from './OpticsLab';
import { CircuitLab } from './CircuitLab';
import { LabType } from '../../types/physics';
import { Activity, ShieldAlert, Orbit, Volume2, Sun, Zap } from 'lucide-react';

interface VisualLabHubProps {
  initialLab?: LabType;
}

export const VisualLabHub: React.FC<VisualLabHubProps> = ({ initialLab = 'motion' }) => {
  const [selectedLab, setSelectedLab] = useState<LabType>(initialLab);

  const labsList: {
    id: LabType;
    titleBengali: string;
    classLevel: string;
    icon: React.ComponentType<{ className?: string }>;
    descBengali: string;
  }[] = [
    {
      id: 'motion',
      titleBengali: 'গতি ও গ্রাফ ল্যাব',
      classLevel: 'Class 9',
      icon: Activity,
      descBengali: 'গাড়ির গতিবেগ, ত্বরণ, s-t এবং v-t লেখচিত্রের লাইভ অঙ্কন।',
    },
    {
      id: 'newton-laws',
      titleBengali: 'নিউটনের গতিসূত্র ও বল',
      classLevel: 'Class 9',
      icon: ShieldAlert,
      descBengali: 'ভর ও বলের সম্পর্ক ($F=ma$), ঘর্ষণ এবং ক্রিয়া-প্রতিক্রিয়া।',
    },
    {
      id: 'gravitation-energy',
      titleBengali: 'মহাকর্ষ ও শক্তির নিত্যতা',
      classLevel: 'Class 9',
      icon: Orbit,
      descBengali: 'মুক্ত পতনে স্থিতিশক্তি ও গতিশক্তির সংরক্ষণ এবং আকর্ষণ বল।',
    },
    {
      id: 'sound-waves',
      titleBengali: 'শব্দ ও প্রতিধ্বনি ল্যাব',
      classLevel: 'Class 9',
      icon: Volume2,
      descBengali: 'অনুদৈর্ঘ্য তরঙ্গ, ঘনীভবন-তনুভবন এবং স্পষ্ট প্রতিধ্বনি পরীক্ষা।',
    },
    {
      id: 'light-optics',
      titleBengali: 'দর্পণ ও লেন্স রশ্মি চিত্র',
      classLevel: 'Class 10',
      icon: Sun,
      descBengali: 'অবতল-উত্তল দর্পণ ও লেন্সের বাস্তব রশ্মি চিত্র ও প্রতিবিম্ব গঠন।',
    },
    {
      id: 'circuits',
      titleBengali: 'ইলেকট্রিক সার্কিট ল্যাব',
      classLevel: 'Class 10',
      icon: Zap,
      descBengali: 'ওহমের সূত্র, বাল্ব, ব্যাটারি এবং শ্রেণি ও সমান্তরাল সমবায়।',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Visual Lab Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
            ইন্টারেক্টিভ ভিজুয়াল পদার্থবিজ্ঞান ল্যাবরেটরি
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ছবি ও অ্যানিমেশনে পদার্থবিজ্ঞান পরীক্ষা
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {labsList.map((lab) => {
            const Icon = lab.icon;
            const isSelected = selectedLab === lab.id;
            return (
              <button
                key={lab.id}
                onClick={() => setSelectedLab(lab.id)}
                className={`p-3 rounded-xl text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-sky-600 border-transparent shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-400' : 'text-sky-600 dark:text-sky-400'}`} />
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {lab.classLevel}
                  </span>
                </div>
                <div className="text-xs font-bold leading-snug line-clamp-1">
                  {lab.titleBengali}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Lab Component */}
      <div>
        {selectedLab === 'motion' && <MotionLab />}
        {selectedLab === 'newton-laws' && <NewtonLab />}
        {selectedLab === 'gravitation-energy' && <GravitationEnergyLab />}
        {selectedLab === 'sound-waves' && <SoundWaveLab />}
        {selectedLab === 'light-optics' && <OpticsLab />}
        {selectedLab === 'circuits' && <CircuitLab />}
      </div>
    </div>
  );
};
