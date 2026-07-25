import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiExclamationCircle, 
  HiLogout, 
  HiTrash, 
  HiShieldExclamation, 
  HiRefresh 
} from 'react-icons/hi';
import DeleteAccountModal from './DeleteAccountModal';
import toast from 'react-hot-toast';

const DangerZoneTab = ({ onSignOut, onDeleteAccount, isLoading }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleClearCache = () => {
    try {
      localStorage.removeItem('hotel_booking_search_history');
      toast.success('Recent search history & local cache cleared.');
    } catch (e) {
      toast.error('Failed to clear cache.');
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Account Safety</span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/30">
              Critical Actions
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">Danger Zone & Account Management</h3>
          <p className="text-xs text-slate-400">
            Manage sensitive account actions, sign out of your profile, or request account deletion.
          </p>
        </div>
      </div>

      {/* DANGER ACTIONS CONTAINER */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <h3 className="text-base font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
          <HiExclamationCircle className="text-rose-400 text-lg" /> Destructive & Session Actions
        </h3>

        <div className="space-y-4">
          {/* ACTION 1: LOG OUT */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HiLogout className="text-blue-400" /> End Current Session (Sign Out)
              </h4>
              <p className="text-xs text-slate-400">
                Safely sign out of your account on this device. Your bookings and saved stays remain safe.
              </p>
            </div>

            <button
              onClick={onSignOut}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
            >
              Sign Out Now
            </button>
          </div>

          {/* ACTION 2: CLEAR LOCAL HISTORY */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HiRefresh className="text-amber-400" /> Clear Search & Local Preferences
              </h4>
              <p className="text-xs text-slate-400">
                Wipe locally cached search dates, recent filter preferences, and temporary search history.
              </p>
            </div>

            <button
              onClick={handleClearCache}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-amber-500/20 hover:text-amber-400 border border-slate-700 text-slate-300 text-xs font-bold transition-all shrink-0 cursor-pointer"
            >
              Clear Local Cache
            </button>
          </div>

          {/* ACTION 3: DELETE ACCOUNT */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                <HiTrash className="text-rose-500" /> Permanently Delete Account
              </h4>
              <p className="text-xs text-slate-400">
                Once deleted, your account data, past bookings, and VIP tier points will be permanently erased.
              </p>
            </div>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/20 shrink-0 cursor-pointer"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={onDeleteAccount}
        isDeleting={isLoading}
      />
    </div>
  );
};

export default DangerZoneTab;
