import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, formatPriceCents } from "../../services/api";
import { logoutAdmin } from "../../utils/adminAuth";

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSummary() {
      try {
        const response = await api.get("/admin/dashboard/summary");
        setSummary(response.data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard summary.");
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-white text-black lg:ml-64">
      <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between border-b-2 border-black bg-white px-5 py-4 lg:left-64 lg:px-8">
        <h1 className="text-xl font-black uppercase tracking-tight">Dashboard</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs font-black uppercase tracking-widest hover:opacity-60"
        >
          Logout
        </button>
      </header>

      <div className="px-5 pb-32 pt-24 lg:px-12 lg:pb-16">
        {loading && (
          <p className="text-xs font-black uppercase tracking-widest">Loading summary...</p>
        )}

        {error && (
          <p className="text-xs font-black uppercase tracking-widest text-red-600">{error}</p>
        )}

        {summary && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border-2 border-black p-6">
              <p className="text-xs font-black uppercase tracking-widest text-black/50">Total Products</p>
              <p className="mt-2 text-4xl font-black">{summary.totalProducts}</p>
            </div>
            <div className="border-2 border-black p-6">
              <p className="text-xs font-black uppercase tracking-widest text-black/50">Active Products</p>
              <p className="mt-2 text-4xl font-black">{summary.activeProducts}</p>
            </div>
            <div className="border-2 border-black p-6">
              <p className="text-xs font-black uppercase tracking-widest text-black/50">Low Stock</p>
              <p className="mt-2 text-4xl font-black">{summary.lowStockProducts}</p>
            </div>
            <div className="border-2 border-black p-6">
              <p className="text-xs font-black uppercase tracking-widest text-black/50">Pending Orders</p>
              <p className="mt-2 text-4xl font-black">{summary.pendingOrders}</p>
            </div>
            <div className="border-2 border-black p-6">
              <p className="text-xs font-black uppercase tracking-widest text-black/50">Revenue Today</p>
              <p className="mt-2 text-4xl font-black">{formatPriceCents(summary.revenueToday)}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
