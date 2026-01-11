import React, { useState } from 'react';
import { PLANS } from '../data';
import { SubscriptionPlan, UserProfile, Language } from '../types';
import { translations } from '../translations';
import { ShieldAlert, KeyRound, Unlock, Lock, TriangleAlert } from 'lucide-react';

interface AdminGrantProps {
  user: UserProfile;
  onUpgrade: (plan: SubscriptionPlan) => void;
  lang: Language;
}

const AdminGrant: React.FC<AdminGrantProps> = ({ user, onUpgrade, lang }) => {
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const t = translations[lang].adminGrant;
  const ADMIN_PLAN_ID = 99;
  const SECRET_KEY = "QTV-MANGA-2025"; 

  const handleVerify = () => {
    if (keyInput === SECRET_KEY) {
      setSuccess(true);
      setError(false);
      const adminPlan = PLANS.find(p => p.id === ADMIN_PLAN_ID);
      if (adminPlan) {
        setTimeout(() => {
            onUpgrade(adminPlan);
        }, 1000);
      }
    } else {
      setError(true);
      setSuccess(false);
      setKeyInput('');
    }
  };

  const isAlreadyAdmin = user.plan.id === ADMIN_PLAN_ID;

  return (
    <div className="h-full flex items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Red/Danger Background effect */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#330000_10px,#330000_20px)] opacity-20 pointer-events-none"></div>
      
      <div className="max-w-md w-full bg-gray-950 border border-red-900 shadow-[0_0_100px_rgba(220,38,38,0.2)] rounded-sm p-8 relative z-10">
        
        {/* Warning Banner */}
        <div className="absolute top-0 left-0 w-full bg-red-600 text-black font-black text-center text-xs py-1 tracking-widest uppercase">
            Restricted Access • Top Secret
        </div>

        <div className="flex flex-col items-center text-center mb-8 mt-4">
          <div className={`p-4 rounded-full mb-4 ${isAlreadyAdmin ? 'bg-green-500/10 text-green-500 border border-green-500' : 'bg-red-500/10 text-red-500 border border-red-500 animate-pulse'}`}>
            {isAlreadyAdmin ? <Unlock size={48} /> : <ShieldAlert size={48} />}
          </div>
          <h1 className="text-2xl font-black text-red-500 uppercase tracking-widest font-mono">{t.title}</h1>
          <div className="flex items-center gap-2 mt-2 text-red-400 justify-center">
             <TriangleAlert size={16} />
             <p className="text-xs font-bold uppercase tracking-wide">{t.subtitle}</p>
          </div>
        </div>

        {isAlreadyAdmin ? (
          <div className="bg-green-900/10 border border-green-500/50 rounded-sm p-4 text-center">
            <p className="text-green-500 font-bold font-mono uppercase">{t.alreadyAdmin}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-red-500 uppercase flex items-center gap-2 tracking-widest">
                <KeyRound size={12} />
                {t.inputLabel}
              </label>
              <div className="relative">
                <input 
                  type="password"
                  value={keyInput}
                  onChange={(e) => {
                    setKeyInput(e.target.value);
                    setError(false);
                  }}
                  placeholder={t.placeholder}
                  className={`w-full bg-black border rounded-sm p-4 text-white outline-none transition-all font-mono text-center tracking-[0.5em] ${
                    error ? 'border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.5)]' : 'border-red-900/50 focus:border-red-500'
                  }`}
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-red-800" size={16} />
              </div>
              {error && <p className="text-red-500 text-xs font-bold text-center font-mono uppercase blink">{t.error}</p>}
              {success && <p className="text-green-500 text-xs font-bold text-center font-mono uppercase">{t.success}</p>}
            </div>

            <button
              onClick={handleVerify}
              disabled={!keyInput || success}
              className={`w-full py-4 rounded-sm font-black uppercase tracking-[0.2em] transition-all border ${
                success 
                  ? 'bg-green-600 border-green-400 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]' 
                  : 'bg-red-900/20 border-red-600 text-red-500 hover:bg-red-600 hover:text-black hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]'
              }`}
            >
              {success ? 'GRANTED' : t.btnVerify}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGrant;