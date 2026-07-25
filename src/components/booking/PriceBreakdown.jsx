import React from 'react';
import { HiInformationCircle, HiTag, HiShieldCheck } from 'react-icons/hi';
import { formatPrice } from '../../utils/formatters';

const PriceBreakdown = ({
  pricePerNight = 0,
  nights = 1,
  subtotal = 0,
  taxes = 0,
  totalPrice = 0,
  discount = 0,
  promoCode = '',
  className = '',
}) => {
  return (
    <div className={`space-y-3 p-5 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 ${className}`}>
      <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
        Price Breakdown
      </h4>

      {/* NIGHTLY CALCULATION */}
      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
        <span>
          {formatPrice(pricePerNight)} × {nights} {nights === 1 ? 'night' : 'nights'}
        </span>
        <span className="font-extrabold text-slate-900 dark:text-white">
          {formatPrice(subtotal)}
        </span>
      </div>

      {/* TAXES & FEES */}
      <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-1">
          Taxes & Service Fees (18% GST)
          <HiInformationCircle className="text-slate-400 hover:text-blue-500 transition-colors" title="Includes GST and luxury hotel tax" />
        </span>
        <span>{formatPrice(taxes)}</span>
      </div>

      {/* PROMO DISCOUNT IF APPLIED */}
      {discount > 0 && (
        <div className="flex justify-between items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200/60 dark:border-emerald-800/60">
          <span className="flex items-center gap-1">
            <HiTag className="text-sm" /> Promo ({promoCode || 'MEMBER10'})
          </span>
          <span>-{formatPrice(discount)}</span>
        </div>
      )}

      {/* TOTAL PAYABLE */}
      <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
        <div>
          <span className="text-xs font-black uppercase tracking-wider block">Total Amount</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Includes all taxes & fees</span>
        </div>
        <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
          {formatPrice(totalPrice)}
        </span>
      </div>

      {/* FREE CANCELLATION BADGE */}
      <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 rounded-xl mt-1 border border-emerald-200/50 dark:border-emerald-900/50">
        <HiShieldCheck className="text-base text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        <span>Free cancellation up to 48 hours before check-in</span>
      </div>
    </div>
  );
};

export default PriceBreakdown;
