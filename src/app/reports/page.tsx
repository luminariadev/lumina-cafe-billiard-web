'use client';

import { useState, useEffect } from 'react';
import { getReports, ReportData } from '@/lib/api';

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  const clr = color === 'amber' ? 'text-amber-400 bg-amber-400/10' : color === 'yellow' ? 'text-yellow-400 bg-yellow-400/10' : 'text-green-400 bg-green-400/10';
  return (
    <div className="glass-card p-6 rounded-xl hover:shadow-[0_0_20px_0_rgba(107,251,154,0.15)] transition-shadow">
      <div className={`p-2 ${clr} rounded-lg w-fit mb-3`}>
        <span className="material-symbols-outlined text-lg">{icon}</span>
      </div>
      <p className="text-sm text-gray-400">{label}</p>
      <h3 className="text-3xl font-bold font-[Montserrat] text-green-400 mt-1">{value}</h3>
    </div>
  );
}

export default function ReportsPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports().then(setReport).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><span className="material-symbols-outlined text-green-400 text-5xl animate-pulse">bar_chart</span></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold font-[Montserrat] text-gray-200">Reports & Analytics</h2>
        <p className="text-gray-400 text-sm mt-1">Performance overview of billiard & cafe operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Today Revenue" value={`Rp ${(report?.today_revenue || 0).toLocaleString('id-ID')}`} icon="payments" color="green" />
        <StatCard label="Monthly Revenue" value={`Rp ${(report?.monthly_revenue || 0).toLocaleString('id-ID')}`} icon="calendar_month" color="amber" />
        <StatCard label="Transactions Today" value={report?.today_transactions || 0} icon="receipt_long" color="yellow" />
        <StatCard label="Monthly Transactions" value={report?.monthly_transactions || 0} icon="assessment" color="green" />
      </div>

      <div className="glass-card rounded-xl p-6">
        <h4 className="text-lg font-semibold font-[Montserrat] text-gray-200 mb-4">Best Selling Products</h4>
        {report?.best_sellers && report.best_sellers.length > 0 ? (
          <div className="space-y-3">
            {report.best_sellers.map((item: any, idx: number) => (
              <div key={item.name} className="flex items-center gap-4 p-4 rounded-lg bg-gray-900 border border-gray-800 hover:bg-gray-800/50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${idx === 0 ? 'bg-yellow-400/20 text-yellow-400' : 'bg-gray-700 text-gray-300'}`}>
                  {idx === 0 ? <span className="material-symbols-outlined text-yellow-400">emoji_events</span> : idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-200">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.quantity} items sold</p>
                </div>
                <span className="text-sm font-bold text-green-400">{item.quantity}x</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 text-sm">No sales data yet.</div>
        )}
      </div>
    </div>
  );
}