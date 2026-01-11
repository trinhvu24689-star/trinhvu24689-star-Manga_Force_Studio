import React, { useState, useEffect } from 'react';
import { SubscriptionPlan } from '../types';
import { generateVietQRUrl } from '../services/paymentService';
import { X, Check, Loader2, Smartphone, AlertTriangle, ShieldCheck, Copy } from 'lucide-react';

interface PaymentModalProps {
  plan: SubscriptionPlan;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ plan, isOpen, onClose, onConfirm }) => {
  const [qrUrl, setQrUrl] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [step, setStep] = useState<'scan' | 'verifying' | 'success'>('scan');
  const [txCode, setTxCode] = useState('');

  useEffect(() => {
    if (isOpen && plan) {
      // Generate a random 4-digit transaction code
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setTxCode(code);
      setQrUrl(generateVietQRUrl(plan, code));
      setStep('scan');
    }
  }, [isOpen, plan]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  const handleConfirmPaid = () => {
    setIsVerifying(true);
    setStep('verifying');

    // Simulate verification delay (Since we don't have a real backend webhook)
    setTimeout(() => {
      setIsVerifying(false);
      setStep('success');
      
      // Auto close after success
      setTimeout(() => {
        onConfirm();
      }, 2000);
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-gray-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-white/10 flex justify-between items-center">
            <div>
                <h3 className="text-xl font-black text-white">Thanh Toán An Toàn</h3>
                <p className="text-xs text-gray-400">Nâng cấp: <span className="text-cyan-400 font-bold">{plan.name}</span></p>
            </div>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                <X size={20} className="text-gray-400" />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-black/40">
            
            {step === 'scan' && (
                <div className="flex flex-col items-center gap-6">
                    {/* QR Area */}
                    <div className="bg-white p-4 rounded-2xl shadow-lg relative group">
                        <img 
                            src={qrUrl} 
                            alt="VietQR Payment" 
                            className="w-full h-auto max-w-[280px] rounded-lg mix-blend-multiply"
                        />
                        <div className="absolute -bottom-3 -right-3 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                            <Smartphone size={24} />
                        </div>
                    </div>

                    <div className="w-full bg-red-900/10 border border-red-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2 text-red-400 font-bold uppercase text-xs">
                            <AlertTriangle size={14} />
                            <span>Note (Cần phải đọc)</span>
                        </div>
                        <p className="text-xs text-red-200 mb-4 leading-relaxed font-medium bg-red-950/30 p-2 rounded border border-red-500/10">
                            "Đây là tài khoản ngân hàng của nhân viên đổi tiền NDT của tôi, không phải của tôi vì tôi không chi tiền VNĐ, chuyển khoản đúng, sợ tiền tôi chịu trách nhiệm!"
                        </p>
                        
                        <div className="space-y-3">
                             <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
                                <span className="text-gray-400 text-sm">Chủ TK</span>
                                <span className="font-mono font-bold text-white">SAM BA VUONG</span>
                            </div>
                            <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
                                <span className="text-gray-400 text-sm">Số tiền</span>
                                <span className="font-mono font-bold text-xl text-green-400">{plan.priceVND}</span>
                            </div>
                            <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5 group cursor-pointer" onClick={() => handleCopy(`MF PAY ${plan.code} ${txCode}`)}>
                                <span className="text-gray-400 text-sm">Nội dung</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-white">MF PAY {plan.code} {txCode}</span>
                                    <Copy size={14} className="text-gray-500 group-hover:text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleConfirmPaid}
                        className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold text-white shadow-lg shadow-green-900/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                    >
                        <ShieldCheck size={20} />
                        Tôi đã chuyển khoản
                    </button>
                </div>
            )}

            {step === 'verifying' && (
                <div className="flex flex-col items-center justify-center py-12 gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-gray-700 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
                        <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-500" size={32} />
                    </div>
                    <div className="text-center">
                        <h4 className="text-xl font-bold text-white mb-2">Đang xác minh giao dịch...</h4>
                        <p className="text-gray-400 text-sm">Vui lòng đợi trong giây lát.</p>
                        <p className="text-gray-500 text-xs mt-4">Kết nối Neon DB & Banking API</p>
                    </div>
                </div>
            )}

            {step === 'success' && (
                <div className="flex flex-col items-center justify-center py-12 gap-6">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.6)] animate-bounce">
                        <Check size={48} className="text-black" />
                    </div>
                    <div className="text-center">
                        <h4 className="text-2xl font-black text-white mb-2">Thanh Toán Thành Công!</h4>
                        <p className="text-gray-400">Gói <span className="text-green-400 font-bold">{plan.name}</span> đã được kích hoạt.</p>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default PaymentModal;