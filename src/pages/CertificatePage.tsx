import React from 'react';
import { Course, Page } from '../types';
import { ArrowLeft, Award, Download, Share2 } from 'lucide-react';

interface CertificatePageProps {
  course: Course;
  onNavigate: (page: Page) => void;
}

export const CertificatePage: React.FC<CertificatePageProps> = ({ 
  course, 
  onNavigate 
}) => {
  // Use today's date as a mock completion date
  const completionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#3B82F6] transition-colors text-sm font-bold cursor-pointer w-max"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="px-4 py-2 bg-gradient-to-b from-[#3B82F6] to-[#2563EB] text-white rounded-lg text-sm font-bold shadow-sm border-b-[3px] border-[#1D4ED8] hover:border-b-[1px] hover:translate-y-[2px] transition-all flex items-center gap-2 cursor-pointer">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Certificate Container */}
        <div className="bg-white p-2 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
          
          {/* Certificate Inner Border */}
          <div className="border-[8px] border-double border-slate-100 p-8 sm:p-16 lg:p-24 relative overflow-hidden flex flex-col items-center justify-center text-center rounded-2xl bg-white min-h-[600px]">
            
            {/* Background Watermark/Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#20B486]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <Award className="w-20 h-20 text-[#F59E0B] mb-8 relative z-10" />
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1E293B] uppercase tracking-widest font-serif mb-4 relative z-10">
              Certificate
            </h1>
            <h2 className="text-xl sm:text-2xl text-slate-400 font-bold uppercase tracking-[0.3em] mb-12 relative z-10">
              Of Completion
            </h2>

            <p className="text-lg text-slate-500 font-medium italic mb-4 relative z-10">
              This is to proudly certify that
            </p>

            <div className="text-3xl sm:text-4xl font-black text-[#3B82F6] border-b-2 border-slate-200 pb-2 mb-8 px-12 relative z-10 inline-block min-w-[300px]">
              {/* Mock Student Name */}
              Awraq Student
            </div>

            <p className="text-lg text-slate-500 font-medium italic mb-4 relative z-10">
              has successfully completed all requirements for the course
            </p>

            <div className="text-2xl sm:text-3xl font-black text-[#1E293B] mb-16 relative z-10 max-w-2xl">
              {course.title}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-3xl relative z-10 mt-auto pt-8 border-t border-slate-100 gap-8">
              <div className="text-center">
                <div className="text-lg font-bold text-[#1E293B] font-serif mb-1">{course.instructor.name}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-slate-300 pt-2 px-8">Instructor</div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <div className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></div>
                  </div>
                </div>
                <span className="font-black text-[#1E293B] text-xl tracking-tight">AWRAQ</span>
              </div>

              <div className="text-center">
                <div className="text-lg font-bold text-[#1E293B] font-serif mb-1">{completionDate}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-slate-300 pt-2 px-8">Date Issued</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};