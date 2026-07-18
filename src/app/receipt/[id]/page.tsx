'use client';

import { useState, useEffect } from 'react';
import { getTransaksis, Transaksi } from '@/lib/api';
import { useParams } from 'next/navigation';

export default function ReceiptPage() {
  const params = useParams();
  const [tx, setTx] = useState<Transaksi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTransaksis()
      .then((data) => {
        const found = (data || []).find(t => t.id === Number(params.id));
        if (found) setTx(found);
        else setError('Transaction not found');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="flex justify-center"><span className="material-symbols-outlined text-primary text-6xl animate-pulse">receipt_long</span></div>;
  if (error) return <div className="text-center py-xl text-error font-label-md">{error}</div>;
  if (!tx) return null;

  const total = tx.total_bayar ? parseFloat(tx.total_bayar) : 0;

  return (
    <div className="max-w-md mx-auto" id="receipt-content">
      <div className="glass-card rounded-xl p-6 text-center">
        <div className="mb-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-2">
            <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
          </div>
          <h2 className="font-headline-md text-primary">Lumina</h2>
          <p className="font-label-sm text-[#e5e2e1]-variant">Payment Receipt</p>
        </div>

        <div className="border-t border-[#869486]-variant/10 pt-lg space-y-md text-left">
          <div className="flex justify-between">
            <span className="text-[#e5e2e1]-variant font-label-sm">Transaction Code</span>
            <span className="font-label-md text-primary">{tx.kode_transaksi}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#e5e2e1]-variant font-label-sm">Type</span>
            <span className="font-label-md capitalize">{tx.tipe}</span>
          </div>
          {tx.nama_pelanggan && (
            <div className="flex justify-between">
              <span className="text-[#e5e2e1]-variant font-label-sm">Customer</span>
              <span className="font-label-md">{tx.nama_pelanggan}</span>
            </div>
          )}
          {tx.payment_method && (
            <div className="flex justify-between">
              <span className="text-[#e5e2e1]-variant font-label-sm">Payment</span>
              <span className={`font-label-md uppercase tracking-wider ${tx.payment_method === 'qris' ? 'text-secondary' : 'text-primary'}`}>
                {tx.payment_method === 'qris' ? 'QRIS' : 'CASH'}
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-[#869486]-variant/10 pt-lg mt-lg">
          <div className="flex justify-between items-center">
            <span className="font-headline-md">Total</span>
            <span className="font-headline-lg text-primary">Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {tx.status === 'aktif' && (
          <div className="mt-lg p-4 bg-secondary/10 rounded-xl">
            <p className="font-label-md text-secondary">Payment pending</p>
          </div>
        )}

        <button
          onClick={() => window.print()}
          className="mt-lg w-full py-4 bg-primary text-on-primary font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">print</span>
          Print Receipt
        </button>
      </div>
    </div>
  );
}
