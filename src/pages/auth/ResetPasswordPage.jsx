import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { HiLockClosed, HiCheckCircle } from 'react-icons/hi';
import AuthCard from '../../components/auth/AuthCard';
import PasswordInput from '../../components/auth/PasswordInput';
import PasswordStrengthIndicator from '../../components/auth/PasswordStrengthIndicator';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const ResetPasswordPage = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await resetPassword(data.password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    } catch (err) {
      console.error('Reset password error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Create New Password"
      subtitle="Enter your new password below to secure your luxury account."
      badge="Security Update"
    >
      {isSuccess ? (
        <div className="flex flex-col items-center text-center py-6 gap-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl">
            <HiCheckCircle />
          </div>
          <h3 className="text-xl font-bold text-white">Password Updated!</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Your password has been changed successfully. Redirecting you to sign in...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <PasswordInput
              label="New Password"
              placeholder="Enter new password"
              error={errors.password?.message}
              {...register('password', {
                required: 'New password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
            />
            <PasswordStrengthIndicator password={passwordValue} />
          </div>

          <PasswordInput
            label="Confirm New Password"
            placeholder="Repeat new password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your new password',
              validate: (val) => val === passwordValue || 'Passwords do not match',
            })}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isSubmitting}
            icon={HiLockClosed}
            className="mt-2 py-3.5 text-sm font-bold tracking-wide"
          >
            {isSubmitting ? 'Updating Password...' : 'Update Password'}
          </Button>
        </form>
      )}
    </AuthCard>
  );
};

export default ResetPasswordPage;
