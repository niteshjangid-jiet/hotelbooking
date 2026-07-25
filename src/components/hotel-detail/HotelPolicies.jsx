import React from 'react';
import { 
  HiClock, 
  HiExclamationCircle, 
  HiShieldCheck, 
  HiUserGroup, 
  HiHeart, 
  HiCreditCard,
  HiDocumentText
} from 'react-icons/hi';

const HotelPolicies = ({ policies }) => {
  const defaultPolicies = {
    checkIn: '14:00 PM onwards (Early check-in subject to room availability)',
    checkOut: '12:00 PM Noon (Late check-out available on request)',
    cancellation: 'Free cancellation up to 48 hours before check-in date. Cancellations made within 48 hours are charged 1 night fare.',
    childPolicy: 'Children under 6 stay free of charge when sharing existing bedding with parents. Extra bed for adults or children above 6 is ₹2,500/night.',
    pets: 'Pets are not allowed on property except registered guide & service animals.',
    payment: 'Accepts Credit Cards (Visa, MasterCard, Amex), UPI payments, Net Banking & Cash at check-in.',
    idRequirement: 'All Indian guests must present government photo ID (Aadhaar, Driving License, Voter ID, Passport). PAN card is not accepted.',
  };

  const p = policies || defaultPolicies;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* HEADER */}
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <HiDocumentText className="text-blue-600" /> Hotel Policies & Fine Print
        </h3>
        <p className="text-xs text-slate-500 font-medium">Important guidelines for a smooth stay</p>
      </div>

      {/* POLICIES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CHECK-IN / CHECK-OUT */}
        <div className="flex gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl flex-shrink-0">
            <HiClock />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Check-in & Check-out</h4>
            <p className="text-xs text-slate-700 font-medium mt-1">
              <span className="font-bold text-slate-900">Check-in:</span> {p.checkIn}
            </p>
            <p className="text-xs text-slate-700 font-medium mt-0.5">
              <span className="font-bold text-slate-900">Check-out:</span> {p.checkOut}
            </p>
          </div>
        </div>

        {/* CANCELLATION */}
        <div className="flex gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl flex-shrink-0">
            <HiShieldCheck />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Cancellation / Prepayment</h4>
            <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">
              {p.cancellation}
            </p>
          </div>
        </div>

        {/* CHILDREN & EXTRA BEDS */}
        <div className="flex gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl flex-shrink-0">
            <HiUserGroup />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Children & Extra Bedding</h4>
            <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">
              {p.childPolicy}
            </p>
          </div>
        </div>

        {/* PETS & ID PROOF */}
        <div className="flex gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl flex-shrink-0">
            <HiExclamationCircle />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Government ID & Pets</h4>
            <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">
              {p.idRequirement}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">
              <span className="font-bold text-slate-700">Pets:</span> {p.pets}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelPolicies;
