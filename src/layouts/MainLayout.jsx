import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';
import Newsletter from '../components/newsletter/Newsletter';
import { HiArrowUp } from 'react-icons/hi';
import { useScroll } from '../hooks/useScroll';

const MainLayout = ({ children, showNewsletter = true }) => {
  const { isScrolled } = useScroll(300);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-blue-600 selection:text-white">
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        {children}
      </main>

      {/* NEWSLETTER SECTION */}
      {showNewsletter && <Newsletter />}

      {/* FOOTER */}
      <Footer />

      {/* BACK TO TOP BUTTON */}
      {isScrolled && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-2xl bg-blue-600 text-white shadow-2xl flex items-center justify-center hover:bg-blue-500 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border border-white/20"
        >
          <HiArrowUp className="text-xl" />
        </motion.button>
      )}
    </div>
  );
};

export default MainLayout;
