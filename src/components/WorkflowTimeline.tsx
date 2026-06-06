import React from 'react';
import { WorkflowStatus, ActivityLogEntry } from '@/types/workflow';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { CheckCircle, Clock, Circle, XCircle } from 'lucide-react';

interface TimelineProps {
  rfqId: string;
}

export function WorkflowTimeline({ rfqId }: TimelineProps) {
  const { activities, rfqs } = useWorkflow();
  
  // Get the current RFQ
  const rfq = rfqs.find(r => r.id === rfqId);
  if (!rfq) return null;

  // Filter activities related to this RFQ or its children
  // To keep it simple, we just look for activities where the target contains the rfqId 
  // or description contains the rfqId.
  const rfqActivities = activities
    .filter(a => a.target.includes(rfqId) || a.description.includes(rfqId))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Define the expected steps
  const steps = [
    { key: 'RFQ_CREATED', label: 'RFQ Created' },
    { key: 'QUOTATION_RECEIVED', label: 'Quotation Submitted' },
    { key: 'APPROVED', label: 'Approval Granted' },
    { key: 'PO_GENERATED', label: 'PO Generated' },
    { key: 'INVOICE_GENERATED', label: 'Invoice Generated' },
  ];

  // Map activities to steps
  // This is a heuristic mapping for the visual timeline
  const stepData = steps.map((step, index) => {
    let activity: ActivityLogEntry | undefined;
    
    if (step.key === 'RFQ_CREATED') {
      activity = rfqActivities.find(a => a.module === 'RFQ' && a.action === 'Created');
    } else if (step.key === 'QUOTATION_RECEIVED') {
      activity = rfqActivities.find(a => a.module === 'Quotation' && a.action === 'Submitted');
    } else if (step.key === 'APPROVED') {
      activity = rfqActivities.find(a => a.module === 'Approval' && a.action === 'Approved');
      const rejected = rfqActivities.find(a => a.module === 'Approval' && a.action === 'Rejected');
      if (rejected) activity = rejected; // Overwrite if rejected
    } else if (step.key === 'PO_GENERATED') {
      activity = rfqActivities.find(a => a.module === 'Purchase Order');
    } else if (step.key === 'INVOICE_GENERATED') {
      activity = rfqActivities.find(a => a.module === 'Invoice');
    }

    return {
      ...step,
      activity,
      isCompleted: !!activity,
      isRejected: activity?.action === 'Rejected',
      isCurrent: !activity && (index === 0 || !!steps[index - 1].activity) // First incomplete step
    };
  });

  return (
    <div className="space-y-4">
      {stepData.map((step, idx) => (
        <div key={step.key} className="flex gap-4">
          {/* Timeline Line & Icon */}
          <div className="flex flex-col items-center">
            <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center
              ${step.isRejected ? 'text-rose-500' : 
                step.isCompleted ? 'text-emerald-500' : 
                step.isCurrent ? 'text-primary-500' : 'text-gray-300 dark:text-gray-600'}`}
            >
              {step.isRejected ? <XCircle className="h-6 w-6" /> :
               step.isCompleted ? <CheckCircle className="h-6 w-6" /> :
               step.isCurrent ? <Clock className="h-6 w-6" /> :
               <Circle className="h-5 w-5" />}
            </div>
            {idx < stepData.length - 1 && (
              <div className={`w-px h-full my-1 ${step.isCompleted ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
            )}
          </div>
          
          {/* Content */}
          <div className="pb-6">
            <h4 className={`text-sm font-bold ${step.isCompleted || step.isCurrent ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              {step.isRejected ? 'Approval Rejected' : step.label}
            </h4>
            
            {step.activity ? (
              <div className="mt-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">{step.activity.description}</p>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-400 font-medium">
                  <span>{step.activity.actor}</span>
                  <span>•</span>
                  <span>{new Date(step.activity.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ) : step.isCurrent ? (
              <p className="text-xs text-gray-400 mt-1">Pending action...</p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
