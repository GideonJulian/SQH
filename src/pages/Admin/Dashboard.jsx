import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Grid2X2,
  Menu,
  Package,
  Plus,
  Search,
  ShoppingCart,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { api, formatPriceCents } from "../../services/api";
import { logoutAdmin } from "../../utils/adminAuth";

function getResponsePayload(response) {
  return response?.data ?? response;
}

function getCollection(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.orders)) return payload.orders;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function formatOrderDate(value) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).toUpperCase();

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();
}

function formatOrderAmount(order) {
  const centsValue =
    order.totalCents ??
    order.totalAmountCents ??
    order.amountCents ??
    order.grandTotalCents;

  if (typeof centsValue === "number") {
    return formatPriceCents(centsValue);
  }

  const value = order.total ?? order.amount ?? order.grandTotal;
  if (typeof value === "string") return value;

  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: order.currency || "USD",
    }).format(value);
  }

  return "N/A";
}

function normalizeOrder(order) {
  const status = order.status || "pending";
  const normalizedStatus = status.replace(/_/g, " ").toUpperCase();
  const filledStatuses = ["COMPLETED", "DELIVERED", "DISPATCHED", "FULFILLED", "PAID", "SHIPPED"];

  return {
    id: order.orderNumber || order.number || order.id || "N/A",
    customer: order.customerName || order.customer?.name || "Unknown Customer",
    email: order.customerEmail || order.customer?.email || "No email",
    date: formatOrderDate(order.createdAt || order.date || order.updatedAt),
    status: normalizedStatus,
    amount: formatOrderAmount(order),
    filled: filledStatuses.includes(normalizedStatus),
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [summaryResponse, ordersResponse] = await Promise.all([
          api.get("/admin/dashboard/summary"),
          api.get("/admin/orders?limit=5"),
        ]);

        setSummary(getResponsePayload(summaryResponse));
        setRecentOrders(getCollection(getResponsePayload(ordersResponse)).map(normalizeOrder));
      } catch (err) {
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  const mobileNavItems = [
    { label: "Dashboard", icon: Grid2X2, path: "/admin/dashboard", active: true },
    { label: "Products", icon: Package, path: "/admin" },
    { label: "Orders", icon: ShoppingCart, path: "/admin/orders" },
    { label: "Heroes", icon: Users, path: "/admin/customers" },
  ];

  const mobileOrders = recentOrders.slice(0, 4);

  return (
    <main className="min-h-screen bg-white text-black lg:ml-64 lg:pt-24">
      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b-2 border-black bg-white px-4 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center text-black"
          >
            <Menu size={24} strokeWidth={2.4} />
          </button>
          <span className="text-xl font-black italic uppercase tracking-tight">SQH Admin</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center text-black"
          >
            <Search size={22} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center text-black"
          >
            <Bell size={22} strokeWidth={2.4} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-black" />
          </button>
        </div>
      </header>

      <aside
        className={`fixed inset-0 z-[60] transition-transform duration-300 lg:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 h-full w-full bg-black/40 backdrop-blur-sm"
        />
        <div className="relative flex h-full w-64 flex-col border-r-2 border-black bg-white">
          <div className="flex items-center justify-between border-b-2 border-black p-6">
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tight">SQH Admin</h2>
              <p className="mt-1 text-[10px] font-black uppercase tracking-tight text-black/40">
                Performance Command
              </p>
            </div>
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMenuOpen(false)}
              className="flex h-9 w-9 items-center justify-center"
            >
              <X size={22} strokeWidth={2.4} />
            </button>
          </div>

          <nav className="flex-grow overflow-y-auto py-4">
            {mobileNavItems.slice(0, 4).map(({ label, icon: Icon, path, active }) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate(path);
                }}
                className={`flex w-full items-center gap-4 px-6 py-4 text-left text-sm font-black uppercase tracking-tight ${
                  active ? "bg-black text-white" : "text-black/50 hover:bg-black/5"
                }`}
              >
                <Icon size={22} strokeWidth={2.4} />
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-auto border-t-2 border-black p-6">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                navigate("/admin/upload");
              }}
              className="flex w-full items-center justify-center gap-2 bg-black py-4 text-xs font-black uppercase tracking-widest text-white"
            >
              <Plus size={16} strokeWidth={2.4} />
              New Product
            </button>
          </div>
        </div>
      </aside>

      <header className="fixed top-0 right-0 left-0 z-40 hidden items-center justify-between border-b-2 border-black bg-white px-5 py-4 lg:left-64 lg:flex lg:px-8">
        <h1 className="text-xl font-black uppercase tracking-tight">Dashboard</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs font-black uppercase tracking-widest hover:opacity-60"
        >
          Logout
        </button>
      </header>

      <div className="px-4 pb-28 pt-16 lg:hidden">
        <section className="py-8">
          <p className="text-xs font-black uppercase tracking-widest text-black/40">
            Operational Status: Active
          </p>
          <h1 className="mt-1 text-[42px] font-black uppercase leading-none tracking-tight">
            Command Center
          </h1>
        </section>

        {loading && (
          <p className="mb-8 text-xs font-black uppercase tracking-widest">Loading summary...</p>
        )}

        {error && (
          <p className="mb-8 text-xs font-black uppercase tracking-widest text-red-600">{error}</p>
        )}

        {summary && (
          <>
            <section className="mb-8 grid grid-cols-1 gap-4">
              <div className="relative overflow-hidden border-2 border-black bg-white p-6">
                <TrendingUp
                  className="absolute -bottom-4 -right-4 text-black/10"
                  size={104}
                  strokeWidth={2.2}
                />
                <p className="mb-1 text-xs font-black uppercase tracking-widest text-black/50">
                  Total Sales
                </p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-[44px] font-black leading-none tracking-tight">
                    {formatPriceCents(summary.revenueToday)}
                  </h2>
                  <span className="text-xs font-black uppercase text-green-600">Today</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative overflow-hidden bg-black p-6 text-white">
                  <p className="mb-1 text-xs font-black uppercase tracking-widest text-white/50">
                    Active Products
                  </p>
                  <h2 className="text-[42px] font-black leading-none tracking-tight">
                    {summary.activeProducts}
                  </h2>
                  <div className="absolute bottom-0 right-0 top-0 w-1 bg-white/20" />
                </div>
                <div className="relative overflow-hidden border-2 border-black bg-white p-6">
                  <p className="mb-1 text-xs font-black uppercase tracking-widest text-black/50">
                    Low Stock
                  </p>
                  <h2 className="text-[42px] font-black leading-none tracking-tight">
                    {summary.lowStockProducts}
                  </h2>
                </div>
              </div>
            </section>

          

            <section className="mb-8">
              <div className="mb-6 flex items-end justify-between gap-4">
                <h3 className="text-[30px] font-black uppercase leading-none tracking-tight">
                  Recent Orders
                </h3>
                <button
                  type="button"
                  onClick={() => navigate("/admin/orders")}
                  className="border-b-2 border-black pb-1 text-xs font-black uppercase tracking-widest"
                >
                  View All
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {mobileOrders.length > 0 ? (
                  mobileOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between gap-4 border-2 border-black bg-white p-4 active:scale-[0.98] active:bg-black active:text-white"
                    >
                      <div className="min-w-0">
                        <span className="block truncate text-xs font-bold uppercase text-black/40">
                          {order.id}
                        </span>
                        <span className="mt-1 block truncate text-lg font-black uppercase">
                          {order.customer}
                        </span>
                      </div>
                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-flex px-2 py-0.5 text-[10px] font-black uppercase ${
                            order.filled
                              ? "bg-black text-white"
                              : "border-2 border-black bg-white text-black"
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="mt-1 block text-sm font-black">{order.amount}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border-2 border-black bg-white p-6">
                    <p className="text-xs font-black uppercase tracking-widest text-black/50">
                      No recent orders
                    </p>
                  </div>
                )}
              </div>
            </section>

          
          </>
        )}
      </div>

      {/* <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t-2 border-black bg-white px-4 lg:hidden">
        {mobileNavItems.map(({ label, icon: Icon, path, active }) => (
          <button
            key={label}
            type="button"
            onClick={() => navigate(path)}
            className={`flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-1 ${
              active ? "text-black" : "text-black/40"
            }`}
          >
            <Icon size={22} strokeWidth={active ? 3 : 2.4} />
            <span className="max-w-full truncate text-[10px] font-black uppercase">{label}</span>
          </button>
        ))}
        <button
          type="button"
          aria-label="Add product"
          onClick={() => navigate("/admin/upload")}
          className="absolute left-1/2 top-0 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black text-white shadow-2xl"
        >
          <Plus size={30} strokeWidth={2.4} />
        </button>
      </nav> */}

      <div className="mx-auto hidden max-w-[1440px] px-12 py-12 lg:block">
        {loading && (
          <p className="text-xs font-black uppercase tracking-widest">Loading summary...</p>
        )}

        {error && (
          <p className="text-xs font-black uppercase tracking-widest text-red-600">{error}</p>
        )}

        {summary && (
          <>
            <section className="mb-16">
              <div className="mb-8 flex items-baseline justify-between">
                <h2 className="font-display-xl text-5xl font-black uppercase leading-none text-black">
                  Performance Overview
                </h2>
                <span className="text-xs font-black uppercase tracking-widest text-black/40">
                  Real-time telemetry
                </span>
              </div>

              <div className="grid grid-cols-3 border-2 border-black">
                <div className="border-r-2 border-black bg-white p-10">
                  <p className="mb-4 text-xs font-black uppercase tracking-widest text-black/50">
                    Total Sales
                  </p>
                  <p className="font-display-xl text-6xl font-black leading-none text-black">
                    {formatPriceCents(summary.revenueToday)}
                  </p>
                  <p className="mt-4 flex items-center gap-1 text-sm font-bold uppercase text-black">
                    <span className="material-symbols-outlined text-sm">trending_up</span>
                    Revenue captured today
                  </p>
                </div>

                <div className="border-r-2 border-black bg-white p-10">
                  <p className="mb-4 text-xs font-black uppercase tracking-widest text-black/50">
                    Active Products
                  </p>
                  <p className="font-display-xl text-6xl font-black leading-none text-black">
                    {summary.activeProducts}
                  </p>
                  <p className="mt-4 flex items-center gap-1 text-sm font-bold uppercase text-black">
                    <span className="material-symbols-outlined text-sm">bolt</span>
                    Catalog deployment live
                  </p>
                </div>

                <div className="bg-white p-10">
                  <p className="mb-4 text-xs font-black uppercase tracking-widest text-black/50">
                    Total Products
                  </p>
                  <p className="font-display-xl text-6xl font-black leading-none text-black">
                    {summary.totalProducts}
                  </p>
                  <p className="mt-4 flex items-center gap-1 text-sm font-bold uppercase text-black">
                    <span className="material-symbols-outlined text-sm">inventory_2</span>
                    {summary.lowStockProducts} low stock signals
                  </p>
                </div>
              </div>
            </section>

            {/* <section className="mb-16 overflow-hidden">
              <div className="relative h-[400px] w-full bg-black">
                <img
                  alt="Athlete training in a high-contrast industrial gym"
                  className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-luminosity"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcMBQhm47mLVDVuIBhD_8BfMSqcu5UMccXQ-XPjHlgY6N7IZmO2L_xwcuL7aZ-EUabAdY9tkIQFLbEpqnjllcYC1tUVXJ1tA2lG_9QpPj-W0Y08GsnhglqBQP1Zk78MvAup-C6Cb2N2ej3SYLu7_YOxadxJV1s5HOrXEKRxQ4dtZ6gpnewMTjrk9iBXLCOVP_O000nPAbrGItM2nSaDUJIj9tPo_MQAqIIm7GgcqGWvZbG_WRdGT27Vm-ZrQThP6VLB1j8G8LDKm8"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-12">
                  <div className="max-w-2xl">
                    <p className="font-display-xl mb-4 text-6xl font-black uppercase leading-none text-white">
                      Quest No. 084
                    </p>
                    <p className="max-w-lg text-lg font-medium leading-7 text-white/80">
                      The elite performance cycle is now active. {summary.pendingOrders} pending
                      orders are synchronized with the central performance grid.
                    </p>
                  </div>
                </div>
              </div>
            </section> */}

            <section>
              <div className="mb-8 flex items-center justify-between">
                <h2 className="font-display-xl text-4xl font-black uppercase leading-none text-black">
                  Recent Orders
                </h2>
                <button
                  className="border-b-2 border-black px-2 py-1 text-xs font-black uppercase tracking-widest transition-colors hover:bg-black hover:text-white"
                  onClick={() => navigate("/admin/orders")}
                  type="button"
                >
                  View All
                </button>
              </div>

              <div className="overflow-hidden border-2 border-black bg-white">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">
                        Order ID
                      </th>
                      <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">
                        Customer
                      </th>
                      <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">
                        Date
                      </th>
                      <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">
                        Status
                      </th>
                      <th className="px-8 py-6 text-right text-xs font-black uppercase tracking-widest">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <tr key={order.id} className="cursor-default hover:bg-black/[0.03]">
                          <td className="px-8 py-6 font-mono text-sm font-black">
                            {order.id}
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="font-black uppercase text-black">
                                {order.customer}
                              </span>
                              <span className="text-xs text-black/50">{order.email}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-sm font-bold uppercase">{order.date}</td>
                          <td className="px-8 py-6">
                            <span
                              className={`px-3 py-1 text-[10px] font-black uppercase tracking-tight ${
                                order.filled
                                  ? "bg-black text-white"
                                  : "border border-black bg-white text-black"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right font-mono text-sm font-black">
                            {order.amount}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          className="px-8 py-10 text-center text-xs font-black uppercase tracking-widest text-black/50"
                          colSpan={5}
                        >
                          No recent orders
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>

      <footer className="hidden p-12 opacity-10 pointer-events-none select-none lg:block">
        <h2 className="font-display-xl text-[120px] font-black italic uppercase leading-none text-black">
          Side Quest Heroes
        </h2>
      </footer>
    </main>
  );
}
