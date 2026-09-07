import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, Course, DigitalProduct, PurchaseRecord } from '../types';
import { COURSES } from '../data/courses';
import { DIGITAL_PRODUCTS } from '../data/digitalProducts';
import {
  PlayCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Award,
  ArrowUpRight,
  Clock,
  Sparkles,
  Star,
  Download,
  FileText,
  ReceiptText,
  LogOut,
  PenTool,
  TrendingUp,
  GraduationCap,
  Search,
  Trash2,
  ExternalLink,
} from 'lucide-react';

interface StudentDashboardProps {
  purchaseHistory: PurchaseRecord[];
  progressData: Record<string, { completedLessons: string[]; lastLessonId?: string }>;
  onNavigate: (page: Page) => void;
  onStartLearning: (course: Course) => void;
  onViewCertificate: (course: Course) => void;
  onExploreCourse: (course: Course) => void;
  onAccessResource: (product: DigitalProduct) => void;
  onLogout?: () => void;
}

type TabType = 'courses' | 'resources' | 'certificates' | 'notes' | 'history';

interface LessonNote {
  courseId: string;
  courseName: string;
  lessonId: string;
  lessonName: string;
  content: string;
  updatedAt: number;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  purchaseHistory,
  progressData,
  onNavigate,
  onStartLearning,
  onViewCertificate,
  onExploreCourse,
  onAccessResource,
  onLogout,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('courses');
  const [notesSearch, setNotesSearch] = useState('');

  const purchasedCourseIds = purchaseHistory.filter((p) => p.type === 'course').map((p) => p.itemId);
  const purchasedDigitalIds = purchaseHistory.filter((p) => p.type === 'digital').map((p) => p.itemId);

  const myCourses = COURSES.filter((course) => purchasedCourseIds.includes(course.id));
  const recommendedCourses = COURSES.filter((course) => !purchasedCourseIds.includes(course.id));
  const myDigitalProducts = DIGITAL_PRODUCTS.filter((dp) => purchasedDigitalIds.includes(dp.id));

  // ────────────────────────────────────────────────────────
  // COLLECT ALL NOTES FROM LOCALSTORAGE (from course player)
  // ────────────────────────────────────────────────────────
  const [allNotes, setAllNotes] = useState<LessonNote[]>([]);

