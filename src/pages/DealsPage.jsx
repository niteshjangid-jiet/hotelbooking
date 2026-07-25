import React from 'react';
import SectionTitle from '../components/common/SectionTitle';
import OfferCard from '../components/offers/OfferCard';
import { OFFERS } from '../constants/offers';

const DealsPage = () => {
  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionTitle
        badge="Special Deals"
        title="Exclusive Hotel Promotions & Coupons"
        subtitle="Claim limited-time discount vouchers and unlock secret rates for your next getaway."
        center={true}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {OFFERS.map((offer, index) => (
          <OfferCard key={offer.id} offer={offer} index={index} />
        ))}
      </div>
    </div>
  );
};

export default DealsPage;
