import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Course, Page } from '../types';
import {
  ArrowLeft,
  CheckCircle2,
  PlayCircle,
  FileText,
  Clock,
  MonitorPlay,
  Award,
  Shield,
  Star,
  Lock,
  Play,
  Sparkles,
  X,
  Users,
  Zap,
} from 'lucide-react';
import { MobileStickyCTA } from '../components/MobileStickyCTA';

interface CourseDetailPageProps {
  course: Course;
  isOwned?: boolean;
  progress?: { completedLessons: string[]; lastLessonId?: string };
  onNavigate: (page: Page) => void;
  onEnroll: () => void;
}

// ────────────────────────────────────────────────────────────
// TESTIMONIALS (move to /data/ later)
// ────────────────────────────────────────────────────────────
const TEXT_TESTIMONIALS = [
  {
    id: 't1',
    quote:
      'This course finally made digital marketing make sense. Lamlak breaks down everything in a way that just clicks.',
    author: 'Selamawit Bekele',
    role: 'Small Business Owner',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
  },
  {
    id: 't2',
    quote:
      'Best investment I made this year. The templates alone are worth 10x the price.',
    author: 'Daniel Tesfaye',
    role: 'Marketing Manager',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
  },
  {
    id: 't3',
    quote:
      'My social media grew 3x in 2 months following the exact steps in this course.',
    author: 'Hanan Mohammed',
    role: 'Content Creator',
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    rating: 5,
  },
];

const VIDEO_TESTIMONIALS = [
  {
    id: 'v1',
    name: 'Yohannes A.',
    role: 'E-commerce Founder',
    thumbnail:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    youtubeId: 'dQw4w9WgXcQ',
    quote: 'From zero to 200+ customers',
  },
  {
    id: 'v2',
    name: 'Meron K.',
    role: 'Freelance Designer',
    thumbnail:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    youtubeId: 'dQw4w9WgXcQ',
    quote: 'Landed 5 new clients',
  },
];

