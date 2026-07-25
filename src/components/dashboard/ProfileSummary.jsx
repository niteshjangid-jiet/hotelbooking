import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiUser, HiMail, HiPhone, HiShieldCheck, HiPencilAlt, HiCheckCircle, HiSparkles, HiClock } from 'react-icons/hi';

const ProfileSummary = ({ user }) => {
  const userName = user?.user_metadata?.full_name || user?.name || user?.email?.split('@')[0] || 'Luxury Guest';
  const userEmail = user?.email || 'N/A';
  const userPhone = user?.user_metadata?.phone || '+91 98765 43210';
  const createdAt = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Jan 2026';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-6 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <HiUser className="text-blue-400" /> Account Summary
          </h3>
          <Link
            to="/profile"
            className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors"
          >
            <HiPencilAlt /> Edit
          </Link>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-2xl border border-slate-800/60">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <HiUser className="text-slate-500" /> Member Name
            </span>
            <span className="text-white font-bold">{userName}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-2xl border border-slate-800/60">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <HiMail className="text-slate-500" /> Email Address
            </span>
            <span className="text-slate-200 font-semibold truncate max-w-[160px]" title={userEmail}>
              {userEmail}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-2xl border border-slate-800/60">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <HiPhone className="text-slate-500" /> Contact Phone
            </span>
            <span className="text-slate-200 font-semibold">{userPhone}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-2xl border border-slate-800/60">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <HiClock className="text-slate-500" /> Member Since
            </span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <HiSparkles /> {createdAt}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-3.5 py-2 rounded-xl border border-emerald-500/20">
        <span className="flex items-center gap-1.5">
          <HiCheckCircle className="text-emerald-400 text-sm" /> 2FA & Identity Verified
        </span>
        <span className="text-[10px] uppercase font-black tracking-wider text-emerald-300">Active</span>
      </div>
    </motion.div>
  );
};

export default ProfileSummary;
