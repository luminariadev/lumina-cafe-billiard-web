"use client";

import { useEffect, useState } from "react";

interface AnalyticsData {
  peak_hours: { hour: number; count: number }[];
  daily_trend: { date: string; revenue: number }[];
  top_categories: { name: string; revenue: number }[];
}

const rupiah = (n: number) =>
  "Rp " + (n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 });

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/v1/reports/analytics", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized atau error");
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20 bg-[#131313] min-h-screen">
        <span className="material-symbols-outlined text-green-400 text-5xl animate-pulse">bar_chart</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#131313] flex items-center justify-center">
        <div className="glass-card rounded-xl p-8 text-center max-w-sm">
          <span className="material-symbols-outlined text-5xl text-red-400 mb-4">error</span>
          <p className="text-gray-300">{error}</p>
          <p className="text-sm text-gray-500 mt-2">Login sebagai admin untuk melihat analytics.</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const maxPeak = Math.max(...(data.peak_hours?.map((p) => p.count) || [1]));
  const maxRevenue = Math.max(...(data.daily_trend?.map((d) => d.revenue) || [1]));
  const maxCat = Math.max(...(data.top_categories?.map((c) => c.revenue) || [1]));

  return (
    <div className="min-h-screen bg-[#131313] text-gray-200 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold font-[Montserrat] text-gray-200">Analytics Dashboard</h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Peak hours, tren penjualan & kategori terlaris</p>
        </div>

        {/* Peak Hours */}
        <div className="glass-card rounded-xl p-4 sm:p-6 bg-gray-900/80 border border-gray-800">
          <h4 className="text-base sm:text-lg font-semibold font-[Montserrat] text-gray-200 mb-4">
            ⏰ Jam Sibuk (7 hari terakhir)
          </h4>
          <div className="flex items-end gap-1 sm:gap-2 h-40">
            {(data.peak_hours || []).map((p) => (
              <div key={p.hour} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-gray-400">{p.count}</span>
                <div
                  className="w-full rounded-t bg-gradient-to-t from-green-600 to-green-400"
                  style={{ height: `${Math.max((p.count / maxPeak) * 100, 4)}%` }}
                />
                <span className="text-[10px] text-gray-500">{p.hour}:00</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Trend */}
        <div className="glass-card rounded-xl p-4 sm:p-6 bg-gray-900/80 border border-gray-800">
          <h4 className="text-base sm:text-lg font-semibold font-[Montserrat] text-gray-200 mb-4">
            📈 Tren Harian (14 hari terakhir)
          </h4>
          <div className="flex items-end gap-1 sm:gap-2 h-40">
            {(data.daily_trend || []).map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-gray-500 truncate max-w-full">
                  {String(d.date).slice(8, 10)}/{String(d.date).slice(5, 7)}
                </span>
                <div
                  className="w-full rounded-t bg-gradient-to-t from-blue-600 to-blue-400"
                  style={{ height: `${Math.max((d.revenue / maxRevenue) * 100, 4)}%` }}
                  title={`${d.date}: ${rupiah(d.revenue)}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="glass-card rounded-xl p-4 sm:p-6 bg-gray-900/80 border border-gray-800">
          <h4 className="text-base sm:text-lg font-semibold font-[Montserrat] text-gray-200 mb-4">
            🏆 Kategori Terlaris (30 hari terakhir)
          </h4>
          <div className="space-y-3">
            {(data.top_categories || []).map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{c.name}</span>
                  <span className="text-green-400 font-semibold">{rupiah(c.revenue)}</span>
                </div>
                <div className="h-3 rounded-full bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-600 to-green-400"
                    style={{ width: `${Math.max((c.revenue / maxCat) * 100, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
