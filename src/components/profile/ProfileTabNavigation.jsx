import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiUser, 
  HiPencilAlt, 
  HiShieldCheck, 
  HiDesktopComputer, 
  HiExclamationCircle 
} from 'react-icons/hi';

const TABS = [
  { id: 'overview', label: 'Overview', icon: HiUser },
  { id: 'edit', label: 'Edit Profile', icon: HiPencilAlt },
  { id: 'security', label: 'Security & Password', icon: HiShieldCheck },
  { id: 'sessions', label: 'Active Sessions', icon: HiDesktopComputer },
  { id: 'danger', label: 'Danger Zone', icon: HiExclamationCircle, isDanger: true },
];

const ProfileTabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              isActive
                ? tab.isDanger
                  ? 'text-rose-400 bg-rose-500/10 border border-rose-500/30'
                  : 'text-blue-400 bg-blue-600/10 border border-blue-500/30 shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Icon className={`text-base ${
              isActive 
                ? tab.isDanger ? 'text-rose-400' : 'text-blue-400'
                : 'text-slate-400'
            }`} />
            <span>{tab.label}</span>

            {isActive && (
              <motion.div
                layoutId="activeTabGlow"
                className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full ${
                  tab.isDanger ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                }`}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ProfileTabNavigation;
