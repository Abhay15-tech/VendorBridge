import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { ArrowLeft, CheckCircle, Download, TrendingDown } from 'lucide-react';

// Mock data for comparison
const comparisonData = {
  rfqId: 'RFQ-2023-089',
  title: 'Q3 Enterprise Server Procurement',
  items: [
    { name: 'Rack Servers (32-core)', qty: 10 },
    { name: 'Storage Array (50TB)', qty: 2 },
    { name: 'Network Switches (48-port)', qty: 4 },
  ],
  bids: [
    {
      vendorName: 'TechCorp Industries',
      vendorId: 'V-1001',
      totalPrice: 145000,
      deliveryTime: '14 Days',
      warranty: '3 Years',
      status: 'shortlisted',
      prices: [120000, 15000, 10000]
    },
    {
      vendorName: 'Global Supply Co',
      vendorId: 'V-1002',
      totalPrice: 138000,
      deliveryTime: '21 Days',
      warranty: '1 Year',
      status: 'pending',
      prices: [115000, 14000, 9000]
    },
    {
      vendorName: 'Apex Electronics',
      vendorId: 'V-1005',
      totalPrice: 152000,
      deliveryTime: '7 Days',
      warranty: '5 Years',
      status: 'rejected',
      prices: [125000, 16000, 11000]
    }
  ]
};

export default function QuotationComparison() {
  const navigate = useNavigate();

  const lowestPrices = comparisonData.items.map((_, i) =>
    Math.min(...comparisonData.bids.map(bid => bid.prices[i]))
  );
  const lowestTotal = Math.min(...comparisonData.bids.map(b => b.totalPrice));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Compare Quotations</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{comparisonData.title} · {comparisonData.rfqId}</p>
          </div>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export Matrix
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {comparisonData.bids.map(bid => (
          <div key={bid.vendorId} className={`rounded-2xl p-4 border ${bid.totalPrice === lowestTotal ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'} shadow-card`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{bid.vendorName}</p>
                <p className="text-xs text-gray-400 mt-0.5">{bid.vendorId}</p>
              </div>
              {bid.totalPrice === lowestTotal && (
                <Badge variant="success" className="text-[10px]">
                  <TrendingDown className="h-3 w-3 mr-1" />Best Price
                </Badge>
              )}
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">${bid.totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span>🚚 {bid.deliveryTime}</span>
              <span>🛡 {bid.warranty}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <Card>
        <CardHeader>
          <CardTitle>Bid Comparison Matrix</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/4">Evaluation Criteria</th>
                {comparisonData.bids.map(bid => (
                  <th key={bid.vendorId} className="px-6 py-4 min-w-[220px]">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{bid.vendorName}</div>
                    <div className="text-xs text-gray-400 font-normal mt-0.5">{bid.vendorId}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
              {/* Total Price */}
              <tr className="bg-primary-50/40 dark:bg-primary-900/10">
                <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Total Bid Price</td>
                {comparisonData.bids.map(bid => (
                  <td key={bid.vendorId} className="px-6 py-4 font-bold text-lg text-gray-900 dark:text-white">
                    ${bid.totalPrice.toLocaleString()}
                    {bid.totalPrice === lowestTotal && (
                      <Badge variant="success" className="ml-2 text-[10px] align-middle">Lowest</Badge>
                    )}
                  </td>
                ))}
              </tr>
              {/* Delivery */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-400">Delivery Time</td>
                {comparisonData.bids.map(bid => (
                  <td key={bid.vendorId} className="px-6 py-4 text-gray-700 dark:text-gray-300">{bid.deliveryTime}</td>
                ))}
              </tr>
              {/* Warranty */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-400">Warranty Term</td>
                {comparisonData.bids.map(bid => (
                  <td key={bid.vendorId} className="px-6 py-4 text-gray-700 dark:text-gray-300">{bid.warranty}</td>
                ))}
              </tr>
              {/* Section header */}
              <tr>
                <td colSpan={comparisonData.bids.length + 1} className="px-6 py-2.5 bg-gray-50 dark:bg-gray-800/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Line Item Breakdown
                </td>
              </tr>
              {/* Line items */}
              {comparisonData.items.map((item, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800 dark:text-gray-200">{item.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Qty: {item.qty}</div>
                  </td>
                  {comparisonData.bids.map(bid => {
                    const isLowest = bid.prices[i] === lowestPrices[i];
                    return (
                      <td key={bid.vendorId} className="px-6 py-4">
                        <span className={`font-medium flex items-center gap-2 ${isLowest ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}>
                          ${bid.prices[i].toLocaleString()}
                          {isLowest && <Badge variant="success" className="text-[10px] px-1.5 py-0">Best</Badge>}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Actions */}
              <tr className="bg-gray-50/60 dark:bg-gray-800/30">
                <td className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400">Final Action</td>
                {comparisonData.bids.map(bid => (
                  <td key={bid.vendorId} className="px-6 py-4">
                    <Button className="w-full" variant={bid.status === 'shortlisted' ? 'default' : 'outline'} size="sm">
                      {bid.status === 'shortlisted' ? (
                        <><CheckCircle className="mr-2 h-4 w-4" /> Award Contract</>
                      ) : 'Shortlist'}
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
