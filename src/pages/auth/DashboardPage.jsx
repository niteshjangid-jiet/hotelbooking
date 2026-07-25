import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  HiTicket, 
  HiCalendar, 
  HiCurrencyRupee, 
  HiXCircle, 
  HiShieldCheck,
  HiClock,
  HiRefresh
} from 'react-icons/hi';
import MainLayout from '../../layouts/MainLayout';
import { useAuth } from '../../context/AuthContext';
import { useSession } from '../../hooks/useSession';
import { getUserBookings, cancelBooking, getUserActivities } from '../../services/bookingService';
import { formatPrice } from '../../utils/formatters';

// Dashboard Sub-components
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import ProfileSummary from '../../components/dashboard/ProfileSummary';
import StatCard from '../../components/dashboard/StatCard';
import BookingFilterBar from '../../components/dashboard/BookingFilterBar';
import BookingCard from '../../components/dashboard/BookingCard';
import BookingDetailsModal from '../../components/dashboard/BookingDetailsModal';
import CancelBookingModal from '../../components/dashboard/CancelBookingModal';
import RecentActivityFeed from '../../components/dashboard/RecentActivityFeed';
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton';
import EmptyState from '../../components/dashboard/EmptyState';

const DashboardPage = () => {
  const { user, signOut } = useAuth();
  const { userName } = useSession();

  const [bookings, setBookings] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search State
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Modals State
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [isSubmittingCancel, setIsSubmittingCancel] = useState(false);

  // Fetch Bookings & Activity Feed
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const userBookings = await getUserBookings(user?.id);
      setBookings(userBookings || []);

      const userAct = getUserActivities(user?.id);
      setActivities(userAct || []);
    } catch (err) {
      console.error('Failed to load user dashboard data:', err);
      toast.error('Unable to fetch dashboard data. Showing saved offline records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Compute Statistics
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const stats = useMemo(() => {
    let upcoming = 0;
    let completed = 0;
    let cancelled = 0;
    let totalSpent = 0;

    bookings.forEach((b) => {
      const status = b.booking_status || 'Confirmed';
      const checkOutDate = new Date(b.check_out);

      if (status === 'Cancelled') {
        cancelled++;
      } else if (checkOutDate < today) {
        completed++;
        totalSpent += Number(b.total_price || 0);
      } else {
        upcoming++;
        totalSpent += Number(b.total_price || 0);
      }
    });

    return {
      total: bookings.length,
      upcoming,
      completed,
      cancelled,
      totalSpent,
    };
  }, [bookings, today]);

  // Filtered & Sorted Bookings List
  const filteredBookings = useMemo(() => {
    return bookings
      .filter((b) => {
        const status = b.booking_status || 'Confirmed';
        const checkOutDate = new Date(b.check_out);
        let computed = status;

        if (status !== 'Cancelled') {
          if (checkOutDate < today) computed = 'completed';
          else computed = 'upcoming';
        } else {
          computed = 'cancelled';
        }

        // Tab Filter
        if (activeTab !== 'all' && computed !== activeTab) {
          return false;
        }

        // Search Filter
        if (searchTerm.trim() !== '') {
          const q = searchTerm.toLowerCase();
          const matchesId = (b.booking_id || '').toLowerCase().includes(q);
          const matchesHotel = (b.hotel_name || '').toLowerCase().includes(q);
          const matchesCity = (b.hotel_city || '').toLowerCase().includes(q);
          const matchesRoom = (b.room_name || '').toLowerCase().includes(q);
          return matchesId || matchesHotel || matchesCity || matchesRoom;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') {
          return new Date(a.created_at) - new Date(b.created_at);
        }
        if (sortBy === 'price_high') {
          return (b.total_price || 0) - (a.total_price || 0);
        }
        if (sortBy === 'price_low') {
          return (a.total_price || 0) - (b.total_price || 0);
        }
        // Default: newest
        return new Date(b.created_at) - new Date(a.created_at);
      });
  }, [bookings, activeTab, searchTerm, sortBy, today]);

  // Handle Cancel Booking Submission
  const handleConfirmCancel = async (bookingId, reason) => {
    try {
      setIsSubmittingCancel(true);
      const res = await cancelBooking(bookingId, reason);

      if (res.success) {
        toast.success(res.message);
        setSelectedBookingForCancel(null);
        // Refresh dashboard data
        fetchDashboardData();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error('Cancellation error:', err);
      toast.error('An error occurred while cancelling your reservation.');
    } finally {
      setIsSubmittingCancel(false);
    }
  };

  return (
    <MainLayout>
      <div className="pt-28 pb-20 bg-slate-950 text-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* HEADER WELCOME BANNER */}
          <DashboardHeader 
            user={user} 
            userName={userName} 
            signOut={signOut} 
            totalBookings={stats.total} 
          />

          {loading ? (
            <DashboardSkeleton />
          ) : (
            <>
              {/* ANALYTICS STATS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                <StatCard
                  title="Total Bookings"
                  value={stats.total}
                  subtext="All-time reservations"
                  icon={HiTicket}
                  color="bg-blue-500/10 text-blue-400 border-blue-500/20"
                  delay={0.05}
                />
                <StatCard
                  title="Upcoming Stays"
                  value={stats.upcoming}
                  subtext="Active reservations"
                  icon={HiCalendar}
                  color="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  delay={0.1}
                />
                <StatCard
                  title="Completed"
                  value={stats.completed}
                  subtext="Fulfilled stays"
                  icon={HiClock}
                  color="bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                  delay={0.15}
                />
                <StatCard
                  title="Cancelled"
                  value={stats.cancelled}
                  subtext="Revoked bookings"
                  icon={HiXCircle}
                  color="bg-rose-500/10 text-rose-400 border-rose-500/20"
                  delay={0.2}
                />
                <StatCard
                  title="Total Spent"
                  value={formatPrice(stats.totalSpent)}
                  subtext="Value of stays"
                  icon={HiCurrencyRupee}
                  color="bg-amber-500/10 text-amber-400 border-amber-500/20"
                  delay={0.25}
                />
              </div>

              {/* PROFILE SUMMARY & RECENT ACTIVITY DUAL COLUMN */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <ProfileSummary user={user} />
                </div>
                <div className="lg:col-span-2">
                  <RecentActivityFeed activities={activities} />
                </div>
              </div>

              {/* BOOKINGS SECTION HEADER */}
              <div className="pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <HiTicket className="text-blue-500" /> My Stay Reservations
                  </h2>
                  <button
                    onClick={fetchDashboardData}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Refresh Bookings"
                  >
                    <HiRefresh />
                  </button>
                </div>

                {/* TABS & FILTER BAR */}
                <BookingFilterBar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  counts={{
                    all: stats.total,
                    upcoming: stats.upcoming,
                    completed: stats.completed,
                    cancelled: stats.cancelled,
                  }}
                />

                {/* BOOKINGS LIST OR EMPTY STATE */}
                {filteredBookings.length === 0 ? (
                  <EmptyState
                    title={
                      searchTerm
                        ? `No results for "${searchTerm}"`
                        : activeTab !== 'all'
                        ? `No ${activeTab} stays found`
                        : 'No Reservations Found'
                    }
                    description={
                      searchTerm
                        ? 'Try searching with a different keyword, hotel name, or booking reference.'
                        : 'When you book a luxury stay, your itinerary and ticket voucher will appear here.'
                    }
                    onResetSearch={searchTerm ? () => setSearchTerm('') : null}
                  />
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map((b, idx) => (
                      <BookingCard
                        key={b.booking_id || idx}
                        booking={b}
                        index={idx}
                        onViewDetails={(booking) => setSelectedBookingForModal(booking)}
                        onCancelBooking={(booking) => setSelectedBookingForCancel(booking)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>

      {/* DETAIL MODAL */}
      <BookingDetailsModal
        booking={selectedBookingForModal}
        onClose={() => setSelectedBookingForModal(null)}
      />

      {/* CANCEL MODAL */}
      <CancelBookingModal
        booking={selectedBookingForCancel}
        onClose={() => setSelectedBookingForCancel(null)}
        onConfirmCancel={handleConfirmCancel}
        isSubmitting={isSubmittingCancel}
      />
    </MainLayout>
  );
};

export default DashboardPage;
