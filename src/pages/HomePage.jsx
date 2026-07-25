import React from 'react';
import Hero from '../components/hero/Hero';
import DestinationsSection from '../components/destinations/DestinationsSection';
import FeaturedHotelsSection from '../components/hotels/FeaturedHotelsSection';
import WhyChooseUsSection from '../components/features/WhyChooseUsSection';
import SpecialOffersSection from '../components/offers/SpecialOffersSection';
import TestimonialsSection from '../components/testimonials/TestimonialsSection';

const HomePage = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* HERO SECTION */}
      <Hero />

      {/* POPULAR DESTINATIONS */}
      <DestinationsSection />

      {/* FEATURED HOTELS */}
      <FeaturedHotelsSection />

      {/* WHY CHOOSE US */}
      <WhyChooseUsSection />

      {/* SPECIAL OFFERS */}
      <SpecialOffersSection />

      {/* TESTIMONIALS CAROUSEL */}
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;
