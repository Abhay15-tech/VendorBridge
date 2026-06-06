import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { useWorkflow } from '@/contexts/WorkflowContext';

export default function POList() {
  const navigate = useNavigate();
  const { purchaseOrders } = useWorkflow();

  const columns = [
    { header: 'PO Number', accessorKey: 'id', cell: (item: any) => <span className="font-semibold text-primary-600 dark:text-primary-400">{item.id}</span> },
    { header: 'Vendor', accessorKey: 'vendor', cell: (item: any) => <span className="font-medium text-gray-800 dark:text-gray-200">{item.vendor}</span> },
    { header: 'Amount', accessorKey: 'amount', cell: (item: any) => <span className="font-semibold">${item.amount.toLocaleString()}</span> },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Exp. Delivery', accessorKey: 'deliveryDate' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item: any) => {
        let variant: any = 'default';
        if (item.status === 'COMPLETED' || item.status === 'Delivered') variant = 'success';
        if (item.status === 'PO_GENERATED' || item.status === 'Pending') variant = 'warning';
        return <Badge variant={variant}>{item.status}</Badge>;
      }
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (item: any) => (
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4 text-gray-500" />
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Purchase Orders</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage and track all generated purchase orders.</p>
        </div>
        <Button onClick={() => navigate('/purchase-orders/new')}>
          <Plus className="mr-2 h-4 w-4" /> Create PO
        </Button>
      </div>

      <DataTable data={purchaseOrders} columns={columns} searchPlaceholder="Search POs..." />
    </div>
  );
}
