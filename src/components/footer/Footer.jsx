import React from 'react';
import { Link } from 'react-router-dom';
import { HiOfficeBuilding, HiHeart } from 'react-icons/hi';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaYoutube 
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-20 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-slate-800/80">
          {/* BRAND COLUMN */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <HiOfficeBuilding className="text-2xl" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-white tracking-tight">
                  HotelBooking<span className="text-blue-500">Site</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                  Luxury Stays
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm font-normal">
              HotelBookingSite is India's premier luxury travel marketplace. Discover, compare, and book heritage palaces, 5-star beach resorts, and boutique stays at guaranteed lowest prices.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex items-center gap-3 mt-2">
              {[
                { icon: FaInstagram, href: '#', label: 'Instagram' },
                { icon: FaFacebookF, href: '#', label: 'Facebook' },
                { icon: FaTwitter, href: '#', label: 'Twitter' },
                { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
                { icon: FaYoutube, href: '#', label: 'YouTube' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-300"
                >
                  <social.icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* COMPANY */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Company</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Careers & Jobs</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Press & Media</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Travel Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Partner With Us</a></li>
            </ul>
          </div>

          {/* DESTINATIONS */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Destinations</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link to="/destinations" className="hover:text-blue-400 transition-colors">Udaipur Stays</Link></li>
              <li><Link to="/destinations" className="hover:text-blue-400 transition-colors">Jaipur Palaces</Link></li>
              <li><Link to="/destinations" className="hover:text-blue-400 transition-colors">Goa Beach Resorts</Link></li>
              <li><Link to="/destinations" className="hover:text-blue-400 transition-colors">Mumbai Luxury Hotels</Link></li>
              <li><Link to="/destinations" className="hover:text-blue-400 transition-colors">Kerala Backwaters</Link></li>
            </ul>
          </div>

          {/* SUPPORT & LEGAL */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Support & Legal</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Help Center & FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact 24/7 Support</Link></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Cancellation Refund Policy</a></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <p>© {new Date().getFullYear()} HotelBookingSite Inc. All rights reserved. Built with passion for luxury travelers.</p>
          <div className="flex items-center gap-1">
            <span>Designed & Engineered with</span>
            <HiHeart className="text-rose-500 text-sm" />
            <span>for Module 1</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
