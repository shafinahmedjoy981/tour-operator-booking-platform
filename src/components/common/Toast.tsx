import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, showToast } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="glass-modal px-4 py-3 rounded-2xl flex items-center gap-3 border border-white/95 shadow-[0_16px_40px_rgba(15,42,61,0.22)] bg-white/95 text-[#0F2A3D]">
        <div className="w-8 h-8 rounded-full bg-[#1EC1CB]/20 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 text-[#0A6C74]" />
        </div>
        <p className="text-xs font-semibold flex-1 leading-snug">{toastMessage}</p>
        <button
          onClick={() => showToast('')}
          className="text-[#5B7184] hover:text-[#0F2A3D] p-1 rounded-lg hover:bg-black/5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
