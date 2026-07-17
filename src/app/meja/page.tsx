'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getMejas, updateMejaStatus, Meja } from "@/lib/api";
import MejaGrid from "@/components/MejaGrid";

export default function MejaPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [meja, setMeja] = useState<Meja[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeja, setSelectedMeja] = useState<Meja | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    if (!authLoading && user?.role === "kasir_cafe") router.push("/dashboard");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) loadMeja();
  }, [user]);

  const loadMeja = async () => {
    try {
      setMeja(await getMejas());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleStatusChange = async (status: string) => {
    if (!selectedMeja) return;
    try {
      await updateMejaStatus(selectedMeja.id, status);
      setSelectedMeja(null);
      loadMeja();
    } catch (e) {
      console.error(e);
    }
  };

  if (authLoading || loading) {
    return <div className="text-center py-20 text-6xl animate-pulse">🎱</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Manajemen Meja</h1>

      <MejaGrid meja={meja} onSelect={setSelectedMeja} selectedId={selectedMeja?.id} />

      {/* Status Change Modal */}
      {selectedMeja && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111d15] border border-[#2d5a27] rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-white mb-2">
              Meja {selectedMeja.nomor_meja}
            </h3>
            <p className="text-sm text-gray-400 mb-4">{selectedMeja.keterangan}</p>
            <p className="text-sm text-gray-300 mb-3">
              Status saat ini: <span className="text-amber-400">{selectedMeja.status}</span>
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleStatusChange("tersedia")}
                className="w-full py-2.5 bg-green-700 hover:bg-green-600 text-white rounded-xl transition-colors text-sm"
              >
                Set Tersedia
              </button>
              <button
                onClick={() => handleStatusChange("dipakai")}
                className="w-full py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-xl transition-colors text-sm"
              >
                Set Dipakai
              </button>
              <button
                onClick={() => handleStatusChange("maintenance")}
                className="w-full py-2.5 bg-yellow-700 hover:bg-yellow-600 text-white rounded-xl transition-colors text-sm"
              >
                Set Maintenance
              </button>
              <button
                onClick={() => setSelectedMeja(null)}
                className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors text-sm mt-2"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
