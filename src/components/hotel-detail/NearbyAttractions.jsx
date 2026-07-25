import React from 'react';
import GeoapifyInteractiveMap from './GeoapifyInteractiveMap';

/**
 * NearbyAttractions Component wrapper using Geoapify Interactive Map & POI Service
 */
const NearbyAttractions = ({ attractions = [], hotelName, city = 'Udaipur', hotel }) => {
  // Construct a minimal hotel object if hotel object wasn't passed directly
  const hotelObj = hotel || {
    hotel_name: hotelName,
    name: hotelName,
    city: city,
    nearby_attractions: attractions,
  };

  return <GeoapifyInteractiveMap hotel={hotelObj} />;
};

export default NearbyAttractions;
