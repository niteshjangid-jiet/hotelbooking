import React from 'react';
import { motion } from 'framer-motion';

const SectionTitle = ({
  badge,
  title,
  subtitle,
  center = true,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`flex flex-col ${center ? 'items-center text-center' : 'items-start text-left'} mb-12 ${className}`}
    >
      {badge && (
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-blue-700 bg-blue-100/80 border border-blue-200 shadow-sm mb-3">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionTitle;
