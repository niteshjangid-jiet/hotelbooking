import React, { useState } from 'react';
import { HiEye, HiEyeOff, HiLockClosed } from 'react-icons/hi';

const PasswordInput = React.forwardRef(
  ({ label = 'Password', error, placeholder = '••••••••', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <HiLockClosed className="text-lg" />
          </div>
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            className={`w-full pl-10 pr-12 py-3 bg-slate-950/60 border rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
              error
                ? 'border-rose-500/80 focus:ring-rose-500/30'
                : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/20 hover:border-slate-700'
            }`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
          >
            {showPassword ? (
              <HiEyeOff className="text-lg" />
            ) : (
              <HiEye className="text-lg" />
            )}
          </button>
        </div>
        {error && (
          <span className="text-xs font-semibold text-rose-400 mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
