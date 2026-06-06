import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { spendData, vendors } from '@/data/mockData';
import { 
  Users, FileText, ShoppingCart, AlertCircle, 
  TrendingUp, TrendingDown, Clock, CheckSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

const kpis = [
  {
    title: 'Pending Approvals',
    value: '12',
    change: 'Action required',
    trend: 'warn',
    icon: CheckSquare,
    color: 'amber',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    title: 'Budget Consumed',
    value: '72%',
    change: '+5% vs last month',
    trend: 'up',
    icon: ShoppingCart,
    color: 'indigo',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    title: 'Active RFQs',
    value: '18',
    change: 'In progress',
    trend: 'up',
    icon: FileText,
    color: 'sky',
    bg: 'bg-sky-50 dark:bg-sky-900/20',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
  {
    title: 'Vendor Issues',
    value: '3',
    change: 'Needs review',
    trend: 'down',
    icon: AlertCircle,
    color: 'rose',
    bg: 'bg-rose-50 dark:bg-rose-900/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
];

const pendingApprovals = [
  { id: 'APR-001', title: 'PO for TechCorp Q3 Laptops', amount: '$58,500', due: 'Today' },
  { id: 'APR-002', title: 'Onboard Quantum Supplies', amount: '-', due: 'Tomorrow' },
  { id: 'APR-003', title: 'RFQ Budget Exception', amount: '$135,000', due: 'In 2 days' },
];

export default function ManagerDashboard() {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Manager Overview
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Review pending approvals and team budget.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2 shadow-card">
          <Clock className="h-4 w-4" />
          <span>Last updated: just now</span>
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
                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  kpi.trend === 'up' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' :
                  kpi.trend === 'down' ? 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-400' :
                  'text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400'
                }`}>
                  {kpi.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : kpi.trend === 'down' ? <TrendingDown className="h-3 w-3" /> : null}
                  {kpi.change}
                </span>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{kpi.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{kpi.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Approvals Action Required */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Pending Approvals</CardTitle>
                <CardDescription>Items awaiting your sign-off</CardDescription>
              </div>
              <Link to="/approvals" className="text-xs text-primary-600 font-semibold hover:underline">View all</Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApprovals.map(app => (
                <div key={app.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{app.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 font-mono">{app.id}</span>
                      <span className="text-gray-300 dark:text-gray-600 text-xs">•</span>
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1"><Clock className="h-3 w-3" /> Due {app.due}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{app.amount}</p>
                    <Link to="/approvals" className="text-xs font-semibold text-primary-600 mt-1 inline-block hover:underline">Review</Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links / Team Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Team Recent Activity</CardTitle>
            <CardDescription>Latest actions from your department</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mt-1">S</div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white"><span className="font-semibold">Sarah K.</span> drafted RFQ-2024-002</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 mt-1">A</div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white"><span className="font-semibold">Admin User</span> added a new vendor</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
