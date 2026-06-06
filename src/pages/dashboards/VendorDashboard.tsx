import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { 
  FileText, ShoppingCart, Receipt, Clock, Bell, CheckCircle, UploadCloud
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VendorDashboard() {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Vendor Portal
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Welcome back, TechCorp Industries.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-card p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold">2</div>
              <div className="text-sm text-gray-500">Open RFQs</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-card p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold">4</div>
              <div className="text-sm text-gray-500">Active POs</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-card p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold">$12,400</div>
              <div className="text-sm text-gray-500">Pending Payments</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Action Required</CardTitle>
            <CardDescription>Please respond to these items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-start gap-3">
                <Bell className="h-5 w-5 text-rose-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">RFQ-2024-001 Closing Soon</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">The deadline to submit your quotation is tomorrow at 5:00 PM.</p>
                  <Link to="/quotations/submit" className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-2 inline-block hover:underline">
                    Submit Quotation →
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-sm font-semibold">PO-9901</p>
                      <p className="text-xs text-gray-500">Received 2 hours ago</p>
                    </div>
                  </div>
                  <Badge variant="success">Confirmed</Badge>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
