import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiMenuAlt3, 
  HiX, 
  HiOfficeBuilding, 
  HiUserCircle, 
  HiSparkles,
  HiLogout,
  HiUser,
  HiCollection,
  HiHeart,
  HiChevronDown,
  HiViewGrid
} from 'react-icons/hi';
import { useScroll } from '../../hooks/useScroll';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Hotels', path: '/hotels' },
  { name: 'Destinations', path: '/destinations' },
  { name: 'Deals', path: '/deals' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const { isScrolled } = useScroll(40);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { user, userProfile, signOut } = useAuth();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    navigate('/login');
  };

  const getUserDisplayName = () => {
    if (userProfile?.full_name) return userProfile.full_name;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'Guest User';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-md py-3.5 border-b border-slate-100'
          : 'bg-gradient-to-b from-slate-900/90 via-slate-900/40 to-transparent py-5 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
            <HiOfficeBuilding className="text-2xl" />
          </div>
          <div className="flex flex-col">
            <span className={`text-xl font-extrabold tracking-tight ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
              HotelBooking<span className="text-blue-600">Site</span>
            </span>
            <span className={`text-[10px] uppercase font-bold tracking-widest -mt-1 ${isScrolled ? 'text-slate-400' : 'text-slate-300'}`}>
              Luxury Stays
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                  isScrolled
                    ? isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                    : isActive
                    ? 'text-white bg-white/20'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ACTION BUTTONS / USER PROFILE MENU (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  isScrolled
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-white'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-teal-400 text-white font-bold text-xs flex items-center justify-center shadow-md uppercase">
                  {getUserDisplayName().charAt(0)}
                </div>
                <span className="text-sm font-semibold max-w-[120px] truncate">
                  {getUserDisplayName()}
                </span>
                <HiChevronDown className={`text-xs transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* USER DROPDOWN MENU */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 text-white p-1.5"
                  >
                    <div className="px-3.5 py-2.5 border-b border-slate-800/80 mb-1">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                    >
                      <HiViewGrid className="text-blue-400 text-sm" /> Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                    >
                      <HiUser className="text-teal-400 text-sm" /> My Profile
                    </Link>

                    <Link
                      to="/booking-history"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                    >
                      <HiCollection className="text-amber-400 text-sm" /> My Bookings
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                    >
                      <HiHeart className="text-rose-400 text-sm" /> Saved Wishlist
                    </Link>

                    <div className="h-px bg-slate-800/80 my-1" />

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                    >
                      <HiLogout className="text-sm" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant={isScrolled ? 'ghost' : 'glass'} size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm" icon={HiSparkles}>
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU HAMBURGER BUTTON */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle Navigation"
            className={`p-2 rounded-xl text-2xl focus:outline-none transition-colors ${
              isScrolled
                ? 'text-slate-800 hover:bg-slate-100'
                : 'text-white hover:bg-white/10'
            }`}
          >
            {mobileMenuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-slate-900 text-white border-b border-slate-800 px-4 pt-4 pb-6 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 text-base font-semibold rounded-xl flex items-center justify-between ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                  </Link>
                );
              })}
              
              <div className="h-px bg-slate-800 my-2" />

              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="px-4 py-2 bg-slate-800/60 rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                      {getUserDisplayName().charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{getUserDisplayName()}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 rounded-xl flex items-center gap-2"
                  >
                    <HiViewGrid className="text-blue-400" /> Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 rounded-xl flex items-center gap-2"
                  >
                    <HiUser className="text-teal-400" /> Profile Settings
                  </Link>
                  <Link
                    to="/booking-history"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 rounded-xl flex items-center gap-2"
                  >
                    <HiCollection className="text-amber-400" /> Booking History
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 rounded-xl flex items-center gap-2"
                  >
                    <HiHeart className="text-rose-400" /> Wishlist
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full mt-2 px-4 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <HiLogout /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 pt-1">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" fullWidth>
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" fullWidth icon={HiSparkles}>
                      Sign Up / Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
