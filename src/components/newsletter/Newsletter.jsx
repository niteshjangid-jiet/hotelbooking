import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMail, HiSparkles, HiCheckCircle } from 'react-icons/hi';
import Button from '../common/Button';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl bg-slate-900 overflow-hidden p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
        {/* AMBIENT BACKGROUND GLOWS */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-widest"
          >
            <HiSparkles className="text-amber-400 text-sm" />
            VIP Travel Insider
          </motion.span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Unlock Secret Rates & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
              Exclusive Hotel Deals
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-normal max-w-xl leading-relaxed">
            Join over 150,000+ smart travelers. Receive members-only discounts up to 50% OFF directly to your inbox every week.
          </p>

          {/* SUBSCRIPTION FORM */}
          <form onSubmit={handleSubmit} className="w-full max-w-md mt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 backdrop-blur-md transition-all"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="py-4 px-8 rounded-2xl text-sm font-bold shadow-xl shadow-blue-600/30 whitespace-nowrap"
            >
              Subscribe Now
            </Button>
          </form>

          {/* SUCCESS MESSAGE */}
          {subscribed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold"
            >
              <HiCheckCircle className="text-emerald-400 text-base" />
              <span>Thank you! Check your inbox for your 30% OFF welcome coupon code.</span>
            </motion.div>
          )}

          <p className="text-[11px] text-slate-400 font-medium">
            🔒 We respect your privacy. Unsubscribe anytime with 1-click. No spam ever.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
