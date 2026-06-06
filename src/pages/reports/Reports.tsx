import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { Badge } from '@/components/Badge';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users,
  FileText, Receipt, Download, Calendar, ArrowUpRight
} from 'lucide-react';

// ─── Data ──────────────────────────────────────────────────────────────────────

const spendTrend = [
  { month: 'Jan', spend: 150000, budget: 160000, savings: 10000 },
  { month: 'Feb', spend: 180000, budget: 160000, savings: -20000 },
  { month: 'Mar', spend: 140000, budget: 160000, savings: 20000 },
  { month: 'Apr', spend: 210000, budget: 180000, savings: -30000 },
  { month: 'May', spend: 190000, budget: 180000, savings: -10000 },
  { month: 'Jun', spend: 250000, budget: 200000, savings: -50000 },
  { month: 'Jul', spend: 220000, budget: 200000, savings: -20000 },
];

const categorySpend = [
  { name: 'Hardware', value: 1250000, color: '#6366f1' },
  { name: 'Services', value: 450000, color: '#10b981' },
  { name: 'Software', value: 320000, color: '#f59e0b' },
  { name: 'Stationery', value: 85000, color: '#3b82f6' },
  { name: 'Logistics', value: 210000, color: '#ec4899' },
];

const vendorPerf = [
  { vendor: 'TechCorp',   delivery: 98, quality: 95, price: 88, compliance: 97 },
  { vendor: 'Apex',       delivery: 99, quality: 85, price: 80, compliance: 92 },
  { vendor: 'Global Off.',delivery: 95, quality: 90, price: 92, compliance: 88 },
  { vendor: 'SecureNet',  delivery: 82, quality: 75, price: 70, compliance: 79 },
];

const rfqCycleTime = [
  { month: 'Jan', days: 18 }, { month: 'Feb', days: 15 }, { month: 'Mar', days: 22 },
  { month: 'Apr', days: 12 }, { month: 'May', days: 10 }, { month: 'Jun', days: 9 },
  { month: 'Jul', days: 11 },
];

const poStatusData = [
  { status: 'Delivered', count: 42, color: '#10b981' },
  { status: 'Pending',   count: 18, color: '#f59e0b' },
  { status: 'Cancelled', count: 5,  color: '#f43f5e' },
];

const invoiceAgeing = [
  { range: '0–30 days', amount: 24000, count: 3 },
  { range: '31–60 days', amount: 58500, count: 5 },
  { range: '61–90 days', amount: 12400, count: 2 },
  { range: '90+ days',   amount: 8200,  count: 1 },
];

const savingsBreakdown = [
  { initiative: 'Early Payment', savings: 32000 },
  { initiative: 'Bulk Negotiation', savings: 58000 },
  { initiative: 'Vendor Consolidation', savings: 45000 },
  { initiative: 'Contract Renegotiation', savings: 27000 },
  { initiative: 'E-Auction', savings: 18000 },
];

const radarData = [
  { metric: 'On-Time Delivery', TechCorp: 98, Apex: 99, Global: 95 },
  { metric: 'Quality Score',    TechCorp: 95, Apex: 85, Global: 90 },
  { metric: 'Price Score',      TechCorp: 88, Apex: 80, Global: 92 },
  { metric: 'Compliance',       TechCorp: 97, Apex: 92, Global: 88 },
  { metric: 'Responsiveness',   TechCorp: 93, Apex: 96, Global: 85 },
];

const topVendors = [
  { name: 'TechCorp Industries', spend: 1250000, orders: 145, rating: 4.8, trend: 'up' },
  { name: 'Apex Logistics',      spend: 450000,  orders: 85,  rating: 4.6, trend: 'up' },
  { name: 'Global Office',       spend: 85000,   orders: 320, rating: 4.2, trend: 'down' },
  { name: 'SecureNet Solutions', spend: 120000,  orders: 42,  rating: 3.5, trend: 'down' },
];

// ─── KPI Cards ─────────────────────────────────────────────────────────────────

