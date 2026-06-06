import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { FileBarChart2 } from 'lucide-react';
import { quotations } from '@/data/mockData';

export default function QuotationList() {
  const navigate = useNavigate();

  const columns = [
    { header: 'Quote ID', accessorKey: 'id', cell: (item: any) => <span className="font-medium text-primary-600">{item.id}</span> },
    { header: 'RFQ Reference', accessorKey: 'rfqId' },
    { header: 'Vendor', accessorKey: 'vendor' },
    { header: 'Total Value', accessorKey: 'totalAmount', cell: (item: any) => `$${item.totalAmount.toLocaleString()}` },
    { header: 'Submitted Date', accessorKey: 'date' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item: any) => {
        let variant: any = 'default';
        if (item.status === 'Accepted') variant = 'success';
        if (item.status === 'Pending') variant = 'warning';
        if (item.status === 'Rejected') variant = 'destructive';
        return <Badge variant={variant}>{item.status}</Badge>;
      }
    },
    { header: 'Actions', accessorKey: 'actions', cell: () => <Button variant="ghost" size="sm">View PDF</Button> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quotations</h1>
          <p className="text-sm text-gray-500">Review and manage vendor bids for your RFQs.</p>
        </div>
        <Button onClick={() => navigate('/quotations/compare')} variant="secondary">
          <FileBarChart2 className="mr-2 h-4 w-4" /> Compare Bids
        </Button>
      </div>
      <DataTable data={quotations} columns={columns} searchPlaceholder="Search quotations..." />
    </div>
  );
}
