import React, { useState } from 'react';
import { HiStar } from 'react-icons/hi';
import { motion } from 'framer-motion';

const RATING_LABELS = {
  1: 'Poor (1.0)',
  2: 'Fair (2.0)',
  3: 'Good (3.0)',
  4: 'Very Good (4.0)',
  5: 'Exceptional (5.0)',
};

const StarRatingInput = ({ value = 5, onChange, label = 'Overall Rating' }) => {
  const [hoverValue, setHoverValue] = useState(null);

  const activeValue = hoverValue || value;

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center text-xs font-bold text-slate-300">
          <span>{label}</span>
          <span className="text-amber-400 font-extrabold">{RATING_LABELS[activeValue] || `${activeValue}.0`}</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 p-2 bg-slate-900/90 rounded-2xl border border-slate-800 w-fit">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= activeValue;

          return (
            <motion.button
              key={star}
              type="button"
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverValue(star)}
              onMouseLeave={() => setHoverValue(null)}
              className="p-1 text-2xl focus:outline-none transition-colors cursor-pointer"
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <HiStar
                className={`transition-all duration-200 ${
                  isFilled
                    ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                    : 'text-slate-700 hover:text-slate-500'
                }`}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default StarRatingInput;
