import React from 'react';
import { DigitalProduct, Page } from '../types';
import { ArrowLeft, Download, FileText, Lock, CheckCircle2 } from 'lucide-react';

interface ResourceAccessPageProps {
  product: DigitalProduct;
  isOwned: boolean;
  purchaseDate?: string;
  onNavigate: (page: Page) => void;
  onBuy: () => void;
}

export const ResourceAccessPage: React.FC<ResourceAccessPageProps> = ({ 
  product, 
  isOwned,
  purchaseDate,
  onNavigate,
  onBuy
}) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#3B82F6] transition-colors text-sm font-bold mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-8 sm:p-10 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row items-start md:items-center gap-8">
            <img 
              src={product.thumbnail} 
              alt={product.title} 
              className="w-32 h-32 rounded-2xl object-cover shadow-sm border border-slate-200" 
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-[#3B82F6]/10 text-[#3B82F6] text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                  Digital Resource
                </span>
                {isOwned && (
                  <span className="flex items-center gap-1 text-[#20B486] text-[11px] font-bold bg-emerald-50 px-2.5 py-1 rounded">
                    <CheckCircle2 className="w-3 h-3" />
                    Purchased
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1E293B] mb-2">{product.title}</h1>
              <p className="text-sm text-slate-500 font-medium line-clamp-2">{product.description}</p>
              
              {isOwned && purchaseDate && (
                <div className="mt-4 text-xs font-bold text-slate-400">
                  Purchased on: {purchaseDate}
                </div>
              )}
            </div>
          </div>

          {/* Access Area */}
          <div className="p-8 sm:p-10">
            <h2 className="text-lg font-black text-[#1E293B] mb-6">Files Included</h2>
            
            <div className="space-y-4">
              {product.files.map((file) => (
                <div key={file.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-[#3B82F6]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1E293B] text-sm">{file.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                        <span>{file.type}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>{file.size}</span>
                      </div>
                    </div>
                  </div>
                  
                  {isOwned ? (
                    <a 
                      href={file.url} 
                      download
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" />
                      Download Resource
                    </a>
                  ) : (
                    <button 
                      className="px-6 py-2.5 bg-slate-100 text-slate-400 font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-not-allowed whitespace-nowrap"
                      disabled
                    >
                      <Lock className="w-4 h-4" />
                      Locked
                    </button>
                  )}
                </div>
              ))}
            </div>

            {!isOwned && (
              <div className="mt-10 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                <Lock className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <h3 className="font-bold text-[#1E293B] mb-2">Access Required</h3>
                <p className="text-sm text-slate-500 mb-6">You need to purchase this resource to unlock the downloads.</p>
                <button 
                  onClick={onBuy}
                  className="px-8 py-3 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Buy Resource — ETB {product.price.toFixed(2)}
                </button>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
};