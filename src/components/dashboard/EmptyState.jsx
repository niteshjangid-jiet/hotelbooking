import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineOfficeBuilding, HiTicket, HiSearch } from 'react-icons/hi';

const EmptyState = ({
  icon: Icon = HiTicket,
  title = 'No Bookings Found',
  description = 'You currently have no reservation records matching this filter criteria.',
  actionText = 'Explore Hotels & Palaces',
  actionLink = '/hotels',
  onResetSearch,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-10 sm:p-14 text-center backdrop-blur-xl shadow-xl space-y-5 my-6"
    >
      <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-3xl mx-auto shadow-inner">
        <Icon />
      </div>

      <div className="max-w-md mx-auto space-y-1">
        <h3 className="text-xl font-extrabold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400 font-normal leading-relaxed">{description}</p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
        {onResetSearch && (
          <button
            onClick={onResetSearch}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
          >
            Clear Filters
          </button>
        )}

        {actionLink && (
          <Link
            to={actionLink}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-600/20 transition-all"
          >
            <HiOutlineOfficeBuilding className="text-sm" /> {actionText}
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default EmptyState;
