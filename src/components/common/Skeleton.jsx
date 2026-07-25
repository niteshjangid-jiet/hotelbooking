import React from 'react';

export const HotelCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-md p-0 flex flex-col">
      <div className="w-full h-56 skeleton-shimmer"></div>
      <div className="p-5 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="h-5 w-2/3 skeleton-shimmer rounded-md"></div>
          <div className="h-5 w-12 skeleton-shimmer rounded-md"></div>
        </div>
        <div className="h-4 w-1/2 skeleton-shimmer rounded-md"></div>
        <div className="flex gap-2 my-1">
          <div className="h-6 w-16 skeleton-shimmer rounded-full"></div>
          <div className="h-6 w-20 skeleton-shimmer rounded-full"></div>
          <div className="h-6 w-16 skeleton-shimmer rounded-full"></div>
        </div>
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center mt-2">
          <div className="h-7 w-24 skeleton-shimmer rounded-md"></div>
          <div className="h-10 w-28 skeleton-shimmer rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export const DestinationCardSkeleton = () => {
  return (
    <div className="w-full h-80 rounded-2xl overflow-hidden skeleton-shimmer"></div>
  );
};
