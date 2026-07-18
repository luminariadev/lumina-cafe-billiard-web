'use client';

import { useState, useEffect } from 'react';
import { getTransaksis, Transaksi } from '@/lib/api';

export default function TransaksisPage() {
  const [transaksis, setTransaksis] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTransaksis()
      .then((data) => setTransaksis(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><span className="material-symbols-outlined text-green-400 text-5xl animate-pulse">receipt_long</span></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold font-[Montserrat] text-gray-200">Transaction History</h2>
        <p className="text-gray-400 text-sm mt-1">Manage all billiard & cafe transactions</p>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-xs text-gray-400 uppercase tracking-wider">CODE</th>
                <th className="px-6 py-4 text-left font-semibold text-xs text-gray-400 uppercase tracking-wider">TYPE</th>
                <th className="px-6 py-4 text-left font-semibold text-xs text-gray-400 uppercase tracking-wider">CUSTOMER</th>
                <th className="px-6 py-4 text-left font-semibold text-xs text-gray-400 uppercase tracking-wider">AMOUNT</th>
                <th className="px-6 py-4 text-left font-semibold text-xs text-gray-400 uppercase tracking-wider">PAYMENT</th>
                <th className="px-6 py-4 text-left font-semibold text-xs text-gray-400 uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-4 text-left font-semibold text-xs text-gray-400 uppercase tracking-wider">CREATED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {transaksis.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No transactions yet</td></tr>
              ) : (
                transaksis.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-green-400">{tx.kode_transaksi}</td>
                    <td className="px-6 py-4 capitalize">{tx.tipe}</td>
                    <td className="px-6 py-4">{tx.nama_pelanggan || '-'}</td>
                    <td className="px-6 py-4 font-bold text-gray-200">Rp {(tx.total_bayar ? parseFloat(tx.total_bayar) : 0).toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      {tx.payment_method ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider">{tx.payment_method}</span>
                      ) : <span className="text-gray-500 text-xs">-</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${tx.status === 'dibayar' ? 'bg-green-400/10 text-green-400' : tx.status === 'aktif' ? 'bg-amber-500/10 text-amber-400' : 'bg-gray-800 text-gray-400'}`}>{tx.status}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{new Date(tx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}