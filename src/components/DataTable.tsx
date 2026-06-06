import React from 'react';
import { cn } from '@/utils/cn';

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessorKey: string;
    cell?: (item: T) => React.ReactNode;
  }[];
  searchPlaceholder?: string;
}

export function DataTable<T extends Record<string, any>>({ data, columns, searchPlaceholder = "Search..." }: DataTableProps<T>) {
  const [query, setQuery] = React.useState('');

  const filtered = data.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-card overflow-hidden">
      {/* Search bar */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full sm:max-w-xs text-sm px-3.5 py-2 bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-400/60 transition-all"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/70 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800">
              {columns.map(col => (
                <th
                  key={col.accessorKey}
                  className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
            {filtered.length > 0 ? (
              filtered.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors group">
                  {columns.map(col => (
                    <td key={col.accessorKey} className="px-5 py-3.5 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {col.cell ? col.cell(row) : row[col.accessorKey]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-5 py-16 text-center">
                  <p className="text-gray-400 font-medium">No results found</p>
                  <p className="text-gray-300 dark:text-gray-600 text-xs mt-1">Try adjusting your search</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {filtered.length > 0 && (
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Showing <span className="font-medium text-gray-600 dark:text-gray-300">{filtered.length}</span> of <span className="font-medium text-gray-600 dark:text-gray-300">{data.length}</span> records
          </p>
        </div>
      )}
    </div>
  );
}
