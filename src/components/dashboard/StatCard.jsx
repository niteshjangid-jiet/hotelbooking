import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, subtext, icon: Icon, color, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-slate-900/70 border border-slate-800/90 hover:border-slate-700/90 rounded-3xl p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 shadow-lg group relative overflow-hidden"
    >
      {/* Background Glow Effect */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10 blur-xl pointer-events-none ${color}`} />

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110 ${color}`}>
          {Icon && <Icon />}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {value}
        </h3>
        {subtext && (
          <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            {subtext}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
