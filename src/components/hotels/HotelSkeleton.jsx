import React from 'react';

const HotelSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md animate-pulse flex flex-col justify-between"
        >
          {/* IMAGE PLACEHOLDER */}
          <div className="h-60 bg-slate-200 relative">
            <div className="absolute top-4 left-4 w-24 h-6 bg-slate-300 rounded-full"></div>
            <div className="absolute top-4 right-4 w-10 h-10 bg-slate-300 rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-32 h-6 bg-slate-300 rounded-lg"></div>
          </div>

          {/* CONTENT PLACEHOLDER */}
          <div className="p-6 space-y-4">
            <div className="h-6 bg-slate-200 rounded-md w-3/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded w-full"></div>
              <div className="h-3 bg-slate-200 rounded w-5/6"></div>
            </div>

            {/* AMENITIES */}
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-slate-200 rounded-md"></div>
              <div className="h-6 w-20 bg-slate-200 rounded-md"></div>
              <div className="h-6 w-16 bg-slate-200 rounded-md"></div>
            </div>

            {/* FOOTER */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-3 w-16 bg-slate-200 rounded"></div>
                <div className="h-6 w-24 bg-slate-300 rounded"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-9 w-20 bg-slate-200 rounded-xl"></div>
                <div className="h-9 w-24 bg-blue-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelSkeleton;
