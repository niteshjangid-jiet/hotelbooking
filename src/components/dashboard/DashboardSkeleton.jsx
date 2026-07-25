import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* HEADER SKELETON */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 h-44 flex items-center justify-between">
        <div className="space-y-3 flex-1 max-w-lg">
          <div className="h-4 w-32 bg-slate-800 rounded-full" />
          <div className="h-8 w-64 bg-slate-800 rounded-xl" />
          <div className="h-4 w-full bg-slate-800 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-slate-800 rounded-xl hidden lg:block" />
      </div>

      {/* STATS GRID SKELETON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 h-36 space-y-4">
            <div className="flex justify-between">
              <div className="h-3 w-20 bg-slate-800 rounded-full" />
              <div className="h-10 w-10 bg-slate-800 rounded-xl" />
            </div>
            <div className="h-7 w-28 bg-slate-800 rounded-xl" />
          </div>
        ))}
      </div>

      {/* CARDS SKELETON */}
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 h-48 flex gap-6">
            <div className="w-64 bg-slate-800 rounded-2xl hidden sm:block" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-48 bg-slate-800 rounded-lg" />
              <div className="h-4 w-32 bg-slate-800 rounded-lg" />
              <div className="h-16 w-full bg-slate-800/60 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
