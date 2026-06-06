import React from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { Select } from '@/components/Select';
import { Button } from '@/components/Button';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useWorkflow } from '@/contexts/WorkflowContext';

type RFQItem = {
  name: string;
  quantity: number;
  unit: string;
  description: string;
};

type RFQFormInputs = {
  title: string;
  department: string;
  deadline: string;
  budget: number;
  items: RFQItem[];
};

export default function CreateRFQ() {
  const navigate = useNavigate();
  const { createRFQ } = useWorkflow();
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RFQFormInputs>({
    defaultValues: {
      items: [{ name: '', quantity: 1, unit: 'pcs', description: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const onSubmit: SubmitHandler<RFQFormInputs> = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    createRFQ({
      title: data.title,
      department: data.department,
      deadline: data.deadline,
      budget: Number(data.budget),
      items: data.items,
    });

    navigate('/rfqs');
  };

  const deptOptions = [
    { value: '', label: 'Select Department...' },
    { value: 'IT', label: 'IT & Engineering' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Infrastructure', label: 'Facilities & Infrastructure' },
    { value: 'HR', label: 'Human Resources' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Request for Quotation (RFQ)</h1>
          <p className="text-sm text-gray-500">Draft a new RFQ to invite vendor bids.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">RFQ Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Q3 Laptop Procurement"
                  {...register('title', { required: 'Title is required' })}
                  error={errors.title?.message}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select
                  id="department"
                  options={deptOptions}
                  {...register('department', { required: 'Department is required' })}
                  error={errors.department?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Submission Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  {...register('deadline', { required: 'Deadline is required' })}
                  error={errors.deadline?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Estimated Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="0.00"
                  {...register('budget', { min: 0 })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Line Items</CardTitle>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => append({ name: '', quantity: 1, unit: 'pcs', description: '' })}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200/60 dark:border-gray-800/60 rounded-xl bg-gray-50/50 dark:bg-gray-800/20 relative">
                <div className="absolute right-2 top-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <h4 className="text-sm font-medium mb-3">Item #{index + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Item Name *</Label>
                    <Input
                      {...register(`items.${index}.name` as const, { required: 'Required' })}
                      error={errors.items?.[index]?.name?.message}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <Input
                      type="number"
                      min="1"
                      {...register(`items.${index}.quantity` as const, { required: 'Required', min: 1 })}
                      error={errors.items?.[index]?.quantity?.message}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Select
                      options={[
                        { value: 'pcs', label: 'Pieces (pcs)' },
                        { value: 'kg', label: 'Kilograms (kg)' },
                        { value: 'hrs', label: 'Hours (hrs)' },
                        { value: 'lic', label: 'Licenses' },
                      ]}
                      {...register(`items.${index}.unit` as const)}
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-4">
                    <Label>Description</Label>
                    <Input
                      placeholder="Specific requirements, models, etc."
                      {...register(`items.${index}.description` as const)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="button" variant="secondary">
            Save as Draft
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Publishing...' : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Publish RFQ
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
