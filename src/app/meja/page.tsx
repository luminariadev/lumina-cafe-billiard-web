'use client';

import { useState, useEffect } from 'react';
import { getMejas, Meja, updateMejaStatus } from '@/lib/api';

export default function MejaPage() {
  const [mejas, setMejas] = useState<Meja[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeja, setSelectedMeja] = useState<Meja | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getMejas().then(setMejas).catch(console.error).finally(() => setLoading(false));
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

  if (loading) return <div className="flex justify-center py-20"><span className="material-symbols-outlined text-green-400 text-5xl animate-pulse">sports_bar</span></div>;

  const activeCount = mejas.filter(m => m.status === 'dipakai').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold font-[Montserrat] text-gray-200">Billiard Tables</h2>
          <div className="flex items-center gap-4 mt-1">
            <span className="flex items-center gap-1.5 text-sm text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> {activeCount} Active
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-400">
              <span className="w-2 h-2 rounded-full bg-gray-600"></span> {mejas.length - activeCount} Available
            </span>
          </div>
        </div>
        <button className="bg-green-400 text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-green-400/20 hover:brightness-110">
          <span className="material-symbols-outlined">add</span> NEW SESSION
        </button>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mejas.map((meja) => (
          <MejaCard key={meja.id} meja={meja} onStart={handleStartSession} onStop={handleStopSession} />
        ))}
      </div>

      {/* Setup Modal */}
      {showModal && selectedMeja && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="glass-card w-full max-w-lg p-8 rounded-3xl relative z-10 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold font-[Montserrat] text-green-400">TABLE SETUP</h2>
                <p className="text-sm text-gray-400">Configure current play session</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1.5">CUSTOMER NAME</label>
                <input className="w-full bg-[#0A0A0A] border border-gray-700/30 rounded-xl p-4 text-gray-200 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all outline-none" placeholder="Enter name..." type="text" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1.5">DURATION</label>
                  <select className="w-full bg-[#0A0A0A] border border-gray-700/30 rounded-xl p-4 text-gray-200 focus:ring-green-400 outline-none">
                    <option>30 Minutes</option>
                    <option selected>1 Hour</option>
                    <option>2 Hours</option>
                    <option>3 Hours</option>
                    <option>Unlimited (Manual Stop)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1.5">RATE</label>
                  <div className="w-full bg-[#0A0A0A]/50 border border-gray-700/10 rounded-xl p-4 text-gray-200 font-bold">50,000 / hr</div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-800 flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-700/30 text-gray-200 font-bold py-3 rounded-2xl hover:bg-gray-800 transition-all">CANCEL</button>
                <button onClick={() => setShowModal(false)} className="flex-[2] bg-green-400 text-black font-bold py-3 rounded-2xl shadow-lg shadow-green-400/20 active:scale-95 transition-all">START PLAY</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MejaCard({ meja, onStart, onStop }: { meja: Meja; onStart: (m: Meja) => void; onStop: (m: Meja) => void }) {
  const isActive = meja.status === 'dipakai';
  const isBooked = meja.status === 'maintenance';

  if (isActive) {
    return (
      <div className="glass-card p-6 rounded-2xl border border-green-400/20 shadow-[0_0_20px_0_rgba(107,251,154,0.15)]">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-green-400/10 text-green-400 font-bold px-3 py-1 rounded-lg text-sm">TABLE {String(meja.nomor_meja).padStart(2, '0')}</div>
          <span className="material-symbols-outlined text-green-400" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
        </div>
        <div className="space-y-2 mb-4">
          <h4 className="text-xl font-semibold font-[Montserrat] text-gray-200">{meja.keterangan || 'Customer'}</h4>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-gray-500 text-[10px] uppercase tracking-wider">Remaining</span>
              <p className="text-[28px] font-bold text-green-400 leading-none mt-0.5">00:42:15</p>
            </div>
            <div className="text-right">
              <span className="text-gray-500 text-[10px] uppercase tracking-wider">Charge</span>
              <p className="text-sm text-gray-200">50k / hr</p>
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden mb-4">
          <div className="bg-green-400 h-full rounded-full" style={{ width: '70%' }}></div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-gray-700 hover:bg-green-400/20 hover:text-green-400 text-gray-200 text-sm font-medium py-2 rounded-lg transition-colors">+ Order</button>
          <button onClick={() => onStop(meja)} className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-400 font-medium text-sm py-2 rounded-lg transition-colors">Stop</button>
        </div>
      </div>
    );
  }

  if (isBooked) {
    return (
      <div className="glass-card p-6 rounded-2xl border border-yellow-400/20 shadow-[0_0_20px_0_rgba(255,221,123,0.15)]">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-yellow-400/10 text-yellow-400 font-bold px-3 py-1 rounded-lg text-sm">TABLE {String(meja.nomor_meja).padStart(2, '0')}</div>
          <span className="material-symbols-outlined text-yellow-400">build</span>
        </div>
        <div className="space-y-2 mb-4">
          <h4 className="text-xl font-semibold font-[Montserrat] text-yellow-400">Maintenance</h4>
          <p className="text-sm text-gray-400">{meja.keterangan || 'Under maintenance'}</p>
        </div>
        <button disabled className="w-full border border-yellow-400 text-yellow-400 font-bold py-3 rounded-xl opacity-50 cursor-not-allowed">UNAVAILABLE</button>
      </div>
    );
  }

  // Available
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-green-400/40 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-gray-800 text-gray-400 font-bold px-3 py-1 rounded-lg text-sm">TABLE {String(meja.nomor_meja).padStart(2, '0')}</div>
        <span className="material-symbols-outlined text-gray-500 group-hover:text-green-400 transition-colors">power_settings_new</span>
      </div>
      <div className="flex flex-col items-center justify-center py-6 space-y-3">
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-3xl text-gray-600">sports_bar</span>
        </div>
        <p className="text-sm text-gray-400">Ready for Play</p>
      </div>
      <button onClick={() => onStart(meja)} className="w-full bg-gray-800 text-gray-400 font-bold py-3 rounded-xl hover:bg-green-400 hover:text-black transition-all">START SESSION</button>
    </div>
  );
}