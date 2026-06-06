import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { useAuth } from '@/contexts/AuthContext';

export default function RFQList() {
  const navigate = useNavigate();
  const { rfqs } = useWorkflow();
  const { role } = useAuth();

  const columns = [
    { header: 'RFQ ID', accessorKey: 'id', cell: (item: any) => <span className="font-medium text-primary-600">{item.id}</span> },
    { header: 'Title', accessorKey: 'title' },
    { header: 'Department', accessorKey: 'department' },
    { header: 'Deadline', accessorKey: 'deadline' },
    { header: 'Budget', accessorKey: 'budget', cell: (item: any) => `$${item.budget.toLocaleString()}` },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item: any) => {
        let variant: any = 'default';
        if (item.status === 'RFQ_SENT' || item.status === 'APPROVED') variant = 'success';
        if (item.status === 'RFQ_CREATED') variant = 'secondary';
        if (item.status === 'COMPLETED') variant = 'outline';
        return <Badge variant={variant}>{item.status}</Badge>;
      }
    },
    { header: 'Actions', accessorKey: 'actions', cell: (item: any) => <Button variant="ghost" size="sm" onClick={() => navigate(`/rfqs/${item.id}`)}>View</Button> }
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Requests for Quotation (RFQs)</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your active and past RFQs.</p>
        </div>
        
        {(role === 'Admin' || role === 'Officer') && (
          <Button onClick={() => navigate('/rfqs/new')}>
            <Plus className="mr-2 h-4 w-4" /> Create RFQ
          </Button>
        )}
      </div>
      <DataTable data={rfqs} columns={columns} searchPlaceholder="Search RFQs..." />
    </div>
  );
}
