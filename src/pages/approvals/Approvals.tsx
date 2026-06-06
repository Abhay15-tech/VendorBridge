import React, { useState } from 'react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import {
  CheckCircle, XCircle, Clock, Search,
  ShoppingCart, Users, FileText, FileSignature, AlertCircle,
  ChevronDown, ChevronUp, User, Calendar, DollarSign
} from 'lucide-react';
import { useWorkflow } from '@/contexts/WorkflowContext';

const FILTERS = ['All', 'Pending', 'Approved', 'Rejected'];

export default function Approvals() {
  const { quotations, approveQuotation, rejectQuotation } = useWorkflow();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  // Map quotations to approval requests format
  const approvalRequests = quotations
    .filter(q => ['PENDING_APPROVAL', 'APPROVED', 'REJECTED'].includes(q.status))
    .map(q => ({
      id: q.id,
      type: 'Quotation Approval',
      refId: q.rfqId,
      priority: 'High',
      title: `Quotation from ${q.vendor}`,
      amount: q.totalAmount,
      submittedBy: q.vendor,
      submittedAt: q.date,
      dueBy: 'N/A',
      status: q.status === 'PENDING_APPROVAL' ? 'Pending' : q.status === 'APPROVED' ? 'Approved' : 'Rejected',
      description: `Quotation requires approval to automatically generate a Purchase Order and Invoice. Delivery promised in ${q.deliveryDays} days.`,
      history: [
        { actor: q.vendor, action: 'Submitted', time: q.date }
      ]
    }));

  const visible = approvalRequests.filter(a => {
    const matchFilter = filter === 'All' || a.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || [a.title, a.refId, a.id, a.type, a.submittedBy].join(' ').toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const counts = {
    all:      approvalRequests.length,
    pending:  approvalRequests.filter(s => s.status === 'Pending').length,
    approved: approvalRequests.filter(s => s.status === 'Approved').length,
    rejected: approvalRequests.filter(s => s.status === 'Rejected').length,
  };

  const handleApprove = (id: string) => approveQuotation(id, 'Manager (You)');
  const handleReject  = (id: string) => rejectQuotation(id, 'Manager (You)');

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Approvals</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Review and action pending approval requests.</p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2">
          <Clock className="h-4 w-4" />
          <span className="font-semibold">{counts.pending} pending</span> items require your action
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total',    value: counts.all,      color: 'text-gray-800 dark:text-gray-200', bg: 'bg-white dark:bg-gray-900' },
          { label: 'Pending',  value: counts.pending,  color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Approved', value: counts.approved, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Rejected', value: counts.rejected, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20' },
        ].map(s => (
          <button
            key={s.label}
            onClick={() => setFilter(s.label === 'Total' ? 'All' : s.label)}
            className={`${s.bg} rounded-2xl p-4 border border-gray-100 dark:border-gray-800 text-left hover:-translate-y-0.5 transition-all duration-150 shadow-card`}
          >
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search approvals..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-400/60 transition-all text-gray-700 dark:text-gray-300"
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >{f}</button>
          ))}
        </div>
        <span className="text-xs text-gray-400 ml-auto">{visible.length} requests</span>
      </div>

      {/* Approval Cards */}
      <div className="space-y-3">
        {visible.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card py-20 text-center">
            <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
            <p className="font-semibold text-gray-600 dark:text-gray-300">All caught up!</p>
            <p className="text-sm text-gray-400 mt-1">No approvals match your current filter.</p>
          </div>
        ) : visible.map(req => {
          const status = req.status;
          const isPending = status === 'Pending';
          const isExpanded = expanded === req.id;

          return (
            <div key={req.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card overflow-hidden transition-all duration-200">
              <div className="flex items-start gap-4 p-5">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400`}>
                  <FileSignature className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-400">{req.id}</span>
                    <span className="text-gray-200 dark:text-gray-700">·</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{req.type}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800`}>
                      {req.priority} Priority
                    </span>
                    {status === 'Approved' && <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full"><CheckCircle className="h-3 w-3" /> Approved</span>}
                    {status === 'Rejected' && <span className="flex items-center gap-1 text-[10px] font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded-full"><XCircle className="h-3 w-3" /> Rejected</span>}
                    {status === 'Pending' && <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full"><Clock className="h-3 w-3" /> Pending</span>}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{req.title}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {req.submittedBy}</span>
                    {req.amount > 0 && <span className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300"><DollarSign className="h-3 w-3" /> ${req.amount.toLocaleString()}</span>}
                    <span className="text-gray-400">Ref: <span className="font-medium text-primary-600 dark:text-primary-400">{req.refId}</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isPending && (
                    <>
                      <Button size="sm" variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-900/20 gap-1" onClick={() => handleReject(req.id)}>
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </Button>
                      <Button size="sm" className="gap-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApprove(req.id)}>
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                      </Button>
                    </>
                  )}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : req.id)}
                    className="h-8 w-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 px-5 py-4 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{req.description}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Approval History</p>
                    <div className="space-y-2">
                      {req.history.map((h, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="h-2 w-2 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
                          <div>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{h.actor}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">{h.action}</span>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">{h.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
