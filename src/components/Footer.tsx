import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrandLogo } from './BrandLogo';
import { Page } from '../types';
import { Twitter, Linkedin, Github, Globe, Facebook } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: Page) => void;
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenConsultation }) => {
  const { t } = useTranslation();

  const scrollToSection = (id: string) => {
    onNavigate('home');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <footer
      id="main-footer"
      className="bg-[#0D1527] text-gray-400 pt-12 sm:pt-16 pb-8 sm:pb-10 border-t border-gray-800 safe-bottom"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 pb-10 sm:pb-14 border-b border-gray-800">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <div className="flex items-start">
              <BrandLogo variant="light" size="md" />
            </div>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              {t(
                'sections.learnSimpleWay.description',
                'Top learning experiences that create more talent in the world.'
              ).slice(0, 120)}
              ...
            </p>
          </div>

          {/* Product */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider">
              {t('nav.courses')}
            </h4>
            <ul className="space-y-1 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection('courses')}
                  className="hover:text-white transition-colors cursor-pointer py-2 text-left min-h-[40px]"
                >
                  {t('nav.allCourses')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('resources')}
                  className="hover:text-white transition-colors cursor-pointer py-2 text-left min-h-[40px]"
                >
                  {t('nav.resources')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('learning')}
                  className="hover:text-white transition-colors cursor-pointer py-2 text-left min-h-[40px]"
                >
                  {t('nav.freeSessions')}
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider">
              {t('nav.about')}
            </h4>
            <ul className="space-y-1 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="hover:text-white transition-colors cursor-pointer py-2 text-left min-h-[40px]"
                >
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="hover:text-white transition-colors cursor-pointer py-2 text-left min-h-[40px]"
                >
                  {t('nav.contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider">Social</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex py-2 min-h-[40px] items-center"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex py-2 min-h-[40px] items-center"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors inline-flex py-2 min-h-[40px] items-center"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Legal + Consultation */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider">Legal</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <a
                  href="#terms"
                  className="hover:text-white transition-colors inline-flex py-2 min-h-[40px] items-center"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="hover:text-white transition-colors inline-flex py-2 min-h-[40px] items-center"
                >
                  Privacy
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenConsultation}
                  className="hover:text-white transition-colors cursor-pointer py-2 text-left min-h-[40px] text-[#07CCFD] font-semibold"
                >
                  {t('nav.bookConsultation')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Awraq. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-gray-400">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors p-2"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors p-2"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors p-2"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors p-2"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://dribbble.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors p-2"
              aria-label="Website"
            >
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};