import React from 'react';
import { HiCalendar } from 'react-icons/hi';
import { formatDate } from '../../utils/formatters';

const DateSelector = ({
  label,
  value,
  onChange,
  minDate,
  error,
  disabled = false,
  className = '',
}) => {
  // Get today's YYYY-MM-DD for default min attribute
  const todayStr = new Date().toISOString().split('T')[0];
  const effectiveMin = minDate || todayStr;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
        <span>{label}</span>
        {value && (
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
            {formatDate(value)}
          </span>
        )}
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <HiCalendar className="text-lg text-blue-500" />
        </div>

        <input
          type="date"
          value={value || ''}
          min={effectiveMin}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border rounded-2xl text-sm font-bold text-slate-900 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 cursor-pointer ${
            error
              ? 'border-rose-500/80 focus:ring-rose-500/30'
              : 'border-slate-200 dark:border-slate-800 focus:border-blue-600 focus:ring-blue-600/20 hover:border-slate-300 dark:hover:border-slate-700'
          } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800' : ''}`}
        />
      </div>

      {error && (
        <span className="text-xs font-semibold text-rose-500 mt-0.5 animate-fadeIn">
          {error}
        </span>
      )}
    </div>
  );
};

export default DateSelector;
