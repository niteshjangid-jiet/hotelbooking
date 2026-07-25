import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiExclamation, HiX, HiTrash, HiShieldExclamation } from 'react-icons/hi';

const DeleteAccountModal = ({ isOpen, onClose, onConfirmDelete, isDeleting }) => {
  const [confirmText, setConfirmText] = useState('');
  const REQUIRED_TEXT = 'DELETE';

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (confirmText.trim().toUpperCase() !== REQUIRED_TEXT) return;
    onConfirmDelete();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl shadow-rose-950/50 relative overflow-hidden space-y-6"
        >
          {/* BACKGROUND GLOW */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* HEADER */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center text-2xl shadow-md">
                <HiShieldExclamation />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Delete Account</h3>
                <p className="text-xs text-rose-400 font-semibold">Irreversible Action</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <HiX className="text-lg" />
            </button>
          </div>

          {/* WARNING BODY */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-300">
            <p className="leading-relaxed">
              Are you sure you want to permanently delete your <strong className="text-white">HotelBookingSite</strong> account?
            </p>

            <ul className="list-disc list-inside space-y-1.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400">
              <li>All upcoming room reservations will be cancelled.</li>
              <li>Your saved wishlist and personal preferences will be lost.</li>
              <li>VIP diamond rewards status and earned points will be forfeited.</li>
            </ul>

            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Type <span className="text-rose-400 font-extrabold">{REQUIRED_TEXT}</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full bg-slate-950/90 border border-rose-500/30 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all font-mono"
              />
            </div>
          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all"
            >
              Cancel & Keep Account
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={confirmText.trim().toUpperCase() !== REQUIRED_TEXT || isDeleting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <HiTrash className="text-base" /> Permanently Delete
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteAccountModal;
