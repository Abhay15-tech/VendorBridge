import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { UserPlus, Upload, ArrowLeft } from 'lucide-react';

type RegisterFormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  country: string;
  additionalInfo: string;
  photo?: FileList;
};

export default function Register() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormInputs>();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    navigate('/login');
  };

  const roleOptions = [
    { value: '', label: 'Select Role...' },
    { value: 'admin', label: 'Admin' },
    { value: 'officer', label: 'Procurement Officer' },
  ];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Create your account</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">Join VendorBridge and streamline your procurement.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Avatar upload */}
        <div className="flex items-center gap-5">
          <div className="relative h-20 w-20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800 flex-shrink-0">
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <UserPlus className="h-7 w-7 text-gray-300 dark:text-gray-600" />
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              {...register('photo')}
              onChange={handlePhotoChange}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Profile Photo</p>
            <p className="text-xs text-gray-400 mt-0.5">Click the box to upload (optional)</p>
          </div>
        </div>

        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">First Name</label>
            <Input
              placeholder="Jane"
              {...register('firstName', { required: 'Required' })}
              error={errors.firstName?.message}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Last Name</label>
            <Input
              placeholder="Doe"
              {...register('lastName', { required: 'Required' })}
              error={errors.lastName?.message}
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
          <Input
            type="email"
            placeholder="jane.doe@company.com"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' }
            })}
            error={errors.email?.message}
          />
        </div>

        {/* Phone + Role row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number</label>
            <Input placeholder="+1 (555) 000-0000" {...register('phone')} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Role</label>
            <Select
              options={roleOptions}
              {...register('role', { required: 'Required' })}
              error={errors.role?.message}
            />
          </div>
        </div>

        {/* Country */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Country</label>
          <Input
            placeholder="e.g. United States"
            {...register('country', { required: 'Required' })}
            error={errors.country?.message}
          />
        </div>

        {/* Additional info */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Additional Information</label>
          <textarea
            rows={3}
            className="flex w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
            placeholder="Tell us about your role and responsibilities..."
            {...register('additionalInfo')}
          />
        </div>

        <Button type="submit" className="w-full h-11 text-base" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Creating account...
            </span>
          ) : 'Create Account'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white dark:bg-surface-900 px-2 text-gray-400">Already have an account?</span>
        </div>
      </div>

      <Link to="/login">
        <Button variant="outline" className="w-full h-11 text-sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
        </Button>
      </Link>
    </div>
  );
}
