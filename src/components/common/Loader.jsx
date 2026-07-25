import React from 'react';

const Loader = ({ fullScreen = false, text = 'Loading Luxury Stays...' }) => {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping opacity-25"></div>
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        {/* Icon in Center */}
        <div className="absolute inset-0 flex items-center justify-center text-blue-600 text-xl font-bold">
          🏨
        </div>
      </div>
      {text && (
        <p className="text-sm font-semibold tracking-wide text-slate-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-white/40">
          {loaderContent}
        </div>
      </div>
    );
  }

  return <div className="p-8 flex justify-center">{loaderContent}</div>;
};

export default Loader;
