import React from 'react';
import { motion } from 'framer-motion';
import { HiShieldCheck, HiSparkles } from 'react-icons/hi';
import { FaCircleNotch } from 'react-icons/fa';

const BookingLoader = ({ title = 'Securing Your Luxury Reservation...', subtitle = 'Checking live room availability and generating your confirmed booking voucher.' }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden"
      >
        {/* BACKGROUND GLOW */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-600/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-600/30 rounded-full blur-3xl" />

        {/* ROTATING ICON */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <FaCircleNotch className="w-20 h-20 text-blue-500 animate-spin opacity-80" />
          <HiSparkles className="text-3xl text-amber-400 absolute animate-pulse" />
        </div>

        {/* TEXT CONTENT */}
        <div className="space-y-2 relative z-10">
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* STEPS PULSING LIST */}
        <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs font-semibold text-slate-300 text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Verifying room availability with hotel PMS</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Locking in member rate & tax calculations</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Issuing instant Supabase confirmation ticket</span>
          </div>
        </div>

        {/* SECURITY FOOTER */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-bold">
          <HiShieldCheck className="text-emerald-500 text-base" />
          <span>256-bit Encrypted Reservation Protocol</span>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingLoader;
