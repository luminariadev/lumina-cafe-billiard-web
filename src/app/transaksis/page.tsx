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

  if (loading) return <div className="flex justify-center"><span className="material-symbols-outlined text-primary text-6xl animate-pulse">sports_bar</span></div>;

  return (
    <>
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h2 className="font-headline-md text-[#e5e2e1]">Transaction History</h2>
          <p className="font-label-sm text-[#e5e2e1]-variant">Manage all billiard & cafe transactions</p>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#1c1b1b]">
              <tr>
                <th className="px-lg py-md font-label-sm text-[#e5e2e1]-variant">CODE</th>
                <th className="px-lg py-md font-label-sm text-[#e5e2e1]-variant">TYPE</th>
                <th className="px-lg py-md font-label-sm text-[#e5e2e1]-variant">CUSTOMER</th>
                <th className="px-lg py-md font-label-sm text-[#e5e2e1]-variant">AMOUNT</th>
                <th className="px-lg py-md font-label-sm text-[#e5e2e1]-variant">PAYMENT</th>
                <th className="px-lg py-md font-label-sm text-[#e5e2e1]-variant">STATUS</th>
                <th className="px-lg py-md font-label-sm text-[#e5e2e1]-variant">CREATED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {transaksis.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-lg py-md text-center text-[#e5e2e1]-variant font-label-md py-xl">No transactions yet</td>
                </tr>
              ) : (
                transaksis.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#201f1f]-high transition-colors">
                    <td className="px-lg py-md font-label-md text-primary">{tx.kode_transaksi}</td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-sm">
                        <div className={`w-8 h-8 rounded flex items-center justify-center ${tx.tipe === 'billiard' ? 'bg-secondary/20' : 'bg-tertiary/20'}`}>
                          <span className={`material-symbols-outlined text-[18px] ${tx.tipe === 'billiard' ? 'text-secondary' : 'text-tertiary'}`}>
                            {tx.tipe === 'billiard' ? 'sports_bar' : 'local_cafe'}
                          </span>
                        </div>
                        <span className="font-body-md capitalize">{tx.tipe}</span>
                      </div>
                    </td>
                    <td className="px-lg py-md font-body-md">{tx.nama_pelanggan || '-'}</td>
                    <td className="px-lg py-md text-body-md font-bold text-[#e5e2e1]">
                      Rp {(tx.total_bayar ? parseFloat(tx.total_bayar) : 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-lg py-md">
                      {tx.payment_method ? (
                        <span className="px-2 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider">
                          {tx.payment_method}
                        </span>
                      ) : (
                        <span className="text-[#e5e2e1]-variant text-label-sm">-</span>
                      )}
                    </td>
                    <td className="px-lg py-md">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        tx.status === 'dibayar' ? 'bg-primary/10 text-primary' :
                        tx.status === 'aktif' ? 'bg-secondary/10 text-secondary' :
                        'bg-[#201f1f]-highest text-[#e5e2e1]-variant'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-lg py-md text-label-sm text-[#e5e2e1]-variant">
                      {new Date(tx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
