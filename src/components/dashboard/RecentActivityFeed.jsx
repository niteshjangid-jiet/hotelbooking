import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiClock, 
  HiTicket, 
  HiXCircle, 
  HiShieldCheck, 
  HiUserCircle,
  HiChevronRight
} from 'react-icons/hi';

const RecentActivityFeed = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'cancellation':
        return <HiXCircle className="text-rose-400" />;
      case 'booking':
        return <HiTicket className="text-emerald-400" />;
      case 'security':
        return <HiShieldCheck className="text-blue-400" />;
      case 'profile':
      default:
        return <HiUserCircle className="text-indigo-400" />;
    }
  };

  const getActivityBadgeColor = (type) => {
    switch (type) {
      case 'cancellation':
        return 'bg-rose-500/10 border-rose-500/20';
      case 'booking':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'security':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'profile':
      default:
        return 'bg-indigo-500/10 border-indigo-500/20';
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/90 rounded-3xl p-6 backdrop-blur-xl shadow-xl h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <HiClock className="text-blue-400" /> Recent Activity Log
          </h3>
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
            Real-time Feed
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No recent activity logged yet.
          </div>
        ) : (
          <div className="space-y-3 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {activities.slice(0, 5).map((act, idx) => (
              <motion.div
                key={act.id || idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-3 relative z-10 pl-1"
              >
                <div
                  className={`w-7 h-7 rounded-xl border flex items-center justify-center text-sm flex-shrink-0 bg-slate-950 ${getActivityBadgeColor(
                    act.type
                  )}`}
                >
                  {getActivityIcon(act.type)}
                </div>

                <div className="flex-1 bg-slate-950/50 p-2.5 rounded-2xl border border-slate-800/60 text-xs">
                  <p className="text-slate-200 font-semibold leading-snug">
                    {act.description}
                  </p>
                  <span className="text-[10px] text-slate-500 font-medium block mt-1">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                    {new Date(act.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityFeed;
