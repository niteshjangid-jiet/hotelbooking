import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiUser, 
  HiPhone, 
  HiLocationMarker, 
  HiGlobe, 
  HiSave, 
  HiCurrencyRupee, 
  HiDocumentText,
  HiCheckCircle
} from 'react-icons/hi';
import AvatarUpload from './AvatarUpload';
import toast from 'react-hot-toast';

const CURRENCY_OPTIONS = ['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)', 'AED (د.إ)'];

const EditProfileForm = ({ user, onSaveProfile, onSaveAvatar, isLoading }) => {
  const meta = user?.user_metadata || {};

  const [formData, setFormData] = useState({
    full_name: meta.full_name || meta.name || user?.name || '',
    phone: meta.phone || user?.phone || '',
    address: meta.address || '',
    city: meta.city || '',
    state: meta.state || '',
    country: meta.country || 'India',
    zip_code: meta.zip_code || '',
    bio: meta.bio || '',
    preferred_currency: meta.preferred_currency || 'INR (₹)',
  });

  const [isAvatarSaving, setIsAvatarSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (fileOrUrl) => {
    setIsAvatarSaving(true);
    try {
      await onSaveAvatar(fileOrUrl);
    } catch (err) {
      console.error('Avatar update failed:', err);
    } finally {
      setIsAvatarSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      toast.error('Full Name is required.');
      return;
    }

    try {
      await onSaveProfile(formData);
    } catch (err) {
      console.error('Profile update failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* AVATAR & BASIC HEADER EDIT */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl flex flex-col sm:flex-row items-center gap-6">
        <AvatarUpload
          currentAvatar={meta.avatar_url}
          userName={formData.full_name || 'Guest'}
          onAvatarChange={handleAvatarChange}
          isUploading={isAvatarSaving}
        />

        <div className="flex-1 text-center sm:text-left space-y-2">
          <h3 className="text-xl font-bold text-white">Profile Photo & Identity</h3>
          <p className="text-xs text-slate-400 max-w-md">
            Upload a PNG, JPG or WEBP image (max 5MB) or choose from preset luxury avatars. Your avatar is displayed across bookings and reviews.
          </p>
        </div>
      </div>

      {/* FORM FIELDS GRID */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <h3 className="text-base font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
          <HiUser className="text-blue-400" /> Personal & Contact Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* FULL NAME */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* PHONE NUMBER */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Phone Number
            </label>
            <div className="relative">
              <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* STREET ADDRESS */}
          <div className="sm:col-span-2 space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Street Address
            </label>
            <div className="relative">
              <HiLocationMarker className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. Flat 402, Sunset Towers, Bandra West"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* CITY */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Mumbai"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* STATE */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              State / Province
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. Maharashtra"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* POSTAL / ZIP CODE */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Postal / Zip Code
            </label>
            <input
              type="text"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
              placeholder="e.g. 400050"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          {/* COUNTRY */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Country / Region
            </label>
            <div className="relative">
              <HiGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. India"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* PREFERRED CURRENCY */}
          <div className="space-y-2 sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Preferred Currency
            </label>
            <div className="relative">
              <HiCurrencyRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
              <select
                name="preferred_currency"
                value={formData.preferred_currency}
                onChange={handleChange}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
              >
                {CURRENCY_OPTIONS.map((curr) => (
                  <option key={curr} value={curr} className="bg-slate-900 text-white">
                    {curr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* BIO */}
          <div className="space-y-2 sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Bio & Guest Preferences
            </label>
            <div className="relative">
              <textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Share a short bio or stay preferences (e.g. High floor quiet room, non-smoking, early check-in preference)."
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <HiSave className="text-lg" /> Save Profile Details
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditProfileForm;
