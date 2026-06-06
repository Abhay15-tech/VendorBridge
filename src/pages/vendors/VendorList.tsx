import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { vendors } from '@/data/mockData';

export default function VendorList() {
  const navigate = useNavigate();

  const columns = [
    {
      header: 'Vendor ID',
      accessorKey: 'id',
      cell: (item: any) => <span className="font-medium text-primary-600 dark:text-primary-400">{item.id}</span>
    },
    {
      header: 'Vendor Name',
      accessorKey: 'name',
      cell: (item: any) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
          <div className="text-xs text-gray-500">{item.email}</div>
        </div>
      )
    },
    {
      header: 'Category',
      accessorKey: 'category',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (item: any) => {
        let variant: any = 'default';
        if (item.status === 'Active') variant = 'success';
        if (item.status === 'Under Review') variant = 'warning';
        if (item.status === 'Inactive') variant = 'destructive';
        return <Badge variant={variant}>{item.status}</Badge>;
      }
    },
    {
      header: 'Rating',
      accessorKey: 'rating',
      cell: (item: any) => (
        <div className="flex items-center space-x-1">
          <span className="text-amber-500">★</span>
          <span>{item.rating > 0 ? item.rating : 'N/A'}</span>
        </div>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: () => (
        <Button variant="ghost" size="sm">View Details</Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vendors</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your supplier directory and performance.</p>
        </div>
        <Button onClick={() => navigate('/vendors/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      <DataTable 
        data={vendors} 
        columns={columns} 
        searchPlaceholder="Search vendors by name, ID, or category..."
      />
    </div>
  );
}
