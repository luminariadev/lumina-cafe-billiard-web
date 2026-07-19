'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getReports, getTransaksis, getTransactionsReport } from '@/lib/api';
import { useRouter } from 'next/navigation';

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="glass-card p-4 sm:p-6 rounded-xl hover:shadow-[0_0_20px_0_rgba(107,251,154,0.15)] transition-shadow">
      <p className="text-xs sm:text-sm text-gray-400 mb-1">{label}</p>
      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold font-[Montserrat] text-green-400 truncate">{value}</h3>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [report, setReport] = useState<any | null>(null);
  const [recentTransaksis, setRecentTransaksis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.allSettled([
          getReports(), // Ini harusnya report summary, bukan report transaksi
          getTransaksis(),
        ]);

        if (results[0].status === 'fulfilled') {
          setReport(results[0].value);
        } else if (results[0].status === 'rejected' && results[0].reason.message.includes("HTTP 401")) {
          router.push('/login');
          return;
        } else {
          console.error('Reports fetch failed:', results[0].reason);
        }

        if (results[1].status === 'fulfilled') {
          const data = results[1].value;
          setRecentTransaksis(Array.isArray(data) ? data.slice(0, 5) : []);
        } else if (results[1].status === 'rejected' && results[1].reason.message.includes("HTTP 401")) {
          router.push('/login');
          return;
        } else {
          console.error('Transaksis fetch failed:', results[1].reason);
          setError('Failed to load some data');
        }
      } catch (err) {
        console.error('Dashboard fetch error', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="material-symbols-outlined text-green-400 text-5xl animate-pulse">sports_bar</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold font-[Montserrat] text-gray-200">Dashboard</h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">Welcome back, {user?.name || 'Administrator'}</p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-400">
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard value={`Rp ${(report?.today_revenue || 0).toLocaleString('id-ID')}`} label="Today Revenue" />
        <StatCard value={`Rp ${(report?.monthly_revenue || 0).toLocaleString('id-ID')}`} label="Monthly Revenue" />
        <StatCard value={report?.today_transactions || 0} label="Transaksi Hari Ini" />
        <StatCard value={report?.monthly_transactions || 0} label="Transaksi Bulan Ini" />
      </div>

      {/* Recent Transactions + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-800">
            <h4 className="text-base sm:text-lg font-semibold font-[Montserrat] text-gray-200">Recent Transactions</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left font-semibold text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">CODE</th>
                  <th className="px-4 sm:px-6 py-3 text-left font-semibold text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">TYPE</th>
                  <th className="px-4 sm:px-6 py-3 text-left font-semibold text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">AMOUNT</th>
                  <th className="px-4 sm:px-6 py-3 text-left font-semibold text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">STATUS</th>
                  <th className="px-4 sm:px-6 py-3 text-left font-semibold text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">TIME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {recentTransaksis.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 sm:px-6 py-10 sm:py-12 text-center text-gray-400">No recent transactions</td>
                  </tr>
                ) : (
                  recentTransaksis.map((tx: any) => (
                    <tr key={tx.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-green-400 whitespace-nowrap">{tx.kode_transaksi}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 capitalize">{tx.tipe || tx.transaksi_type}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-bold text-gray-200 whitespace-nowrap">
                        Rp {parseFloat(tx.total_bayar || tx.total_amount || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase ${
                          tx.status === 'dibayar' ? 'bg-green-400/10 text-green-400' :
                          tx.status === 'aktif' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-gray-800 text-gray-400'
                        }`}>{tx.status}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-400 text-[10px] sm:text-xs whitespace-nowrap">
                        {new Date(tx.created_at).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Stats */}
          <div className="glass-card rounded-xl p-4 sm:p-6">
            <h4 className="text-base sm:text-lg font-semibold font-[Montserrat] text-gray-200 mb-3 sm:mb-4">Quick Stats</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-900 border border-gray-800">
                <span className="text-xs sm:text-sm text-gray-400">Transaksi Hari Ini</span>
                <span className="font-bold text-green-400">{report?.today_transactions || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-900 border border-gray-800">
                <span className="text-xs sm:text-sm text-gray-400">Transaksi Bulan Ini</span>
                <span className="font-bold text-green-400">{report?.monthly_transactions || 0}</span>
              </div>
            </div>
          </div>

          {/* Best Sellers */}
          {report?.best_sellers && report.best_sellers.length > 0 && (
            <div className="glass-card rounded-xl p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold font-[Montserrat] text-gray-200 mb-3 sm:mb-4">Best Sellers</h4>
              <div className="space-y-3">
                {report.best_sellers.map((item: any, idx: number) => (
                  <div key={item.name} className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg bg-gray-900 border border-gray-800">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 ${
                      idx === 0 ? 'bg-amber-500/20 text-amber-500' : 'bg-gray-800 text-gray-400'
                    }`}>{idx + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-200 truncate">{item.name}</p>
                      <p className="text-[10px] sm:text-xs text-gray-400">{item.quantity} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
