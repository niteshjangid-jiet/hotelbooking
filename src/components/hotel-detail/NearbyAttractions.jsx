import React from 'react';
import { HiLocationMarker, HiMap, HiExternalLink } from 'react-icons/hi';
import { FaPlane, FaTrain, FaLandmark, FaUmbrellaBeach } from 'react-icons/fa';

const getAttractionIcon = (name) => {
  const n = (name || '').toLowerCase();
  if (n.includes('airport')) return <FaPlane className="text-sky-500" />;
  if (n.includes('train') || n.includes('station')) return <FaTrain className="text-amber-500" />;
  if (n.includes('beach') || n.includes('lake') || n.includes('sea')) return <FaUmbrellaBeach className="text-cyan-500" />;
  return <FaLandmark className="text-indigo-500" />;
};

const NearbyAttractions = ({ attractions = [], hotelName, city = 'Udaipur' }) => {
  const defaultAttractions = [
    { name: `${city} City Palace & Museum`, distance: '0.9 km', duration: '12 mins walk' },
    { name: `${city} Central Lake & Sunset Pier`, distance: '1.4 km', duration: '5 mins drive' },
    { name: 'International Airport (UDR)', distance: '19.2 km', duration: '35 mins taxi' },
    { name: 'Main City Railway Station', distance: '4.5 km', duration: '15 mins drive' },
    { name: 'Heritage Handicrafts Bazaar', distance: '1.8 km', duration: '10 mins walk' },
  ];

  const displayAttractions = attractions.length > 0 ? attractions : defaultAttractions;

  // Encoded query for Google Maps embed iframe
  const mapSearchQuery = encodeURIComponent(`${hotelName || ''} ${city}`);
  const mapsIframeUrl = `https://maps.google.com/maps?q=${mapSearchQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div id="hotel-map-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* HEADER */}
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <HiMap className="text-blue-600" /> Location & Nearby Attractions
        </h3>
        <p className="text-xs text-slate-500 font-medium">Explore key landmarks and transportation hubs near the hotel</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ATTRACTIONS LIST */}
        <div className="lg:col-span-1 space-y-3">
          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Top Nearby Spots</h4>
          <div className="space-y-2.5">
            {displayAttractions.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-sm">
                    {getAttractionIcon(item.name)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{item.duration || 'Nearby'}</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  {item.distance}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* GOOGLE MAPS EMBED IFRAME */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-slate-200 shadow-md relative min-h-[300px] bg-slate-100">
          <iframe
            title={`Map location for ${hotelName}`}
            src={mapsIframeUrl}
            className="w-full h-full min-h-[320px] border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default NearbyAttractions;
