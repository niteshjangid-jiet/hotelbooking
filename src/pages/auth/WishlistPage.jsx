import React from 'react';
import { Link } from 'react-router-dom';
import { HiHeart, HiArrowLeft } from 'react-icons/hi';
import MainLayout from '../../layouts/MainLayout';

const WishlistPage = () => {
  return (
    <MainLayout>
      <div className="pt-28 pb-20 bg-slate-950 text-white min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
                <HiHeart className="text-rose-500" /> Saved Wishlist
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Luxury hotels and villas you have bookmarked for future trips.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-1.5"
            >
              <HiArrowLeft /> Back to Dashboard
            </Link>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-3xl mx-auto mb-4">
              <HiHeart />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Your Wishlist is Empty</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              Browse our luxury collection and tap the heart icon on any stay card to save your dream properties.
            </p>
            <Link
              to="/hotels"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg transition-all"
            >
              Browse Destinations & Hotels
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default WishlistPage;
