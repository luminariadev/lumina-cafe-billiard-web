'use client';

import { useState, useEffect } from 'react';
import { getMejas, Meja, updateMejaStatus, getTransaksis, Transaksi } from '@/lib/api';

export default function MejaPage() {
  const [mejas, setMejas] = useState<Meja[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeja, setSelectedMeja] = useState<Meja | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getMejas()
      .then(setMejas)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStartSession = async (meja: Meja) => {
    setSelectedMeja(meja);
    setShowModal(true);
  };

  const handleStopSession = async (meja: Meja) => {
    try {
      await updateMejaStatus(meja.id, 'tersedia');
      setMejas(mejas.map(m => m.id === meja.id ? { ...m, status: 'tersedia' } : m));
    } catch (err) {
      console.error('Failed to stop session', err);
    }
  };

  if (loading) return <div className="flex justify-center"><span className="material-symbols-outlined text-primary text-6xl animate-pulse">sports_bar</span></div>;

  const activeCount = mejas.filter(m => m.status === 'dipakai').length;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-lg">
        <div className="flex flex-col">
          <h3 className="font-headline-md text-on-surface">Table Grid</h3>
          <div className="flex items-center gap-md mt-xs">
            <span className="flex items-center gap-xs font-label-sm text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> {activeCount} Active
            </span>
            <span className="flex items-center gap-xs font-label-sm text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-surface-variant"></span> {mejas.length - activeCount} Available
            </span>
          </div>
        </div>
        <button className="bg-primary text-on-primary font-bold px-lg py-md rounded-xl flex items-center gap-sm active:scale-95 transition-all shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined">add</span> NEW SESSION
        </button>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
        {mejas.map((meja) => (
          <MejaCard key={meja.id} meja={meja} onStart={handleStartSession} onStop={handleStopSession} />
        ))}
      </div>

      {/* Setup Modal */}
      {showModal && selectedMeja && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="glass-card w-full max-w-lg p-xl rounded-3xl relative z-10 scale-95 transition-transform duration-300">
            <div className="flex justify-between items-center mb-xl">
              <div>
                <h2 className="font-headline-lg text-primary">TABLE SETUP</h2>
                <p className="text-on-surface-variant font-body-md">Configure current play session</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-xl">
              <div className="space-y-sm">
                <label className="font-label-md text-on-surface-variant ml-xs">CUSTOMER NAME</label>
                <input className="w-full bg-[#0A0A0A] border border-outline-variant/30 rounded-xl p-md text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholder="Enter name..." type="text" />
              </div>
              <div className="grid grid-cols-2 gap-lg">
                <div className="space-y-sm">
                  <label className="font-label-md text-on-surface-variant ml-xs">DURATION</label>
                  <select className="w-full bg-[#0A0A0A] border border-outline-variant/30 rounded-xl p-md text-on-surface focus:ring-primary outline-none">
                    <option>30 Minutes</option>
                    <option selected>1 Hour</option>
                    <option>2 Hours</option>
                    <option>3 Hours</option>
                    <option>Unlimited (Manual Stop)</option>
                  </select>
                </div>
                <div className="space-y-sm">
                  <label className="font-label-md text-on-surface-variant ml-xs">RATE</label>
                  <div className="w-full bg-[#0A0A0A]/50 border border-outline-variant/10 rounded-xl p-md text-on-surface font-bold">
                    50,000 / hr
                  </div>
                </div>
              </div>
              <div className="pt-lg border-t border-outline-variant/10 flex gap-md">
                <button onClick={() => setShowModal(false)} className="flex-1 border border-outline-variant/30 text-on-surface font-bold py-lg rounded-2xl hover:bg-surface-container transition-all">CANCEL</button>
                <button onClick={() => setShowModal(false)} className="flex-[2] bg-primary text-on-primary font-bold py-lg rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all">START PLAY</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MejaCard({ meja, onStart, onStop }: { meja: Meja; onStart: (m: Meja) => void; onStop: (m: Meja) => void }) {
  const isActive = meja.status === 'dipakai';
  const isBooked = meja.status === 'maintenance';

  if (isActive) {
    return (
      <div className="glass-card p-lg rounded-2xl border-primary/20 active-glow relative group">
        <div className="flex justify-between items-start mb-md">
          <div className="bg-primary/10 text-primary font-bold px-md py-xs rounded-lg font-label-md">TABLE {String(meja.nomor_meja).padStart(2, '0')}</div>
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
        </div>
        <div className="space-y-sm mb-lg">
          <h4 className="font-headline-lg-mobile text-on-surface">{meja.keterangan || 'Customer'}</h4>
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-on-surface-variant text-[10px] uppercase tracking-wider">Remaining</span>
              <span className="font-display-lg text-[28px] text-primary leading-none">00:42:15</span>
            </div>
            <div className="text-right">
              <span className="text-on-surface-variant text-[10px] uppercase tracking-wider">Charge</span>
              <span className="block font-label-md text-on-surface">50k / hr</span>
            </div>
          </div>
        </div>
        <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden mb-md">
          <div className="bg-primary h-full rounded-full" style={{ width: '70%' }}></div>
        </div>
        <div className="flex gap-sm">
          <button className="flex-1 bg-surface-container-highest hover:bg-primary/20 hover:text-primary text-on-surface font-label-md py-sm rounded-lg transition-colors">+ Order</button>
          <button onClick={() => onStop(meja)} className="flex-1 bg-error-container hover:bg-error text-on-error font-label-md py-sm rounded-lg transition-colors">Stop</button>
        </div>
      </div>
    );
  }

  if (isBooked) {
    return (
      <div className="glass-card p-lg rounded-2xl border-tertiary/20 booked-glow relative group">
        <div className="flex justify-between items-start mb-md">
          <div className="bg-tertiary/10 text-tertiary font-bold px-md py-xs rounded-lg font-label-md">TABLE {String(meja.nomor_meja).padStart(2, '0')}</div>
          <span className="material-symbols-outlined text-tertiary">build</span>
        </div>
        <div className="space-y-sm mb-lg">
          <h4 className="font-headline-lg-mobile text-tertiary">Maintenance</h4>
          <p className="text-on-surface-variant font-body-md">{meja.keterangan || 'Under maintenance'}</p>
        </div>
        <button disabled className="w-full border border-tertiary text-tertiary font-bold py-md rounded-xl opacity-50 cursor-not-allowed">UNAVAILABLE</button>
      </div>
    );
  }

  // Available
  return (
    <div className="bg-surface-container-low border border-outline-variant/10 p-lg rounded-2xl hover:border-primary/40 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-md">
        <div className="bg-surface-container-highest text-on-surface-variant font-bold px-md py-xs rounded-lg font-label-md">TABLE {String(meja.nomor_meja).padStart(2, '0')}</div>
        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">power_settings_new</span>
      </div>
      <div className="flex flex-col items-center justify-center py-xl space-y-md">
        <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-[32px] text-on-surface-variant/30">sports_bar</span>
        </div>
        <p className="font-label-md text-on-surface-variant">Ready for Play</p>
      </div>
      <button onClick={() => onStart(meja)} className="w-full bg-surface-container-highest text-on-surface-variant font-bold py-md rounded-xl hover:bg-primary hover:text-on-primary transition-all">START SESSION</button>
    </div>
  );
}
