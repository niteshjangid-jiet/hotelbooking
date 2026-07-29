import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { HiUser, HiMail, HiPhone, HiSparkles, HiArrowRight } from 'react-icons/hi';
import AuthCard from '../../components/auth/AuthCard';
import PasswordInput from '../../components/auth/PasswordInput';
import PasswordStrengthIndicator from '../../components/auth/PasswordStrengthIndicator';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const SignupPage = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await signUp({
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Signup error:', err);
      setAuthError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Create VIP Account"
      subtitle="Join India's premier luxury travel club to unlock member-only rates, upgrades, and concierge benefits."
      badge="Join the Privilege Club"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
        {authError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium flex items-center justify-between">
            <span>{authError}</span>
            <button
              type="button"
              onClick={() => setAuthError(null)}
              className="text-rose-400 hover:text-rose-300 ml-2 text-base font-bold leading-none"
            >
              &times;
            </button>
          </div>
        )}
        {/* FULL NAME */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <HiUser className="text-lg" />
            </div>
            <input
              type="text"
              placeholder="Vikramaditya Singh"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.fullName
                  ? 'border-rose-500/80 focus:ring-rose-500/30'
                  : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/20 hover:border-slate-700'
              }`}
              {...register('fullName', {
                required: 'Full name is required',
                minLength: { value: 3, message: 'Name must be at least 3 characters' },
              })}
            />
          </div>
          {errors.fullName && (
            <span className="text-xs font-semibold text-rose-400 mt-0.5">
              {errors.fullName.message}
            </span>
          )}
        </div>

        {/* EMAIL ADDRESS */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <HiMail className="text-lg" />
            </div>
            <input
              type="email"
              placeholder="vikram@example.com"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.email
                  ? 'border-rose-500/80 focus:ring-rose-500/30'
                  : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/20 hover:border-slate-700'
              }`}
              {...register('email', {
                required: 'Email is required',
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

        {/* PHONE NUMBER */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <HiPhone className="text-lg" />
            </div>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.phone
                  ? 'border-rose-500/80 focus:ring-rose-500/30'
                  : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/20 hover:border-slate-700'
              }`}
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
                  message: 'Invalid phone number format',
                },
              })}
            />
          </div>
          {errors.phone && (
            <span className="text-xs font-semibold text-rose-400 mt-0.5">
              {errors.phone.message}
            </span>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <PasswordInput
            label="Password"
            placeholder="Create a strong password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
            })}
          />
          <PasswordStrengthIndicator password={passwordValue} />
        </div>

        {/* CONFIRM PASSWORD */}
        <PasswordInput
          label="Confirm Password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === passwordValue || 'Passwords do not match',
          })}
        />

        {/* ACCEPT TERMS CHECKBOX */}
        <div className="flex flex-col gap-1 pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500/40 focus:ring-offset-slate-900 transition-colors"
              {...register('acceptTerms', {
                required: 'You must accept the terms of service',
              })}
            />
            <span className="text-xs text-slate-400 leading-tight group-hover:text-slate-300 transition-colors">
              I accept the{' '}
              <a href="#" className="text-blue-400 underline font-semibold">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-400 underline font-semibold">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.acceptTerms && (
            <span className="text-xs font-semibold text-rose-400">
              {errors.acceptTerms.message}
            </span>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isSubmitting}
          icon={HiSparkles}
          className="mt-2 py-3 text-sm font-bold tracking-wide"
        >
          {isSubmitting ? 'Creating VIP Membership...' : 'Create Account'}
        </Button>

        {/* LOGIN LINK */}
        <div className="text-center pt-3 border-t border-slate-800/80 mt-1">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-blue-400 hover:text-blue-300 hover:underline transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
};

export default SignupPage;
