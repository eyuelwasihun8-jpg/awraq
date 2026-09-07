import React from 'react';

interface MobileStickyCTAProps {
  priceLabel: string;
  originalPriceLabel?: string;
  buttonLabel: string;
  onClick: () => void;
  accent?: 'blue' | 'green' | 'purple' | 'cyan';
  isOwned?: boolean;
}

export const MobileStickyCTA: React.FC<MobileStickyCTAProps> = ({
  priceLabel,
  originalPriceLabel,
  buttonLabel,
  onClick,
  accent = 'blue',
  isOwned = false,
}) => {
  const getButtonStyles = () => {
    if (isOwned) {
      return 'from-slate-900 to-slate-800 border-slate-950';
    }
    switch (accent) {
      case 'green':
        return 'from-[#20B486] to-[#059669] border-[#047857] shadow-[0_8px_20px_rgba(32,180,134,0.3)]';
      case 'purple':
        return 'from-[#8B5CF6] to-[#6D28D9] border-[#5B21B6] shadow-[0_8px_20px_rgba(139,92,246,0.3)]';
      case 'cyan':
        return 'from-[#07CCFD] to-[#06B8E4] border-[#05A3CA] shadow-[0_8px_20px_rgba(7,204,253,0.3)]';
      case 'blue':
      default:
        return 'from-[#3B82F6] to-[#2563EB] border-[#1D4ED8] shadow-[0_8px_20px_rgba(59,130,246,0.3)]';
    }
  };

  const getPriceColor = () => {
    switch (accent) {
      case 'green':
        return 'text-[#059669]';
      case 'purple':
        return 'text-[#8B5CF6]';
      case 'cyan':
        return 'text-[#07CCFD]';
      case 'blue':
      default:
        return 'text-[#3B82F6]';
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-4 pt-3 safe-bottom shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        {!isOwned && (
          <div className="min-w-0 shrink-0">
            <div className={`text-lg font-black leading-none ${getPriceColor()}`}>
              {priceLabel}
            </div>
            {originalPriceLabel && (
              <div className="text-[10px] text-slate-400 font-bold line-through mt-1 whitespace-nowrap">
                {originalPriceLabel}
              </div>
            )}
          </div>
        )}
        <button
          onClick={onClick}
          className={`flex-1 min-h-[48px] py-3 px-4 rounded-xl bg-gradient-to-b ${getButtonStyles()} text-white font-bold text-sm border-b-[3px] active:translate-y-[1px] active:border-b-[1px] transition-all whitespace-nowrap`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};