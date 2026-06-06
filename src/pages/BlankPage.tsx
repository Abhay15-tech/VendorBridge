import React from 'react';
import { Construction } from 'lucide-react';

const moduleIcons: Record<string, string> = {
  'approvals': '✅',
  'activity logs': '📋',
  'reports & analytics': '📊',
  'settings': '⚙️',
  'forgot password': '🔑',
  'reset password': '🔒',
};

export default function BlankPage({ title }: { title: string }) {
  const emoji = moduleIcons[title.toLowerCase()] || '🚧';

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          This module is coming soon.
        </p>
      </div>

      <div className="h-80 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-3 text-center px-4">
        <div className="text-5xl">{emoji}</div>
        <div>
          <p className="text-base font-semibold text-gray-600 dark:text-gray-300">{title} Module</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">This feature is under development and will be available soon.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 mt-1">
          <Construction className="h-3.5 w-3.5" />
          Under Construction
        </div>
      </div>
    </div>
  );
}
