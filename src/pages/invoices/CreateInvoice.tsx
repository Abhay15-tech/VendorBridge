import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { Select } from '@/components/Select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { ArrowLeft, UploadCloud, Receipt, DollarSign, Calendar, FileText } from 'lucide-react';
import { purchaseOrders } from '@/data/mockData';

export default function CreateInvoice() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    console.log('Invoice data:', data);
    navigate('/invoices');
  };

  const poOptions = purchaseOrders.map(po => ({
    value: po.id,
    label: `${po.id} — ${po.vendor} ($${po.amount.toLocaleString()})`
  }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-slide-up">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/invoices')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Create New Invoice</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Record a new vendor invoice against a Purchase Order.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5 text-primary-500" /> Invoice Details</CardTitle>
            <CardDescription>Basic information from the vendor's invoice document.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="invoiceNumber"
                    className="pl-9"
                    placeholder="e.g. INV-2024-089"
                    {...register('invoiceNumber', { required: 'Invoice number is required' })}
                    error={errors.invoiceNumber?.message as string}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="poReference">Purchase Order Reference *</Label>
                <Select
                  id="poReference"
                  options={[{ value: '', label: 'Select a PO...' }, ...poOptions]}
                  {...register('poReference', { required: 'PO reference is required' })}
                  error={errors.poReference?.message as string}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="issueDate"
                    type="date"
                    className="pl-9"
                    {...register('issueDate', { required: 'Issue date is required' })}
                    error={errors.issueDate?.message as string}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="dueDate"
                    type="date"
                    className="pl-9"
                    {...register('dueDate', { required: 'Due date is required' })}
                    error={errors.dueDate?.message as string}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Total Invoice Amount *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    className="pl-9"
                    placeholder="0.00"
                    {...register('amount', { required: 'Amount is required' })}
                    error={errors.amount?.message as string}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Label>Supporting Document</Label>
              <div className="mt-2 flex justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 px-6 py-8 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="text-center">
                  <UploadCloud className="mx-auto h-10 w-10 text-gray-400" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-semibold text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-500 mt-1">PDF, PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <textarea
                id="notes"
                rows={3}
                className="flex w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
                placeholder="Any special payment instructions or remarks..."
                {...register('notes')}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/invoices')}>
            Cancel
          </Button>
          <Button type="submit">
            Create Invoice
          </Button>
        </div>
      </form>
    </div>
  );
}
