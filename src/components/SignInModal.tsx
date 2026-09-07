import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('learner@awraq.com');
  const [password, setPassword] = useState('••••••••');
  const [fullName, setFullName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onSuccess?.();
      onClose();
    }, 1000);
  };

  return (
    <div
      id="signin-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        id="signin-modal-container"
        className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-gray-100 grid grid-cols-1 md:grid-cols-12 animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200 max-h-[92dvh] overflow-y-auto safe-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left visual — desktop only */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-b from-gray-50 via-slate-50 to-emerald-50/40 p-8 flex-col justify-between border-r border-gray-100">
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                  • LIVE
                </span>
                <span className="text-[11px] text-gray-400 font-medium">STRATEGY</span>
              </div>
              <h4 className="text-sm font-bold text-gray-900 leading-snug">
                Beginner's Guide to Digital Marketing
              </h4>
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-50">
                <img
                  src="https://res.cloudinary.com/dw1ohipim/image/upload/v1788610521/zdd0btz0dhpdrl3qdekg.jpg"
                  alt="Lamlak"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-xs text-gray-600 font-medium">Lamlak</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 shadow-xs border border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-gray-900">Premium Access</div>
                <div className="text-[10px] text-gray-500">Join 5,000+ students</div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Learn today
              </span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200/70">
            <div className="flex items-center gap-3 mb-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="Student"
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <div>
                <div className="text-xs font-bold text-gray-900">Wade Blue</div>
                <div className="text-[10px] text-gray-500">Business Owner</div>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-800 leading-relaxed italic">
              "Awraq completely changed how I think about my business. Simple, effective, and
              directly applicable."
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="col-span-1 md:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-5">
            <BrandLogo size="sm" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 pr-10">
            {isRegister ? t('auth.signUpTitle') : t('auth.signInTitle')}
          </h3>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            {isRegister
              ? 'Join over 5,000+ students advancing their digital careers'
              : 'Sign in to access your courses, live cohorts and resources'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {t('auth.fullName')}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={isRegister}
                  placeholder="Your name"
                  className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50/50"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 text-base rounded-xl border border-gray-200 focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  className="w-full pl-10 pr-4 py-3 text-base rounded-xl border border-gray-200 focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50/50"
                />
              </div>
              {!isRegister && (
                <div className="flex justify-end mt-1.5">
                  <a
                    href="#forgot"
                    className="text-[11px] font-medium text-gray-500 hover:text-[#3B82F6]"
                  >
                    {t('auth.forgotPassword')}
                  </a>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitted}
              className="w-full mt-2 min-h-[48px] py-3.5 rounded-xl bg-gradient-to-b from-[#3B82F6] to-[#2563EB] border-b-[4px] border-[#1D4ED8] hover:border-b-[2px] hover:translate-y-[2px] text-white text-sm font-bold shadow-[0_8px_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isRegister ? 'Creating Account...' : 'Signing In...'}</span>
                </>
              ) : (
                <span>{isRegister ? t('auth.signUp') : t('auth.signIn')}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 pb-2">
            {isRegister ? (
              <>
                {t('auth.haveAccount')}{' '}
                <button
                  onClick={() => setIsRegister(false)}
                  className="font-bold text-[#3B82F6] hover:underline cursor-pointer"
                >
                  {t('auth.signIn')}
                </button>
              </>
            ) : (
              <>
                {t('auth.noAccount')}{' '}
                <button
                  onClick={() => setIsRegister(true)}
                  className="font-bold text-[#3B82F6] hover:underline cursor-pointer"
                >
                  {t('auth.signUp')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};