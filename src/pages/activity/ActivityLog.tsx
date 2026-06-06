import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';
import { Input } from '@/components/Input';
import { useWorkflow } from '@/contexts/WorkflowContext';

export default function ActivityLog() {
  const { activities } = useWorkflow();
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleExport = () => {
    const headers = ['ID', 'Module', 'Action', 'Actor', 'Target', 'Time', 'Status', 'Description'];
    const csvContent = [
      headers.join(','),
      ...activities.map(a => 
        [a.id, a.module, a.action, a.actor, a.target, a.time, a.status, `"${a.description}"`].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `activity_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredActivities = activities.filter(activity => 
    activity.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Activity Log</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Track system-wide procurement and vendor events.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-primary-500' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>System Events</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search logs..." 
                  className="pl-9 h-9" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="h-9 px-3 flex items-center justify-center border border-gray-200 dark:border-gray-800 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredActivities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No activities recorded yet.</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="p-4 sm:px-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <div className={`h-2.5 w-2.5 rounded-full ${
                        activity.status === 'success' ? 'bg-emerald-500' :
                        activity.status === 'warning' ? 'bg-amber-500' :
                        activity.status === 'destructive' ? 'bg-rose-500' :
                        'bg-blue-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{activity.module}</span>
                          <Badge variant="secondary" className="px-1.5 py-0 text-[10px] uppercase tracking-wider">{activity.action}</Badge>
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">{activity.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{activity.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        <span className="flex items-center gap-1">Actor: <span className="text-gray-700 dark:text-gray-300">{activity.actor}</span></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">Target: <span className="text-gray-700 dark:text-gray-300">{activity.target}</span></span>
                        <span>•</span>
                        <span>{new Date(activity.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
