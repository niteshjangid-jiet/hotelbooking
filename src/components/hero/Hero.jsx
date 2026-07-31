import React from 'react';
import { motion } from 'framer-motion';
import { HiSparkles, HiStar, HiShieldCheck } from 'react-icons/hi';
import SearchCard from './SearchCard';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-900">
      {/* BACKGROUND IMAGE WITH OVERLAY GRADIENTS */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85"
          alt="Luxury Resort Background"
          className="w-full h-full object-cover object-center scale-105 animate-pulse-slow filter brightness-90"
        />
        {/* Multilayer gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/65 to-slate-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/40"></div>
      </div>

      {/* AMBIENT FLOATING BLUR SHAPES */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* HERO CONTENT CONTAINER */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center items-center text-center my-auto pt-6 pb-12">
        {/* FLOATING BADGE */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs md:text-sm font-semibold tracking-wide shadow-xl mb-6"
        >
          <HiSparkles className="text-amber-400 text-base animate-bounce" />
          <span>Discover 5-Star Heritage Palaces & Luxury Resorts</span>
        </motion.div>

        {/* HERO TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.08] max-w-5xl"
        >
          Find Your Perfect <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent drop-shadow-sm">
            Stay Anywhere
          </span>
        </motion.h1>

        {/* HERO SUBTITLE */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-200 font-normal max-w-2xl leading-relaxed text-balance"
        >
          Discover luxury hotels, budget stays, and unforgettable travel experiences with verified photos and best price guarantee.
        </motion.p>

        {/* STAT BADGES */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-slate-300 text-xs sm:text-sm font-semibold"
        >
          <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <HiStar className="text-amber-400 text-base" />
            <span>4.95 Average Guest Rating</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <HiShieldCheck className="text-emerald-400 text-base" />
            <span>100% Verified Property Listings</span>
          </div>
        </motion.div>
      </div>

      {/* FLOATING SEARCH CARD AT BOTTOM OF HERO */}
      <div className="relative z-20 w-full mt-4">
        <SearchCard />
      </div>
    </section>
  );
};

export default Hero;
