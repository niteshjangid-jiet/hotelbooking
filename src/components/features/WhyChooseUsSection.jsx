import React from 'react';
import SectionTitle from '../common/SectionTitle';
import FeatureCard from './FeatureCard';
import { WHY_CHOOSE_US } from '../../constants/whyChooseUs';

const WhyChooseUsSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionTitle
        badge="Why Choose Us"
        title="Unrivaled Peace of Mind For Every Journey"
        subtitle="We blend technology with warm hospitality to deliver transparent pricing, verified stays, and round-the-clock VIP assistance."
        center={true}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {WHY_CHOOSE_US.map((feature, index) => (
          <FeatureCard key={feature.id} feature={feature} index={index} />
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
