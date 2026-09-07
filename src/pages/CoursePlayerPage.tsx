import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Course, Page } from '../types';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FileText,
  Menu,
  X,
  Award,
  PenTool,
  Save,
  PartyPopper,
  Sparkles,
  Search,
  PanelLeftClose,
  PanelLeft,
  BookOpen,
  Download,
  Play,
} from 'lucide-react';

interface CoursePlayerPageProps {
  course: Course;
  progress: { completedLessons: string[]; lastLessonId?: string };
  onUpdateProgress: (courseId: string, completedLessons: string[], lastLessonId: string) => void;
  onNavigate: (page: Page) => void;
}

type SidebarTab = 'outline' | 'resources' | 'notes';

export const CoursePlayerPage: React.FC<CoursePlayerPageProps> = ({
  course,
  progress,
  onUpdateProgress,
  onNavigate,
}) => {
  const { t } = useTranslation();

  const allLessons = course.modules.flatMap((m) => m.lessons);

  const [activeLessonId, setActiveLessonId] = useState<string>(
    progress.lastLessonId || allLessons[0]?.id || ''
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('outline');
  const [searchQuery, setSearchQuery] = useState('');

  // ────────────────────────────────────────────────────────
  // MODULE EXPANSION STATE — Only first module expanded by default
  // ────────────────────────────────────────────────────────
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    course.modules.forEach((m, idx) => {
      initial[m.id] = idx === 0; // Only first module expanded
    });
    return initial;
  });

  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(`awraq_notes_${course.id}`);
    return saved ? JSON.parse(saved) : {};
  });
  const [isSavingNote, setIsSavingNote] = useState(false);

  const [showCelebration, setShowCelebration] = useState(false);

  const activeLessonIndex = allLessons.findIndex((l) => l.id === activeLessonId);
  const activeLesson = allLessons[activeLessonIndex];

  const hasNext = activeLessonIndex < allLessons.length - 1;
  const hasPrev = activeLessonIndex > 0;

  const progressPercent =
    allLessons.length === 0
      ? 0
      : Math.round((progress.completedLessons.length / allLessons.length) * 100);
  const isCourseFullyCompleted = progressPercent === 100;

  // Persist notes
  useEffect(() => {
    localStorage.setItem(`awraq_notes_${course.id}`, JSON.stringify(notes));
  }, [notes, course.id]);

  // Update progress + auto-expand module containing active lesson
  useEffect(() => {
    if (activeLessonId) {
      onUpdateProgress(course.id, progress.completedLessons, activeLessonId);

      // Auto-expand module of active lesson (so user can see where they are)
      const activeModule = course.modules.find((m) =>
        m.lessons.some((l) => l.id === activeLessonId)
      );
      if (activeModule && !expandedModules[activeModule.id]) {
        setExpandedModules((prev) => ({ ...prev, [activeModule.id]: true }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLessonId]);

  // Toggle module expansion
  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  // Search filter for modules/lessons
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return course.modules;
    const q = searchQuery.toLowerCase();
    return course.modules
      .map((module) => ({
        ...module,
        lessons: module.lessons.filter((l) => l.title.toLowerCase().includes(q)),
      }))
      .filter((m) => m.lessons.length > 0 || m.title.toLowerCase().includes(q));
  }, [searchQuery, course.modules]);

  // Auto-expand all matching modules when searching
  useEffect(() => {
    if (searchQuery.trim()) {
      const newExpanded: Record<string, boolean> = {};
      filteredModules.forEach((m) => {
        newExpanded[m.id] = true;
      });
      setExpandedModules((prev) => ({ ...prev, ...newExpanded }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleNext = () => {
    if (hasNext) setActiveLessonId(allLessons[activeLessonIndex + 1].id);
  };

  const handlePrev = () => {
    if (hasPrev) setActiveLessonId(allLessons[activeLessonIndex - 1].id);
  };

  const handleCompleteAndContinue = () => {
    const isAlreadyCompleted = progress.completedLessons.includes(activeLessonId);
    const newCompleted = isAlreadyCompleted
      ? progress.completedLessons
      : [...progress.completedLessons, activeLessonId];

    const isNowComplete = newCompleted.length === allLessons.length;
    if (isNowComplete && !isCourseFullyCompleted) {
      setShowCelebration(true);
    }

    if (hasNext) {
      const nextId = allLessons[activeLessonIndex + 1].id;
      setActiveLessonId(nextId);
      onUpdateProgress(course.id, newCompleted, nextId);
    } else {
      onUpdateProgress(course.id, newCompleted, activeLessonId);
    }
  };

  const handleSaveNote = () => {
    setIsSavingNote(true);
    setTimeout(() => setIsSavingNote(false), 800);
  };

  const getLessonIcon = (lessonId: string, isActive: boolean) => {
    if (progress.completedLessons.includes(lessonId)) {
      return (
        <div className="w-6 h-6 rounded-full bg-[#20B486] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4 text-white" />
        </div>
      );
    }
    if (isActive) {
      return (
        <div className="w-6 h-6 rounded-full border-2 border-[#07CCFD] bg-[#07CCFD]/10 flex items-center justify-center shrink-0">
          <div className="w-2 h-2 rounded-full bg-[#07CCFD]"></div>
        </div>
      );
    }
    return <Circle className="w-6 h-6 text-slate-300 shrink-0" strokeWidth={1.5} />;
  };

  if (!activeLesson) return null;

  const currentModule = course.modules.find((m) =>
    m.lessons.some((l) => l.id === activeLesson.id)
  );
  const currentModuleIndex = course.modules.findIndex((m) =>
    m.lessons.some((l) => l.id === activeLesson.id)
  );

  return (
    <div className="player-lock bg-[#0F172A] flex flex-col overflow-hidden">
      {/* ═══════════════════════════════════════════════════════
          TOP BAR
      ═══════════════════════════════════════════════════════ */}
      <header
        className="bg-[#0F172A] border-b border-slate-800 flex items-center justify-between px-3 sm:px-5 z-40 shrink-0"
        style={{ paddingTop: 'env(safe-area-inset-top)', minHeight: '56px' }}
      >
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-300 transition-colors cursor-pointer shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="font-bold text-white text-sm sm:text-base truncate">
              {course.title}
            </h1>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <span>
                {progress.completedLessons.length} of {allLessons.length} lessons
              </span>
              <span>•</span>
              <span className="text-[#07CCFD] font-bold">{progressPercent}% complete</span>
            </div>
          </div>
        </div>

        {/* Progress bar (desktop) */}
        <div className="hidden md:flex items-center gap-3 w-56">
          <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#07CCFD] to-[#20B486] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold text-white shrink-0">
            {progress.completedLessons.length}/{allLessons.length}
          </span>
        </div>

        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="lg:hidden w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white cursor-pointer ml-2"
          aria-label="Course content"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* ═══════════════════════════════════════════════════════
          BODY
      ═══════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDEBAR */}
        <aside
          className={`
            ${isSidebarOpen ? 'lg:w-96 xl:w-[420px]' : 'lg:w-0'}
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            fixed lg:relative top-0 left-0 h-full lg:h-auto
            w-[min(22rem,90vw)] lg:transition-all lg:duration-300
            bg-white border-r border-slate-200 z-30 flex flex-col shrink-0
            transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
            overflow-hidden
          `}
        >
          <div className="w-[min(22rem,90vw)] lg:w-96 xl:w-[420px] h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Course
                  </div>
                  <div className="text-sm font-black text-[#0F172A] leading-tight mt-0.5">
                    Content
                  </div>
                </div>

                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="hidden lg:flex w-9 h-9 rounded-lg hover:bg-slate-200 items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  aria-label="Collapse sidebar"
                  title="Collapse sidebar"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="lg:hidden w-9 h-9 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex px-2 mt-2">
                <button
                  onClick={() => setActiveSidebarTab('outline')}
                  className={`flex-1 flex items-center justify-center gap-1.5 pb-3 pt-1.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                    activeSidebarTab === 'outline'
                      ? 'border-[#07CCFD] text-[#0F172A]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Outline</span>
                </button>
                <button
                  onClick={() => setActiveSidebarTab('resources')}
                  className={`flex-1 flex items-center justify-center gap-1.5 pb-3 pt-1.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                    activeSidebarTab === 'resources'
                      ? 'border-[#07CCFD] text-[#0F172A]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Resources</span>
                </button>
                <button
                  onClick={() => setActiveSidebarTab('notes')}
                  className={`hidden md:flex flex-1 items-center justify-center gap-1.5 pb-3 pt-1.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                    activeSidebarTab === 'notes'
                      ? 'border-[#07CCFD] text-[#0F172A]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Notes</span>
                </button>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* ═════════ OUTLINE TAB ═════════ */}
              {activeSidebarTab === 'outline' && (
                <div>
                  {/* Search */}
                  <div className="p-4 sticky top-0 bg-white z-10 border-b border-slate-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search lessons..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#07CCFD] focus:ring-1 focus:ring-[#07CCFD] transition-all"
                      />
                    </div>
                  </div>

                  {/* Modules */}
                  <div className="pb-6">
                    {filteredModules.length === 0 && (
                      <div className="p-8 text-center text-sm text-slate-500 font-medium">
                        No lessons found for "{searchQuery}"
                      </div>
                    )}

                    {filteredModules.map((module) => {
                      const moduleIdxOriginal = course.modules.findIndex((m) => m.id === module.id);
                      const moduleCompletedCount = module.lessons.filter((l) =>
                        progress.completedLessons.includes(l.id)
                      ).length;
                      const moduleProgress =
                        module.lessons.length === 0
                          ? 0
                          : Math.round((moduleCompletedCount / module.lessons.length) * 100);

                      const isExpanded = !!expandedModules[module.id];
                      const hasActiveLesson = module.lessons.some((l) => l.id === activeLessonId);

                      return (
                        <div key={module.id} className="border-b border-slate-100 last:border-b-0">
                          {/* MODULE HEADER — CLICKABLE TO EXPAND/COLLAPSE */}
                          <button
                            onClick={() => toggleModule(module.id)}
                            className={`w-full px-4 py-3 text-left transition-colors cursor-pointer ${
                              hasActiveLesson
                                ? 'bg-cyan-50/50 hover:bg-cyan-50'
                                : 'bg-slate-50/70 hover:bg-slate-100/70'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="min-w-0 flex-1">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                                  Module {moduleIdxOriginal + 1}
                                </div>
                                <h4 className="font-bold text-[#0F172A] text-sm leading-snug mt-0.5">
                                  {module.title}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <div className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-md">
                                  {moduleCompletedCount}/{module.lessons.length}
                                </div>
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center bg-white border border-slate-200 transition-transform duration-300 ${
                                    isExpanded ? 'rotate-180' : 'rotate-0'
                                  }`}
                                >
                                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                                </div>
                              </div>
                            </div>

                            {/* Module progress bar */}
                            <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  moduleProgress === 100 ? 'bg-[#20B486]' : 'bg-[#07CCFD]'
                                }`}
                                style={{ width: `${moduleProgress}%` }}
                              ></div>
                            </div>
                          </button>

                          {/* LESSONS (only visible if module is expanded) */}
                          {isExpanded && (
                            <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                              {module.lessons.map((lesson) => {
                                const isActive = activeLessonId === lesson.id;
                                const isCompleted = progress.completedLessons.includes(lesson.id);

                                return (
                                  <button
                                    key={lesson.id}
                                    onClick={() => {
                                      setActiveLessonId(lesson.id);
                                      setIsMobileSidebarOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 flex items-start gap-3 text-left transition-colors cursor-pointer border-l-[3px] ${
                                      isActive
                                        ? 'bg-cyan-50/70 border-[#07CCFD]'
                                        : 'border-transparent hover:bg-slate-50'
                                    }`}
                                  >
                                    {getLessonIcon(lesson.id, isActive)}
                                    <div className="flex-1 min-w-0">
                                      <div
                                        className={`text-sm leading-snug ${
                                          isActive
                                            ? 'font-black text-[#0F172A]'
                                            : isCompleted
                                            ? 'font-medium text-slate-600'
                                            : 'font-medium text-slate-700'
                                        }`}
                                      >
                                        {lesson.title}
                                      </div>
                                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mt-1">
                                        {lesson.type === 'video' && (
                                          <PlayCircle className="w-3 h-3" />
                                        )}
                                        {lesson.type === 'reading' && (
                                          <FileText className="w-3 h-3" />
                                        )}
                                        {lesson.type === 'resource' && (
                                          <Download className="w-3 h-3" />
                                        )}
                                        <span>{lesson.duration || '00:00'}</span>
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ═════════ RESOURCES TAB ═════════ */}
              {activeSidebarTab === 'resources' && (
                <div className="p-4 space-y-3">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">
                    Lesson Resources
                  </div>

                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-[#07CCFD] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-[#0F172A] truncate group-hover:text-[#07CCFD]">
                        Lesson Slides.pdf
                      </div>
                      <div className="text-[11px] font-medium text-slate-500">PDF • 2.4 MB</div>
                    </div>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-[#07CCFD] shrink-0" />
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-[#07CCFD] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-[#0F172A] truncate group-hover:text-[#07CCFD]">
                        Worksheet.xlsx
                      </div>
                      <div className="text-[11px] font-medium text-slate-500">Excel • 1.1 MB</div>
                    </div>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-[#07CCFD] shrink-0" />
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-[#07CCFD] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-[#0F172A] truncate group-hover:text-[#07CCFD]">
                        Additional Reading.pdf
                      </div>
                      <div className="text-[11px] font-medium text-slate-500">PDF • 800 KB</div>
                    </div>
                    <Download className="w-4 h-4 text-slate-400 group-hover:text-[#07CCFD] shrink-0" />
                  </a>

                  <div className="text-xs font-medium text-slate-500 text-center pt-4">
                    Resources for this lesson
                  </div>
                </div>
              )}

              {/* ═════════ NOTES TAB (Desktop/Tablet only) ═════════ */}
              {activeSidebarTab === 'notes' && (
                <div className="hidden md:flex flex-col h-full">
                  <div className="p-4 border-b border-slate-100">
                    <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">
                      Notes for
                    </div>
                    <div className="text-sm font-bold text-[#0F172A] leading-tight">
                      {activeLesson.title}
                    </div>
                  </div>

                  <div className="flex-1 p-4 flex flex-col overflow-hidden">
                    <textarea
                      value={notes[activeLesson.id] || ''}
                      onChange={(e) =>
                        setNotes({ ...notes, [activeLesson.id]: e.target.value })
                      }
                      placeholder="Write your notes here... They will be saved automatically."
                      className="flex-1 w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#07CCFD] focus:ring-1 focus:ring-[#07CCFD] resize-none min-h-[200px]"
                    />

                    <div className="flex items-center justify-between mt-3">
                      <div className="text-[11px] text-slate-500 font-medium">
                        {(notes[activeLesson.id] || '').length} characters
                      </div>
                      <button
                        onClick={handleSaveNote}
                        className="px-4 py-2 bg-[#07CCFD] hover:bg-[#06B8E4] text-[#0F172A] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {isSavingNote ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-20 lg:hidden cursor-pointer"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="hidden lg:flex fixed left-3 top-20 z-30 w-10 h-10 rounded-lg bg-white shadow-lg border border-slate-200 items-center justify-center text-slate-600 hover:text-[#07CCFD] hover:border-[#07CCFD] transition-all cursor-pointer"
              aria-label="Show sidebar"
              title="Show course content"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          )}

          <div className="max-w-6xl mx-auto">
            {/* Completion Banner */}
            {isCourseFullyCompleted && !showCelebration && (
              <div className="px-4 sm:px-6 pt-4 sm:pt-6">
                <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-[#20B486] text-white rounded-full flex items-center justify-center shrink-0 shadow-md">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-[#0F172A] text-sm sm:text-base">
                        Course Completed!
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium">
                        You mastered all lessons.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate(course.isFree ? 'home' : 'certificate')}
                    className="w-full sm:w-auto whitespace-nowrap px-5 py-3 bg-[#20B486] hover:bg-[#059669] text-white text-sm font-bold rounded-xl shadow-sm cursor-pointer"
                  >
                    {course.isFree ? 'Finish' : 'View Certificate'}
                  </button>
                </div>
              </div>
            )}

            {/* Video Player */}
            <div className="px-0 sm:px-6 pt-4 sm:pt-6">
              <div className="relative bg-black w-full aspect-video sm:rounded-2xl overflow-hidden shadow-xl group">
                <img
                  src={course.thumbnail}
                  alt="Lesson video"
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />

                {hasPrev && (
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center z-10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    aria-label="Previous lesson"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                )}
                {hasNext && (
                  <button
                    onClick={handleNext}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center z-10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    aria-label="Next lesson"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                )}

                <button
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 sm:w-20 sm:h-20 bg-white/95 hover:bg-white text-[#0F172A] rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-2xl"
                  aria-label="Play video"
                >
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current ml-1" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="text-[10px] sm:text-xs font-black text-[#07CCFD] uppercase tracking-wider mb-1">
                    Module {currentModuleIndex + 1} • Lesson {activeLessonIndex + 1}
                  </div>
                  <div className="text-white font-black text-base sm:text-lg leading-snug">
                    {activeLesson.title}
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="px-4 sm:px-6 py-6 sm:py-8 pb-32 sm:pb-24">
              <div className="mb-6">
                <div className="text-[#07CCFD] text-xs font-black uppercase tracking-wider mb-2">
                  {currentModule?.title}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] mb-3 leading-tight">
                  {activeLesson.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {activeLesson.description ||
                    'Watch this lesson to uncover key strategies and practical examples. Apply these concepts directly to your ongoing projects.'}
                </p>
              </div>

              {/* Mobile-only Resources (since Notes is hidden on mobile) */}
              <div className="md:hidden bg-white border border-slate-200 rounded-2xl p-5 mb-6">
                <h3 className="font-bold text-[#0F172A] mb-3 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#07CCFD]" />
                  Lesson Resources
                </h3>
                <a
                  href="#"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[#0F172A]">Lesson Slides</div>
                    <div className="text-[11px] text-slate-500">PDF • 2.4 MB</div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              {/* Navigation Actions */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-slate-200">
                <button
                  onClick={handlePrev}
                  disabled={!hasPrev}
                  className="sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm border-2 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white min-h-[48px]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleCompleteAndContinue}
                  disabled={isCourseFullyCompleted && !hasNext}
                  className="sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-b from-[#20B486] to-[#059669] text-white font-bold text-sm shadow-[0_6px_16px_rgba(32,180,134,0.3)] border-b-[4px] border-[#047857] hover:border-b-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed min-h-[48px]"
                >
                  <span>{hasNext ? 'Complete & Continue' : 'Finish Course'}</span>
                  {hasNext ? <ChevronRight className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* CELEBRATION MODAL */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative bg-white rounded-3xl p-6 sm:p-10 max-w-md w-full text-center shadow-2xl border-4 border-[#20B486] animate-in zoom-in-90 duration-500">
            <div className="absolute -top-8 -left-4 text-5xl animate-bounce" style={{ animationDelay: '0.1s' }}>
              🎊
            </div>
            <div className="absolute -top-10 right-0 text-5xl animate-bounce" style={{ animationDelay: '0.3s' }}>
              🎈
            </div>
            <div className="absolute top-16 -right-6 text-4xl animate-pulse">✨</div>

            <div className="w-20 h-20 bg-gradient-to-br from-[#20B486] to-[#047857] rounded-full mx-auto flex items-center justify-center mb-5 shadow-xl relative z-10">
              <PartyPopper className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] mb-2">
              CONGRATULATIONS!
            </h2>
            <div className="flex items-center justify-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-[#F59E0B] font-bold tracking-widest uppercase text-xs">
                Course Mastered
              </span>
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            </div>

            <p className="text-slate-600 text-sm sm:text-base font-medium mb-6 leading-relaxed">
              You did it! You successfully completed{' '}
              <strong className="text-[#0F172A]">{course.title}</strong>.
            </p>

            <button
              onClick={() => {
                setShowCelebration(false);
                onNavigate(course.isFree ? 'home' : 'certificate');
              }}
              className="w-full min-h-[48px] py-3.5 rounded-xl bg-gradient-to-b from-[#07CCFD] to-[#06B8E4] text-[#0F172A] font-black text-base shadow-lg border-b-[4px] border-[#05A3CA] hover:border-b-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-5 h-5" />
              {course.isFree ? 'Finish Learning' : 'Claim My Certificate'}
            </button>

            <button
              onClick={() => setShowCelebration(false)}
              className="mt-3 text-slate-400 text-xs font-bold hover:text-slate-600 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};