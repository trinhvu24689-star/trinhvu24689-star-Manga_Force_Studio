import React from 'react';
import { ComicProject, Panel, Language } from '../types';
import { translations } from '../translations';
import { generatePanelImage } from '../services/geminiService';
import { RefreshCw, Image as ImageIcon, PlayCircle, Zap } from 'lucide-react';

interface StoryboardProps {
  project: ComicProject;
  updateProject: (updates: Partial<ComicProject>) => void;
  lang: Language;
  consumeCurrency: (cost: number) => boolean;
}

const Storyboard: React.FC<StoryboardProps> = ({ project, updateProject, lang, consumeCurrency }) => {
  const t = translations[lang].storyboard;
  const PANEL_COST = 30;

  const handleGeneratePanel = async (panelId: string) => {
    // Check cost first
    if (!consumeCurrency(PANEL_COST)) return;

    // Set loading state
    const newPanels = project.panels.map(p => 
      p.id === panelId ? { ...p, isGenerating: true } : p
    );
    updateProject({ panels: newPanels });

    const panel = project.panels.find(p => p.id === panelId);
    if (!panel) return;

    try {
      const imageUrl = await generatePanelImage(panel, project.style, project.characters);
      
      const completedPanels = project.panels.map(p => 
        p.id === panelId ? { ...p, imageUrl, isGenerating: false } : p
      );
      updateProject({ panels: completedPanels });
    } catch (e) {
      const errorPanels = project.panels.map(p => 
        p.id === panelId ? { ...p, isGenerating: false } : p
      );
      updateProject({ panels: errorPanels });
      alert("Failed to generate panel image.");
    }
  };

  const handleGenerateAll = async () => {
    // Note: In a real app, calculate total cost first. 
    // Here we just iterate and consume per panel to keep it simple.
    
    for (const panel of project.panels) {
      if (!panel.imageUrl) {
        // Check if user still has currency for this iteration
        await handleGeneratePanel(panel.id);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gray-900/60 backdrop-blur z-20 sticky top-0">
        <div>
           <h2 className="text-2xl font-black text-white flex items-center gap-2">
               <Zap className="text-yellow-400 fill-yellow-400" />
               <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">{t.title}</span>
           </h2>
           <p className="text-sm text-gray-400 font-medium">{t.subtitle}</p>
        </div>
        <button 
          onClick={handleGenerateAll}
          className="group relative overflow-hidden rounded-xl bg-gray-800 text-white px-6 py-3 font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600 opacity-20 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 flex items-center gap-2">
                <PlayCircle size={20} className="group-hover:text-black transition-colors" />
                <span className="group-hover:text-black transition-colors">{t.btnRenderAll}</span>
            </div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto pb-20">
          {project.panels.map((panel, idx) => (
            <div key={panel.id} className="flex flex-col gap-4 group">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-gray-400 font-black text-sm tracking-[0.2em] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]"></span>
                    {t.panel} {idx + 1}
                </h3>
                <button 
                  onClick={() => handleGeneratePanel(panel.id)}
                  disabled={panel.isGenerating}
                  className="text-xs text-yellow-500 hover:text-yellow-300 flex items-center gap-2 uppercase font-bold tracking-widest border border-yellow-500/30 px-3 py-1 rounded hover:bg-yellow-500/10 transition-colors"
                >
                  <RefreshCw size={12} className={panel.isGenerating ? "animate-spin" : ""} />
                  {panel.imageUrl ? t.regenerate : t.generate}
                </button>
              </div>

              <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative transition-transform duration-500 group-hover:-translate-y-1">
                {/* Glow behind */}
                <div className="absolute -inset-1 bg-gradient-to-b from-yellow-500/20 to-transparent blur-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                {/* Image Area */}
                <div 
                  className={`w-full relative bg-black flex items-center justify-center z-10`}
                  style={{ aspectRatio: panel.aspectRatio.replace(':', '/') }}
                >
                  {panel.isGenerating ? (
                    <div className="flex flex-col items-center gap-4 text-yellow-500">
                      <div className="w-12 h-12 border-4 border-yellow-500/30 border-t-yellow-400 rounded-full animate-spin"></div>
                      <span className="text-xs font-mono font-bold animate-pulse tracking-widest">{t.rendering}</span>
                    </div>
                  ) : panel.imageUrl ? (
                     <img src={panel.imageUrl} alt="Panel" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-gray-800">
                      <ImageIcon size={64} />
                      <span className="text-sm font-black tracking-widest text-gray-800">{t.awaiting}</span>
                    </div>
                  )}
                </div>

                {/* Info Area */}
                <div className="p-5 border-t border-white/5 bg-gray-900/90 relative z-10">
                  <p className="text-[10px] text-gray-500 mb-2 font-bold tracking-widest uppercase">{t.description}</p>
                  <p className="text-sm text-gray-300 mb-6 leading-relaxed border-l-2 border-gray-700 pl-3">{panel.description}</p>
                  
                  <p className="text-[10px] text-gray-500 mb-2 font-bold tracking-widest uppercase">{t.dialogue}</p>
                  <div className="bg-black/40 p-4 rounded-lg border border-white/5 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-orange-500"></div>
                    <p className="text-sm text-white italic font-medium">"{panel.dialogue}"</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Storyboard;