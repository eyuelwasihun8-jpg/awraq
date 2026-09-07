import React from 'react';
import { BundleItem, Course, DigitalProduct, Page } from '../types';
import { ArrowLeft, CheckCircle2, PlayCircle, Download, Layers, Shield } from 'lucide-react';

interface BundlePageProps {
  bundle: BundleItem;
  allCourses: Course[];
  allDigitalProducts: DigitalProduct[];
  isOwned: boolean;
  onNavigate: (page: Page) => void;
  onBuy: () => void;
}

export const BundlePage: React.FC<BundlePageProps> = ({
  bundle,
  allCourses,
  allDigitalProducts,
  isOwned,
  onNavigate,
  onBuy
}) => {
  const includedCourses = (bundle.includedCourseIds || [])
    .map(id => allCourses.find(c => c.id === id) || { id, title: 'Premium Digital Marketing Course', category: 'Course' } as Course);
  
  const includedResources = (bundle.includedDigitalProductIds || [])
    .map(id => allDigitalProducts.find(dp => dp.id === id) || { id, title: 'Premium Digital Resource', category: 'Resource' } as DigitalProduct);

  return (
    <div className="min-h-screen bg-[var(--color-bg-tertiary)] pb-20 pt-24">
      {/* Dark Hero Section */}
      <section className="bg-[var(--color-hero-bg)] relative py-12 lg:py-20 border-b border-[var(--color-hero-border)]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--color-brand-purple-light)] rounded-full blur-[100px] pointer-events-none"></div>
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
              <span className="bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3 h-3" />
                Premium Bundle
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              {bundle.title}
            </h1>
            
            <p className="text-lg text-[var(--color-text-tertiary)] mb-8 font-medium leading-relaxed max-w-2xl">
              {bundle.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 relative">
          
          <div className="lg:w-2/3 space-y-12">
            
            <div className="bg-[var(--color-card-bg)] rounded-3xl p-8 border border-[var(--color-border-subtle)] shadow-sm">
              <h2 className="text-2xl font-black text-[#1E293B] mb-4">Bundle Overview</h2>
              <p className="text-[var(--color-text-secondary)] font-medium leading-relaxed">
                {bundle.description}
              </p>
            </div>

            <div className="bg-[var(--color-card-bg)] rounded-3xl p-8 border border-[var(--color-border-subtle)] shadow-sm">
              <h2 className="text-2xl font-black text-[#1E293B] mb-6 flex items-center gap-2">
                <PlayCircle className="w-6 h-6 text-[#3B82F6]" />
                Courses Included
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {includedCourses.map((course, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)]">
                    <CheckCircle2 className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-slate-800 font-bold text-sm leading-snug">{course.title}</div>
                      <div className="text-xs text-slate-500 font-medium mt-1">Full Video Curriculum</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--color-card-bg)] rounded-3xl p-8 border border-[var(--color-border-subtle)] shadow-sm">
              <h2 className="text-2xl font-black text-[#1E293B] mb-6 flex items-center gap-2">
                <Download className="w-6 h-6 text-[#20B486]" />
                Resources Included
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {includedResources.map((resource, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-tertiary)]">
                    <CheckCircle2 className="w-5 h-5 text-[#20B486] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-slate-800 font-bold text-sm leading-snug">{resource.title}</div>
                      <div className="text-xs text-slate-500 font-medium mt-1">Digital Download</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--color-card-bg)] rounded-3xl p-8 border border-[var(--color-border-subtle)] shadow-sm">
              <h2 className="text-2xl font-black text-[#1E293B] mb-6">Bundle Perks</h2>
              <ul className="space-y-3">
                {bundle.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#8B5CF6]"></div>
                    <span className="text-[var(--color-text-secondary)] font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Sticky Action Card */}
          <div className="lg:w-1/3">
            <div className="sticky top-28 bg-[var(--color-card-bg)] rounded-3xl p-6 border border-[var(--color-border-subtle)] shadow-[0_15px_40px_rgba(0,0,0,0.08)] border-b-[6px] border-b-slate-200 flex flex-col z-20">
              
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 w-full aspect-video mb-6 shadow-inner border border-[var(--color-border-subtle)]">
                <img src={bundle.thumbnail} alt={bundle.title} className="w-full h-full object-cover opacity-80" />
                <div className="absolute top-3 left-3 bg-[var(--color-card-bg)]/90 backdrop-blur-sm text-[#1E293B] text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <Layers className="w-3 h-3 text-[#8B5CF6]" />
                  {includedCourses.length + includedResources.length} Included Items
                </div>
              </div>

              <div className="text-3xl font-black text-[#8B5CF6] mb-2 text-center">
                ETB {bundle.price.toFixed(2)}
              </div>
              <div className="text-sm text-[var(--color-text-tertiary)] font-bold line-through text-center mb-6">
                Total Value: ETB {bundle.originalValue.toFixed(2)}
              </div>
              
              {isOwned ? (
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg shadow-sm hover:bg-slate-800 transition-colors cursor-pointer mb-6 flex items-center justify-center gap-2"
                >
                  Go to Dashboard
                </button>
              ) : (
                <button 
                  onClick={onBuy}
                  className="w-full py-4 rounded-xl bg-gradient-to-b from-[#8B5CF6] to-[#6D28D9] text-white font-bold text-lg shadow-[0_8px_20px_rgba(139,92,246,0.3)] border-b-[4px] border-[#5B21B6] hover:border-b-[2px] hover:translate-y-[2px] transition-all cursor-pointer mb-6"
                >
                  Buy Bundle Now
                </button>
              )}

              <div className="space-y-4 pt-4 border-t border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-4 h-4 text-[#8B5CF6]" />
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">Courses go to My Learning</span>
                </div>
                <div className="flex items-center gap-3">
                  <Download className="w-4 h-4 text-[#8B5CF6]" />
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">Files go to My Resources</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-[#8B5CF6]" />
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">Single Secure Payment</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
};