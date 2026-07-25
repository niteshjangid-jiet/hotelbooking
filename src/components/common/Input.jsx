import React from 'react';

const Input = ({
  label,
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 text-lg pointer-events-none transition-colors group-focus-within:text-blue-600">
            <Icon />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full bg-white/90 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 ${
            Icon ? 'pl-11 pr-4 py-3' : 'px-4 py-3'
          } ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-rose-500 font-medium pl-1">{error}</span>}
    </div>
  );
};

export default Input;
