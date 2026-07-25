import React from 'react';
import { HiStar } from 'react-icons/hi';
import { FaQuoteRight } from 'react-icons/fa';

const TestimonialCard = ({ testimonial }) => {
  const { name, city, country, role, avatar, rating, title, review, hotelStayed } = testimonial;

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl relative flex flex-col justify-between h-full min-h-[300px] hover:border-blue-300 transition-all duration-300">
      {/* QUOTE ICON */}
      <div className="absolute top-6 right-6 text-slate-100 text-6xl pointer-events-none select-none">
        <FaQuoteRight />
      </div>

      <div className="relative z-10 flex flex-col gap-4">
        {/* RATING */}
        <div className="flex items-center gap-1 text-amber-400 text-lg">
          {[...Array(rating)].map((_, i) => (
            <HiStar key={i} />
          ))}
        </div>

        {/* TITLE & REVIEW */}
        <div>
          <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
          <p className="text-sm text-slate-600 font-normal leading-relaxed italic">
            "{review}"
          </p>
        </div>
      </div>

      {/* USER PROFILE FOOTER */}
      <div className="relative z-10 pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/30"
          />
          <div className="flex flex-col">
            <h5 className="text-sm font-bold text-slate-900">{name}</h5>
            <span className="text-xs text-slate-500 font-medium">
              {role} • {city}, {country}
            </span>
          </div>
        </div>

        <span className="hidden sm:block text-[11px] font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          {hotelStayed}
        </span>
      </div>
    </div>
  );
};

export default TestimonialCard;
