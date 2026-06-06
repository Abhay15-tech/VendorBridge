import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { LogIn } from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Select } from '@/components/Select';

type LoginFormInputs = {
  username: string;
  password: string;
  role: UserRole;
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    login(data.role);
    navigate('/');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome back</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">Sign in to your procurement workspace.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="username" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Username</label>
          <Input
            id="username"
            placeholder="your.username"
            {...register('username', { required: 'Username is required' })}
            error={errors.username?.message}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="role" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Login Role</label>
          <Select
            id="role"
            options={[
              { value: 'Admin', label: 'Admin (Full Access)' },
              { value: 'Manager', label: 'Manager (Approvals & Budget)' },
              { value: 'Officer', label: 'Officer (Processing)' },
              { value: 'Vendor', label: 'Vendor (External)' }
            ]}
            {...register('role')}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
            <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-500 font-medium">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password', { required: 'Password is required' })}
            error={errors.password?.message}
          />
        </div>

        <Button type="submit" className="w-full h-11 text-base" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Signing in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </span>
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white dark:bg-surface-900 px-2 text-gray-400">Don't have an account?</span>
        </div>
      </div>

      <Link to="/signup">
        <Button variant="outline" className="w-full h-11 text-sm">
          Create account
        </Button>
      </Link>
    </div>
  );
}
