import React from 'react';
import SectionTitle from '../components/common/SectionTitle';
import DestinationCard from '../components/destinations/DestinationCard';
import { DESTINATIONS } from '../constants/destinations';

const DestinationsPage = () => {
  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionTitle
        badge="All Destinations"
        title="Discover India's Premier Holiday Hubs"
        subtitle="Browse top rated destinations, royal cities, and serene coastal getaways."
        center={true}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {DESTINATIONS.map((destination, index) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default DestinationsPage;
