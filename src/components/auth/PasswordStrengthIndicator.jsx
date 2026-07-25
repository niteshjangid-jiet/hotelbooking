import React from 'react';
import { HiCheck, HiX } from 'react-icons/hi';

const PasswordStrengthIndicator = ({ password = '' }) => {
  if (!password) return null;

  const checks = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'Contains uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'Contains a number', valid: /[0-9]/.test(password) },
    { label: 'Contains special character', valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = checks.filter((c) => c.valid).length;

  let label = 'Weak';
  let colorClass = 'bg-rose-500';
  let textColor = 'text-rose-400';

  if (score >= 4) {
    label = 'Strong';
    colorClass = 'bg-emerald-500';
    textColor = 'text-emerald-400';
  } else if (score >= 3) {
    label = 'Good';
    colorClass = 'bg-blue-500';
    textColor = 'text-blue-400';
  } else if (score >= 2) {
    label = 'Fair';
    colorClass = 'bg-amber-500';
    textColor = 'text-amber-400';
  }

  return (
    <div className="flex flex-col gap-2 mt-1.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400">Password Strength</span>
        <span className={`text-xs font-bold ${textColor}`}>{label}</span>
      </div>

      {/* BARS */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((step) => {
          const filled = score >= step || (score === 5 && step === 4);
          return (
            <div
              key={step}
              className={`h-full rounded-full transition-all duration-300 ${
                filled ? colorClass : 'bg-slate-800'
              }`}
            />
          );
        })}
      </div>

      {/* CHECKLIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
        {checks.map((check, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-[11px]">
            {check.valid ? (
              <HiCheck className="text-emerald-400 text-sm flex-shrink-0" />
            ) : (
              <HiX className="text-slate-600 text-sm flex-shrink-0" />
            )}
            <span className={check.valid ? 'text-slate-300 font-medium' : 'text-slate-500'}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
