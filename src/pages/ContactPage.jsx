import React, { useState } from 'react';
import SectionTitle from '../components/common/SectionTitle';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { HiMail, HiPhone, HiLocationMarker, HiPaperAirplane, HiCheckCircle } from 'react-icons/hi';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionTitle
        badge="24/7 Support"
        title="We are Here To Assist Your Travel"
        subtitle="Have questions about a booking, property verification, or custom travel packages? Get in touch with our luxury concierge team."
        center={true}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
        {/* CONTACT INFO CARDS */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-card p-8 rounded-3xl border border-slate-200/80 shadow-lg flex flex-col gap-6">
            <h3 className="text-xl font-bold text-slate-900">Reach Us Directly</h3>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
                <HiPhone />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">24/7 Concierge Hotline</span>
                <p className="text-base font-bold text-slate-900">+91 1800 555 9898</p>
                <p className="text-xs text-slate-500">Toll-free across India</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-xl shrink-0">
                <HiMail />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Support</span>
                <p className="text-base font-bold text-slate-900">support@hotelbookingsite.com</p>
                <p className="text-xs text-slate-500">Avg response time: 15 mins</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl shrink-0">
                <HiLocationMarker />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Head Office</span>
                <p className="text-base font-bold text-slate-900">BKC Luxury Tower, Bandra Kurla Complex</p>
                <p className="text-xs text-slate-500">Mumbai, Maharashtra 400051</p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT FORM */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
          <h3 className="text-2xl font-extrabold text-slate-900 mb-6">Send Us a Message</h3>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <Input
              label="Subject"
              placeholder="Booking inquiry or feedback"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Your Message *
              </label>
              <textarea
                rows="5"
                required
                placeholder="How can we assist you today?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              ></textarea>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={HiPaperAirplane}
              className="py-4 font-bold shadow-lg shadow-blue-600/25"
            >
              Send Message
            </Button>

            {submitted && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
                <HiCheckCircle className="text-emerald-600 text-xl" />
                Thank you! Your message has been sent to our concierge team.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
