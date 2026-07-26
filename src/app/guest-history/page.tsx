"use client";

import { useState } from "react";
import { getGuestHistory, GuestHistoryItem } from "@/lib/api";

export default function GuestHistoryPage() {
  const [phone, setPhone] = useState("");
  const [data, setData] = useState<GuestHistoryItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (!phone.trim() || phone.trim().length < 8) {
      setError("Masukkan nomor HP minimal 8 digit");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await getGuestHistory(phone.trim());
      setData(res);
    } catch (e: any) {
      setError(e.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, color: "#fff" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>Riwayat Transaksi</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="tel"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setError(""); }}
          placeholder="Masukkan No. HP..."
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(30,30,30,0.8)",
            color: "#fff",
            fontSize: 16,
            outline: "none",
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            padding: "12px 24px",
            borderRadius: 12,
            border: "none",
            background: "#6bfb9a",
            color: "#131313",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "..." : "Cari"}
        </button>
      </div>

      {error && <p style={{ color: "#ff4444", marginBottom: 8 }}>{error}</p>}

      {data && data.length === 0 && (
        <p style={{ color: "rgba(255,255,255,0.6)", textAlign: "center", marginTop: 40 }}>
          Tidak ada transaksi ditemukan
        </p>
      )}

      {data && data.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {data.map((item) => (
            <div
              key={item.id}
              style={{
                background: "rgba(30,30,30,0.8)",
                borderRadius: 12,
                padding: 16,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#6bfb9a", fontWeight: 600, fontSize: 14 }}>{item.kode_transaksi}</span>
                <span
                  style={{
                    background: item.status === "dibayar" ? "#1b5e20" : "#e65100",
                    color: "#fff",
                    padding: "2px 8px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {item.status}
                </span>
              </div>
              <p style={{ color: "#fff", fontSize: 16, fontWeight: 500 }}>{item.customer_name}</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
                {item.transaksi_type === "billiard" ? "🎱 Billiard" : "☕ Cafe"}
              </p>
              <p style={{ color: "#fff", fontSize: 18, fontWeight: "bold", marginTop: 4 }}>
                Rp {item.total_amount.toLocaleString("id-ID")}
              </p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 4 }}>
                {new Date(item.jam_mulai).toLocaleDateString("id-ID")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
