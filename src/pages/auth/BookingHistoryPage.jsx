import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiTicket, 
  HiCalendar, 
  HiLocationMarker, 
  HiArrowLeft, 
  HiShieldCheck, 
  HiClock,
  HiUserGroup,
  HiChevronRight
} from 'react-icons/hi';
import MainLayout from '../../layouts/MainLayout';
import { useAuth } from '../../context/AuthContext';
import { getUserBookings } from '../../services/bookingService';
import { formatPrice } from '../../utils/formatters';

const BookingHistoryPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getUserBookings(user?.id);
        setBookings(data || []);
      } catch (err) {
        console.error('Error loading booking history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  return (
    <MainLayout>
      <div className="pt-28 pb-20 bg-slate-950 text-white min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
                <HiTicket className="text-blue-500" /> My Booking History
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Your past, present, and upcoming luxury hotel reservations and stay vouchers.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-1.5 self-start sm:self-auto transition-colors"
            >
              <HiArrowLeft /> Back to Dashboard
            </Link>
          </div>

          {/* CONTENT AREA */}
          {loading ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400 text-xs font-semibold">Retrieving your stay itineraries...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-3xl mx-auto mb-4">
                <HiTicket />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Past Bookings Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                When you reserve a stay at any of our heritage palaces or luxury beach resorts, your confirmed tickets and itineraries will appear here.
              </p>
              <Link
                to="/hotels"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
              >
                Explore Hotel Stays
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking, idx) => (
                <motion.div
                  key={booking.booking_id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col md:flex-row"
                >
                  {/* IMAGE */}
                  {booking.hotel_image && (
                    <div className="md:w-1/3 h-48 md:h-auto relative bg-slate-950">
                      <img
                        src={booking.hotel_image}
                        alt={booking.hotel_name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 text-[10px] font-black text-blue-400 font-mono">
                        {booking.booking_id}
                      </div>
                    </div>
                  )}

                  {/* DETAILS */}
                  <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[11px] font-extrabold text-blue-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                            <HiLocationMarker /> {booking.hotel_city || 'India'}
                          </span>
                          <h3 className="text-xl font-extrabold text-white">{booking.hotel_name}</h3>
                          <p className="text-xs text-slate-300 font-medium mt-0.5">{booking.room_name}</p>
                        </div>

                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-extrabold rounded-full flex items-center gap-1">
                          <HiShieldCheck /> {booking.booking_status || 'Confirmed'}
                        </span>
                      </div>

                      {/* SPECS GRID */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Check-in</span>
                          <span className="font-extrabold text-white flex items-center gap-1">
                            <HiCalendar className="text-blue-400" /> {booking.check_in}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Check-out</span>
                          <span className="font-extrabold text-white flex items-center gap-1">
                            <HiCalendar className="text-blue-400" /> {booking.check_out}
                          </span>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Guests</span>
                          <span className="font-extrabold text-white flex items-center gap-1">
                            <HiUserGroup className="text-indigo-400" /> {booking.guests} Guests ({booking.nights}N)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* PRICE & ACTION */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Amount</span>
                        <span className="text-xl font-black text-blue-400 tracking-tight">
                          {formatPrice(booking.total_price)}
                        </span>
                      </div>

                      <Link
                        to={`/booking-success/${booking.booking_id}`}
                        state={{ booking }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl border border-slate-700 flex items-center gap-1 transition-all"
                      >
                        <span>View Ticket</span>
                        <HiChevronRight />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default BookingHistoryPage;
