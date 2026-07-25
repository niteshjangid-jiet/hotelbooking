import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiStar,
  HiChatAlt2,
  HiPencilAlt,
  HiFilter,
  HiSortAscending,
  HiSearch,
  HiCheckCircle,
  HiSparkles,
} from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import ReviewCard from './ReviewCard';
import ReviewFormModal from '../reviews/ReviewFormModal';
import DeleteReviewModal from '../reviews/DeleteReviewModal';
import StarRatingDisplay from '../reviews/StarRatingDisplay';
import { fetchHotelReviews, createReview, updateReview, deleteReview } from '../../services/reviewService';

const ReviewSection = ({
  hotelId,
  reviews: initialReviews = [],
  rating: initialRating = 4.9,
  reviewCount: initialReviewCount = 0,
  ratingBreakdown: initialBreakdown,
}) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Local state for live review management
  const [reviewList, setReviewList] = useState(initialReviews);
  const [loading, setLoading] = useState(false);

  // Filters, Search & Sort
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [deletingReview, setDeletingReview] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Supabase & Local reviews on mount or when hotelId changes
  useEffect(() => {
    let isMounted = true;
    const loadReviews = async () => {
      if (!hotelId) return;
      try {
        setLoading(true);
        const fetched = await fetchHotelReviews(hotelId);
        if (isMounted && fetched && fetched.length > 0) {
          // Merge initial fallback reviews with fetched reviews
          const fetchedIds = new Set(fetched.map((r) => r.id));
          const combined = [...fetched, ...initialReviews.filter((r) => !fetchedIds.has(r.id))];
          setReviewList(combined);
        } else if (isMounted && initialReviews.length > 0) {
          setReviewList(initialReviews);
        }
      } catch (err) {
        console.warn('Failed to load dynamic reviews:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadReviews();
    return () => {
      isMounted = false;
    };
  }, [hotelId]);

  // Compute live overall rating score
  const computedRating = useMemo(() => {
    if (!reviewList || reviewList.length === 0) return Number(initialRating) || 4.5;
    const total = reviewList.reduce((acc, r) => acc + Number(r.rating || 5), 0);
    return Number((total / reviewList.length).toFixed(1));
  }, [reviewList, initialRating]);

  // Compute category averages
  const computedBreakdown = useMemo(() => {
    if (!reviewList || reviewList.length === 0) {
      return (
        initialBreakdown || {
          cleanliness: 4.9,
          location: 4.9,
          service: 4.8,
          value: 4.7,
        }
      );
    }

    const totals = { cleanliness: 0, location: 0, service: 0, value: 0 };
    let count = 0;

    reviewList.forEach((r) => {
      if (r.ratings_breakdown) {
        totals.cleanliness += Number(r.ratings_breakdown.cleanliness || r.rating);
        totals.location += Number(r.ratings_breakdown.location || r.rating);
        totals.service += Number(r.ratings_breakdown.service || r.rating);
        totals.value += Number(r.ratings_breakdown.value || r.rating);
        count++;
      }
    });

    if (count === 0) {
      return {
        cleanliness: computedRating,
        location: computedRating,
        service: computedRating,
        value: computedRating,
      };
    }

    return {
      cleanliness: Number((totals.cleanliness / count).toFixed(1)),
      location: Number((totals.location / count).toFixed(1)),
      service: Number((totals.service / count).toFixed(1)),
      value: Number((totals.value / count).toFixed(1)),
    };
  }, [reviewList, computedRating, initialBreakdown]);

  // Rating count distribution (5 stars, 4 stars, etc.)
  const starCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewList.forEach((r) => {
      const rounded = Math.round(r.rating);
      if (counts[rounded] !== undefined) {
        counts[rounded] += 1;
      } else {
        counts[5] += 1;
      }
    });
    return counts;
  }, [reviewList]);

  // Filter & Sort reviews
  const processedReviews = useMemo(() => {
    let result = [...reviewList];

    // Filter by rating
    if (filterRating !== 'all') {
      const targetStar = Number(filterRating);
      result = result.filter((r) => Math.floor(Number(r.rating)) === targetStar);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          (r.comment && r.comment.toLowerCase().includes(q)) ||
          (r.title && r.title.toLowerCase().includes(q)) ||
          (r.user_name && r.user_name.toLowerCase().includes(q))
      );
    }

    // Sort reviews
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at || b.date) - new Date(a.created_at || a.date);
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at || a.date) - new Date(b.created_at || b.date);
      }
      if (sortBy === 'highest') {
        return Number(b.rating) - Number(a.rating);
      }
      if (sortBy === 'lowest') {
        return Number(a.rating) - Number(b.rating);
      }
      return 0;
    });

    return result;
  }, [reviewList, filterRating, searchQuery, sortBy]);

  // Handle Add Review submission
  const handleAddReview = async (formData) => {
    const userName =
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      (user?.email ? user.email.split('@')[0] : 'Valued Guest');
    const userAvatar = user?.user_metadata?.avatar_url || user?.avatar_url || null;

    const newRecord = await createReview({
      hotel_id: hotelId,
      user_id: user?.id,
      user_name: userName,
      user_avatar: userAvatar,
      ...formData,
    });

    setReviewList((prev) => [newRecord, ...prev]);
  };

  // Handle Edit Review submission
  const handleEditReview = async (formData) => {
    if (!editingReview) return;
    const updated = await updateReview(editingReview.id, {
      ...formData,
      user_name: editingReview.user_name,
      user_avatar: editingReview.user_avatar,
    });

    setReviewList((prev) =>
      prev.map((r) =>
        r.id === editingReview.id
          ? {
              ...r,
              ...updated,
            }
          : r
      )
    );
    setEditingReview(null);
  };

  // Handle Delete Review execution
  const handleDeleteReviewConfirm = async () => {
    if (!deletingReview) return;
    try {
      setIsDeleting(true);
      await deleteReview(deletingReview.id);
      setReviewList((prev) => prev.filter((r) => r.id !== deletingReview.id));
      toast.success('Review deleted successfully');
      setDeletingReview(null);
    } catch (err) {
      console.error('Delete review error:', err);
      toast.error('Failed to delete review');
    } finally {
      setIsDeleting(false);
    }
  };

  // Trigger Write Review Modal
  const openWriteModal = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to share a guest review', {
        icon: '🔒',
      });
      navigate('/login', { state: { from: `/hotels/${hotelId}` } });
      return;
    }
    setIsAddModalOpen(true);
  };

  return (
    <div id="reviews-section" className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-8 text-slate-100">
      {/* SECTION HEADER & WRITE REVIEW BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <HiChatAlt2 className="text-blue-500" /> Guest Reviews & Ratings
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real feedback from verified staying guests
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openWriteModal}
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
        >
          <HiPencilAlt className="text-base" />
          <span>Write a Review</span>
        </motion.button>
      </div>

      {/* OVERALL RATING BANNER & CATEGORY BREAKDOWN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/70 p-6 rounded-3xl border border-slate-800">
        {/* OVERALL SCORE SUMMARY (COL 4) */}
        <div className="lg:col-span-4 flex flex-col justify-center items-center text-center p-4 border-b lg:border-b-0 lg:border-r border-slate-800 space-y-3">
          <div className="text-5xl font-black text-amber-400 tracking-tight flex items-center gap-1.5">
            <span>{computedRating}</span>
            <HiStar className="text-4xl text-amber-400" />
          </div>
          <StarRatingDisplay rating={computedRating} size="md" />
          <div>
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-black rounded-full uppercase tracking-wider">
              {computedRating >= 4.7
                ? 'Exceptional'
                : computedRating >= 4.3
                ? 'Excellent'
                : computedRating >= 3.8
                ? 'Very Good'
                : 'Good'}
            </span>
            <p className="text-xs text-slate-400 font-medium mt-2">
              Based on {reviewList.length} verified guest review{reviewList.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* CATEGORY RATINGS BARS (COL 8) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
          {Object.entries(computedBreakdown).map(([category, score]) => {
            const percentage = (score / 5) * 100;
            return (
              <div key={category} className="space-y-1.5 p-3 bg-slate-900/60 rounded-2xl border border-slate-800/60">
                <div className="flex justify-between items-center text-xs font-bold capitalize">
                  <span className="text-slate-300">{category}</span>
                  <span className="text-amber-400 font-black">{score} / 5</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-amber-500 to-blue-500 rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FILTERS, SEARCH & SORT CONTROLS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
        {/* STAR RATING FILTER BADGES */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <HiFilter className="text-slate-500" /> Filter:
          </span>
          {['all', '5', '4', '3', '2', '1'].map((val) => {
            const isSelected = filterRating === val;
            const count = val === 'all' ? reviewList.length : starCounts[val] || 0;

            return (
              <button
                key={val}
                onClick={() => setFilterRating(val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span>{val === 'all' ? 'All Ratings' : `${val} Stars`}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-blue-700 text-white' : 'bg-slate-900 text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* SEARCH & SORT DROPDOWN */}
        <div className="flex flex-wrap items-center gap-3">
          {/* SEARCH INPUT */}
          <div className="relative flex-1 sm:w-48">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviews..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* SORT SELECT */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300 font-bold">
            <HiSortAscending className="text-blue-400 text-sm" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer font-bold"
            >
              <option value="newest" className="bg-slate-900 text-white">Newest First</option>
              <option value="highest" className="bg-slate-900 text-white">Highest Rated</option>
              <option value="lowest" className="bg-slate-900 text-white">Lowest Rated</option>
              <option value="oldest" className="bg-slate-900 text-white">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* REVIEWS LIST CARDS */}
      {processedReviews.length === 0 ? (
        <div className="text-center py-12 bg-slate-950/40 rounded-3xl border border-slate-800/60 space-y-3">
          <HiChatAlt2 className="text-4xl text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">No Reviews Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery || filterRating !== 'all'
              ? 'Try resetting your search query or rating filter to see more guest reviews.'
              : 'Be the first guest to share your stay experience for this property!'}
          </p>
          <button
            onClick={openWriteModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md mt-2 cursor-pointer"
          >
            <HiPencilAlt /> Write First Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence>
            {processedReviews.map((rev) => (
              <ReviewCard
                key={rev.id}
                review={rev}
                currentUser={user}
                onEdit={(r) => setEditingReview(r)}
                onDelete={(r) => setDeletingReview(r)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ADD REVIEW MODAL */}
      <ReviewFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddReview}
        isEditing={false}
      />

      {/* EDIT REVIEW MODAL */}
      <ReviewFormModal
        isOpen={!!editingReview}
        onClose={() => setEditingReview(null)}
        onSubmit={handleEditReview}
        initialData={editingReview}
        isEditing={true}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteReviewModal
        isOpen={!!deletingReview}
        onClose={() => setDeletingReview(null)}
        onConfirm={handleDeleteReviewConfirm}
        deleting={isDeleting}
      />
    </div>
  );
};

export default ReviewSection;
