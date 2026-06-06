import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { useAuth } from '@/contexts/AuthContext';
import { WorkflowTimeline } from '@/components/WorkflowTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { ArrowLeft, FileText, CheckCircle, XCircle } from 'lucide-react';

export default function RFQDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { rfqs, quotations, approveQuotation, rejectQuotation } = useWorkflow();
  const { role } = useAuth();

  const rfq = rfqs.find(r => r.id === id);
  const rfqQuotations = quotations.filter(q => q.rfqId === id);

  if (!rfq) {
    return <div className="p-8 text-center text-gray-500">RFQ not found.</div>;
  }

  const handleApprove = (quoteId: string) => {
    approveQuotation(quoteId, 'Manager User'); // Hardcoded name for demo
  };

  const handleReject = (quoteId: string) => {
    rejectQuotation(quoteId, 'Manager User');
  };

  return (
    <div className="space-y-6 animate-slide-up max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
              {rfq.id} <Badge variant="secondary">{rfq.status}</Badge>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{rfq.title}</p>
          </div>
        </div>
        
        {role === 'Vendor' && rfq.status === 'RFQ_CREATED' && (
          <Button onClick={() => navigate('/quotations/submit')}>
            Submit Quotation
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details & Quotations */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>RFQ Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Department</p>
                  <p className="font-semibold">{rfq.department}</p>
                </div>
                <div>
                  <p className="text-gray-500">Budget</p>
                  <p className="font-semibold">${rfq.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Deadline</p>
                  <p className="font-semibold">{rfq.deadline}</p>
                </div>
                <div>
                  <p className="text-gray-500">Created By</p>
                  <p className="font-semibold">{rfq.createdBy}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submitted Quotations ({rfqQuotations.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {rfqQuotations.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">No quotations received yet.</div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {rfqQuotations.map(quote => (
                    <div key={quote.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 dark:text-white">{quote.vendor}</h4>
                          <Badge variant={quote.status === 'APPROVED' ? 'success' : quote.status === 'REJECTED' ? 'destructive' : 'secondary'}>
                            {quote.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Bid: <span className="font-semibold text-gray-700 dark:text-gray-300">${quote.totalAmount.toLocaleString()}</span> • {quote.deliveryDays} Days Delivery</p>
                        <p className="text-xs text-gray-400 mt-0.5">Submitted {quote.date}</p>
                      </div>
                      
                      {role === 'Manager' && (quote.status === 'QUOTATION_RECEIVED' || quote.status === 'PENDING_APPROVAL') && (
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleReject(quote.id)} className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-900/20">
                            <XCircle className="h-4 w-4 mr-1" /> Reject
                          </Button>
                          <Button size="sm" onClick={() => handleApprove(quote.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                          </Button>
                        </div>
                      )}
                      
                      {role === 'Officer' && quote.status === 'QUOTATION_RECEIVED' && (
                        <Button variant="outline" size="sm" onClick={() => navigate('/quotations/compare')}>
                          Compare
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Timeline */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Workflow Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkflowTimeline rfqId={rfq.id} />
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
