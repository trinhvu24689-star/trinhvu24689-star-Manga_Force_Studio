import React, { useState } from 'react';
import { translations } from '../translations';
import { Language, ComicProject } from '../types';
import { generateFullStory } from '../services/geminiService';
import { Zap, Sparkles, PenTool, Globe, Gem } from 'lucide-react';

interface DashboardProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onStartManual: () => void;
  onStartAuto: (project: ComicProject) => void;
  consumeCurrency: (cost: number) => boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ lang, setLang, onStartManual, onStartAuto, consumeCurrency }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const t = translations[lang].dashboard;
  const commonT = translations[lang].common;
  const AUTO_GEN_COST = 50;

  const handleAutoCreate = async () => {
    if (!topic) return;
    
    // Check balance
    if (!consumeCurrency(AUTO_GEN_COST)) return;

    setIsGenerating(true);
    try {
      const project = await generateFullStory(topic, lang);
      onStartAuto(project);
    } catch (e) {
      console.error(e);
      alert("Something went wrong with the AI magic. Try again?");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center relative font-sans text-white overflow-y-auto py-12 lg:py-0">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/30 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-900/30 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[40%] h-[40%] bg-pink-900/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="z-10 w-full max-w-4xl px-4 sm:px-6 flex flex-col items-center text-center">
        
        {/* Language Toggle */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
             <button 
                onClick={() => setLang(lang === 'en' ? 'vi' : 'en')}
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors backdrop-blur-md"
              >
                 <Globe size={16} className="text-pink-500" />
                 <span className="text-sm font-medium">{lang === 'en' ? 'English' : 'Tiếng Việt'}</span>
             </button>
        </div>

        {/* Hero */}
        <div className="mb-8 lg:mb-12 group mt-8 lg:mt-0">
          <div className="flex justify-center mb-6">
             <div className="relative">
                <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <Zap size={64} className="sm:w-20 sm:h-20 text-yellow-400 fill-yellow-400 relative z-10 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" />
             </div>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500 animate-gradient-x">
             MangaForge
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 font-light tracking-wide px-4">
             {t.subtitle}
          </p>
        </div>

        {/* Main Interaction Area */}
        <div className="w-full bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            
            {/* Input Section */}
            <div className="space-y-4 mb-8 sm:mb-10">
               <label className="block text-lg font-bold text-gray-300">{t.inputLabel}</label>
               <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={t.inputPlaceholder}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 sm:p-6 text-lg sm:text-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all text-center"
               />
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 justify-center items-center">
                
                {/* Auto Button */}
                <button
                   onClick={handleAutoCreate}
                   disabled={!topic || isGenerating}
                   className={`w-full md:w-auto min-w-[200px] sm:min-w-[280px] py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all relative overflow-hidden group ${
                      !topic || isGenerating ? 'opacity-50 cursor-not-allowed bg-gray-800' : 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105'
                   }`}
                >
                   {isGenerating ? (
                      <>
                        <span className="animate-spin text-xl sm:text-2xl">✨</span>
                        <span>{t.generating}</span>
                      </>
                   ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Sparkles size={20} className="relative z-10 text-purple-600 sm:w-6 sm:h-6" />
                        <span className="relative z-10 flex items-center gap-2">
                            {t.btnAuto} 
                            <span className="text-xs bg-black/20 px-1.5 rounded flex items-center gap-0.5">
                                {AUTO_GEN_COST} <Gem size={10} />
                            </span>
                        </span>
                      </>
                   )}
                </button>

                <div className="text-gray-500 font-bold text-sm tracking-widest">{t.or}</div>

                {/* Manual Button */}
                <button
                   onClick={onStartManual}
                   disabled={isGenerating}
                   className="w-full md:w-auto min-w-[200px] sm:min-w-[240px] py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 bg-transparent border border-white/20 hover:bg-white/5 hover:border-white/40 transition-all text-gray-300 hover:text-white"
                >
                   <PenTool size={20} className="sm:w-5 sm:h-5" />
                   <span>{t.btnManual}</span>
                </button>
            </div>

            {/* Tip */}
            <p className="mt-8 text-xs sm:text-sm text-gray-500 font-medium px-4">
               <span className="text-cyan-400">*</span> {t.tip}
            </p>
        </div>

        <div className="mt-8 text-[10px] sm:text-xs text-gray-600 uppercase tracking-widest">
           {commonT.poweredBy}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;