import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiUser, 
  HiMail, 
  HiPhone, 
  HiSparkles, 
  HiLogout, 
  HiBadgeCheck, 
  HiCalendar, 
  HiShieldCheck,
  HiTicket,
  HiHeart,
  HiCurrencyRupee
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useSession } from '../../hooks/useSession';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/common/Button';

// Profile Components
import ProfileTabNavigation from '../../components/profile/ProfileTabNavigation';
import ProfileOverviewTab from '../../components/profile/ProfileOverviewTab';
import EditProfileForm from '../../components/profile/EditProfileForm';
import SecuritySettingsTab from '../../components/profile/SecuritySettingsTab';
import SessionManagerTab from '../../components/profile/SessionManagerTab';
import DangerZoneTab from '../../components/profile/DangerZoneTab';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { 
    user, 
    updateProfile, 
    updateAvatar, 
    changePassword, 
    deleteAccount, 
    signOut, 
    loading 
  } = useAuth();
  
  const { userName, userEmail } = useSession();
  const [activeTab, setActiveTab] = useState('overview');

  const meta = user?.user_metadata || {};
  const phone = meta.phone || user?.phone || '+91 98765 43210';
  const avatar = meta.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563EB&color=fff`;
  const createdAt = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) 
    : 'Jan 2026';

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Account deletion error:', err);
    }
  };

  return (
    <MainLayout>
      <div className="pt-28 pb-20 bg-slate-950 text-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* HEADER PROFILE BANNER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl"
          >
            {/* AMBIENT BACKGROUND GLOW */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                {/* AVATAR IMAGE */}
                <div className="relative group shrink-0">
                  <img
                    src={avatar}
                    alt={userName}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-blue-500/30 shadow-2xl bg-slate-950"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-lg border border-slate-800">
                    <HiSparkles className="text-sm" />
                  </div>
                </div>

                {/* USER METADATA */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {userName}
                    </h1>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                      <HiSparkles /> VIP Diamond Member
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 font-medium">
                    Member since {createdAt} • Verified Account
                  </p>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs font-medium text-slate-300 pt-1">
                    <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
                      <HiMail className="text-blue-400" /> {userEmail}
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
                      <HiPhone className="text-teal-400" /> {phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* TOP ACTION BUTTONS */}
              <div className="flex items-center gap-3 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  icon={HiLogout}
                  onClick={handleLogout}
                  className="border-rose-500/40 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500"
                >
                  Sign Out
                </Button>
              </div>

            </div>
          </motion.div>

          {/* TAB NAVIGATION */}
          <ProfileTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* TAB CONTENT PANELS WITH ANIMATIONS */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'overview' && (
                <ProfileOverviewTab user={user} onNavigateTab={setActiveTab} />
              )}

              {activeTab === 'edit' && (
                <EditProfileForm
                  user={user}
                  onSaveProfile={updateProfile}
                  onSaveAvatar={updateAvatar}
                  isLoading={loading}
                />
              )}

              {activeTab === 'security' && (
                <SecuritySettingsTab
                  userEmail={userEmail}
                  onChangePassword={changePassword}
                  isLoading={loading}
                />
              )}

              {activeTab === 'sessions' && (
                <SessionManagerTab onSignOutAll={handleLogout} />
              )}

              {activeTab === 'danger' && (
                <DangerZoneTab
                  onSignOut={handleLogout}
                  onDeleteAccount={handleDeleteAccount}
                  isLoading={loading}
                />
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
