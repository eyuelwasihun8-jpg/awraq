import React from 'react';
import { DigitalProduct, Page } from '../types';
import { ArrowLeft, CheckCircle2, Download, FileText, Lock, Unlock } from 'lucide-react';

interface DigitalProductPageProps {
  product: DigitalProduct;
  isOwned: boolean;
  onNavigate: (page: Page) => void;
  onBuy: () => void;
  onAccess: () => void;
}

export const DigitalProductPage: React.FC<DigitalProductPageProps> = ({
  product,
  isOwned,
  onNavigate,
  onBuy,
  onAccess
}) => {
  return (
    <div className="min-h-screen bg-[var(--color-bg-tertiary)] pb-20 pt-24">
      {/* Dark Hero Section */}
      <section className="bg-[var(--color-hero-bg)] relative py-12 lg:py-20 border-b border-[var(--color-hero-border)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--color-success-light)] rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-[var(--color-text-tertiary)] hover:text-white transition-colors text-sm font-semibold mb-8 cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-[#20B486]/20 text-[#20B486] border border-[#20B486]/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Digital Resource
              </span>
              <span className="bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              {product.title}
            </h1>
            
            <p className="text-lg text-[var(--color-text-tertiary)] mb-8 font-medium leading-relaxed max-w-2xl">
              {product.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 relative">
          
          <div className="lg:w-2/3 space-y-12">
            
            <div className="bg-[var(--color-card-bg)] rounded-3xl p-8 border border-[var(--color-border-subtle)] shadow-sm">
              <h2 className="text-2xl font-black text-[#1E293B] mb-4">Overview</h2>
              <p className="text-[var(--color-text-secondary)] font-medium leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="bg-[var(--color-card-bg)] rounded-3xl p-8 border border-[var(--color-border-subtle)] shadow-sm">
              <h2 className="text-2xl font-black text-[#1E293B] mb-6">What is included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.includes?.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#20B486] shrink-0 mt-0.5" />
                    <span className="text-[var(--color-text-secondary)] font-medium text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--color-card-bg)] rounded-3xl p-8 border border-[var(--color-border-subtle)] shadow-sm">
              <h2 className="text-2xl font-black text-[#1E293B] mb-6">Who is it for?</h2>
              <ul className="space-y-3">
                {product.whoIsItFor?.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div>
                    <span className="text-[var(--color-text-secondary)] font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Sticky Action Card */}
          <div className="lg:w-1/3">
            <div className="sticky top-28 bg-[var(--color-card-bg)] rounded-3xl p-6 border border-[var(--color-border-subtle)] shadow-[0_15px_40px_rgba(0,0,0,0.08)] border-b-[6px] border-b-slate-200 flex flex-col z-20">
              
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 w-full aspect-video mb-6 shadow-inner border border-[var(--color-border-subtle)]">
                <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-[var(--color-card-bg)]/90 backdrop-blur-sm text-[#1E293B] text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <FileText className="w-3 h-3 text-[#3B82F6]" />
                  {product.files?.length || 0} File{(product.files?.length || 0) !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="text-3xl font-black text-[#20B486] mb-6 text-center">
                ETB {product.price.toFixed(2)}
              </div>
              
              {isOwned ? (
                <button 
                  onClick={onAccess}
                  className="w-full py-4 rounded-xl bg-gradient-to-b from-[#20B486] to-[#059669] text-white font-bold text-lg shadow-[0_8px_20px_rgba(32,180,134,0.3)] border-b-[4px] border-[#047857] hover:border-b-[2px] hover:translate-y-[2px] transition-all cursor-pointer mb-6 flex items-center justify-center gap-2"
                >
                  <Unlock className="w-5 h-5" />
                  Access Resource
                </button>
              ) : (
                <button 
                  onClick={onBuy}
                  className="w-full py-4 rounded-xl bg-gradient-to-b from-[#3B82F6] to-[#2563EB] text-white font-bold text-lg shadow-[0_8px_20px_rgba(59,130,246,0.3)] border-b-[4px] border-[#1D4ED8] hover:border-b-[2px] hover:translate-y-[2px] transition-all cursor-pointer mb-6"
                >
                  Buy Now
                </button>
              )}

              <div className="space-y-4 pt-4 border-t border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-3">
                  <Download className="w-4 h-4 text-[#3B82F6]" />
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">Instant Download</span>
                </div>
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-[#3B82F6]" />
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">Secure Access</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
};