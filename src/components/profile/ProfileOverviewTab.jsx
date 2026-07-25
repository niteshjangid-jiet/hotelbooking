import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiUser, 
  HiMail, 
  HiPhone, 
  HiLocationMarker, 
  HiSparkles, 
  HiBadgeCheck, 
  HiCalendar, 
  HiPencilAlt, 
  HiShieldCheck, 
  HiGlobe, 
  HiCurrencyRupee,
  HiDocumentText
} from 'react-icons/hi';

const ProfileOverviewTab = ({ user, onNavigateTab }) => {
  const meta = user?.user_metadata || {};
  const userName = meta.full_name || meta.name || user?.name || user?.email?.split('@')[0] || 'Luxury Guest';
  const userEmail = user?.email || meta.email || 'guest@hotelbookingsite.com';
  const phone = meta.phone || user?.phone || 'Not provided';
  const address = meta.address || 'Not specified';
  const city = meta.city || 'Mumbai';
  const state = meta.state || 'Maharashtra';
  const country = meta.country || 'India';
  const zipCode = meta.zip_code || '400001';
  const bio = meta.bio || 'Frequent traveler looking for luxury stays and boutique hospitality experiences worldwide.';
  const currency = meta.preferred_currency || 'INR (₹)';
  const createdAt = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '25 Jan 2026';

  // Calculate profile completeness score
  let completeness = 40;
  if (meta.full_name) completeness += 15;
  if (meta.phone && meta.phone !== 'Not provided') completeness += 15;
  if (meta.address && meta.address !== 'Not specified') completeness += 15;
  if (meta.avatar_url) completeness += 15;

  return (
    <div className="space-y-6">
      {/* COMPLETENESS BANNER */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Profile Health</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                {completeness}% Complete
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">Your Profile & Verification Details</h3>
            <p className="text-xs text-slate-400">
              Keep your contact and billing details updated for seamless luxury room reservations.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('edit')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg hover:shadow-blue-500/25 whitespace-nowrap"
          >
            <HiPencilAlt className="text-base" /> Edit Profile
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-4 w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completeness}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full"
          />
        </div>
      </div>

      {/* DETAILED INFO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PERSONAL DETAILS CARD */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <HiUser className="text-blue-400 text-base" /> Personal Identification
            </h4>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <HiBadgeCheck className="text-sm" /> Verified Guest
            </span>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400 font-medium">Full Name</span>
              <span className="text-white font-bold">{userName}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <HiMail className="text-blue-400 text-base" /> Email Address
              </span>
              <span className="text-white font-bold">{userEmail}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <HiPhone className="text-teal-400 text-base" /> Contact Phone
              </span>
              <span className="text-white font-bold">{phone}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <HiCalendar className="text-indigo-400 text-base" /> Member Since
              </span>
              <span className="text-slate-300 font-semibold">{createdAt}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <HiCurrencyRupee className="text-amber-400 text-base" /> Preferred Currency
              </span>
              <span className="text-amber-300 font-bold">{currency}</span>
            </div>
          </div>
        </div>

        {/* ADDRESS & BIO CARD */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <HiLocationMarker className="text-rose-400 text-base" /> Location & Preferences
            </h4>
            <span className="text-xs text-slate-400 font-medium">Primary Billing</span>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="py-1 border-b border-slate-800/50">
              <span className="text-slate-400 font-medium block mb-1">Street Address</span>
              <span className="text-white font-bold">{address}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-1 border-b border-slate-800/50">
              <div>
                <span className="text-slate-400 font-medium block">City / State</span>
                <span className="text-white font-bold">{city}, {state}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Postal / Zip Code</span>
                <span className="text-white font-bold">{zipCode}</span>
              </div>
            </div>

            <div className="py-1 border-b border-slate-800/50">
              <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                <HiGlobe className="text-blue-400 text-base" /> Country / Region
              </span>
              <span className="text-white font-bold">{country}</span>
            </div>

            <div className="pt-1">
              <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                <HiDocumentText className="text-indigo-400 text-base" /> Bio & Guest Preferences
              </span>
              <p className="text-slate-300 text-xs italic bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60">
                "{bio}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverviewTab;
