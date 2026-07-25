import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiTag, HiCheck, HiClipboardCopy, HiArrowRight } from 'react-icons/hi';
import Button from '../common/Button';

const OfferCard = ({ offer, index = 0 }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(offer.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className={`relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-white/20 text-white flex flex-col justify-between h-[360px] bg-gradient-to-br ${offer.gradient} group p-6 md:p-8`}
    >
      {/* BACKGROUND IMAGE ACCENT WITH BLEND MODE */}
      <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
        <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
      </div>

      {/* TOP HEADER */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-widest border border-white/30">
          {offer.badge}
        </span>
        <span className="text-2xl font-black tracking-tight bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-2xl border border-white/30">
          {offer.discount}
        </span>
      </div>

      {/* CENTER CONTENT */}
      <div className="relative z-10 my-auto flex flex-col gap-2">
        <span className="text-xs text-blue-100 font-bold uppercase tracking-wider">
          {offer.validTill}
        </span>
        <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
          {offer.title}
        </h3>
        <p className="text-xs md:text-sm text-slate-100 font-normal leading-relaxed line-clamp-2">
          {offer.description}
        </p>
      </div>

      {/* BOTTOM COUPON CODE & ACTION */}
      <div className="relative z-10 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-black/25 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20">
          <HiTag className="text-amber-300 text-base" />
          <span className="font-mono font-bold text-sm tracking-wider">{offer.code}</span>
          <button
            onClick={handleCopyCode}
            aria-label="Copy Coupon Code"
            className="ml-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {copied ? <HiCheck className="text-emerald-400 text-base" /> : <HiClipboardCopy className="text-base" />}
          </button>
        </div>

        <Button
          variant="glass"
          size="sm"
          onClick={() => alert(`Applied coupon ${offer.code}!`)}
          className="text-xs font-bold px-4 py-2"
        >
          Claim Deal
        </Button>
      </div>
    </motion.div>
  );
};

export default OfferCard;
