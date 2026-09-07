import React, { useState } from 'react';
import { X, Play, Clock, CheckCircle, Share2, Sparkles, BookOpen } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: string;
  duration: string;
  description: string;
  instructor?: string;
  keyTakeaways?: string[];
  youtubeId?: string;
  onOpenConsultation?: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  title,
  category,
  duration,
  description,
  instructor = 'Lamlak',
  keyTakeaways,
  youtubeId = 'f02mOEt11OQ',
  onOpenConsultation
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      id="video-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="video-modal-dialog"
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#FBFBFA]">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full uppercase tracking-wider">
              {category}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {duration}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              id="close-video-modal-btn"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
          {isPlaying ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center group">
              <img
                src={`https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80`}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

              <div className="relative z-10 max-w-md">
                <button
                  id="start-video-playback-btn"
                  onClick={() => setIsPlaying(true)}
                  className="w-20 h-20 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/30 transition-transform active:scale-95 group-hover:scale-110 mb-4 mx-auto cursor-pointer"
                  aria-label="Play video"
                >
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>
                <span className="inline-block text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-1">
                  Awraq Master Class
                </span>
                <h4 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
                  {title}
                </h4>
                <p className="text-xs text-slate-400 mt-1">Instructor: {instructor} · Click to start stream</p>
              </div>
            </div>
          )}
        </div>

        {/* Content & Takeaways */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-xl font-serif font-bold text-slate-900">{title}</h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">{description}</p>
          </div>

          {keyTakeaways && keyTakeaways.length > 0 && (
            <div className="bg-[#F8FAF9] border border-emerald-100 rounded-2xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-3">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Key Actionable Takeaways
              </h4>
              <ul className="space-y-2.5">
                {keyTakeaways.map((point, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bottom Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Full curriculum materials and worksheets available in Awraq programs.</span>
            </div>

            {onOpenConsultation && (
              <button
                onClick={() => {
                  onClose();
                  onOpenConsultation();
                }}
                className="w-full sm:w-auto bg-[#064E3B] hover:bg-[#022c22] text-white text-xs font-semibold px-5 py-2.5 rounded-full cursor-pointer transition-colors"
              >
                Discuss with Lamlak 1-on-1
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
