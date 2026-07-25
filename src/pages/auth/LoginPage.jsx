import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiMail, HiArrowRight, HiLockClosed } from 'react-icons/hi';
import AuthCard from '../../components/auth/AuthCard';
import PasswordInput from '../../components/auth/PasswordInput';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await signIn({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to access your luxury bookings, exclusive member pricing, and VIP concierge."
      badge="Member Portal"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* EMAIL INPUT */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <HiMail className="text-lg" />
            </div>
            <input
              type="email"
              placeholder="alex.smith@example.com"
              className={`w-full pl-10 pr-4 py-3 bg-slate-950/60 border rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.email
                  ? 'border-rose-500/80 focus:ring-rose-500/30'
                  : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/20 hover:border-slate-700'
              }`}
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address format',
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

        {/* PASSWORD INPUT */}
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />

        {/* REMEMBER ME & FORGOT PASSWORD */}
        <div className="flex items-center justify-between pt-1 pb-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500/40 focus:ring-offset-slate-900 transition-colors"
              {...register('rememberMe')}
            />
            <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
              Remember me
            </span>
          </label>

          <Link
            to="/forgot-password"
            className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={isSubmitting}
          icon={HiArrowRight}
          className="mt-2 py-3.5 text-sm font-bold tracking-wide"
        >
          {isSubmitting ? 'Authenticating...' : 'Sign In to Account'}
        </Button>

        {/* FOOTER LINK TO SIGNUP */}
        <div className="text-center pt-4 border-t border-slate-800/80 mt-2">
          <p className="text-xs text-slate-400">
            Don't have a luxury account yet?{' '}
            <Link
              to="/signup"
              className="font-bold text-blue-400 hover:text-blue-300 hover:underline transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
};

export default LoginPage;
