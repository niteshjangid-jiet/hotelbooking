import React from 'react';
import { motion } from 'framer-motion';
import { HiStar, HiArrowRight, HiLocationMarker } from 'react-icons/hi';

const DestinationCard = ({ destination, index = 0 }) => {
  const { name, state, tagline, description, image, hotelCount, startingPrice, rating } = destination;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative h-[380px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-slate-200/50 bg-slate-900"
    >
      {/* BACKGROUND IMAGE WITH HOVER ZOOM */}
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
        loading="lazy"
      />

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent group-hover:via-slate-950/60 transition-all duration-300"></div>

      {/* TOP BADGES */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <span className="px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1 border border-white/20">
          <HiLocationMarker className="text-blue-400" />
          {state}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1 shadow-md">
          <HiStar className="text-white text-sm" />
          {rating}
        </span>
      </div>

      {/* CARD CONTENT */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <h3 className="text-2xl font-black tracking-tight group-hover:text-blue-400 transition-colors duration-300">
            {name}
          </h3>
          <span className="text-xs text-slate-300 font-medium bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur-sm">
            {hotelCount}+ Hotels
          </span>
        </div>

        <p className="text-xs text-blue-200 font-semibold tracking-wide">
          {tagline}
        </p>

        <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed group-hover:text-white transition-colors">
          {description}
        </p>

        <div className="pt-3 mt-1 border-t border-white/15 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Starts From</span>
            <span className="text-base font-extrabold text-white">{startingPrice} <span className="text-xs font-normal text-slate-300">/ night</span></span>
          </div>

          <div className="w-10 h-10 rounded-xl bg-blue-600 group-hover:bg-blue-500 flex items-center justify-center text-white shadow-lg group-hover:translate-x-1 transition-all">
            <HiArrowRight className="text-lg" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;
