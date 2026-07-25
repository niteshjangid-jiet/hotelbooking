import React from 'react';
import SectionTitle from '../components/common/SectionTitle';
import WhyChooseUsSection from '../components/features/WhyChooseUsSection';
import { HiShieldCheck, HiSparkles, HiUserGroup, HiGlobeAlt } from 'react-icons/hi';

const AboutPage = () => {
  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionTitle
        badge="Our Story"
        title="Redefining Modern Hotel Discovery"
        subtitle="HotelBookingSite was built to give travelers an effortless, transparent, and luxurious way to book verified stays worldwide."
        center={true}
      />

      {/* METRICS BANNER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-12">
        {[
          { icon: HiGlobeAlt, label: 'Cities Covered', value: '120+' },
          { icon: HiShieldCheck, label: 'Verified Stays', value: '1,500+' },
          { icon: HiUserGroup, label: 'Happy Travelers', value: '200,000+' },
          { icon: HiSparkles, label: 'Average Rating', value: '4.95 ★' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl text-center flex flex-col items-center gap-2 border border-slate-200/80 shadow-md">
            <stat.icon className="text-3xl text-blue-600 mb-1" />
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">{stat.value}</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
          </div>
        ))}
      </div>

      <WhyChooseUsSection />
    </div>
  );
};

export default AboutPage;
