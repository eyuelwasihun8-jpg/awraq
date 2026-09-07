import React, { useState } from 'react';
import { Course, DigitalProduct, BundleItem, Page } from '../types';
import { ArrowLeft, ShieldCheck, CheckCircle2, Download, PlayCircle, Layers, Loader2 } from 'lucide-react';

interface CheckoutPageProps {
  item: Course | DigitalProduct | BundleItem;
  onNavigate: (page: Page) => void;
  onCompletePurchase: (itemId: string, type: 'course' | 'digital' | 'bundle') => void;
}

type PaymentMethod = 'telebirr' | 'cbe' | 'chapa-hosted';

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ 
  item, 
  onNavigate,
  onCompletePurchase 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('telebirr');
  const [phoneNumber, setPhoneNumber] = useState('');

  const isBundle = 'includedCourseIds' in item;
  const isCourse = 'lessonsCount' in item;
  const itemType = isBundle ? 'bundle' : (isCourse ? 'course' : 'digital');

  const originalPrice = ('originalValue' in item && item.originalValue) 
    ? item.originalValue 
    : ('originalPrice' in item && item.originalPrice) 
      ? item.originalPrice 
      : null;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  const finishCheckout = () => {
    onCompletePurchase(item.id, itemType);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-tertiary)] flex items-center justify-center p-4 pt-24 pb-20">
        <div className="bg-[var(--color-card-bg)] rounded-3xl p-8 sm:p-10 max-w-lg w-full text-center shadow-2xl border border-[var(--color-border-primary)] animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#20B486]" />
          </div>
          <h2 className="text-3xl font-black text-[#1E293B] mb-2">Purchase Complete!</h2>
          <p className="text-[var(--color-text-muted)] font-medium mb-8">
            Your payment was successful and your order has been created.
          </p>
          
          <div className="bg-slate-50 rounded-xl p-5 mb-8 text-left border border-[var(--color-border-subtle)]">
            <div className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">Access Granted For</div>
            <div className="font-bold text-[#1E293B] text-lg mb-2 leading-snug">{item.title}</div>
            {isBundle && (
              <div className="text-xs font-bold text-[#8B5CF6] flex items-center gap-1.5 mt-2 bg-purple-50 w-max px-2 py-1 rounded">
                <Layers className="w-3 h-3" /> All included items unlocked
              </div>
            )}
          </div>

          <button 
            onClick={finishCheckout}
            className="w-full py-4 rounded-xl bg-gradient-to-b from-[#3B82F6] to-[#2563EB] text-white font-bold text-lg shadow-[0_8px_20px_rgba(59,130,246,0.3)] border-b-[4px] border-[#1D4ED8] hover:border-b-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
          >
            {isBundle ? 'Go to Dashboard' : isCourse ? 'Access Your Course' : 'Access Your Resource'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-tertiary)] pb-20 pt-28">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[#3B82F6] transition-colors text-sm font-bold mb-8 cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-3/5 space-y-8">
            <div>
              <h1 className="text-3xl font-black text-[#1E293B] mb-2">Checkout</h1>
              <p className="text-[var(--color-text-muted)] font-medium">Complete your purchase securely via our payment gateway.</p>
            </div>

            <div className="bg-[var(--color-card-bg)] p-6 sm:p-8 rounded-3xl border border-[var(--color-border-primary)] shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-[var(--color-border-subtle)]">
                <h2 className="text-xl font-bold text-[#1E293B]">Select Payment Method</h2>
                <div className="flex gap-3 items-center">
                  <span className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider hidden sm:inline-block">Secured by</span>
                  <div className="flex items-center gap-1.5 bg-[#00A859]/10 px-4 py-2 sm:py-2.5 rounded-xl border border-[#00A859]/20 select-none">
                    <img 
                      src="https://res.cloudinary.com/dw1ohipim/image/upload/v1788632675/ld6lrrjjjomckurrj33r.png" 
                      alt="Chapa" 
                      className="h-7 sm:h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', '<span class="text-[#00A859] font-black text-sm">Chapa</span>');
                      }}
                    />
                  </div>
                </div>
              </div>

              <form onSubmit={handlePayment} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <button type="button" onClick={() => setPaymentMethod('telebirr')} className={`p-4 sm:p-5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${paymentMethod === 'telebirr' ? 'border-[#00AEEF] bg-[#00AEEF]/5 shadow-[0_4px_20px_rgba(0,174,239,0.15)]' : 'border-[var(--color-border-subtle)] bg-[var(--color-card-bg)] hover:border-[var(--color-border-primary)]'}`}>
                    <div className="h-12 sm:h-14 w-full flex items-center justify-center"><img src="https://res.cloudinary.com/dw1ohipim/image/upload/v1788632382/wjtaklspt9asl4yteegl.png" alt="Telebirr" className={`h-full max-w-full object-contain transition-all duration-300 ${paymentMethod === 'telebirr' ? 'opacity-100 scale-110' : 'opacity-60 hover:opacity-80'}`} /></div>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('cbe')} className={`p-4 sm:p-5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${paymentMethod === 'cbe' ? 'border-[#4B2A75] bg-[#4B2A75]/5 shadow-[0_4px_20px_rgba(75,42,117,0.15)]' : 'border-[var(--color-border-subtle)] bg-[var(--color-card-bg)] hover:border-[var(--color-border-primary)]'}`}>
                    <div className="h-12 sm:h-14 w-full flex items-center justify-center"><img src="https://res.cloudinary.com/dw1ohipim/image/upload/v1788632573/lxp7cb2oodriohs1rx1z.png" alt="CBE Birr" className={`h-full max-w-full object-contain transition-all duration-300 ${paymentMethod === 'cbe' ? 'opacity-100 scale-110' : 'opacity-60 hover:opacity-80'}`} /></div>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('chapa-hosted')} className={`p-4 sm:p-5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${paymentMethod === 'chapa-hosted' ? 'border-[#00A859] bg-[#00A859]/5 shadow-[0_4px_20px_rgba(0,168,89,0.15)]' : 'border-[var(--color-border-subtle)] bg-[var(--color-card-bg)] hover:border-[var(--color-border-primary)]'}`}>
                    <div className="h-10 sm:h-12 w-full flex items-center justify-center mb-1"><img src="https://res.cloudinary.com/dw1ohipim/image/upload/v1788632675/ld6lrrjjjomckurrj33r.png" alt="Chapa" className={`h-full max-w-full object-contain transition-all duration-300 ${paymentMethod === 'chapa-hosted' ? 'opacity-100 scale-110' : 'opacity-60 hover:opacity-80'}`} /></div>
                    <span className={`text-[11px] font-black uppercase tracking-wider transition-colors ${paymentMethod === 'chapa-hosted' ? 'text-[#00A859]' : 'text-[var(--color-text-tertiary)]'}`}>Other Banks</span>
                  </button>
                </div>

                {(paymentMethod === 'telebirr' || paymentMethod === 'cbe') && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{paymentMethod === 'telebirr' ? 'Telebirr Mobile Number' : 'CBE Account / Phone Number'}</label>
                    <div className="flex shadow-sm">
                      <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-[var(--color-border-primary)] bg-slate-100 text-[var(--color-text-muted)] text-sm font-bold">+251</span>
                      <input required type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="9XX XXX XXX" className="w-full bg-slate-50 border border-[var(--color-border-primary)] rounded-r-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all font-mono tracking-widest" />
                    </div>
                    <div className="flex items-start gap-2 pt-2 text-[#00A859]">
                      <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                      <p className="text-[12px] font-medium leading-snug">A secure payment request will be sent to your mobile device. Please enter your PIN to authorize the transaction.</p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'chapa-hosted' && (
                  <div className="bg-slate-50 rounded-xl p-5 border border-[var(--color-border-subtle)] text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <p className="text-sm font-medium text-[var(--color-text-secondary)]">You will be securely redirected to Chapa's official gateway to complete your payment.</p>
                  </div>
                )}

                <button type="submit" disabled={isProcessing || ((paymentMethod === 'telebirr' || paymentMethod === 'cbe') && phoneNumber.length < 9)} className="w-full mt-8 py-4 rounded-xl bg-gradient-to-b from-[#3B82F6] to-[#2563EB] text-white font-bold text-lg shadow-[0_8px_20px_rgba(59,130,246,0.3)] border-b-[4px] border-[#1D4ED8] hover:border-b-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
                  {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /><span>Processing Secure Order...</span></> : <><ShieldCheck className="w-5 h-5" /><span>Pay ETB {item.price.toFixed(2)} Securely</span></>}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:w-2/5">
            <div className="bg-[var(--color-card-bg)] rounded-3xl p-6 border border-[var(--color-border-primary)] shadow-sm sticky top-28">
              <h3 className="text-lg font-black text-[#1E293B] mb-6">Order Summary</h3>
              <div className="flex gap-4 mb-6 pb-6 border-b border-[var(--color-border-subtle)]">
                <img src={item.thumbnail} alt={item.title} className="w-24 h-16 rounded-lg object-cover border border-[var(--color-border-subtle)] shadow-sm" />
                <div>
                  <div className="font-bold text-[#1E293B] text-sm leading-snug mb-1">{item.title}</div>
                  <div className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider">{isBundle ? 'Premium Bundle' : isCourse ? 'Course' : 'Digital Resource'}</div>
                </div>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-[var(--color-border-subtle)] text-sm">
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span className="font-medium">Original Price</span>
                  <span className="font-bold">ETB {(originalPrice || item.price).toFixed(2)}</span>
                </div>
                {originalPrice && originalPrice > item.price && (
                  <div className="flex justify-between text-[#20B486]">
                    <span className="font-bold">Awraq Discount</span>
                    <span className="font-bold">- ETB {(originalPrice - item.price).toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-base font-black text-[#1E293B]">Total</span>
                <span className="text-2xl font-black text-[#3B82F6]">ETB {item.price.toFixed(2)}</span>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3 border border-blue-100">
                {isBundle ? <Layers className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" /> : isCourse ? <PlayCircle className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" /> : <Download className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />}
                <div>
                  <div className="text-xs font-bold text-[#1E293B] mb-0.5">{isBundle ? 'Multiple Items Unlocked' : isCourse ? 'Lifetime Course Access' : 'Instant File Download'}</div>
                  <div className="text-[11px] font-medium text-[var(--color-text-secondary)] leading-relaxed">{isBundle ? 'Courses will go to My Learning and files to My Resources.' : isCourse ? 'Immediate access to all lessons, updates, and resources.' : 'Secure access to download your digital product immediately.'}</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};