  useEffect(() => {
    if (activeTab === 'notes') {
      const collected: LessonNote[] = [];
      myCourses.forEach((course) => {
        const key = `awraq_notes_${course.id}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          try {
            const notesObj: Record<string, string> = JSON.parse(saved);
            Object.entries(notesObj).forEach(([lessonId, content]) => {
              if (content && content.trim()) {
                const allLessons = course.modules.flatMap((m) => m.lessons);
                const lesson = allLessons.find((l) => l.id === lessonId);
                collected.push({
                  courseId: course.id,
                  courseName: course.title,
                  lessonId,
                  lessonName: lesson?.title || 'Unknown Lesson',
                  content,
                  updatedAt: Date.now(),
                });
              }
            });
          } catch (e) {
            // Skip invalid JSON
          }
        }
      });
      setAllNotes(collected);
    }
  }, [activeTab, myCourses]);

  const filteredNotes = allNotes.filter((note) => {
    if (!notesSearch.trim()) return true;
    const q = notesSearch.toLowerCase();
    return (
      note.courseName.toLowerCase().includes(q) ||
      note.lessonName.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q)
    );
  });

  const handleDeleteNote = (courseId: string, lessonId: string) => {
    const key = `awraq_notes_${courseId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const notesObj: Record<string, string> = JSON.parse(saved);
        delete notesObj[lessonId];
        localStorage.setItem(key, JSON.stringify(notesObj));
        setAllNotes((prev) =>
          prev.filter((n) => !(n.courseId === courseId && n.lessonId === lessonId))
        );
      } catch (e) {}
    }
  };

  // ────────────────────────────────────────────────────────
  // STATS CALCULATIONS
  // ────────────────────────────────────────────────────────
  let totalLessonsAll = 0;
  let completedLessonsAll = 0;

  myCourses.forEach((course) => {
    const total = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completed = progressData[course.id]?.completedLessons.length || 0;
    totalLessonsAll += total;
    completedLessonsAll += completed;
  });

  const overallProgress =
    totalLessonsAll === 0 ? 0 : Math.round((completedLessonsAll / totalLessonsAll) * 100);
  const totalEnrolled = myCourses.length;

  const getCourseProgress = (course: Course) => {
    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completedCount = progressData[course.id]?.completedLessons.length || 0;
    const percent = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);
    return { percent, completedLessons: completedCount, totalLessons };
  };

  const completedCourses = myCourses.filter((c) => getCourseProgress(c).percent === 100);
  const certificatesEarned = completedCourses.length;

  const getNextLessonTitle = (course: Course) => {
    const data = progressData[course.id];
    const allLessons = course.modules.flatMap((m) => m.lessons);
    if (!data || !data.lastLessonId) return allLessons[0]?.title || 'Start Course';
    const currentIdx = allLessons.findIndex((l) => l.id === data.lastLessonId);
    if (currentIdx !== -1) return allLessons[currentIdx].title;
    return allLessons[0]?.title || 'Start Course';
  };

  // ────────────────────────────────────────────────────────
  // RECOMMENDED CARD (Coordinated with palette)
  // ────────────────────────────────────────────────────────
  const renderRecommendedCard = (course: Course) => (
    <div key={course.id} className="group cursor-pointer" onClick={() => onExploreCourse(course)}>
      <div className="bg-[var(--color-card-bg)] rounded-2xl overflow-hidden border border-[var(--color-border-primary)] hover:border-[#07CCFD] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
        {/* Thumbnail */}
        <div className="relative h-40 w-full overflow-hidden bg-slate-100">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent"></div>

          <div className="absolute top-3 right-3 bg-[var(--color-card-bg)]/95 backdrop-blur-sm text-[#0F172A] text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-md">
            <Clock className="w-3 h-3 text-[#07CCFD]" />
            {course.duration}
          </div>

          {course.isPopular && (
            <div className="absolute top-3 left-3 bg-[#F59E0B] text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
              Bestseller
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4">
          <span className="text-[#07CCFD] font-black text-[10px] uppercase tracking-wider mb-2 block bg-cyan-50 border border-cyan-100 w-max px-2 py-0.5 rounded">
            {course.category}
          </span>

          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-black text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#07CCFD] transition-colors flex-1">
              {course.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-[var(--color-text-tertiary)] group-hover:text-[#07CCFD] transition-colors shrink-0 mt-1" />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-muted)] mb-4">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(course.rating)
                      ? 'fill-[#F59E0B] text-[#F59E0B]'
                      : 'fill-slate-200 text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[#F59E0B]">{course.rating}</span>
            <span className="text-[var(--color-text-tertiary)] font-normal">({course.reviewsCount})</span>
          </div>

          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-lg font-black text-[#20B486]">
                ETB {course.price.toFixed(2)}
              </div>
              {course.originalPrice && (
                <div className="text-[10px] font-bold text-[var(--color-text-tertiary)] line-through">
                  ETB {course.originalPrice.toFixed(2)}
                </div>
              )}
            </div>
            <button className="px-3 py-2 rounded-lg bg-[#07CCFD] hover:bg-[#06B8E4] text-[#0F172A] font-bold text-xs cursor-pointer transition-colors flex items-center gap-1">
              <span>View</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg-tertiary)] pb-20 pt-24 sm:pt-28">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ═══════════════════════════════════════════════════
            HEADER
        ═══════════════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8 sm:mb-10">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#07CCFD] to-[#06B8E4] flex items-center justify-center shrink-0 shadow-md">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-[#0F172A]" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight">
                {t('dashboard.title', 'My Learning')}
              </h1>
            </div>
            <p className="text-[var(--color-text-muted)] font-medium text-sm sm:text-base">
              {t('dashboard.welcome', 'Welcome back! Access your courses and downloads.')}
            </p>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-border-primary)] text-[var(--color-text-secondary)] text-sm font-bold shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all cursor-pointer self-start"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('nav.signOut', 'Log Out')}</span>
            </button>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════
            COORDINATED STATS CARDS (Clean, matches brand)
        ═══════════════════════════════════════════════════ */}
        {myCourses.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
            {/* Card 1: Enrolled Courses */}
            <div className="bg-[var(--color-card-bg)] rounded-2xl p-4 sm:p-5 border border-[var(--color-border-primary)] shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#07CCFD]" />
                </div>
                <div className="text-[10px] font-black text-[var(--color-text-tertiary)] uppercase tracking-wider">
                  Total
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#0F172A] leading-none mb-1">
                {totalEnrolled}
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-[var(--color-text-muted)]">
                Enrolled Courses
              </div>
            </div>

            {/* Card 2: Lessons Completed */}
            <div className="bg-[var(--color-card-bg)] rounded-2xl p-4 sm:p-5 border border-[var(--color-border-primary)] shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#20B486]" />
                </div>
                <div className="text-[10px] font-black text-[#20B486] uppercase tracking-wider">
                  Done
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#0F172A] leading-none mb-1">
                {completedLessonsAll}
                <span className="text-[var(--color-text-tertiary)] text-lg font-bold">/{totalLessonsAll}</span>
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-[var(--color-text-muted)]">
                Lessons Completed
              </div>
            </div>

            {/* Card 3: Overall Progress */}
            <div className="bg-[var(--color-card-bg)] rounded-2xl p-4 sm:p-5 border border-[var(--color-border-primary)] shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <div className="text-[10px] font-black text-[#3B82F6] uppercase tracking-wider">
                  Progress
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <div className="text-2xl sm:text-3xl font-black text-[#0F172A] leading-none">
                  {overallProgress}
                </div>
                <div className="text-[var(--color-text-tertiary)] text-lg font-bold">%</div>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#3B82F6] to-[#07CCFD] rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Card 4: Certificates */}
            <div className="bg-[var(--color-card-bg)] rounded-2xl p-4 sm:p-5 border border-[var(--color-border-primary)] shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div className="text-[10px] font-black text-[#F59E0B] uppercase tracking-wider">
                  Earned
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#0F172A] leading-none mb-1">
                {certificatesEarned}
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-[var(--color-text-muted)]">
                Certificates
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            TABS
        ═══════════════════════════════════════════════════ */}
        <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto hide-scrollbar bg-[var(--color-card-bg)] border border-[var(--color-border-primary)] rounded-2xl p-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer no-min-touch ${
              activeTab === 'courses'
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Courses</span>
            {myCourses.length > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  activeTab === 'courses'
                    ? 'bg-[#07CCFD] text-[#0F172A]'
                    : 'bg-slate-100 text-[var(--color-text-secondary)]'
                }`}
              >
                {myCourses.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer no-min-touch ${
              activeTab === 'resources'
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:bg-slate-50'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Resources</span>
            {myDigitalProducts.length > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  activeTab === 'resources'
                    ? 'bg-[#07CCFD] text-[#0F172A]'
                    : 'bg-slate-100 text-[var(--color-text-secondary)]'
                }`}
              >
                {myDigitalProducts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer no-min-touch ${
              activeTab === 'notes'
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:bg-slate-50'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer no-min-touch ${
              activeTab === 'certificates'
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certificates</span>
            {completedCourses.length > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  activeTab === 'certificates'
                    ? 'bg-[#07CCFD] text-[#0F172A]'
                    : 'bg-slate-100 text-[var(--color-text-secondary)]'
                }`}
              >
                {completedCourses.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer no-min-touch ${
              activeTab === 'history'
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'text-[var(--color-text-secondary)] hover:bg-slate-50'
            }`}
          >
            <ReceiptText className="w-4 h-4" />
            <span>History</span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════
            TAB CONTENT: COURSES
        ═══════════════════════════════════════════════════ */}
        {activeTab === 'courses' && (
          <>
            {myCourses.length === 0 ? (
              <div className="bg-[var(--color-card-bg)] rounded-2xl p-8 sm:p-12 text-center border border-[var(--color-border-primary)] shadow-sm flex flex-col items-center">
                <div className="w-20 h-20 bg-cyan-50 border border-cyan-100 rounded-full flex items-center justify-center mb-5">
                  <BookOpen className="w-10 h-10 text-[#07CCFD]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] mb-2">
                  You haven't started a course yet
                </h2>
                <p className="text-[var(--color-text-muted)] font-medium mb-6 max-w-md text-sm">
                  Explore our courses and start learning today
                </p>
                <button
                  onClick={() => onNavigate('courses')}
                  className="px-6 py-3 rounded-xl bg-[#07CCFD] hover:bg-[#06B8E4] text-[#0F172A] font-bold text-sm shadow-md cursor-pointer transition-colors"
                >
                  Explore Courses
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {myCourses.map((course) => {
                  const p = getCourseProgress(course);
                  const isCompleted = p.percent === 100;

                  return (
                    <div
                      key={course.id}
                      className="bg-[var(--color-card-bg)] rounded-2xl overflow-hidden border border-[var(--color-border-primary)] shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Thumbnail */}
                        <div className="md:w-64 lg:w-72 relative h-40 md:h-auto bg-slate-900 shrink-0">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover opacity-90"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/70 md:from-transparent md:via-transparent md:to-slate-950/30 pointer-events-none"></div>
                          <div className="absolute top-3 left-3 md:bottom-3 md:top-auto">
                            <span className="bg-[#07CCFD] text-[#0F172A] text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
                              {course.category}
                            </span>
                          </div>
                          {isCompleted && (
                            <div className="absolute top-3 right-3 md:right-auto md:left-3 md:top-12">
                              <span className="bg-[#20B486] text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Done
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-5 sm:p-6 flex flex-col">
                          <h3 className="text-lg sm:text-xl font-black text-[#0F172A] mb-2 leading-tight">
                            {course.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] font-medium mb-4 line-clamp-2">
                            {course.description}
                          </p>

                          <div className="mt-auto space-y-4">
                            {/* Progress */}
                            <div>
                              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                                <span className="text-[#07CCFD]">
                                  {p.completedLessons}/{p.totalLessons} lessons
                                </span>
                                <span className="text-[var(--color-text-secondary)]">{p.percent}%</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isCompleted
                                      ? 'bg-[#20B486]'
                                      : 'bg-gradient-to-r from-[#07CCFD] to-[#06B8E4]'
                                  }`}
                                  style={{ width: `${p.percent}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Action row */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] font-medium min-w-0">
                                {isCompleted ? (
                                  <div className="flex items-center gap-2 text-[#20B486]">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    <span className="font-bold">Course Mastered!</span>
                                  </div>
                                ) : (
                                  <>
                                    <PlayCircle className="w-4 h-4 text-[#07CCFD] shrink-0" />
                                    <span className="truncate">
                                      Up next:{' '}
                                      <strong className="text-[#0F172A]">
                                        {getNextLessonTitle(course)}
                                      </strong>
                                    </span>
                                  </>
                                )}
                              </div>
                              <button
                                onClick={() => onStartLearning(course)}
                                className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
                              >
                                <span>{isCompleted ? 'Review' : 'Resume'}</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Recommended */}
                {recommendedCourses.length > 0 && (
                  <div className="pt-12 mt-8 border-t border-[var(--color-border-primary)]">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-[#07CCFD]" />
                        <span className="text-[#07CCFD] font-black text-xs tracking-widest uppercase">
                          Recommended For You
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#0F172A]">
                        Level Up Your Skills
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                      {recommendedCourses.slice(0, 3).map(renderRecommendedCard)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ═══════════════════════════════════════════════════
            TAB CONTENT: RESOURCES
        ═══════════════════════════════════════════════════ */}
        {activeTab === 'resources' && (
          <>
            {myDigitalProducts.length === 0 ? (
              <div className="bg-[var(--color-card-bg)] rounded-2xl p-8 sm:p-12 text-center border border-[var(--color-border-primary)] shadow-sm flex flex-col items-center">
                <div className="w-20 h-20 bg-cyan-50 border border-cyan-100 rounded-full flex items-center justify-center mb-5">
                  <Download className="w-10 h-10 text-[#07CCFD]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] mb-2">
                  No resources yet
                </h2>
                <p className="text-[var(--color-text-muted)] font-medium mb-6 max-w-md text-sm">
                  Purchase digital products to access them instantly here
                </p>
                <button
                  onClick={() => onNavigate('resources')}
                  className="px-6 py-3 rounded-xl bg-[#07CCFD] hover:bg-[#06B8E4] text-[#0F172A] font-bold text-sm shadow-md cursor-pointer transition-colors"
                >
                  Browse Resources
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {myDigitalProducts.map((dp) => {
                  const purchase = purchaseHistory.find((p) => p.itemId === dp.id);
                  return (
                    <div
                      key={dp.id}
                      className="bg-[var(--color-card-bg)] rounded-2xl overflow-hidden border border-[var(--color-border-primary)] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col"
                    >
                      <div className="relative h-40 bg-slate-100 overflow-hidden">
                        <img
                          src={dp.thumbnail}
                          alt={dp.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-[#07CCFD] text-[#0F172A] text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
                          {dp.category}
                        </div>
                      </div>
                      <div className="p-4 sm:p-5 flex flex-col flex-1">
                        <h3 className="font-black text-[#0F172A] text-base leading-snug mb-2">
                          {dp.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] font-medium mb-4">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{dp.files?.length || 0} files</span>
                          <span>•</span>
                          <span>
                            {purchase
                              ? new Date(purchase.purchaseDate).toLocaleDateString()
                              : 'N/A'}
                          </span>
                        </div>
                        <button
                          onClick={() => onAccessResource(dp)}
                          className="mt-auto w-full min-h-[44px] py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          Open Resource
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ═══════════════════════════════════════════════════
            TAB CONTENT: NOTES (NEW!)
        ═══════════════════════════════════════════════════ */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            {/* Header with search */}
            <div className="bg-[var(--color-card-bg)] rounded-2xl border border-[var(--color-border-primary)] shadow-sm p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <PenTool className="w-4 h-4 text-[#07CCFD]" />
                    <h2 className="text-lg font-black text-[#0F172A]">
                      All Your Notes
                    </h2>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] font-medium">
                    Notes you saved while learning — accessible anywhere
                  </p>
                </div>
                <div className="text-[11px] font-bold text-[var(--color-text-muted)] bg-slate-50 border border-[var(--color-border-primary)] px-3 py-1.5 rounded-lg">
                  {allNotes.length} {allNotes.length === 1 ? 'note' : 'notes'}
                </div>
              </div>

              {allNotes.length > 0 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
                  <input
                    type="text"
                    placeholder="Search your notes..."
                    value={notesSearch}
                    onChange={(e) => setNotesSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-[var(--color-border-primary)] rounded-xl focus:outline-none focus:border-[#07CCFD] focus:ring-1 focus:ring-[#07CCFD] transition-all"
                  />
                </div>
              )}
            </div>

            {/* Notes list */}
            {allNotes.length === 0 ? (
              <div className="bg-[var(--color-card-bg)] rounded-2xl p-8 sm:p-12 text-center border border-[var(--color-border-primary)] shadow-sm flex flex-col items-center">
                <div className="w-20 h-20 bg-cyan-50 border border-cyan-100 rounded-full flex items-center justify-center mb-5">
                  <PenTool className="w-10 h-10 text-[#07CCFD]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] mb-2">
                  No notes yet
                </h2>
                <p className="text-[var(--color-text-muted)] font-medium mb-6 max-w-md text-sm">
                  While watching lessons, use the Notes tab in the course player (on
                  tablet/desktop) to save your thoughts. They'll appear here.
                </p>
                {myCourses.length > 0 && (
                  <button
                    onClick={() => onStartLearning(myCourses[0])}
                    className="px-6 py-3 rounded-xl bg-[#07CCFD] hover:bg-[#06B8E4] text-[#0F172A] font-bold text-sm shadow-md cursor-pointer transition-colors flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Continue Learning
                  </button>
                )}
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="bg-[var(--color-card-bg)] rounded-2xl p-8 text-center border border-[var(--color-border-primary)] shadow-sm">
                <p className="text-[var(--color-text-muted)] font-medium text-sm">
                  No notes match "<strong>{notesSearch}</strong>"
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredNotes.map((note) => {
                  const course = myCourses.find((c) => c.id === note.courseId);
                  return (
                    <div
                      key={`${note.courseId}-${note.lessonId}`}
                      className="bg-[var(--color-card-bg)] rounded-2xl border border-[var(--color-border-primary)] shadow-sm hover:shadow-md hover:border-[#07CCFD] transition-all p-5 flex flex-col group"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-black text-[#07CCFD] uppercase tracking-wider mb-1 truncate">
                            {note.courseName}
                          </div>
                          <div className="font-bold text-[#0F172A] text-sm leading-snug">
                            {note.lessonName}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteNote(note.courseId, note.lessonId)}
                          className="w-9 h-9 rounded-lg hover:bg-red-50 hover:text-red-500 text-[var(--color-text-tertiary)] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                          aria-label="Delete note"
                          title="Delete note"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Note content */}
                      <div className="flex-1 mb-4">
                        <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap line-clamp-6">
                          {note.content}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="text-[10px] font-bold text-[var(--color-text-tertiary)]">
                          {note.content.length} characters
                        </div>
                        {course && (
                          <button
                            onClick={() => onStartLearning(course)}
                            className="text-[11px] font-bold text-[#07CCFD] hover:text-[#0F172A] flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Go to lesson</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            TAB CONTENT: CERTIFICATES
        ═══════════════════════════════════════════════════ */}
        {activeTab === 'certificates' && (
          <>
            {completedCourses.length === 0 ? (
              <div className="bg-[var(--color-card-bg)] rounded-2xl p-8 sm:p-12 text-center border border-[var(--color-border-primary)] shadow-sm flex flex-col items-center">
                <div className="w-20 h-20 bg-amber-50 border border-amber-100 rounded-full flex items-center justify-center mb-5">
                  <Award className="w-10 h-10 text-[#F59E0B]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] mb-2">
                  No certificates yet
                </h2>
                <p className="text-[var(--color-text-muted)] font-medium mb-6 max-w-md text-sm">
                  Complete all lessons in a course to earn your first certificate
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-[var(--color-card-bg)] rounded-2xl p-5 sm:p-6 border border-[var(--color-border-primary)] shadow-sm flex items-center justify-between gap-4 hover:shadow-md hover:border-[#F59E0B] transition-all"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center shrink-0">
                        <Award className="w-6 h-6 text-[#F59E0B]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-[#0F172A] text-sm sm:text-base leading-snug mb-0.5 line-clamp-1">
                          {course.title}
                        </h3>
                        <p className="text-[11px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">
                          Earned Certificate
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onViewCertificate(course)}
                      className="min-h-[44px] px-4 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ═══════════════════════════════════════════════════
            TAB CONTENT: HISTORY
        ═══════════════════════════════════════════════════ */}
        {activeTab === 'history' && (
          <div className="bg-[var(--color-card-bg)] rounded-2xl border border-[var(--color-border-primary)] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <ReceiptText className="w-5 h-5 text-[var(--color-text-muted)]" />
              <h2 className="font-bold text-[#0F172A]">Order History</h2>
            </div>
            {purchaseHistory.length === 0 ? (
              <div className="p-8 sm:p-12 text-center text-[var(--color-text-muted)] font-medium text-sm">
                No purchases found
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {purchaseHistory.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            record.type === 'course'
                              ? 'bg-cyan-50 text-[#07CCFD] border border-cyan-100'
                              : record.type === 'bundle'
                              ? 'bg-purple-50 text-purple-600 border border-purple-100'
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}
                        >
                          {record.type}
                        </span>
                        <span className="text-[11px] font-bold text-[var(--color-text-tertiary)]">
                          {new Date(record.purchaseDate).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#0F172A] text-sm sm:text-base truncate">
                        {record.itemTitle}
                      </h3>
                      <div className="text-[11px] text-[var(--color-text-muted)] font-medium mt-0.5">
                        Order ID: {record.id}
                      </div>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <div className="font-black text-[#20B486] text-base">
                        ETB {record.pricePaid.toFixed(2)}
                      </div>
                      <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-1 mt-0.5 sm:justify-end">
                        <CheckCircle2 className="w-3 h-3 text-[#20B486]" />
                        {record.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};