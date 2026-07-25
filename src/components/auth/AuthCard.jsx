import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOfficeBuilding, HiArrowLeft, HiSparkles } from 'react-icons/hi';

const AuthCard = ({ title, subtitle, children, badge = "VIP Access" }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* BACKGROUND DECORATION BLURS & GRADIENTS */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-teal-500/20 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute top-10 right-1/3 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-[100px] pointer-events-none" />

      {/* FLOATING TOP BRAND HEADER */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between max-w-7xl mx-auto z-20">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
            <HiOfficeBuilding className="text-2xl" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white">
              HotelBooking<span className="text-blue-500">Site</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
              Luxury Stays
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-800 backdrop-blur-md transition-all duration-200 shadow-md"
        >
          <HiArrowLeft className="text-sm" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* AUTH CARD MAIN CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md mt-16 mb-8 z-10"
      >
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-blue-950/40 relative">
          {/* BADGE */}
          {badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
              <HiSparkles className="text-sm" />
              <span>{badge}</span>
            </div>
          )}

          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-slate-400 mt-1.5 font-normal leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* FORM / CHILDREN CONTENT */}
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthCard;
