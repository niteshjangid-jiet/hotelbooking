import React from 'react';
import { HiStar } from 'react-icons/hi';

const StarRatingDisplay = ({ rating = 5, size = 'sm', showValue = false, className = '' }) => {
  const numRating = Number(rating) || 5;

  const sizeClasses = {
    xs: 'text-xs gap-0.5',
    sm: 'text-sm gap-1',
    md: 'text-base gap-1',
    lg: 'text-xl gap-1.5',
  };

  return (
    <div className={`flex items-center ${sizeClasses[size] || sizeClasses.sm} ${className}`}>
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= Math.floor(numRating);
          const isHalf = !isFilled && star - 0.5 <= numRating;

          return (
            <HiStar
              key={star}
              className={`transition-colors ${
                isFilled
                  ? 'text-amber-400'
                  : isHalf
                  ? 'text-amber-400/80'
                  : 'text-slate-300 dark:text-slate-700'
              }`}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="font-extrabold text-amber-400 ml-1">
          {numRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRatingDisplay;
