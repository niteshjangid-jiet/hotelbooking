import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiUserCircle, 
  HiLogout, 
  HiSparkles, 
  HiCalendar, 
  HiBadgeCheck, 
  HiOutlineOfficeBuilding 
} from 'react-icons/hi';
import Button from '../common/Button';

const DashboardHeader = ({ user, userName, signOut, totalBookings = 0 }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const memberTier = totalBookings >= 5 ? 'Platinum Member' : totalBookings >= 2 ? 'Gold VIP Member' : 'Silver Member';

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-indigo-950/80 border border-slate-800/80 rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden backdrop-blur-2xl shadow-2xl"
    >
      {/* Decorative ambient background flares */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        
        {/* User Info & Avatar */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-xl">
              {user?.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt={userName}
                  className="w-full h-full object-cover rounded-[14px]"
                />
              ) : (
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white font-extrabold text-2xl">
                  {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full text-xs shadow-lg" title="VIP Status Verified">
              <HiSparkles />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <HiBadgeCheck className="text-blue-400 text-xs" /> {memberTier}
              </span>
              <span className="text-slate-400 text-xs flex items-center gap-1 font-medium">
                <HiCalendar className="text-slate-500" /> {currentDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {userName || 'Traveler'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl font-normal">
              Manage your stay itineraries, request room upgrades, or discover new luxury destinations.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start lg:self-auto flex-wrap">
          <Link to="/hotels">
            <Button variant="primary" size="sm" icon={HiOutlineOfficeBuilding}>
              Explore Hotels
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="outline" size="sm" icon={HiUserCircle}>
              Edit Profile
            </Button>
          </Link>
          <Button variant="ghost" size="sm" icon={HiLogout} onClick={signOut} className="text-slate-400 hover:text-rose-400">
            Sign Out
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
