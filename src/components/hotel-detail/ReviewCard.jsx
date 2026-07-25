import React, { useState } from 'react';
import { HiStar, HiCheckCircle, HiThumbUp, HiPencil, HiTrash, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { motion } from 'framer-motion';
import StarRatingDisplay from '../reviews/StarRatingDisplay';

const ReviewCard = ({ review, currentUser, onEdit, onDelete }) => {
  const [helpfulCount, setHelpfulCount] = useState(review?.helpful_count || 0);
  const [isHelpful, setIsHelpful] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!review) return null;

  // Check if current logged-in user is author of this review
  const isAuthor = currentUser && (
    (currentUser.id && currentUser.id === review.user_id) ||
    (currentUser.email && review.user_name && currentUser.email.split('@')[0].toLowerCase() === review.user_name.toLowerCase()) ||
    (currentUser.user_metadata?.full_name && currentUser.user_metadata.full_name === review.user_name)
  );

  const avatarUrl =
    review.user_avatar ||
    (currentUser && isAuthor && currentUser.user_metadata?.avatar_url) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user_name || 'Guest')}&background=0D8ABC&color=fff&bold=true`;

  const handleHelpfulClick = () => {
    if (isHelpful) {
      setHelpfulCount((prev) => Math.max(0, prev - 1));
      setIsHelpful(false);
    } else {
      setHelpfulCount((prev) => prev + 1);
      setIsHelpful(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-sm hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-300 space-y-4 text-slate-100 flex flex-col justify-between"
    >
      <div className="space-y-3">
        {/* HEADER: AVATAR, NAME, DATE & ACTION BUTTONS */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={avatarUrl}
              alt={review.user_name || 'Guest User'}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/30 shadow-md"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user_name || 'G')}&background=1E293B&color=F8FAFC`;
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h5 className="font-extrabold text-white text-sm tracking-tight">
                  {review.user_name || 'Anonymous Guest'}
                </h5>
                {isAuthor && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black border border-blue-500/30">
                    You
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-medium mt-0.5">
                <span>{review.date || 'Recent Stay'}</span>
                <span>•</span>
                <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                  <HiCheckCircle className="text-emerald-400 text-xs" />
                  {review.stay_type || 'Verified Stay'}
                </span>
              </div>
            </div>
          </div>

          {/* RATING BADGE */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 text-amber-400 font-extrabold text-xs px-3 py-1 rounded-2xl shadow-xs">
            <HiStar className="text-amber-400 text-sm" />
            <span>{Number(review.rating).toFixed(1)}</span>
          </div>
        </div>

        {/* REVIEW TITLE & COMMENT */}
        <div className="space-y-1.5 pt-1">
          {review.title && (
            <h6 className="font-bold text-slate-200 text-sm italic">
              "{review.title}"
            </h6>
          )}
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            {review.comment || review.review}
          </p>
        </div>

        {/* CATEGORY RATINGS BREAKDOWN TOGGLE */}
        {review.ratings_breakdown && (
          <div className="pt-1">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="text-[11px] font-bold text-slate-400 hover:text-blue-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{showBreakdown ? 'Hide Category Ratings' : 'View Category Breakdown'}</span>
              {showBreakdown ? <HiChevronUp /> : <HiChevronDown />}
            </button>

            {showBreakdown && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 gap-2 p-3 mt-2 bg-slate-950/60 rounded-2xl border border-slate-800 text-[11px]"
              >
                {Object.entries(review.ratings_breakdown).map(([cat, score]) => (
                  <div key={cat} className="flex justify-between items-center capitalize">
                    <span className="text-slate-400 font-medium">{cat}:</span>
                    <span className="font-extrabold text-amber-400">{Number(score).toFixed(1)} / 5</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* CARD FOOTER: HELPFUL & OWNER ACTIONS */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
        <button
          onClick={handleHelpfulClick}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
            isHelpful
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <HiThumbUp className={`text-sm ${isHelpful ? 'text-blue-400' : ''}`} />
          <span>Helpful</span>
          {helpfulCount > 0 && <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded-full">{helpfulCount}</span>}
        </button>

        {/* EDIT & DELETE BUTTONS FOR AUTHOR */}
        {isAuthor && (
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(review)}
                className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-colors cursor-pointer"
                title="Edit review"
              >
                <HiPencil className="text-sm" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(review)}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                title="Delete review"
              >
                <HiTrash className="text-sm" />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ReviewCard;
