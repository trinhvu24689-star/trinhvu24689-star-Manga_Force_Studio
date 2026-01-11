import React, { useState } from 'react';
import { PLANS } from '../data';
import { SubscriptionPlan, UserProfile, Language } from '../types';
import { translations } from '../translations';
import { Gem, Crown, Check, Star, Lock, MessageCircle } from 'lucide-react';
import PaymentModal from './PaymentModal';

interface ShopProps {
  user: UserProfile;
  onUpgrade: (plan: SubscriptionPlan) => void;
  lang: Language;
}

const Shop: React.FC<ShopProps> = ({ user, onUpgrade, lang }) => {
  const t = translations[lang].shop;
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const getGradient = (id: number) => {
    if (id <= 2) return 'from-gray-700 to-gray-800';
    if (id <= 8) return 'from-blue-900 to-indigo-900';
    if (id <= 15) return 'from-purple-900 to-pink-900';
    if (id <= 17) return 'from-yellow-700 to-yellow-900'; // Lifetime/Mod
    return 'from-red-900 to-black'; // Admin
  };

  const getBorderColor = (id: number) => {
    if (id === user.plan.id) return 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]';
    if (id >= 16) return 'border-yellow-500/50';
    return 'border-white/10';
  };

  const handleBuyClick = (plan: SubscriptionPlan) => {
    if (plan.priceUSD === 0) {
        // Free plan, upgrade immediately
        onUpgrade(plan);
    } else {
        // Paid plan, open payment modal
        setSelectedPlan(plan);
    }
  };

  const handlePaymentConfirm = () => {
    if (selectedPlan) {
        onUpgrade(selectedPlan);
        setSelectedPlan(null);
    }
  };

  return (
    <div className="h-full bg-black overflow-y-auto p-6 md:p-10">
      <div className="max-w-7xl mx-auto pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4">
            {t.title}
          </h1>
          <p className="text-gray-400 text-lg">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div 
              key={plan.id} 
              className={`relative rounded-2xl border-2 overflow-hidden flex flex-col ${getBorderColor(plan.id)} bg-gray-900/50 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-2xl`}
            >
              {/* Header */}
              <div className={`p-4 bg-gradient-to-r ${getGradient(plan.id)}`}>
                <div className="flex justify-between items-start">
                   <div>
                      <span className="text-xs font-bold text-white/70 uppercase tracking-widest">{plan.type}</span>
                      <h3 className="text-xl font-black text-white mt-1">{plan.name}</h3>
                      <div className="text-xs font-mono text-white/50">{plan.code}</div>
                   </div>
                   {plan.id >= 16 && <Crown size={24} className="text-yellow-400" />}
                </div>
              </div>

              {/* Pricing */}
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="text-center border-b border-white/10 pb-4">
                   <div className="text-2xl font-bold text-white">{plan.priceVND}</div>
                   {plan.priceUSD > 0 && <div className="text-sm text-gray-500">${plan.priceUSD}</div>}
                </div>

                {/* Resources */}
                <div className="space-y-3">
                   <div className="flex items-center justify-between p-2 bg-blue-900/20 rounded-lg border border-blue-500/20">
                      <div className="flex items-center gap-2 text-cyan-400 font-bold">
                        <Gem size={16} />
                        <span>KC Xanh</span>
                      </div>
                      <span className="text-white font-mono font-bold">{plan.diamonds === 'Unlimited' ? '∞' : plan.diamonds.toLocaleString()}</span>
                   </div>
                   <div className="flex items-center justify-between p-2 bg-red-900/20 rounded-lg border border-red-500/20">
                      <div className="flex items-center gap-2 text-pink-500 font-bold">
                        <Gem size={16} />
                        <span>Ruby</span>
                      </div>
                      <span className="text-white font-mono font-bold">{plan.rubies === 'Unlimited' ? '∞' : plan.rubies.toLocaleString()}</span>
                   </div>
                </div>

                {/* Benefits */}
                {plan.benefits && (
                   <div className="mt-2 text-sm text-gray-300">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">{t.benefits}</p>
                      <div className="flex items-start gap-2">
                         <Check size={14} className="text-green-500 mt-0.5" />
                         <span>{plan.benefits}</span>
                      </div>
                   </div>
                )}
                
                <div className="flex-1"></div>

                {/* Action */}
                {plan.id === 99 ? (
                    <a
                        href="https://zalo.me/0856848557"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all text-center no-underline"
                    >
                        <MessageCircle size={18} className="flex-shrink-0 hidden sm:block" />
                        <span className="text-xs font-bold">Liên Hệ NPH Qua Zalo: 0856848557</span>
                    </a>
                ) : (
                    <button
                    onClick={() => handleBuyClick(plan)}
                    disabled={user.plan.id === plan.id}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                        user.plan.id === plan.id 
                        ? 'bg-green-600/20 text-green-500 cursor-default border border-green-500/50'
                        : 'bg-white text-black hover:bg-cyan-400 hover:scale-105 hover:shadow-lg'
                    }`}
                    >
                    {user.plan.id === plan.id ? (
                        <>
                        <Check size={18} />
                        {t.active}
                        </>
                    ) : (
                        <>
                        <Star size={18} />
                        {t.buy}
                        </>
                    )}
                    </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedPlan && (
        <PaymentModal 
            plan={selectedPlan} 
            isOpen={!!selectedPlan} 
            onClose={() => setSelectedPlan(null)} 
            onConfirm={handlePaymentConfirm} 
        />
      )}
    </div>
  );
};

export default Shop;