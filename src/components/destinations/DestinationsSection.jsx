import React from 'react';
import SectionTitle from '../common/SectionTitle';
import DestinationCard from './DestinationCard';
import { DESTINATIONS } from '../../constants/destinations';

const DestinationsSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionTitle
        badge="Top Destinations"
        title="Explore India's Most Regal & Serene Cities"
        subtitle="From royal palace stays in Rajasthan to sun-kissed beaches in Goa, explore iconic travel destinations."
        center={true}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {DESTINATIONS.map((destination, index) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default DestinationsSection;
