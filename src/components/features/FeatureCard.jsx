import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ feature, index = 0 }) => {
  const { icon: Icon, title, description, iconColor, bgColor } = feature;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 flex flex-col items-start gap-4 group"
    >
      <div className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center text-2xl ${iconColor} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm`}>
        <Icon />
      </div>

      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>

      <p className="text-sm text-slate-600 leading-relaxed font-normal">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
