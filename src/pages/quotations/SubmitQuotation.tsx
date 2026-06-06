import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { ArrowLeft, UploadCloud, CheckCircle } from 'lucide-react';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { useAuth } from '@/contexts/AuthContext';

type SubmitQuotationInputs = {
  rfqReference: string;
  totalAmount: number;
  deliveryTimeline: string;
  notes: string;
};

export default function SubmitQuotation() {
  const navigate = useNavigate();
  const { rfqs, submitQuotation } = useWorkflow();
  const { role } = useAuth(); // Could be used to dynamically set vendor name if we had vendor user auth
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SubmitQuotationInputs>();

  // Only show active RFQs
  const activeRfqs = rfqs.filter(r => r.status === 'RFQ_CREATED' || r.status === 'RFQ_SENT');

  const onSubmit: SubmitHandler<SubmitQuotationInputs> = async (data) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    submitQuotation({
      rfqId: data.rfqReference,
      vendor: role === 'Vendor' ? 'TechCorp Industries (You)' : 'Demo Vendor',
      totalAmount: Number(data.totalAmount),
      deliveryDays: parseInt(data.deliveryTimeline) || 15
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 animate-slide-up text-center py-12">
        <div className="mx-auto h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quotation Submitted!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Your bid has been successfully submitted to the procurement team for review.
          </p>
        </div>
        <div className="pt-4 flex justify-center gap-3">
          <Button onClick={() => navigate('/')} variant="outline">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-3xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Submit Quotation</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Submit your bid for an active Request for Quotation.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card overflow-hidden">
        <div className="p-6 sm:p-8 space-y-8">
          
          <div className="space-y-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">RFQ Details</h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">RFQ Reference <span className="text-rose-500">*</span></label>
                <Select
                  options={[
                    { value: '', label: 'Select an active RFQ' },
                    ...activeRfqs.map(r => ({ value: r.id, label: `${r.id} (${r.title})` }))
                  ]}
                  {...register('rfqReference', { required: 'Please select an RFQ' })}
                />
                {errors.rfqReference && <p className="text-xs text-rose-500 mt-1">{errors.rfqReference.message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Bid Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Bid Amount ($) <span className="text-rose-500">*</span></label>
                <Input
                  type="number"
                  placeholder="e.g. 50000"
                  {...register('totalAmount', { required: 'Total amount is required', min: { value: 1, message: 'Must be greater than 0' } })}
                  error={errors.totalAmount?.message}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Estimated Delivery Timeline <span className="text-rose-500">*</span></label>
                <Select
                  options={[
                    { value: '', label: 'Select timeline' },
                    { value: '7', label: 'Immediate (Within 7 days)' },
                    { value: '15', label: 'Within 15 days' },
                    { value: '30', label: 'Within 30 days' },
                    { value: '60', label: 'More than 60 days' },
                  ]}
                  {...register('deliveryTimeline', { required: 'Timeline is required' })}
                />
                {errors.deliveryTimeline && <p className="text-xs text-rose-500 mt-1">{errors.deliveryTimeline.message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Supporting Documents</h3>
            
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
              <div className="h-12 w-12 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4">
                <UploadCloud className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">Upload your detailed technical and commercial proposal (PDF, DOCX up to 10MB)</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Additional Notes</h3>
            <div className="space-y-1.5">
              <textarea
                rows={4}
                className="w-full px-4 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-400/60 transition-all"
                placeholder="Any special terms, assumptions, or notes regarding this quotation..."
                {...register('notes')}
              />
            </div>
          </div>

        </div>

        <div className="bg-gray-50/80 dark:bg-gray-800/50 p-6 sm:px-8 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Submitting...
              </span>
            ) : (
              'Submit Quotation'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
