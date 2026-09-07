import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  isTransparent?: boolean;
  variant?: 'default' | 'mobile' | 'compact';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  isTransparent = false,
  variant = 'default',
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
    document.documentElement.lang = lng;
  };

  const languages = [
    { code: 'en', label: 'English', native: 'EN' },
    { code: 'am', label: 'አማርኛ', native: 'አማ' },
  ];

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  // MOBILE FULL-WIDTH VARIANT (in mobile drawer)
  if (variant === 'mobile') {
    return (
      <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1 border border-slate-200">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-bold transition-all no-min-touch ${
              i18n.language === lang.code
                ? 'bg-[#07CCFD] text-[#0F172A] shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    );
  }

  // COMPACT VARIANT (icon only, for mobile navbar)
  if (variant === 'compact') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all cursor-pointer border ${
            isTransparent
              ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
          }`}
          aria-label="Change language"
        >
          <Globe className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-sm font-bold text-slate-800">{lang.label}</div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">{lang.code}</div>
                </div>
                {i18n.language === lang.code && <Check className="w-4 h-4 text-[#07CCFD]" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // DEFAULT VARIANT (icon + text, for desktop navbar)
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer border ${
          isTransparent
            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
        }`}
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-bold">{currentLang.native}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div>
                <div className="text-sm font-bold text-slate-800">{lang.label}</div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase">{lang.code}</div>
              </div>
              {i18n.language === lang.code && <Check className="w-4 h-4 text-[#07CCFD]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};