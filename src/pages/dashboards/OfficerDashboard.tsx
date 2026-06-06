import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { 
  FileText, ShoppingCart, Receipt, Clock, ArrowRight,
  TrendingUp, TrendingDown, ClipboardList
} from 'lucide-react';
import { Link } from 'react-router-dom';

const kpis = [
  { title: 'Tasks Assigned', value: '14', change: '5 due today', trend: 'warn', icon: ClipboardList, color: 'sky', bg: 'bg-sky-50 dark:bg-sky-900/20', iconColor: 'text-sky-600 dark:text-sky-400' },
  { title: 'Active RFQs', value: '6', change: '2 ending soon', trend: 'warn', icon: FileText, color: 'indigo', bg: 'bg-indigo-50 dark:bg-indigo-900/20', iconColor: 'text-indigo-600 dark:text-indigo-400' },
  { title: 'POs to Process', value: '8', change: 'Action required', trend: 'up', icon: ShoppingCart, color: 'emerald', bg: 'bg-emerald-50 dark:bg-emerald-900/20', iconColor: 'text-emerald-600 dark:text-emerald-400' },
  { title: 'Invoices Pending', value: '3', change: 'Awaiting match', trend: 'down', icon: Receipt, color: 'amber', bg: 'bg-amber-50 dark:bg-amber-900/20', iconColor: 'text-amber-600 dark:text-amber-400' },
];

const myTasks = [
  { id: 1, title: 'Evaluate bids for RFQ-2024-001', type: 'Quotation', due: 'Today', status: 'High Priority' },
  { id: 2, title: 'Generate PO for TechCorp', type: 'Purchase Order', due: 'Today', status: 'Pending' },
  { id: 3, title: 'Verify Invoice INV-1029', type: 'Invoice', due: 'Tomorrow', status: 'Pending' },
];

export default function OfficerDashboard() {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Procurement Officer Workspace
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Your daily tasks and active processing queues.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.title} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-card p-5 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className={`h-11 w-11 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${kpi.iconColor}`} />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{kpi.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{kpi.title}</div>
                <div className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-2">{kpi.change}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
            <CardDescription>Items assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-3">
              {myTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary-200 transition-colors cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{task.title}</p>
                      <p className="text-xs text-gray-500">{task.type}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <Badge variant={task.status === 'High Priority' ? 'destructive' : 'secondary'}>{task.due}</Badge>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
