import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

type ForgotPasswordInputs = {
  email: string;
};

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordInputs>();

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = async (data) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 animate-slide-up text-center">
        <div className="mx-auto h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Check your email</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            We sent a password reset link to your email address. Please check your inbox and spam folder.
          </p>
        </div>
        <div className="pt-4">
          <Link to="/login">
            <Button variant="outline" className="w-full h-11 text-base gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Reset password</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              className="pl-9"
              placeholder="name@company.com"
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
              })}
              error={errors.email?.message}
            />
          </div>
        </div>

        <Button type="submit" className="w-full h-11 text-base" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Sending...
            </span>
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white dark:bg-surface-900 px-2 text-gray-400">Remember your password?</span>
        </div>
      </div>

      <Link to="/login">
        <Button variant="outline" className="w-full h-11 text-sm gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Button>
      </Link>
    </div>
  );
}
