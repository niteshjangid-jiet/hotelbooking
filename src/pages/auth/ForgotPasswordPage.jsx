import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { HiMail, HiArrowLeft, HiPaperAirplane, HiCheckCircle } from 'react-icons/hi';
import AuthCard from '../../components/auth/AuthCard';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await forgotPassword(data.email);
      setSubmittedEmail(data.email);
    } catch (err) {
      console.error('Forgot password error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Enter your registered email address and we'll send you instructions to reset your password."
      badge="Account Recovery"
    >
      {submittedEmail ? (
        <div className="flex flex-col items-center text-center py-4 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl">
            <HiCheckCircle />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1.5">Check Your Email</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              We have dispatched a password recovery link to{' '}
              <span className="font-semibold text-slate-200">{submittedEmail}</span>. Please check your inbox and spam folder.
            </p>
          </div>
          <Link
            to="/login"
            className="w-full mt-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <HiArrowLeft />
            <span>Return to Login</span>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* EMAIL */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Registered Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <HiMail className="text-lg" />
              </div>
              <input
                type="email"
                placeholder="your.email@example.com"
                className={`w-full pl-10 pr-4 py-3 bg-slate-950/60 border rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.email
                    ? 'border-rose-500/80 focus:ring-rose-500/30'
                    : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/20 hover:border-slate-700'
                }`}
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
            </div>
            {errors.email && (
              <span className="text-xs font-semibold text-rose-400 mt-0.5">
                {errors.email.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isSubmitting}
            icon={HiPaperAirplane}
            className="mt-2 py-3.5 text-sm font-bold tracking-wide"
          >
            {isSubmitting ? 'Sending Link...' : 'Send Recovery Link'}
          </Button>

          <div className="text-center pt-4 border-t border-slate-800/80 mt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <HiArrowLeft />
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      )}
    </AuthCard>
  );
};

export default ForgotPasswordPage;
