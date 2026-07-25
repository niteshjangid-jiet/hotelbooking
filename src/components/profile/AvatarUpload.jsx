import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCamera, HiSparkles, HiCheck, HiRefresh, HiUpload, HiUser } from 'react-icons/hi';
import toast from 'react-hot-toast';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
];

const AvatarUpload = ({ currentAvatar, userName, onAvatarChange, isUploading }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [showPresets, setShowPresets] = useState(false);

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=2563EB&color=fff`;
  const activeAvatar = preview || currentAvatar || fallbackAvatar;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    // Show temporary local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Call parent upload handler
    onAvatarChange(file);
  };

  const handlePresetSelect = (url) => {
    setPreview(url);
    setShowPresets(false);
    onAvatarChange(url);
  };

  return (
    <div className="flex flex-col items-center sm:items-start gap-4">
      <div className="relative group">
        {/* AVATAR CONTAINER */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden ring-4 ring-blue-500/30 shadow-2xl bg-slate-900 flex items-center justify-center">
          <img
            src={activeAvatar}
            alt={userName || 'User Avatar'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackAvatar;
            }}
          />

          {/* OVERLAY ON HOVER / UPLOADING */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-opacity duration-200 ${
              isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            {isUploading ? (
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <HiCamera className="text-2xl text-blue-400" />
                <span className="text-[11px] font-bold text-white tracking-wide uppercase">Change Photo</span>
              </>
            )}
          </div>
        </div>

        {/* QUICK BADGE */}
        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-lg border border-slate-800 pointer-events-none">
          <HiSparkles className="text-sm" />
        </div>

        {/* HIDDEN FILE INPUT */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* BUTTON ACTIONS */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
        >
          <HiUpload className="text-sm" /> Upload File
        </button>

        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-700 text-xs font-semibold transition-all shadow-xs"
        >
          <HiUser className="text-sm" /> Avatars
        </button>
      </div>

      {/* PRESET AVATARS SELECTOR MODAL / PANEL */}
      <AnimatePresence>
        {showPresets && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-xl overflow-hidden mt-1"
          >
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Choose Preset Avatar</p>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetSelect(url)}
                  className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all hover:scale-110 ${
                    activeAvatar === url ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AvatarUpload;
