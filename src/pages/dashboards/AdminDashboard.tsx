import React from 'react';
import { useWorkflow } from '@/contexts/WorkflowContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { spendData, vendorPerformanceData, vendors } from '@/data/mockData';
import { 
  Users, FileText, ShoppingCart, AlertCircle, 
  TrendingUp, TrendingDown, ArrowUpRight, Clock
} from 'lucide-react';

const recentActivity = [
  { id: 'RFQ-2024-005', type: 'RFQ Published', vendor: 'TechCorp Industries', time: '2 min ago', status: 'default' },
  { id: 'PO-9901', type: 'PO Approved', vendor: 'Apex Logistics', time: '1 hr ago', status: 'success' },
  { id: 'INV-1029', type: 'Invoice Overdue', vendor: 'Global Office', time: '3 hrs ago', status: 'destructive' },
  { id: 'VND-1003', type: 'Vendor Onboarded', vendor: 'CloudSystems Inc', time: '1 day ago', status: 'secondary' },
];

export default function AdminDashboard() {
  const { rfqs, quotations, purchaseOrders } = useWorkflow();

  const kpis = [
    {
      title: 'Total Vendors',
      value: vendors.length.toString(),
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'indigo',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      title: 'Active RFQs',
      value: rfqs.filter(r => r.status !== 'COMPLETED' && r.status !== 'Closed').length.toString(),
      change: '+4 this week',
      trend: 'up',
      icon: FileText,
      color: 'sky',
      bg: 'bg-sky-50 dark:bg-sky-900/20',
      iconColor: 'text-sky-600 dark:text-sky-400',
    },
    {
      title: 'Pending Approvals',
      value: quotations.filter(q => q.status === 'PENDING_APPROVAL').length.toString(),
      change: 'Action required',
      trend: 'warn',
      icon: AlertCircle,
      color: 'amber',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Total PO Value',
      value: '$' + purchaseOrders.reduce((sum, po) => sum + po.amount, 0).toLocaleString(),
      change: '-5% vs target',
      trend: 'down',
      icon: ShoppingCart,
      color: 'emerald',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Good morning, Admin 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Here's what's happening with your procurement today.
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

      {/* Charts */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        {/* Spend Area Chart - wider */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Spend Analysis</CardTitle>
                <CardDescription>Monthly procurement vs target</CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">Last 7 months</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={spendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.10} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '13px', padding: '10px 14px' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, undefined]}
                />
                <Area type="monotone" dataKey="amount" name="Actual" stroke="#6366f1" strokeWidth={2.5} fill="url(#spendGrad)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="target" name="Target" stroke="#10b981" strokeWidth={2} strokeDasharray="6 3" fill="url(#targetGrad)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vendor Performance - narrower */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Vendors</CardTitle>
            <CardDescription>Performance overview</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-4">
              {vendors.filter(v => v.status === 'Active').map((v) => (
                <div key={v.id} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xs font-bold flex-shrink-0">
                    {v.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{v.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                          style={{ width: `${(v.rating / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{v.rating}</span>
                    </div>
                  </div>
                  <Badge variant={v.status === 'Active' ? 'success' : 'secondary'} className="flex-shrink-0">{v.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest procurement events</CardDescription>
            </div>
            <button className="text-xs text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-1">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                <div className="h-2 w-2 rounded-full bg-primary-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{item.id}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mx-2">·</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.type}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{item.vendor}</span>
                <Badge variant={item.status as any}>{item.type.split(' ')[1] || item.type}</Badge>
                <span className="text-xs text-gray-400 flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
