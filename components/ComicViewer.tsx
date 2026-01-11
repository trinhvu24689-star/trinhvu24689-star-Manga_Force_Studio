import React from 'react';
import { ComicProject, Language } from '../types';
import { translations } from '../translations';

interface ComicViewerProps {
  project: ComicProject;
  lang: Language;
}

const ComicViewer: React.FC<ComicViewerProps> = ({ project, lang }) => {
  const t = translations[lang].viewer;

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-8">
        
        {/* Title Page */}
        <div className="text-center mb-24 relative">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600 mb-4 tracking-tighter uppercase font-sans drop-shadow-sm">
            {project.title || "UNTITLED"}
          </h1>
          <p className="text-xl text-gray-500 font-bold tracking-[0.3em] uppercase mb-8">{project.genre} <span className="text-pink-500 px-2">•</span> {project.style}</p>
          <div className="w-24 h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        {/* Comic Strip Layout */}
        <div className="flex flex-col gap-12 bg-white p-4 md:p-12 shadow-2xl min-h-[800px] border-t-8 border-gray-900">
          
          {project.panels.map((panel, idx) => (
            <div key={panel.id} className="flex flex-col gap-2">
              <div className="relative border-[6px] border-black bg-gray-100 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] group hover:shadow-[16px_16px_0px_0px_rgba(236,72,153,1)] transition-all duration-300">
                {panel.imageUrl ? (
                   <img src={panel.imageUrl} alt={`Panel ${idx+1}`} className="w-full h-auto block grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />
                ) : (
                   <div className="aspect-video flex items-center justify-center text-gray-300 bg-gray-100 pattern-grid-lg">
                     <span className="font-black text-4xl uppercase tracking-tighter opacity-20">{t.missing} {idx + 1}</span>
                   </div>
                )}
                
                {/* Dialogue Overlay Bubble Style - Basic Implementation */}
                {panel.dialogue && panel.imageUrl && (
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="bg-white border-[3px] border-black p-5 rounded-[2rem] rounded-bl-none inline-block shadow-lg max-w-[85%] relative">
                      <p className="font-comic text-black text-lg md:text-xl leading-tight font-bold">
                        {panel.dialogue}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Fallback dialogue if no image generated yet or preferring standard script below */}
              {!panel.imageUrl && (
                 <p className="text-gray-400 font-mono text-xs mt-2 border-l-4 border-pink-500 pl-3 py-1 bg-gray-50">{panel.dialogue}</p>
              )}
            </div>
          ))}

          {project.panels.length === 0 && (
             <div className="text-center py-32 text-gray-400">
                <p className="font-bold text-xl">{t.empty}</p>
             </div>
          )}

          <div className="mt-20 flex justify-center opacity-30">
             <span className="text-2xl font-black uppercase tracking-[0.5em] text-black">{t.end}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ComicViewer;
