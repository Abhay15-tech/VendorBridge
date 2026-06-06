import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { Select } from '@/components/Select';
import { Button } from '@/components/Button';
import { ArrowLeft, Save } from 'lucide-react';

type VendorFormInputs = {
  name: string;
  category: string;
  email: string;
  phone: string;
  location: string;
  contactPerson: string;
};

export default function CreateVendor() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<VendorFormInputs>();

  const onSubmit: SubmitHandler<VendorFormInputs> = async (data) => {
    console.log('Submitted:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/vendors');
  };

  const categoryOptions = [
    { value: '', label: 'Select Category...' },
    { value: 'Hardware', label: 'Hardware' },
    { value: 'Software', label: 'Software' },
    { value: 'Services', label: 'Services' },
    { value: 'Stationery', label: 'Stationery' },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Vendor</h1>
          <p className="text-sm text-gray-500">Register a new supplier to the platform.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                placeholder="e.g. TechCorp Industries"
                {...register('name', { required: 'Company name is required' })}
                error={errors.name?.message}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Business Category *</Label>
              <Select
                id="category"
                options={categoryOptions}
                {...register('category', { required: 'Please select a category' })}
                error={errors.category?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Headquarters Location</Label>
              <Input
                id="location"
                placeholder="e.g. San Jose, CA"
                {...register('location')}
              />
            </div>

            <div className="border-t border-gray-200/60 dark:border-gray-800/60 pt-4 mt-6">
              <h3 className="text-sm font-semibold mb-4 text-gray-900 dark:text-gray-100">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Primary Contact Name *</Label>
                  <Input
                    id="contactPerson"
                    {...register('contactPerson', { required: 'Contact name is required' })}
                    error={errors.contactPerson?.message}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    error={errors.email?.message}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    {...register('phone')}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 space-x-3">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Vendor
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
