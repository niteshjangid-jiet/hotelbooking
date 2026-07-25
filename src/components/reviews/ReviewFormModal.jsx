import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiStar, HiSparkles, HiCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import StarRatingInput from './StarRatingInput';

const STAY_TYPES = [
  'Verified Couple Stay',
  'Solo Traveler',
  'Family Vacation',
  'Business Trip',
  'Group of Friends',
];

const ReviewFormModal = ({ isOpen, onClose, onSubmit, initialData = null, isEditing = false }) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [stayType, setStayType] = useState('Verified Couple Stay');
  const [breakdown, setBreakdown] = useState({
    cleanliness: 5,
    location: 5,
    service: 5,
    value: 5,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setRating(Number(initialData.rating) || 5);
      setTitle(initialData.title || '');
      setComment(initialData.comment || initialData.review || '');
      setStayType(initialData.stay_type || 'Verified Couple Stay');
      setBreakdown(
        initialData.ratings_breakdown || {
          cleanliness: Number(initialData.rating) || 5,
          location: Number(initialData.rating) || 5,
          service: Number(initialData.rating) || 5,
          value: Number(initialData.rating) || 5,
        }
      );
    } else {
      setRating(5);
      setTitle('');
      setComment('');
      setStayType('Verified Couple Stay');
      setBreakdown({ cleanliness: 5, location: 5, service: 5, value: 5 });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error('Please write a review comment before submitting.');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Please provide a slightly longer review (at least 10 characters).');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        rating,
        title: title.trim(),
        comment: comment.trim(),
        stay_type: stayType,
        ratings_breakdown: breakdown,
      });

      toast.success(isEditing ? 'Review updated successfully!' : 'Review posted successfully!');
      onClose();
    } catch (err) {
      console.error('Failed to submit review:', err);
      toast.error('Failed to save review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategoryChange = (key, val) => {
    setBreakdown((prev) => ({ ...prev, [key]: Number(val) }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* MODAL CARD */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6 text-slate-100 my-8"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
                <HiSparkles className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">
                  {isEditing ? 'Edit Your Review' : 'Write a Guest Review'}
                </h3>
                <p className="text-xs text-slate-400">Share your stay experience to help future guests</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            >
              <HiX className="text-xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OVERALL STAR RATING */}
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <StarRatingInput value={rating} onChange={setRating} label="Overall Rating" />
            </div>

            {/* CATEGORY RATINGS BREAKDOWN */}
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                Category Ratings (Optional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
                {Object.entries(breakdown).map(([key, val]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold capitalize">
                      <span className="text-slate-400">{key}</span>
                      <span className="text-amber-400 font-extrabold">{val}.0 / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={val}
                      onChange={(e) => handleCategoryChange(key, e.target.value)}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* STAY TYPE */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                Type of Travel
              </label>
              <div className="flex flex-wrap gap-2">
                {STAY_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setStayType(type)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      stayType === type
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* TITLE */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                Review Headline / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Unforgettable stay with world-class hospitality!"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* COMMENT */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                Detailed Feedback <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about the room quality, cleanliness, staff friendliness, location, dining, etc..."
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                required
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <HiCheckCircle className="text-base" />
                    <span>{isEditing ? 'Update Review' : 'Submit Review'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReviewFormModal;
