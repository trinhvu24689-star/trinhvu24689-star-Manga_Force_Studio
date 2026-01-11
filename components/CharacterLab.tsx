import React, { useState } from 'react';
import { ComicProject, Character, Language } from '../types';
import { translations } from '../translations';
import { generateCharacterConcept } from '../services/geminiService';
import { UserPlus, Sparkles, X, Palette, ChevronDown, ChevronUp } from 'lucide-react';

interface CharacterLabProps {
  project: ComicProject;
  updateProject: (updates: Partial<ComicProject>) => void;
  lang: Language;
  consumeCurrency: (cost: number) => boolean;
}

const CharacterLab: React.FC<CharacterLabProps> = ({ project, updateProject, lang, consumeCurrency }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInputMobile, setShowInputMobile] = useState(false);
  const t = translations[lang].character;
  const CHARACTER_COST = 20;

  const handleCreate = async () => {
    if (!name || !desc) return;
    if (!consumeCurrency(CHARACTER_COST)) return;

    setIsGenerating(true);
    setShowInputMobile(false);

    try {
      const imageUrl = await generateCharacterConcept(name, desc, project.style);
      
      const newChar: Character = {
        id: crypto.randomUUID(),
        name,
        description: desc,
        imageUrl
      };

      updateProject({ characters: [...project.characters, newChar] });
      setName('');
      setDesc('');
    } catch (e) {
      alert("Failed to generate character image.");
    } finally {
      setIsGenerating(false);
    }
  };

  const removeCharacter = (id: string) => {
    updateProject({ characters: project.characters.filter(c => c.id !== id) });
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Mobile Input Toggle */}
      <div 
        className="lg:hidden p-4 bg-gray-900 border-b border-white/10 flex items-center justify-between cursor-pointer"
        onClick={() => setShowInputMobile(!showInputMobile)}
      >
        <span className="font-bold text-white flex items-center gap-2">
            <UserPlus size={16} className="text-green-400" />
            {t.title}
        </span>
        {showInputMobile ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      <div className={`
          w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-white/5 
          bg-gray-900/50 backdrop-blur-sm z-30
          flex-shrink-0 transition-all duration-300 ease-in-out
          ${showInputMobile ? 'max-h-[60vh] opacity-100 overflow-y-auto' : 'max-h-0 lg:max-h-full opacity-0 lg:opacity-100 overflow-hidden lg:overflow-y-auto'}
      `}>
        <div className="p-6">
            <h2 className="hidden lg:flex text-xl font-black mb-8 text-white items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
                <UserPlus size={20} className="text-green-400" />
            </div>
            {t.title}
            </h2>
            
            <div className="space-y-5">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.lblName}</label>
                <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all placeholder-gray-600"
                placeholder={t.placeholderName}
                />
            </div>
            
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.lblTraits}</label>
                <textarea 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full h-40 bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] resize-none text-sm placeholder-gray-600"
                placeholder={t.placeholderTraits}
                />
            </div>

            <button
                onClick={handleCreate}
                disabled={isGenerating || !name || !desc}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all relative overflow-hidden group ${
                isGenerating ? 'bg-gray-800' : 'text-black'
                }`}
            >
                {!(isGenerating || !name || !desc) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 group-hover:opacity-90"></div>
                )}
                {/* Fallback gray bg for disabled */}
                {(isGenerating || !name || !desc) && (
                    <div className="absolute inset-0 bg-gray-800"></div>
                )}
                
                <div className={`relative z-10 flex items-center gap-2 ${isGenerating || !name || !desc ? 'text-gray-500' : 'text-gray-900'}`}>
                    {isGenerating ? (
                    <span className="animate-spin">⌛</span>
                    ) : (
                    <Sparkles size={18} />
                    )}
                    <span>{t.btnGenerate}</span>
                </div>
            </button>
            </div>
        </div>
      </div>

      <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <h2 className="text-2xl lg:text-3xl font-black text-white mb-6 lg:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-500 inline-block">
            {t.galleryTitle}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8 pb-20">
          {project.characters.map((char) => (
            <div key={char.id} className="group relative">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                
                <div className="relative bg-gray-900 border border-white/10 rounded-xl overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-[3/4] bg-black/50 overflow-hidden">
                        {char.imageUrl ? (
                        <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700">
                            <Palette size={40} />
                        </div>
                        )}
                        <div className="absolute top-2 right-2 z-10">
                        <button onClick={() => removeCharacter(char.id)} className="bg-black/60 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur transition-colors">
                            <X size={14} />
                        </button>
                        </div>
                    </div>
                    <div className="p-4 lg:p-5 flex-1 flex flex-col bg-gradient-to-b from-gray-900 to-black">
                        <h3 className="font-bold text-white text-lg mb-2">{char.name}</h3>
                        <p className="text-gray-400 text-xs leading-relaxed line-clamp-4">{char.description}</p>
                    </div>
                </div>
            </div>
          ))}
          
          {project.characters.length === 0 && (
             <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-600 border-2 border-dashed border-gray-800 rounded-2xl">
                <p>{t.emptyGallery}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterLab;