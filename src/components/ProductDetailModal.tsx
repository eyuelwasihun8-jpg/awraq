import React from 'react';
import { Course, DigitalProduct, BundleItem, ResourceItem } from '../types';
import { X, ArrowRight, Download, FileText, CheckCircle2 } from 'lucide-react';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Course | DigitalProduct | BundleItem | ResourceItem | null;
  type: 'course' | 'digital' | 'bundle' | 'resource';
  onBuy?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  item,
  type,
  onBuy
}) => {
  if (!isOpen || !item) return null;

  const isDigital = type === 'digital' || type === 'resource';
  const digitalProduct = isDigital ? (item as DigitalProduct) : null;

  // Safely grab file info from the first file in the array to avoid undefined errors
  const displayFileType = digitalProduct?.files && digitalProduct.files.length > 0 
    ? digitalProduct.files[0].type 
    : 'PDF / Excel';
    
  const displayFileSize = digitalProduct?.files && digitalProduct.files.length > 0 
    ? digitalProduct.files[0].size 
    : 'Multiple Files';

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full flex items-center justify-center z-10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-64 sm:h-72 w-full bg-slate-900 shrink-0">
          <img 
            src={isDigital ? digitalProduct?.thumbnail : (item as any).thumbnail} 
            alt={item.title} 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <span className="bg-[#3B82F6] text-white text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-widest shadow-md mb-3 inline-block">
              {isDigital ? 'Digital Product' : 'Course / Bundle'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {item.title}
            </h2>
          </div>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-50">
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-lg font-black text-[#1E293B] mb-2">Overview</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>

              {isDigital && digitalProduct && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">File Details</div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <FileText className="w-5 h-5 text-[#3B82F6]" />
                    <span>Format: <strong className="text-[#1E293B]">{displayFileType}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <Download className="w-5 h-5 text-[#3B82F6]" />
                    <span>Size: <strong className="text-[#1E293B]">{displayFileSize}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-[#3B82F6]" />
                    <span>Instant Download After Purchase</span>
                  </div>
                </div>
              )}
            </div>

            <div className="sm:w-64 shrink-0">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-0">
                <div className="text-3xl font-black text-[#20B486] mb-1">
                  ETB {item.price.toFixed(2)}
                </div>
                {((item as any).originalPrice || (item as any).originalValue) && (
                  <div className="text-sm font-bold text-slate-400 line-through mb-6">
                    Normally ETB {((item as any).originalPrice || (item as any).originalValue).toFixed(2)}
                  </div>
                )}

                <button 
                  onClick={() => {
                    if (onBuy) {
                      onBuy();
                      onClose();
                    }
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-b from-[#3B82F6] to-[#2563EB] text-white font-bold text-sm shadow-[0_8px_20px_rgba(59,130,246,0.3)] border-b-[4px] border-[#1D4ED8] hover:border-b-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};