const kpis = [
  { title: 'Total Spend YTD',      value: '$2.4M',  change: '+8.2%',  trend: 'up',   icon: DollarSign,  color: 'indigo', bg: 'bg-indigo-50 dark:bg-indigo-900/20', ic: 'text-indigo-600 dark:text-indigo-400' },
  { title: 'Total Savings',        value: '$180K',  change: '+12%',   trend: 'up',   icon: TrendingUp,  color: 'emerald', bg: 'bg-emerald-50 dark:bg-emerald-900/20', ic: 'text-emerald-600 dark:text-emerald-400' },
  { title: 'Active POs',           value: '60',     change: '+4',     trend: 'up',   icon: ShoppingCart, color: 'sky', bg: 'bg-sky-50 dark:bg-sky-900/20', ic: 'text-sky-600 dark:text-sky-400' },
  { title: 'Avg RFQ Cycle Time',   value: '14 days', change: '-3 days', trend: 'up', icon: FileText,    color: 'violet', bg: 'bg-violet-50 dark:bg-violet-900/20', ic: 'text-violet-600 dark:text-violet-400' },
  { title: 'On-Time Delivery',     value: '94%',    change: '+2%',    trend: 'up',   icon: TrendingUp,  color: 'amber', bg: 'bg-amber-50 dark:bg-amber-900/20', ic: 'text-amber-600 dark:text-amber-400' },
  { title: 'Outstanding Invoices', value: '$103K',  change: '-5%',    trend: 'down', icon: Receipt,     color: 'rose', bg: 'bg-rose-50 dark:bg-rose-900/20', ic: 'text-rose-600 dark:text-rose-400' },
  { title: 'Total Vendors',        value: '1,248',  change: '+12%',   trend: 'up',   icon: Users,       color: 'teal', bg: 'bg-teal-50 dark:bg-teal-900/20', ic: 'text-teal-600 dark:text-teal-400' },
  { title: 'Contract Compliance',  value: '96%',    change: '+1%',    trend: 'up',   icon: TrendingUp,  color: 'green', bg: 'bg-green-50 dark:bg-green-900/20', ic: 'text-green-600 dark:text-green-400' },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'];

const fmt = (v: number) => `$${(v / 1000).toFixed(0)}k`;

const periods = ['This Month', 'This Quarter', 'YTD', 'Last Year'];

export default function Reports() {
  const [period, setPeriod] = useState('YTD');

  return (
    <div className="space-y-6 animate-slide-up pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Full visibility into procurement performance across all modules.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {periods.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  period === p ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                }`}
              >{p}</button>
            ))}
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.title} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-card p-4 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-9 w-9 rounded-xl ${k.bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${k.ic}`} />
                </div>
                <span className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  k.trend === 'up' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400'
                  : 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-400'
                }`}>
                  {k.trend === 'up' ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                  {k.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{k.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{k.title}</div>
            </div>
          );
        })}
      </div>

      {/* Row 1: Spend Trend + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Procurement Spend Trend</CardTitle>
                <CardDescription>Monthly actual spend vs. approved budget</CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />{period}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={spendTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="budgetG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={fmt} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontSize: 12 }} formatter={(v: any) => [`$${Number(v).toLocaleString()}`, undefined]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="spend" name="Actual Spend" stroke="#6366f1" strokeWidth={2.5} fill="url(#spendG)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="budget" name="Budget" stroke="#10b981" strokeWidth={2} strokeDasharray="5 4" fill="url(#budgetG)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Spend by Category</CardTitle>
            <CardDescription>Distribution of procurement budget</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={categorySpend} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {categorySpend.map((entry, i) => (
                    <Cell key={i} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, undefined]} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {categorySpend.map(cat => (
                <div key={cat.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                  <span className="text-xs text-gray-600 dark:text-gray-400 flex-1">{cat.name}</span>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">${(cat.value / 1000).toFixed(0)}K</span>
                  <span className="text-xs text-gray-400">{((cat.value / categorySpend.reduce((a,c) => a+c.value,0))*100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Vendor Performance Radar + RFQ Cycle Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Vendor Performance Radar</CardTitle>
            <CardDescription>Multi-metric comparison across top vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Radar name="TechCorp" dataKey="TechCorp" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Apex" dataKey="Apex" stroke="#10b981" fill="#10b981" fillOpacity={0.10} strokeWidth={2} />
                <Radar name="Global Off." dataKey="Global" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.10} strokeWidth={2} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RFQ Cycle Time</CardTitle>
            <CardDescription>Average days from publish to award (target: 10 days)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={rfqCycleTime} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} unit="d" />
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} formatter={(v: any) => [`${v} days`, 'Cycle Time']} />
                <Bar dataKey="days" name="Cycle Days" radius={[6, 6, 0, 0]}>
                  {rfqCycleTime.map((entry, i) => (
                    <Cell key={i} fill={entry.days <= 10 ? '#10b981' : entry.days <= 15 ? '#f59e0b' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3 text-xs">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> ≤10 days (on target)</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> 11–15 days</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> 15+ days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Savings + Invoice Ageing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Savings by Initiative</CardTitle>
            <CardDescription>Cost reduction programs YTD</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={savingsBreakdown} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={fmt} />
                <YAxis dataKey="initiative" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} width={120} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Savings']} />
                <Bar dataKey="savings" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Ageing Report</CardTitle>
            <CardDescription>Outstanding invoices grouped by overdue period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={invoiceAgeing} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={fmt} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Outstanding']} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {invoiceAgeing.map((_, i) => (
                    <Cell key={i} fill={['#10b981', '#f59e0b', '#f97316', '#f43f5e'][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {invoiceAgeing.map((row, i) => (
                <div key={row.range} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/60 rounded-xl px-3 py-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{row.range}</span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">${(row.amount/1000).toFixed(1)}K</span>
                    <span className="text-[10px] text-gray-400 block">{row.count} inv.</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: PO Status Donut + Top Vendors Table */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Purchase Order Status</CardTitle>
            <CardDescription>Current PO breakdown by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={poStatusData} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={4} dataKey="count">
                  {poStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2.5 mt-2">
              {poStatusData.map(s => (
                <div key={s.status} className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex-1">{s.status}</span>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{s.count}</span>
                  <span className="text-xs text-gray-400">{((s.count / poStatusData.reduce((a,c) => a+c.count,0))*100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Vendors by Spend</CardTitle>
                <CardDescription>Ranked by total YTD procurement value</CardDescription>
              </div>
              <button className="text-xs text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Spend</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
                {topVendors.map((v, i) => (
                  <tr key={v.name} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3.5 text-gray-400 font-medium">{i + 1}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-gray-200">{v.name}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-700 dark:text-gray-300">${(v.spend/1000).toFixed(0)}K</td>
                    <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{v.orders}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full w-16 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" style={{ width: `${(v.rating/5)*100}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{v.rating}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {v.trend === 'up'
                        ? <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold"><TrendingUp className="h-3.5 w-3.5" />Up</span>
                        : <span className="flex items-center gap-1 text-rose-500 text-xs font-semibold"><TrendingDown className="h-3.5 w-3.5" />Down</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
