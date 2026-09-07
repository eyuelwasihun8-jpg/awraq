import React, { useState } from 'react';
import { X, Clock, Calendar, Share2, Check } from 'lucide-react';
import { ArticleItem } from '../types';

interface ArticleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: ArticleItem | null;
  onOpenConsultation?: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  isOpen,
  onClose,
  article,
  onOpenConsultation,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !article) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      id="article-detail-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="article-detail-dialog"
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#FBFBFA]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full uppercase tracking-wider">
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              {article.date}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs cursor-pointer"
              title="Share article"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Copied!</span>
                </>
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Article Cover Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold leading-tight">
              {article.title}
            </h2>
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-300">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-6 h-6 rounded-full object-cover border border-white/40"
              />
              <span className="font-semibold text-white">{article.author.name}</span>
              <span>·</span>
              <span>{article.author.role}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-6 max-h-[50vh] overflow-y-auto">
          <p className="text-base sm:text-lg font-serif italic text-slate-800 leading-relaxed border-l-4 border-emerald-500 pl-4 py-1">
            "{article.excerpt}"
          </p>

          <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
            {article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Author Bio Box */}
          <div className="bg-[#F8FAF9] border border-emerald-100 rounded-2xl p-5 flex items-center gap-4 mt-8">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-emerald-200 shrink-0"
            />
            <div>
              <div className="font-serif font-bold text-slate-900 text-base">
                Written by {article.author.name}
              </div>
              <div className="text-xs text-emerald-800 font-medium">
                {article.author.role} at Awraq
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Helping businesses grow with clear copywriting, search traffic, and simple email strategies.
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-[#FBFBFA] px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Awraq Knowledge Hub
          </span>
          {onOpenConsultation && (
            <button
              onClick={() => {
                onClose();
                onOpenConsultation();
              }}
              className="bg-[#064E3B] hover:bg-[#022c22] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors cursor-pointer"
            >
              Book a Consultation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