export const CourseDetailPage = ({
  course,
  isOwned = false,
  progress,
  onNavigate,
  onEnroll,
}: CourseDetailPageProps) => {
  const { t } = useTranslation();
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [activeVideoTestimonial, setActiveVideoTestimonial] = useState<string | null>(null);

  const isCompleted = isOwned && progress?.completedLessons.length === course.lessonsCount;
  const hasStarted = isOwned && (progress?.completedLessons.length || 0) > 0;

  let ctaText = t('common.enrollNow', 'Enroll Now');
  if (course.isFree) ctaText = t('common.startLearning', 'Start Learning');
  else if (isOwned)
    ctaText = isCompleted
      ? t('common.reviewCourse', 'Review Course')
      : hasStarted
      ? t('common.continueLearning', 'Continue Learning')
      : t('common.startLearning', 'Start Learning');

  const handleCtaClick = () => {
    if (isOwned || course.isFree) {
      onNavigate('learn');
    } else {
      onEnroll();
    }
  };

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div
      id="course-detail-root"
      className="min-h-screen bg-[var(--color-bg-tertiary)] pb-32 lg:pb-20 pt-20 sm:pt-24 font-sans"
    >
      {/* ═══════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-[var(--color-hero-bg)] relative py-8 sm:py-12 lg:py-14 border-b border-[var(--color-hero-border)] overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[var(--color-brand-primary-light)] rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-[var(--color-success-light)] rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold mb-5 cursor-pointer group min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{t('common.back')}</span>
          </button>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {course.isFree ? (
                <span className="bg-[#20B486]/20 text-[#20B486] border border-[#20B486]/30 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider chip">
                  {t('common.free')}
                </span>
              ) : (
                <span className="bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider chip">
                  {course.category}
                </span>
              )}
              <span className="bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider chip">
                {course.level}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3 tracking-tight">
              {course.title}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-300 mb-5 font-medium leading-relaxed max-w-3xl">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold text-slate-300">
              <div className="flex items-center gap-1.5 text-[#F59E0B]">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                <span>{course.rating}</span>
                <span className="text-slate-400 font-normal">({course.reviewsCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <MonitorPlay className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <span>{course.lessonsCount} Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <span>{course.reviewsCount * 3}+ Students</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. MAIN CONTENT
      ═══════════════════════════════════════════════════════ */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* ── LEFT COLUMN ──────────────────────────────── */}
          <div className="lg:w-2/3 space-y-8">
            {/* Video Preview */}
            <div
              onClick={isOwned ? handleCtaClick : () => setShowPreviewModal(true)}
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[var(--color-hero-bg)] aspect-video shadow-xl border-2 border-[var(--color-border-secondary)] cursor-pointer group hover:shadow-2xl transition-all"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-hero-bg)]/85 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-bold shadow-lg">
                  <Sparkles className="w-3 h-3 text-[#20B486]" />
                  <span>{course.isFree || isOwned ? 'Full Access' : 'Free Preview'}</span>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--color-card-bg)]/95 backdrop-blur-md flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-slate-900 text-slate-900 ml-1" />
                </div>
              </div>
            </div>

            {/* What You Will Learn */}
            <div className="bg-[var(--color-card-bg)] rounded-2xl p-5 sm:p-6 border border-[var(--color-border-primary)] shadow-sm">
              <h2 className="text-lg sm:text-xl font-black text-[#1E293B] mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#F59E0B]" />
                {t('course.whatYouLearn')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {course.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#20B486] shrink-0 mt-1" />
                    <span className="text-[var(--color-text-secondary)] font-medium text-sm leading-relaxed">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compact Curriculum */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#1E293B]">
                    {t('course.curriculum')}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {course.modules.length} modules • {totalLessons} lessons
                  </p>
                </div>
                {!course.isFree && !isOwned && (
                  <button
                    onClick={() => setShowPreviewModal(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3B82F6] hover:text-[#2563EB] bg-blue-50 px-3 py-2 rounded-lg border border-blue-100 cursor-pointer transition-all"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Preview</span>
                  </button>
                )}
              </div>

              <div className="bg-[var(--color-card-bg)] rounded-2xl border border-[var(--color-border-primary)] overflow-hidden divide-y divide-slate-100">
                {course.modules.map((module, idx) => (
                  <div
                    key={module.id}
                    className="flex items-center gap-3 p-3.5 sm:p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex items-center justify-center text-[#3B82F6] font-black text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#1E293B] text-sm sm:text-[15px] leading-snug">
                        {module.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-medium">
                        <span>{module.lessons.length} lessons</span>
                        {course.isFree || isOwned ? (
                          <>
                            <span>•</span>
                            <span className="text-[#20B486] font-bold">Unlocked</span>
                          </>
                        ) : idx === 0 ? (
                          <>
                            <span>•</span>
                            <span className="text-[#F59E0B] font-bold">Preview</span>
                          </>
                        ) : (
                          <>
                            <span>•</span>
                            <Lock className="w-2.5 h-2.5" />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Reviews */}
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 mb-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                  <span className="text-[11px] font-bold text-amber-800">
                    {course.rating} / 5.0 • {course.reviewsCount} reviews
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-[#1E293B]">Student Reviews</h2>
              </div>

              {/* Video Reviews */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {VIDEO_TESTIMONIALS.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => setActiveVideoTestimonial(video.youtubeId)}
                    className="group relative bg-[var(--color-hero-bg)] rounded-xl sm:rounded-2xl overflow-hidden aspect-video cursor-pointer hover:-translate-y-0.5 transition-transform shadow-md"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.name}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[var(--color-card-bg)]/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center group-hover:bg-[var(--color-card-bg)] group-hover:scale-110 transition-all shadow-2xl">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white group-hover:fill-slate-900 group-hover:text-slate-900 ml-0.5" />
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
                      <div className="text-white font-bold text-[11px] sm:text-xs leading-tight mb-0.5 line-clamp-1">
                        "{video.quote}"
                      </div>
                      <div className="text-white/70 text-[10px] font-medium">
                        {video.name} • {video.role}
                      </div>
                    </div>

                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow-md flex items-center gap-0.5">
                      <Play className="w-2 h-2 fill-current" />
                      Video
                    </div>
                  </div>
                ))}
              </div>

              {/* Text Reviews */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {TEXT_TESTIMONIALS.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-[var(--color-card-bg)] rounded-xl p-4 border border-[var(--color-border-primary)] flex flex-col hover:border-slate-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]"
                        />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] font-medium leading-relaxed mb-4 flex-1 italic">
                      "{testimonial.quote}"
                    </p>

                    <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-black text-[#1E293B] text-xs truncate">
                          {testimonial.author}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium truncate">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-[var(--color-card-bg)] rounded-2xl p-5 sm:p-6 border border-[var(--color-border-primary)] shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shrink-0"
                />
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">
                    {t('course.yourInstructor')}
                  </div>
                  <div className="text-base sm:text-lg font-black text-[#1E293B]">
                    {course.instructor.name}
                  </div>
                  <div className="text-[#3B82F6] font-bold text-xs">
                    {course.instructor.role}
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Dedicated to helping you learn practical digital marketing skills you can apply
                immediately.
              </p>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════
              STICKY SIDEBAR (like original)
          ═════════════════════════════════════════════════ */}
          <div className="hidden lg:block lg:w-1/3">
            <div className="sticky top-28 bg-[var(--color-card-bg)] rounded-3xl p-6 border border-[var(--color-border-primary)] shadow-xl border-b-[6px] border-b-slate-200 flex flex-col z-20">
              {/* Price */}
              <div className="text-center mb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 inline-block">
                  {isOwned ? t('course.youOwnThis') : t('course.lifetimeAccess')}
                </span>
                <div className="text-4xl font-black text-[#20B486] pt-2">
                  {isOwned
                    ? t('common.unlocked')
                    : course.isFree
                    ? t('common.free')
                    : `ETB ${course.price.toFixed(2)}`}
                </div>
                {!course.isFree && !isOwned && course.originalPrice && (
                  <div className="text-sm text-slate-400 font-bold line-through mt-1">
                    Normally ETB {course.originalPrice.toFixed(2)}
                  </div>
                )}
                {!course.isFree && !isOwned && course.originalPrice && (
                  <div className="inline-block mt-2 bg-emerald-50 border border-emerald-200 text-[#059669] text-[11px] font-black px-2.5 py-1 rounded-full">
                    Save{' '}
                    {Math.round(
                      ((course.originalPrice - course.price) / course.originalPrice) * 100
                    )}
                    %
                  </div>
                )}
              </div>

              {/* Enroll button */}
              <button
                onClick={handleCtaClick}
                className={`w-full py-4 rounded-xl ${
                  course.isFree || isOwned
                    ? 'bg-gradient-to-b from-[#20B486] to-[#059669] shadow-[0_10px_25px_rgba(32,180,134,0.35)] border-b-[5px] border-[#047857]'
                    : 'bg-gradient-to-b from-[#3B82F6] to-[#2563EB] shadow-[0_10px_25px_rgba(59,130,246,0.35)] border-b-[5px] border-[#1D4ED8]'
                } text-white font-bold text-base hover:border-b-[2px] hover:translate-y-[3px] transition-all cursor-pointer mb-3 text-center flex items-center justify-center gap-2`}
              >
                {course.isFree || isOwned ? (
                  <>
                    <PlayCircle className="w-5 h-5 text-emerald-100" />
                    <span>{ctaText}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-blue-200" />
                    <span>Enroll Now</span>
                  </>
                )}
              </button>

              {/* Preview button */}
              {!course.isFree && !isOwned && (
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="w-full py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-[var(--color-text-secondary)] font-bold text-sm border border-[var(--color-border-primary)] transition-all cursor-pointer mb-5 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-slate-700" />
                  <span>Watch Free Preview</span>
                </button>
              )}

              {/* This course includes */}
              <div className="space-y-3 pt-5 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  This course includes:
                </div>
                <div className="flex items-center gap-3">
                  <MonitorPlay className="w-4 h-4 text-[#3B82F6] shrink-0" />
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                    {course.lessonsCount} video lessons ({course.duration})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[#3B82F6] shrink-0" />
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                    Downloadable resources
                  </span>
                </div>
                {!course.isFree && (
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-[#3B82F6] shrink-0" />
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                      Certificate of completion
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#3B82F6] shrink-0" />
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">Lifetime access</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-[#3B82F6] shrink-0" />
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                    {course.isFree ? '100% Free Forever' : '14-Day Money-Back Guarantee'}
                  </span>
                </div>
              </div>

              {/* Small trust note at bottom of card */}
              <div className="mt-5 pt-5 border-t border-slate-100 text-center">
                <div className="flex items-center justify-center gap-1 text-[#F59E0B] mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <div className="text-[11px] font-bold text-slate-600">
                  {course.rating} / 5.0 rated by {course.reviewsCount} students
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE STICKY CTA */}
      <MobileStickyCTA
        priceLabel={
          isOwned
            ? t('common.unlocked')
            : course.isFree
            ? t('common.free')
            : `ETB ${course.price.toFixed(2)}`
        }
        originalPriceLabel={
          !course.isFree && !isOwned && course.originalPrice
            ? `ETB ${course.originalPrice.toFixed(2)}`
            : undefined
        }
        buttonLabel={ctaText}
        onClick={handleCtaClick}
        accent={course.isFree || isOwned ? 'green' : 'blue'}
        isOwned={isOwned}
      />

      {/* PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-[var(--color-hero-bg)] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-700 max-h-[95dvh]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
              <span className="text-white font-bold text-sm">Preview Lesson</span>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/2AtmHMRDxwc?autoplay=1&mute=0&controls=1"
                title="Preview"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>

            <div className="p-4 bg-slate-950 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-800">
              <div className="text-white font-bold text-sm">
                {course.isFree ? 'Ready to start?' : `Enroll for ETB ${course.price.toFixed(2)}`}
              </div>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  handleCtaClick();
                }}
                className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-xl bg-[#20B486] hover:bg-[#059669] text-white text-sm font-bold cursor-pointer"
              >
                {course.isFree || isOwned ? 'Start Now' : 'Enroll Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO TESTIMONIAL MODAL */}
      {activeVideoTestimonial && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-[var(--color-hero-bg)] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
              <span className="text-white font-bold text-sm">Student Review</span>
              <button
                onClick={() => setActiveVideoTestimonial(null)}
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${activeVideoTestimonial}?autoplay=1`}
                title="Testimonial"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};