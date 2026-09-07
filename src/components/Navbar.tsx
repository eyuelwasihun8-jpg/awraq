import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrandLogo } from './BrandLogo';
import { Page } from '../types';
import { Search, ChevronDown, Menu, X, BookOpen, LogOut } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenConsultation: () => void;
  onOpenSignIn: () => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenConsultation,
  onOpenSignIn,
  isLoggedIn = false,
  onLogout,
}) => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showExploreMenu, setShowExploreMenu] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);

      if (currentPage === 'home') {
        const sections = ['home', 'learning', 'courses', 'resources', 'about', 'contact'];
        let current = 'home';
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 150) current = section;
          }
        }
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks: { labelKey: string; page: Page }[] = [
    { labelKey: 'nav.home', page: 'home' },
    { labelKey: 'nav.about', page: 'about' },
    { labelKey: 'nav.learning', page: 'learning' },
    { labelKey: 'nav.courses', page: 'courses' },
    { labelKey: 'nav.resources', page: 'resources' },
    { labelKey: 'nav.contact', page: 'contact' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleLinkClick = (item: (typeof navLinks)[0]) => {
    if (currentPage !== 'home') {
      onNavigate('home');
      setTimeout(() => scrollToSection(item.page), 150);
    } else {
      scrollToSection(item.page);
    }
    setMobileMenuOpen(false);
    setShowExploreMenu(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleLinkClick({ labelKey: 'nav.courses', page: 'courses' });
    }
  };

  const isTransparent = currentPage === 'home' && !isScrolled;

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 safe-top ${
        isTransparent
          ? 'py-3 sm:py-4 bg-transparent border-transparent'
          : 'py-2.5 sm:py-3 bg-white shadow-sm border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
          {/* Logo + Desktop Search */}
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <button
              onClick={() => handleLinkClick({ labelKey: 'nav.home', page: 'home' })}
              className={`focus:outline-none hover:opacity-95 transition-all duration-300 cursor-pointer shrink-0 no-min-touch ${
                isTransparent ? 'brightness-0 invert' : ''
              }`}
              aria-label="Awraq Homepage"
            >
              <BrandLogo size="md" />
            </button>

            <div className="hidden md:block relative">
              <form
                onSubmit={handleSearchSubmit}
                className={`flex items-center rounded-full pl-4 pr-1.5 py-1.5 transition-colors w-56 lg:w-72 border ${
                  isTransparent
                    ? 'bg-white/10 border-white/20 text-white focus-within:border-white/40'
                    : 'bg-white border-slate-200 shadow-sm hover:border-slate-300 focus-within:border-[#07CCFD]'
                }`}
              >
                <Search
                  className={`w-4 h-4 shrink-0 mr-2.5 ${
                    isTransparent ? 'text-white/70' : 'text-slate-400'
                  }`}
                />
                <input
                  type="text"
                  placeholder={t('nav.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full bg-transparent text-sm focus:outline-none min-h-0 ${
                    isTransparent
                      ? 'text-white placeholder-white/70'
                      : 'text-slate-800 placeholder-slate-400'
                  }`}
                />

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowExploreMenu(!showExploreMenu)}
                    className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full transition-colors shrink-0 cursor-pointer no-min-touch ${
                      isTransparent
                        ? 'bg-white/20 hover:bg-white/30 text-white'
                        : 'bg-cyan-50 hover:bg-cyan-100 text-[#07CCFD]'
                    }`}
                  >
                    <span>{t('nav.explore')}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showExploreMenu && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-xs font-medium text-slate-700 animate-in fade-in">
                      <button
                        onClick={() => {
                          handleLinkClick({ labelKey: 'nav.courses', page: 'courses' });
                        }}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 text-slate-800 cursor-pointer"
                      >
                        {t('nav.allCourses')}
                      </button>
                      <button
                        onClick={() => {
                          handleLinkClick({ labelKey: 'nav.learning', page: 'learning' });
                        }}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 text-slate-800 cursor-pointer"
                      >
                        {t('nav.freeSessions')}
                      </button>
                      <button
                        onClick={() => {
                          handleLinkClick({ labelKey: 'nav.resources', page: 'resources' });
                        }}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 text-slate-800 cursor-pointer"
                      >
                        {t('nav.digitalResources')}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium">
            {navLinks.map((item) => {
              const isActive = currentPage === 'home' ? activeSection === item.page : false;
              let linkColor = isTransparent
                ? 'text-white/80 hover:text-white'
                : 'text-slate-600 hover:text-[#07CCFD]';
              if (isActive) {
                linkColor = isTransparent
                  ? 'text-white font-bold'
                  : 'text-[#07CCFD] font-bold';
              }
              return (
                <button
                  key={item.labelKey}
                  onClick={() => handleLinkClick(item)}
                  className={`transition-colors cursor-pointer whitespace-nowrap no-min-touch ${linkColor}`}
                >
                  {t(item.labelKey)}
                </button>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-3">
            <LanguageSwitcher isTransparent={isTransparent} />
            <ThemeToggle isTransparent={isTransparent} variant="default" />

            {isLoggedIn ? (
              <>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`text-sm font-bold px-3 lg:px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                    isTransparent
                      ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                      : 'bg-cyan-50 text-[#07CCFD] hover:bg-cyan-100 border border-cyan-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden md:inline">{t('nav.myLearning')}</span>
                </button>
                <button
                  onClick={onLogout}
                  className={`text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 p-2 ${
                    isTransparent
                      ? 'text-white/80 hover:text-white'
                      : 'text-slate-500 hover:text-red-500'
                  }`}
                  title={t('nav.signOut')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onOpenSignIn}
                  className={`text-sm font-bold transition-colors cursor-pointer px-2 no-min-touch ${
                    isTransparent
                      ? 'text-white hover:text-[#07CCFD]'
                      : 'text-slate-600 hover:text-[#07CCFD]'
                  }`}
                >
                  {t('nav.signIn')}
                </button>
                <button
                  onClick={onOpenConsultation}
                  className={`text-[#0F172A] text-sm font-bold px-4 lg:px-5 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    isTransparent
                      ? 'bg-[#07CCFD] hover:bg-[#06B8E4] shadow-[0_4px_15px_rgba(7,204,253,0.3)]'
                      : 'bg-[#07CCFD] hover:bg-[#06B8E4] border-b-[3px] border-[#05A3CA] hover:border-b-[1px] hover:translate-y-[2px] shadow-sm'
                  }`}
                >
                  {t('nav.bookConsultation')}
                </button>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex sm:hidden items-center gap-1.5">
            <LanguageSwitcher isTransparent={isTransparent} variant="compact" />
            <ThemeToggle isTransparent={isTransparent} variant="compact" />

            {isLoggedIn && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`w-11 h-11 rounded-xl font-bold flex items-center justify-center cursor-pointer shadow-sm ${
                  isTransparent
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-cyan-50 text-[#07CCFD] border border-cyan-100'
                }`}
                aria-label={t('nav.myLearning')}
              >
                <BookOpen className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                isTransparent
                  ? 'text-white hover:bg-white/10'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              aria-label="Toggle Navigation"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Tablet hamburger (sm to lg) */}
          <div className="hidden sm:flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer ${
                isTransparent
                  ? 'text-white hover:bg-white/10'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 top-[var(--nav-h,3.5rem)] bg-black/40 z-30"
            style={{ top: 'max(3.5rem, calc(3.5rem + env(safe-area-inset-top)))' }}
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 sm:px-6 py-5 shadow-xl space-y-5 absolute w-full left-0 mt-[1px] max-h-[min(85dvh,calc(100dvh-4rem))] overflow-y-auto safe-bottom z-40 animate-in fade-in slide-in-from-top-4">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
            >
              <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder={t('nav.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-base focus:outline-none text-slate-800"
              />
            </form>

            <LanguageSwitcher variant="mobile" />
            <ThemeToggle isTransparent={false} variant="compact" />

            <nav className="flex flex-col space-y-1">
              {navLinks.map((item) => {
                const isActive =
                  currentPage === 'home' ? activeSection === item.page : false;
                return (
                  <button
                    key={item.labelKey}
                    onClick={() => handleLinkClick(item)}
                    className={`text-left text-base font-bold py-3 px-2 rounded-xl transition-colors cursor-pointer ${
                      isActive
                        ? 'text-[#07CCFD] bg-cyan-50'
                        : 'text-slate-700 hover:text-[#07CCFD] hover:bg-slate-50'
                    }`}
                  >
                    {t(item.labelKey)}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('dashboard');
                    }}
                    className="w-full min-h-[48px] bg-[#07CCFD] text-[#0F172A] py-3 rounded-xl font-bold text-sm text-center shadow-sm cursor-pointer hover:bg-[#06B8E4]"
                  >
                    {t('nav.myLearning')}
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout?.();
                    }}
                    className="w-full min-h-[48px] bg-slate-50 text-slate-600 border border-slate-200 py-3 rounded-xl font-bold text-sm text-center cursor-pointer hover:bg-red-50 hover:text-red-600 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('nav.signOut')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenConsultation();
                    }}
                    className="w-full min-h-[48px] bg-[#07CCFD] text-[#0F172A] py-3 rounded-xl font-bold text-sm text-center shadow-sm cursor-pointer hover:bg-[#06B8E4]"
                  >
                    {t('nav.bookConsultation')}
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenSignIn();
                    }}
                    className="w-full min-h-[48px] bg-slate-100 text-slate-800 py-3 rounded-xl font-bold text-sm text-center cursor-pointer hover:bg-slate-200"
                  >
                    {t('nav.signIn')}
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};