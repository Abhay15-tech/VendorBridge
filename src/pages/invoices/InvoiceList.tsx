import React from 'react';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Plus, Download, Printer, Mail, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '@/contexts/WorkflowContext';

function InvoiceActions({ invoice }: { invoice: any }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action: string) => {
    setIsOpen(false);
    if (action === 'print') {
      window.print();
    } else {
      alert(`${action} triggered for ${invoice.id}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        {invoice.status === 'Unpaid' ? 'Mark Paid' : 'View'}
      </Button>
      
      <div className="relative" ref={dropdownRef}>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
          <MoreVertical className="h-4 w-4" />
        </Button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-50 animate-slide-up">
            <button
              onClick={() => handleAction('Download PDF')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2"
            >
              <Download className="h-4 w-4" /> Download PDF
            </button>
            <button
              onClick={() => handleAction('print')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2"
            >
              <Printer className="h-4 w-4" /> Print Invoice
            </button>
            <button
              onClick={() => handleAction('Email to Vendor')}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2"
            >
              <Mail className="h-4 w-4" /> Email to Vendor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InvoiceList() {
  const navigate = useNavigate();
  const { invoices } = useWorkflow();
  
  const columns = [
    { header: 'Invoice ID', accessorKey: 'id', cell: (item: any) => <span className="font-semibold text-primary-600 dark:text-primary-400">{item.id}</span> },
    { header: 'PO Reference', accessorKey: 'poId', cell: (item: any) => <span className="text-gray-600 dark:text-gray-400">{item.poId}</span> },
    { header: 'Vendor', accessorKey: 'vendor', cell: (item: any) => <span className="font-medium text-gray-800 dark:text-gray-200">{item.vendor}</span> },
    { header: 'Amount', accessorKey: 'amount', cell: (item: any) => <span className="font-semibold">${item.amount.toLocaleString()}</span> },
    { header: 'Issue Date', accessorKey: 'issueDate' },
    { header: 'Due Date', accessorKey: 'dueDate' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item: any) => {
        let variant: any = 'default';
        if (item.status === 'Paid') variant = 'success';
        if (item.status === 'Unpaid') variant = 'destructive';
        if (item.status === 'Overdue') variant = 'warning';
        return <Badge variant={variant}>{item.status}</Badge>;
      }
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (item: any) => <InvoiceActions invoice={item} />
    }
  ];

  const totalOutstanding = invoices.filter(i => i.status !== 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const paidThisMonth = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0); // Simplified

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Invoices</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Track vendor payments and outstanding invoices.</p>
        </div>
        <Button onClick={() => navigate('/invoices/new')}>
          <Plus className="mr-2 h-4 w-4" /> New Invoice
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Outstanding', value: '$' + totalOutstanding.toLocaleString(), color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20' },
          { label: 'Paid This Month', value: '$' + paidThisMonth.toLocaleString(), color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Total Invoices', value: invoices.length.toString(), color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-900/20' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-4 border border-transparent`}>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <DataTable data={invoices} columns={columns} searchPlaceholder="Search invoices..." />
    </div>
  );
}
