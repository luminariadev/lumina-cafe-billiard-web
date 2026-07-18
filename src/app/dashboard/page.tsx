'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getReports, getTransaksis } from '@/lib/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [report, setReport] = useState<any | null>(null);
  const [recentTransaksis, setRecentTransaksis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [r, t] = await Promise.all([
          getReports(),
          getTransaksis(),
        ]);
        setReport(r);
        setRecentTransaksis(t.slice(0, 5)); // Last 5
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-symbols-outlined text-primary text-6xl animate-pulse">sports_bar</span>
      </div>
    );
  }

  return (
    <>
      {/* Hero Stats Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
        <StatCard
          icon="payments"
          color="primary"
          label="Total Revenue"
          value={`Rp ${(report?.today_revenue || 0).toLocaleString('id-ID')}`}
          badge={report ? `${report.today_transactions} tx` : '0 tx'}
        />
        <StatCard
          icon="sports_bar"
          color="secondary"
          label="Billiards Revenue"
          value="Rp 0"
          badge="+0% vs LY"
        />
        <StatCard
          icon="local_cafe"
          color="tertiary"
          label="Cafe Revenue"
          value="Rp 0"
          badge="+0% vs LY"
        />
        <StatCard
          icon="grid_view"
          color="primary"
          label="Monthly Revenue"
          value={`Rp ${(report?.monthly_revenue || 0).toLocaleString('id-ID')}`}
          badge="LIVE"
          live
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-lg">
          {/* Revenue Trends */}
          <div className="glass-card rounded-xl p-6 h-[400px] relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-xl relative z-10">
              <div>
                <h4 className="font-headline-md text-[#e5e2e1]">Revenue Trends</h4>
                <p className="font-label-sm text-[#e5e2e1]-variant">Consolidated daily performance report</p>
              </div>
              <div className="flex gap-2 bg-[#1c1b1b]est p-1 rounded-lg">
                <button className="px-3 py-1 text-label-sm font-label-sm rounded-md bg-[#201f1f]-high text-primary">Daily</button>
                <button className="px-3 py-1 text-label-sm font-label-sm rounded-md text-[#e5e2e1]-variant hover:text-[#e5e2e1]">Weekly</button>
              </div>
            </div>
            {/* Chart Placeholder */}
            <div className="flex-1 flex items-end gap-2 pb-md relative z-10">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div
                  key={day}
                  className="flex-1 bg-primary/20 hover:bg-primary/40 transition-all rounded-t-sm cursor-default group relative"
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#201f1f] px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[#e5e2e1]">
                    Rp {Math.floor(Math.random() * 500000 + 100000).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-lg border-b border-[#869486]-variant/10 flex justify-between items-center">
              <h4 className="font-headline-md text-[#e5e2e1]">Recent Transactions</h4>
              <a href="/transaksis" className="text-primary font-label-md hover:underline">View All</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#1c1b1b]">
                  <tr>
                    <th className="px-lg py-md font-label-sm text-[#e5e2e1]-variant">ENTITY</th>
                    <th className="px-lg py-md font-label-sm text-[#e5e2e1]-variant">TYPE</th>
                    <th className="px-lg py-md font-label-sm text-[#e5e2e1]-variant">AMOUNT</th>
                    <th className="px-lg py-md font-label-sm text-[#e5e2e1]-variant">STATUS</th>
                    <th className="px-lg py-md font-label-sm text-[#e5e2e1]-variant">TIME</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {recentTransaksis.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-lg py-md text-center text-[#e5e2e1]-variant font-label-md">No recent transactions</td>
                    </tr>
                  ) : (
                    recentTransaksis.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#201f1f]-high transition-colors">
                        <td className="px-lg py-md">
                          <div className="flex items-center gap-sm">
                            <div className={`w-8 h-8 rounded flex items-center justify-center ${
                              tx.transaksi_type === 'billiard' ? 'bg-secondary/20' : 'bg-tertiary/20'
                            }`}>
                              <span className={`material-symbols-outlined text-[18px] ${
                                tx.transaksi_type === 'billiard' ? 'text-secondary' : 'text-tertiary'
                              }`}>
                                {tx.transaksi_type === 'billiard' ? 'sports_bar' : 'local_cafe'}
                              </span>
                            </div>
                            <span className="font-body-md">
                              {tx.customer_name || (tx.meja ? `Table #${tx.meja.nomor_meja}` : tx.kode_transaksi)}
                            </span>
                          </div>
                        </td>
                        <td className="px-lg py-md text-label-md text-[#e5e2e1]-variant">
                          {tx.transaksi_type === 'billiard' ? 'Booking' : 'Cafe Order'}
                        </td>
                        <td className="px-lg py-md text-body-md font-bold text-[#e5e2e1]">
                          Rp {tx.total_amount.toLocaleString('id-ID')}
                        </td>
                        <td className="px-lg py-md">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            tx.status === 'dibayar' ? 'bg-primary/10 text-primary' :
                            'bg-secondary/10 text-secondary'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-lg py-md text-label-sm text-[#e5e2e1]-variant">
                          {new Date(tx.jam_mulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-lg">
          {/* Quick Stats */}
          <div className="glass-card rounded-xl p-lg">
            <h4 className="font-headline-md text-[#e5e2e1] mb-md">Quick Stats</h4>
            <div className="space-y-md">
              <div className="flex justify-between items-center p-4 rounded-lg bg-[#1c1b1b] border border-[#869486]-variant/10">
                <span className="font-label-md text-[#e5e2e1]-variant">Today Transactions</span>
                <span className="font-bold text-primary font-label-md">{report?.today_transactions || 0}</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-[#1c1b1b] border border-[#869486]-variant/10">
                <span className="font-label-md text-[#e5e2e1]-variant">Monthly Transactions</span>
                <span className="font-bold text-primary font-label-md">{report?.monthly_transactions || 0}</span>
              </div>
            </div>
          </div>

          {/* Best Sellers */}
          {report?.best_sellers && report.best_sellers.length > 0 && (
            <div className="glass-card rounded-xl p-lg">
              <h4 className="text-[20px] font-semibold font-[Montserrat] text-gray-200 mb-6">Best Sellers</h4>
              <div className="space-y-4">
                {report.best_sellers.map((item: any, idx: number) => (
                  <div key={item.name} className="flex items-center gap-4 p-4 rounded-lg bg-gray-900 border border-gray-700/10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      idx === 0 ? 'bg-amber-500/20 text-amber-500' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold font-[Inter] text-gray-200 truncate">{item.name}</p>
                      <p className="text-[12px] font-medium font-[Inter] text-gray-400">{item.quantity} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Action */}
          <div className="bg-primary p-6 rounded-xl flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-on-primary text-[48px] mb-sm" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
            <h5 className="font-headline-md text-on-primary font-bold">New Session</h5>
            <p className="font-label-sm text-on-primary/80 mb-md">Start a billiard session or take a cafe order.</p>
            <a
              href={user?.role === 'kasir_cafe' ? '/pos' : '/meja'}
              className="w-full py-md bg-on-primary text-primary rounded-xl font-bold hover:scale-[1.02] transition-transform active:scale-95 text-center"
            >
              Start New Session
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ icon, color, label, value, badge, live }: {
  icon: string;
  color: 'primary' | 'secondary' | 'tertiary';
  label: string;
  value: string;
  badge: string;
  live?: boolean;
}) {
  const colorMap = {
    primary: { text: 'text-primary', bg: 'bg-primary/10' },
    secondary: { text: 'text-secondary', bg: 'bg-secondary/10' },
    tertiary: { text: 'text-tertiary', bg: 'bg-tertiary/10' },
  };

  return (
    <div className="glass-card p-6 rounded-xl glow-hover transition-all">
      <div className="flex justify-between items-start mb-md">
        <div className={`p-2 ${colorMap[color].bg} rounded-lg`}>
          <span className={`material-symbols-outlined ${colorMap[color].text}`}>{icon}</span>
        </div>
        {live ? (
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className={`font-bold font-label-sm text-label-sm ${colorMap[color].text}`}>LIVE</span>
          </div>
        ) : (
          <span className={`font-bold font-label-sm text-label-sm ${colorMap[color].text}`}>{badge}</span>
        )}
      </div>
      <p className="font-label-md text-label-md text-[#e5e2e1]-variant">{label}</p>
      <h3 className="font-headline-lg text-headline-lg text-[#e5e2e1] mt-xs">{value}</h3>
    </div>
  );
}
