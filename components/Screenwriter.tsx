import React, { useState } from 'react';
import { ComicProject, Panel, AspectRatio, Language } from '../types';
import { translations } from '../translations';
import { generateComicScript } from '../services/geminiService';
import { Wand2, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface ScreenwriterProps {
  project: ComicProject;
  updateProject: (updates: Partial<ComicProject>) => void;
  lang: Language;
  consumeCurrency: (cost: number) => boolean;
}

const Screenwriter: React.FC<ScreenwriterProps> = ({ project, updateProject, lang, consumeCurrency }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfigMobile, setShowConfigMobile] = useState(false);
  const t = translations[lang].screenwriter;
  const SCRIPT_COST = 10;

  const handleGenerateScript = async () => {
    if (!project.premise) return;
    
    if (!consumeCurrency(SCRIPT_COST)) return;

    setIsGenerating(true);
    // On mobile, collapse config after generating
    setShowConfigMobile(false);
    
    try {
      const newPanels = await generateComicScript(
        project.title,
        project.genre,
        project.premise,
        project.characters,
        lang
      );
      
      const formattedPanels: Panel[] = newPanels.map((p) => ({
        id: crypto.randomUUID(),
        panelNumber: p.panelNumber || 1,
        description: p.description || "",
        dialogue: p.dialogue || "",
        aspectRatio: p.aspectRatio || AspectRatio.Square,
        charactersInvolved: []
      }));

      updateProject({ panels: formattedPanels });
    } catch (err) {
      console.error(err);
      alert("Failed to generate script. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddPanel = () => {
    const newPanel: Panel = {
      id: crypto.randomUUID(),
      panelNumber: project.panels.length + 1,
      description: "",
      dialogue: "",
      aspectRatio: AspectRatio.Square,
      charactersInvolved: []
    };
    updateProject({ panels: [...project.panels, newPanel] });
  };

  const updatePanel = (id: string, field: keyof Panel, value: any) => {
    const updatedPanels = project.panels.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    );
    updateProject({ panels: updatedPanels });
  };

  const removePanel = (id: string) => {
    updateProject({ panels: project.panels.filter(p => p.id !== id) });
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Mobile Config Toggle (Only visible on small screens) */}
      <div 
        className="lg:hidden p-4 bg-gray-900 border-b border-white/10 flex items-center justify-between cursor-pointer"
        onClick={() => setShowConfigMobile(!showConfigMobile)}
      >
        <span className="font-bold text-white flex items-center gap-2">
            <Wand2 size={16} className="text-pink-500" />
            {t.title}
        </span>
        {showConfigMobile ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {/* Configuration Sidebar */}
      <div className={`
          w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-white/5 
          bg-gray-900/50 backdrop-blur-sm z-30
          flex-shrink-0 transition-all duration-300 ease-in-out
          ${showConfigMobile ? 'max-h-[60vh] opacity-100 overflow-y-auto' : 'max-h-0 lg:max-h-full opacity-0 lg:opacity-100 overflow-hidden lg:overflow-y-auto'}
      `}>
        <div className="p-6">
            <h2 className="hidden lg:block text-2xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                {t.title}
            </h2>
            
            <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.lblTitle}</label>
                <input 
                type="text" 
                value={project.title}
                onChange={(e) => updateProject({ title: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-pink-500 focus:shadow-[0_0_15px_rgba(236,72,153,0.3)] outline-none transition-all placeholder-gray-600"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.lblGenre}</label>
                <select 
                value={project.genre}
                onChange={(e) => updateProject({ genre: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-pink-500 outline-none appearance-none"
                >
                <option>Sci-Fi</option>
                <option>Fantasy</option>
                <option>Noir</option>
                <option>Superhero</option>
                <option>Slice of Life</option>
                <option>Horror</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.lblStyle}</label>
                <input 
                type="text" 
                value={project.style}
                onChange={(e) => updateProject({ style: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] outline-none transition-all placeholder-gray-600"
                placeholder={t.placeholderStyle}
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.lblPremise}</label>
                <textarea 
                value={project.premise}
                onChange={(e) => updateProject({ premise: e.target.value })}
                className="w-full h-32 lg:h-40 bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] outline-none resize-none placeholder-gray-600"
                placeholder={t.placeholderPremise}
                />
            </div>

            <button
                onClick={handleGenerateScript}
                disabled={isGenerating || !project.premise}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all duration-300 relative overflow-hidden group ${
                isGenerating || !project.premise
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'text-white shadow-lg'
                }`}
            >
                {!(isGenerating || !project.premise) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 group-hover:opacity-90 transition-opacity"></div>
                )}
                
                <div className="relative z-10 flex items-center gap-2">
                    {isGenerating ? (
                    <span className="animate-pulse">{t.generating}</span>
                    ) : (
                    <>
                        <Wand2 size={18} />
                        <span>{t.btnGenerate}</span>
                    </>
                    )}
                </div>
            </button>
            </div>
        </div>
      </div>

      {/* Script Editor */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6 sticky top-0 z-20 py-4 bg-gray-950/90 backdrop-blur">
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">{t.editorTitle}</h2>
            <button 
              onClick={handleAddPanel}
              className="group flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm font-bold transition-all hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <Plus size={16} className="text-cyan-400" />
              <span className="hidden sm:inline">{t.btnAddPanel}</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

          <div className="space-y-6 pb-20">
            {project.panels.map((panel, index) => (
              <div key={panel.id} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="bg-gray-900 border border-white/10 rounded-xl p-4 lg:p-6 relative">
                    <div className="absolute top-4 right-4 z-10">
                    <button onClick={() => removePanel(panel.id)} className="text-gray-500 hover:text-red-500 p-2 hover:bg-white/5 rounded-full transition-colors">
                        <Trash2 size={18} />
                    </button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start gap-5">
                    <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-cyan-400 font-black text-lg border border-white/10 shadow-inner">
                        {index + 1}
                    </div>
                    
                    <div className="flex-1 space-y-5 w-full">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-pink-400 uppercase tracking-wider">{t.visualDesc}</label>
                            <textarea
                                value={panel.description}
                                onChange={(e) => updatePanel(panel.id, 'description', e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 lg:p-4 text-gray-200 focus:border-pink-500/50 outline-none text-sm leading-relaxed min-h-[100px]"
                                placeholder={t.placeholderDesc}
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider">{t.dialogue}</label>
                                <textarea
                                value={panel.dialogue}
                                onChange={(e) => updatePanel(panel.id, 'dialogue', e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 lg:p-4 text-gray-200 focus:border-cyan-500/50 outline-none text-sm min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-yellow-400 uppercase tracking-wider">{t.aspectRatio}</label>
                                <div className="relative">
                                    <select
                                        value={panel.aspectRatio}
                                        onChange={(e) => updatePanel(panel.id, 'aspectRatio', e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 lg:p-4 text-gray-200 focus:border-yellow-500/50 outline-none text-sm appearance-none cursor-pointer"
                                    >
                                        {Object.values(AspectRatio).map(ratio => (
                                        <option key={ratio} value={ratio}>{ratio}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
              </div>
            ))}

            {project.panels.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 lg:py-32 text-gray-600 border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/30">
                <Wand2 size={48} className="text-gray-700 mb-4" />
                <p className="text-lg font-medium text-center px-4">{t.emptyState}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screenwriter;