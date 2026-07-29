import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiPhone, HiShieldCheck, HiX, HiLockClosed, HiRefresh, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import { sendPhoneOtp, verifyPhoneOtp, formatPhoneNumber } from '../../services/phoneAuthService';
import { useAuth } from '../../context/AuthContext';

const OtpVerificationModal = ({ isOpen, onClose, onSuccess, initialPhone = '' }) => {
  const { user } = useAuth();
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'success'
  const [phone, setPhone] = useState(initialPhone || user?.user_metadata?.phone || user?.phone || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoNotice, setDemoNotice] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [timer, setTimer] = useState(0);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    const formatted = formatPhoneNumber(phone);
    const digits = formatted.replace(/\D/g, '');

    if (digits.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      setLoading(true);
      const res = await sendPhoneOtp(phone);
      if (res.success) {
        setStep('otp');
        setTimer(60); // 60-second resend countdown
        setDemoNotice(res.demoOtp ? `Demo Mode (SMS provider pending in dashboard): Use OTP ${res.demoOtp}` : 'Real SMS sent to your phone number!');
        toast.success(res.message || `OTP sent to ${res.formattedPhone}`);
      }
    } catch (err) {
      const msg = err.message || 'Failed to send OTP. Please check your phone number.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!otp || otp.trim().length !== 6) {
      setErrorMsg('Please enter the complete 6-digit OTP code.');
      toast.error('Please enter the 6-digit OTP code.');
      return;
    }

    try {
      setLoading(true);
      const res = await verifyPhoneOtp({ phone, otp, user });
      if (res.verified) {
        setStep('success');
        toast.success('Mobile number verified successfully!');
        setTimeout(() => {
          onSuccess && onSuccess(res.phone || phone);
        }, 1200);
      }
    } catch (err) {
      const msg = err.message || 'Invalid OTP code. Please enter the correct code.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0 || loading) return;
    setErrorMsg('');
    try {
      setLoading(true);
      const res = await sendPhoneOtp(phone);
      setTimer(60);
      setOtp('');
      toast.success(res.message || 'OTP resent successfully!');
    } catch (err) {
      const msg = err.message || 'Failed to resend OTP.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Background blurs */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50 hover:bg-slate-800 transition-colors"
          >
            <HiX className="text-xl" />
          </button>

          {/* HEADER */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <HiShieldCheck className="text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                Mobile OTP Verification
              </h3>
              <p className="text-xs text-slate-400">
                Required to confirm hotel booking
              </p>
            </div>
          </div>

          {/* ERROR ALERT BOX */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2"
            >
              <HiExclamationCircle className="text-base flex-shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* STEP 1: PHONE NUMBER INPUT */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Enter Mobile Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={phone.replace(/^\+91\s?/, '')}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="9876543210"
                    maxLength={12}
                    className="w-full pl-14 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-base tracking-wide"
                    required
                  />
                  <HiPhone className="absolute right-3.5 top-3.5 text-slate-500 text-lg" />
                </div>
                <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                  <HiLockClosed className="text-slate-500" /> We will send a 6-digit verification code via SMS.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending OTP...</span>
                  </span>
                ) : (
                  <span>Send OTP Code</span>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: OTP INPUT */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Enter 6-Digit OTP
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('phone');
                      setErrorMsg('');
                    }}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Change Number
                  </button>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Sent to <span className="font-mono font-bold text-slate-200">{formatPhoneNumber(phone)}</span>
                </p>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="123456"
                  maxLength={6}
                  autoFocus
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-center text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-2xl tracking-[0.4em] font-extrabold"
                  required
                />

                {demoNotice && (
                  <div className="mt-3 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs text-center font-medium">
                    ⚡ {demoNotice}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Code...</span>
                  </span>
                ) : (
                  <span>Verify OTP & Proceed to Payment</span>
                )}
              </button>

              <div className="flex justify-between items-center pt-2 text-xs">
                <span className="text-slate-400">Didn't receive code?</span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading || timer > 0}
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                >
                  <HiRefresh className={loading ? 'animate-spin' : ''} />
                  {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS STATE */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                className="w-16 h-16 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center mx-auto text-4xl"
              >
                <HiCheckCircle />
              </motion.div>
              <h4 className="text-lg font-bold text-white">Mobile Verified!</h4>
              <p className="text-xs text-slate-400">
                Opening Razorpay payment gateway...
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OtpVerificationModal;
