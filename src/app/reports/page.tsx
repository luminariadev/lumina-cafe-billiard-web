'use client';

import { useState, useEffect } from 'react';
import { getReports, ReportData } from '@/lib/api';

export default function ReportsPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports()
      .then(setReport)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center"><span className="material-symbols-outlined text-primary text-6xl animate-pulse">sports_bar</span></div>;

  return (
    <>
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h2 className="font-headline-md text-[#e5e2e1]">Reports & Analytics</h2>
          <p className="font-label-sm text-[#e5e2e1]-variant">Performance overview of billiard & cafe operations</p>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-lg">
        <div className="glass-card p-6 rounded-xl glow-hover transition-all">
          <div className="flex justify-between items-start mb-md">
            <div className="p-2 bg-primary/10 rounded-lg">
              <span className="material-symbols-outlined text-primary">payments</span>
            </div>
            <span className="text-primary font-bold font-label-sm text-label-sm">Today</span>
          </div>
          <p className="font-label-md text-label-md text-[#e5e2e1]-variant">Today Revenue</p>
          <h3 className="font-headline-lg text-headline-lg text-[#e5e2e1] mt-xs">Rp {(report?.today_revenue || 0).toLocaleString('id-ID')}</h3>
        </div>
        <div className="glass-card p-6 rounded-xl glow-hover transition-all">
          <div className="flex justify-between items-start mb-md">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <span className="material-symbols-outlined text-secondary">calendar_month</span>
            </div>
            <span className="text-secondary font-bold font-label-sm text-label-sm">Month</span>
          </div>
          <p className="font-label-md text-label-md text-[#e5e2e1]-variant">Monthly Revenue</p>
          <h3 className="font-headline-lg text-headline-lg text-[#e5e2e1] mt-xs">Rp {(report?.monthly_revenue || 0).toLocaleString('id-ID')}</h3>
        </div>
        <div className="glass-card p-6 rounded-xl glow-hover transition-all">
          <div className="flex justify-between items-start mb-md">
            <div className="p-2 bg-tertiary/10 rounded-lg">
              <span className="material-symbols-outlined text-tertiary">receipt_long</span>
            </div>
            <span className="text-tertiary font-bold font-label-sm text-label-sm">Today</span>
          </div>
          <p className="font-label-md text-label-md text-[#e5e2e1]-variant">Transactions Today</p>
          <h3 className="font-headline-lg text-headline-lg text-[#e5e2e1] mt-xs">{report?.today_transactions || 0}</h3>
        </div>
        <div className="glass-card p-6 rounded-xl glow-hover transition-all">
          <div className="flex justify-between items-start mb-md">
            <div className="p-2 bg-primary/10 rounded-lg">
              <span className="material-symbols-outlined text-primary">assessment</span>
            </div>
            <span className="text-primary font-bold font-label-sm text-label-sm">Month</span>
          </div>
          <p className="font-label-md text-label-md text-[#e5e2e1]-variant">Monthly Transactions</p>
          <h3 className="font-headline-lg text-headline-lg text-[#e5e2e1] mt-xs">{report?.monthly_transactions || 0}</h3>
        </div>
      </div>

      {/* Best Sellers */}
      <div className="glass-card rounded-xl p-lg">
        <h4 className="font-headline-md text-[#e5e2e1] mb-lg">Best Selling Products</h4>
        {report?.best_sellers && report.best_sellers.length > 0 ? (
          <div className="space-y-md">
            {report.best_sellers.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-6 p-4 rounded-lg bg-[#1c1b1b] border border-[#869486]-variant/10 hover:bg-[#201f1f]-high transition-colors">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  idx === 0 ? 'bg-tertiary/20 text-tertiary' :
                  idx === 1 ? 'bg-[#201f1f]-highest text-[#e5e2e1]-variant' :
                  'bg-[#201f1f]-highest text-[#e5e2e1]-variant'
                }`}>
                  {idx === 0 ? <span className="material-symbols-outlined text-tertiary">emoji_events</span> : idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-label-md text-[#e5e2e1]">{item.name}</p>
                  <p className="font-label-sm text-[#e5e2e1]-variant">{item.quantity} items sold</p>
                </div>
                <div className="text-right">
                  <span className="font-label-md text-primary">{item.quantity}x</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-xl text-[#e5e2e1]-variant font-label-md">
            No sales data yet. Start by creating transactions.
          </div>
        )}
      </div>
    </>
  );
}
