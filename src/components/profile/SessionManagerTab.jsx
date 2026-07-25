import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiDesktopComputer, 
  HiDeviceMobile, 
  HiLogout, 
  HiCheckCircle, 
  HiClock, 
  HiGlobe, 
  HiShieldCheck, 
  HiTrash 
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const SessionManagerTab = ({ onSignOutAll }) => {
  // Detect current browser environment
  const userAgent = navigator.userAgent;
  let browserName = 'Chrome / Edge';
  if (userAgent.includes('Firefox')) browserName = 'Mozilla Firefox';
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browserName = 'Apple Safari';

  let osName = 'Windows OS';
  if (userAgent.includes('Macintosh')) osName = 'macOS';
  else if (userAgent.includes('Linux')) osName = 'Linux OS';
  else if (userAgent.includes('Android')) osName = 'Android Mobile';
  else if (userAgent.includes('iPhone')) osName = 'iOS iPhone';

  const [sessions, setSessions] = useState([
    {
      id: 'sess_current',
      device: `${browserName} on ${osName}`,
      location: 'Mumbai, Maharashtra, India',
      ip: '103.24.120.45',
      lastActive: 'Active Now (Current Session)',
      isCurrent: true,
      icon: userAgent.includes('Mobile') ? HiDeviceMobile : HiDesktopComputer,
    },
    {
      id: 'sess_2',
      device: 'Mobile Safari on iPhone 15 Pro',
      location: 'Delhi, India',
      ip: '49.36.192.12',
      lastActive: '2 hours ago',
      isCurrent: false,
      icon: HiDeviceMobile,
    },
    {
      id: 'sess_3',
      device: 'Chrome on macOS Monterey',
      location: 'Bengaluru, India',
      ip: '115.240.90.8',
      lastActive: '3 days ago',
      isCurrent: false,
      icon: HiDesktopComputer,
    },
  ]);

  const handleTerminateSession = (sessionId) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast.success('Session terminated successfully.');
  };

  const handleSignOutOtherDevices = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    toast.success('Signed out from all other active devices.');
  };

  return (
    <div className="space-y-8">
      {/* SESSION HEADER BANNER */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Session Security</span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/30">
              {sessions.length} Active Devices
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">Active Login Sessions & Devices</h3>
          <p className="text-xs text-slate-400">
            Monitor devices logged into your account. If you spot unfamiliar activity, revoke the session immediately.
          </p>
        </div>

        {sessions.length > 1 && (
          <button
            onClick={handleSignOutOtherDevices}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-bold transition-all shadow-lg whitespace-nowrap cursor-pointer"
          >
            <HiLogout className="text-base" /> Revoke Other Sessions
          </button>
        )}
      </div>

      {/* SESSIONS LIST */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-4">
        <h3 className="text-base font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
          <HiDesktopComputer className="text-blue-400" /> Device Log
        </h3>

        <div className="space-y-3">
          {sessions.map((sess) => {
            const Icon = sess.icon;
            return (
              <motion.div
                key={sess.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-all ${
                  sess.isCurrent
                    ? 'bg-blue-950/20 border-blue-500/30 ring-1 ring-blue-500/20'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                    sess.isCurrent
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    <Icon />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">{sess.device}</h4>
                      {sess.isCurrent && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1">
                          <HiCheckCircle className="text-xs" /> This Device
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <HiGlobe className="text-slate-500" /> {sess.location} ({sess.ip})
                      </span>
                      <span className="flex items-center gap-1">
                        <HiClock className="text-slate-500" /> {sess.lastActive}
                      </span>
                    </div>
                  </div>
                </div>

                {!sess.isCurrent && (
                  <button
                    onClick={() => handleTerminateSession(sess.id)}
                    className="self-end sm:self-center px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 border border-slate-700 text-slate-400 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <HiTrash className="text-sm" /> End Session
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SessionManagerTab;
