import React from 'react';
import SectionTitle from '../common/SectionTitle';
import OfferCard from './OfferCard';
import { OFFERS } from '../../constants/offers';

const SpecialOffersSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionTitle
        badge="Exclusive Offers"
        title="Promotional Deals & Vacation Discounts"
        subtitle="Take advantage of limited-time seasonal packages, weekend cashback offers, and complimentary room upgrades."
        center={true}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {OFFERS.map((offer, index) => (
          <OfferCard key={offer.id} offer={offer} index={index} />
        ))}
      </div>
    </section>
  );
};

export default SpecialOffersSection;
