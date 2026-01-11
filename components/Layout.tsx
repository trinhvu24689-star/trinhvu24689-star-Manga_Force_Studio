import React from 'react';
import { AppMode, Language, UserProfile } from '../types';
import { translations } from '../translations';
import { BookOpen, PenTool, Image as ImageIcon, Layers, Zap, Globe, Home, ShoppingBag, Gem, Shield, Lock } from 'lucide-react';

interface LayoutProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  goHome: () => void;
  user: UserProfile;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentMode, setMode, lang, setLang, goHome, user, children }) => {
  const t = translations[lang];
  const isAdmin = user.plan.id === 99;

  const navItems = [
    { mode: AppMode.Screenwriter, label: t.modes.screenwriter, icon: <PenTool size={20} /> },
    { mode: AppMode.CharacterDesign, label: t.modes.characterLab, icon: <BookOpen size={20} /> },
    { mode: AppMode.Storyboard, label: t.modes.storyboard, icon: <ImageIcon size={20} /> },
    { mode: AppMode.Preview, label: t.modes.preview, icon: <Layers size={20} /> },
    { mode: AppMode.Shop, label: t.modes.shop, icon: <ShoppingBag size={20} /> },
    { 
      mode: AppMode.AdminGrant, 
      label: t.modes.adminGrant, 
      icon: isAdmin ? <Shield size={20} className="text-red-500" /> : <Lock size={20} className="text-gray-500" /> 
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-black text-gray-100 font-sans selection:bg-pink-500 selection:text-white overflow-hidden">
      
      {/* MOBILE HEADER */}
      <div className="lg:hidden h-16 flex-shrink-0 bg-gray-900/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2" onClick={goHome}>
           <Zap className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" size={24} />
           <span className="font-black text-lg tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500 animate-gradient-x">
              MF
           </span>
        </div>

        {/* Mobile Wallet */}
        <div className="flex items-center gap-3 bg-black/40 px-3 py-1 rounded-full border border-white/10">
            <div className="flex items-center gap-1">
                <Gem size={12} className="text-cyan-400" />
                <span className="text-xs font-bold text-cyan-100">{user.diamonds === Infinity ? '∞' : user.diamonds}</span>
            </div>
            <div className="w-px h-3 bg-white/20"></div>
            <div className="flex items-center gap-1">
                <Gem size={12} className="text-pink-500" />
                <span className="text-xs font-bold text-pink-100">{user.rubies === Infinity ? '∞' : user.rubies}</span>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <button 
                onClick={() => setLang(lang === 'en' ? 'vi' : 'en')}
                className="p-2 rounded-full bg-white/5 border border-white/10"
            >
                <Globe size={18} className="text-pink-500" />
            </button>
            <button 
                onClick={goHome}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400"
            >
                <Home size={18} />
            </button>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:flex w-72 flex-shrink-0 bg-gray-900/40 backdrop-blur-xl border-r border-white/10 flex-col relative z-20">
        
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-start px-6 border-b border-white/5 relative overflow-hidden group cursor-pointer" onClick={goHome}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Zap className="text-yellow-400 mr-3 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" size={28} />
            <span className="font-black text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500 animate-gradient-x">
              {t.appTitle}
            </span>
        </div>
        
        {/* User Stats / Wallet */}
        <div className="p-4 mx-4 mt-4 mb-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-white/10 shadow-lg">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{user.plan.name}</span>
                <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded font-bold">{user.plan.code}</span>
            </div>
            
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-2 bg-black/40 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2">
                        <Gem size={16} className="text-cyan-400" />
                        <span className="text-sm font-medium text-cyan-100">{t.common.diamonds}</span>
                    </div>
                    <span className="font-mono font-bold text-white">{user.diamonds === Infinity ? '∞' : user.diamonds.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-black/40 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2">
                        <Gem size={16} className="text-pink-500" />
                        <span className="text-sm font-medium text-pink-100">{t.common.rubies}</span>
                    </div>
                    <span className="font-mono font-bold text-white">{user.rubies === Infinity ? '∞' : user.rubies.toLocaleString()}</span>
                </div>
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-2 px-2">
          {navItems.map((item) => {
            const isActive = currentMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => setMode(item.mode)}
                className={`group w-full flex items-center justify-start px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? 'bg-white/5 text-white shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500 rounded-full"></div>
                )}
                <span className={`mr-3 relative z-10 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]' : ''}`}>
                    {item.icon}
                </span>
                <span className={`font-bold relative z-10 ${isActive ? 'bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300' : ''}`}>
                    {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/5 bg-black/20 space-y-3">
          <button 
             onClick={goHome}
             className="w-full flex items-center justify-start gap-3 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
             <Home size={18} />
             <span className="text-sm font-bold">{t.common.backHome}</span>
          </button>

          <button 
            onClick={() => setLang(lang === 'en' ? 'vi' : 'en')}
            className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-white/5 group"
          >
             <div className="flex items-center gap-2">
                <Globe size={16} className="text-pink-500 group-hover:animate-spin-slow" />
                <span className="text-sm font-medium">{lang === 'en' ? 'English' : 'Tiếng Việt'}</span>
             </div>
             <span className="text-xs bg-black/40 px-2 py-0.5 rounded text-gray-400">Switch</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-hidden relative flex flex-col bg-gray-950">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="relative z-10 w-full h-full flex flex-col">
            {children}
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="lg:hidden h-16 bg-gray-900 border-t border-white/10 flex items-center justify-around px-2 z-50 flex-shrink-0 safe-area-bottom">
        {navItems.map((item) => {
            const isActive = currentMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => setMode(item.mode)}
                className={`flex flex-col items-center justify-center w-full h-full py-1 ${
                  isActive ? 'text-cyan-400' : 'text-gray-500'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-white/10' : ''}`}>
                    {item.icon}
                </div>
                <span className="text-[10px] font-bold mt-1 truncate w-full text-center px-1">
                    {item.label}
                </span>
              </button>
            );
        })}
      </div>
    </div>
  );
};

export default Layout;