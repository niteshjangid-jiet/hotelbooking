import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiLockClosed, 
  HiShieldCheck, 
  HiCheckCircle, 
  HiEye, 
  HiEyeOff, 
  HiKey, 
  HiMail, 
  HiDeviceMobile,
  HiExclamationCircle
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const SecuritySettingsTab = ({ userEmail, onChangePassword, isLoading }) => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Password strength logic
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'Empty', color: 'bg-slate-700' };
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;

    if (score <= 25) return { score, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 50) return { score, label: 'Fair', color: 'bg-amber-500' };
    if (score <= 75) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong & Secure', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(passwords.newPassword);

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (!passwords.newPassword) {
      toast.error('Please enter a new password.');
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    try {
      await onChangePassword(passwords.newPassword);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Password update failed:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* SECURITY SCORE HEADER */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-2xl shadow-lg">
            <HiShieldCheck />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Account Security Status</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                High Protection
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Your authentication tokens are encrypted and managed via Supabase Auth standard.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-2">
            <HiMail className="text-blue-400 text-base" /> {userEmail}
          </div>
        </div>
      </div>

      {/* CHANGE PASSWORD FORM */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <h3 className="text-base font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
          <HiKey className="text-amber-400" /> Change Security Password
        </h3>

        <form onSubmit={handleSubmitPassword} className="space-y-6 max-w-xl">
          {/* CURRENT PASSWORD */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Current Password
            </label>
            <div className="relative">
              <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
              <input
                type={showCurrent ? 'text' : 'password'}
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                placeholder="Enter current password (optional validation)"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-11 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showCurrent ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>
          </div>

          {/* NEW PASSWORD */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
              <input
                type={showNew ? 'text' : 'password'}
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                placeholder="Minimum 6 characters"
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-11 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showNew ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>

            {/* PASSWORD STRENGTH BAR */}
            {passwords.newPassword && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Strength:</span>
                  <span className="font-bold text-slate-200">{strength.label}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Confirm New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                placeholder="Re-enter new password"
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating Password...
              </>
            ) : (
              <>
                <HiCheckCircle className="text-lg" /> Update Password
              </>
            )}
          </button>
        </form>
      </div>

      {/* TWO-FACTOR AUTH & VERIFICATION MOCK */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-4">
        <h3 className="text-base font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
          <HiDeviceMobile className="text-teal-400" /> Multi-Factor & Login Safeguards
        </h3>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Email Security Notifications</h4>
            <p className="text-xs text-slate-400">
              Receive automated email alerts for new device logins or sensitive profile updates.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/30">
            Enabled
          </span>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsTab;
