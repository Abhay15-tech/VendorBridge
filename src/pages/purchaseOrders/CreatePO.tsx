import React from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { Select } from '@/components/Select';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { vendors } from '@/data/mockData';

type POItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

type CreatePOInputs = {
  poNumber: string;
  vendorId: string;
  issueDate: string;
  deliveryDate: string;
  items: POItem[];
  notes: string;
};

export default function CreatePO() {
  const navigate = useNavigate();
  const { register, control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CreatePOInputs>({
    defaultValues: {
      items: [{ description: '', quantity: 1, unitPrice: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const watchItems = watch('items') || [];
  const totalAmount = watchItems.reduce((acc, curr) => acc + ((Number(curr.quantity) || 0) * (Number(curr.unitPrice) || 0)), 0);

  const vendorOptions = [
    { value: '', label: 'Select Vendor...' },
    ...vendors.map(v => ({ value: v.id, label: v.name }))
  ];

  const onSubmit: SubmitHandler<CreatePOInputs> = async (data) => {
    console.log('PO Data:', { ...data, totalAmount });
    await new Promise(resolve => setTimeout(resolve, 800));
    navigate('/purchase-orders');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/purchase-orders')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Generate Purchase Order</h1>
          <p className="text-sm text-gray-500">Create a new PO and send it to the vendor.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* General Details */}
        <div className="bg-white/90 backdrop-blur-md dark:bg-gray-900/90 rounded-2xl p-6 border border-gray-200/60 dark:border-gray-800/60 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">General Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="poNumber">PO Number</Label>
              <Input
                id="poNumber"
                placeholder="PO-2024-XXXX"
                {...register('poNumber', { required: 'PO Number is required' })}
                error={errors.poNumber?.message}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendorId">Vendor</Label>
              <Select
                id="vendorId"
                options={vendorOptions}
                {...register('vendorId', { required: 'Vendor is required' })}
                error={errors.vendorId?.message}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                {...register('issueDate', { required: 'Issue Date is required' })}
                error={errors.issueDate?.message}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Expected Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                {...register('deliveryDate', { required: 'Delivery Date is required' })}
                error={errors.deliveryDate?.message}
              />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white/90 backdrop-blur-md dark:bg-gray-900/90 rounded-2xl p-6 border border-gray-200/60 dark:border-gray-800/60 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Line Items</h3>
            <span className="font-semibold text-primary-600 dark:text-primary-400">
              Total: ${totalAmount.toLocaleString()}
            </span>
          </div>
          
          <div className="space-y-4">
            {fields.map((item, index) => (
              <div key={item.id} className="flex gap-4 items-start">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Item description"
                    {...register(`items.${index}.description` as const, { required: true })}
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Input
                    type="number"
                    placeholder="Qty"
                    {...register(`items.${index}.quantity` as const, { required: true, min: 1 })}
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Input
                    type="number"
                    placeholder="Price"
                    {...register(`items.${index}.unitPrice` as const, { required: true, min: 0 })}
                  />
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => remove(index)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  disabled={fields.length === 1}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>

          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
            className="mt-4"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>

        {/* Additional Info */}
        <div className="bg-white/90 backdrop-blur-md dark:bg-gray-900/90 rounded-2xl p-6 border border-gray-200/60 dark:border-gray-800/60 shadow-sm space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Terms & Conditions / Notes</Label>
            <textarea
              id="notes"
              rows={4}
              className="flex w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
              placeholder="Payment terms, delivery instructions..."
              {...register('notes')}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => navigate('/purchase-orders')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Generating...' : (
              <><Save className="mr-2 h-4 w-4" /> Generate PO</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
