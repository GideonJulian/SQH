import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronLeft, ChevronRight, Search, Settings } from "lucide-react";
import { api } from "../../services/api";

const PAGE_LIMIT = 7;

const STATUS_FILTERS = [
  { label: "All Orders", value: "all" },
  { label: "Pending Payment", value: "pending_payment" },
  { label: "Paid", value: "paid" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];
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

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).toUpperCase();
  return new Intl.DateTimeFormat("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();
}

function formatAmount(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(value ?? 0);
}

function normalizeOrder(order) {
  const status = (order.status || "pending").replace(/_/g, " ").toUpperCase();
  const filledStatuses = ["COMPLETED", "DELIVERED", "DISPATCHED", "FULFILLED", "PAID", "SHIPPED"];

  return {
    id: order.orderNumber || order.number || order.id || "N/A",
    rawId: order.id,
    customer: order.customerName || order.customer?.name || "Unknown Customer",
    date: formatDate(order.createdAt || order.date || order.updatedAt),
    status,
    amount: formatAmount(order.total ?? order.amount ?? 0),
    filled: filledStatuses.includes(status),
  };
}

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_LIMIT),
        });
        if (activeStatus !== "all") {
          params.set("status", activeStatus);
        }

        const response = await api.get(`/admin/orders?${params.toString()}`);
        const payload = getResponsePayload(response);

        setOrders(getCollection(payload).map(normalizeOrder));
        setTotalPages(payload?.pagination?.totalPages || 1);
        setTotalEntries(payload?.pagination?.total || 0);
      } catch (err) {
        setError(err.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [activeStatus, page]);

  const handleStatusFilter = (status) => {
    setActiveStatus(status);
    setPage(1);
  };

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between border-b-2 border-black bg-white px-5 py-4 lg:left-64 lg:px-8">
        <div className="lg:hidden">
          <span className="text-xl font-black italic uppercase tracking-tight">
            SQH Admin
          </span>
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-black/40">
            Order Management /
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-black">
            All Orders
          </span>
        </div>

        <div className="flex items-center gap-5">
          <button aria-label="Notifications" className="hover:opacity-60" type="button">
            <Bell size={22} />
          </button>
          <button aria-label="Settings" className="hover:opacity-60" type="button">
            <Settings size={22} />
          </button>
        </div>
      </header>

      <main className="px-5 pb-32 pt-24 lg:ml-64 lg:px-12 lg:pb-16">
        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 border-b-4 border-black pb-4 lg:flex-row lg:items-end">
          <div className="relative">
            <span className="pointer-events-none absolute -left-4 -top-12 hidden select-none text-[120px] font-black uppercase leading-none text-black/[0.03] lg:block">
              Orders
            </span>
            <h1 className="relative z-10 text-4xl font-black uppercase leading-none tracking-tight md:text-6xl lg:text-7xl">
              Your Orders
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => {
              const isActive = activeStatus === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => handleStatusFilter(filter.value)}
                  className={`border-2 border-black px-6 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                    isActive
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-black hover:text-white"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading && (
          <p className="text-xs font-black uppercase tracking-widest">Loading orders...</p>
        )}

        {error && (
          <p className="text-xs font-black uppercase tracking-widest text-red-600">{error}</p>
        )}

        {!loading && !error && (
          <>
            {/* Table */}
            <div className="border-2 border-black bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] border-collapse text-left">
                  <thead>
                    <tr className="bg-black text-white">
                      <th className="border-r border-white/20 p-4 text-xs font-black uppercase tracking-widest">
                        Order ID
                      </th>
                      <th className="border-r border-white/20 p-4 text-xs font-black uppercase tracking-widest">
                        Date
                      </th>
                      <th className="border-r border-white/20 p-4 text-xs font-black uppercase tracking-widest">
                        Customer
                      </th>
                      <th className="border-r border-white/20 p-4 text-xs font-black uppercase tracking-widest">
                        Status
                      </th>
                      <th className="p-4 text-right text-xs font-black uppercase tracking-widest">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <tr
                          key={order.rawId}
                          onClick={() => navigate(`/admin/orders/${order.rawId}`)}
                          className="cursor-pointer border-b-2 border-black transition-all hover:bg-black/[0.03]"
                        >
                          <td className="border-r border-black p-4 font-mono text-sm font-black">
                            #{order.id}
                          </td>
                          <td className="border-r border-black p-4 text-sm font-bold uppercase">
                            {order.date}
                          </td>
                          <td className="border-r border-black p-4 text-sm font-semibold uppercase">
                            {order.customer}
                          </td>
                          <td className="border-r border-black p-4">
                            <span
                              className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-tight ${
                                order.filled
                                  ? "bg-black text-white"
                                  : "border-2 border-black bg-white text-black"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 text-right font-mono text-sm font-black">
                            {order.amount}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-10 text-center text-xs font-black uppercase tracking-widest text-black/50"
                        >
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-8 flex flex-col items-center justify-between gap-6 md:flex-row">
              {/* <div className="flex items-center gap-4">
                <span className="text-xs font-black uppercase tracking-widest text-black/50">
                  Showing {orders.length} of {totalEntries} entries
                </span>
                <div className="h-px w-24 bg-black" />
              </div> */}

              <div className="flex border-2 border-black">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="border-r-2 border-black p-4 transition-all hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>

                {pageNumbers.map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPage(num)}
                    className={`border-l-2 border-black px-6 py-4 text-xs font-black uppercase tracking-widest first:border-l-0 ${
                      page === num
                        ? "bg-black text-white"
                        : "hover:bg-black hover:text-white"
                    }`}
                  >
                    {String(num).padStart(2, "0")}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="border-l-2 border-black p-4 transition-all hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black"
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}