import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  MapPin,
  Receipt,
  ShoppingBag,
  User,
} from "lucide-react";
import { api } from "../../services/api";

const STATUS_OPTIONS = [
  "PENDING PAYMENT",
  "PROCESSING",
  "DISPATCHED",
  "SHIPPED",
  "DELIVERED",
  "ON HOLD",
  "CANCELLED",
];

function getResponsePayload(response) {
  return response?.data ?? response;
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

  return {
    id: order.orderNumber || order.number || order.id || "N/A",
    rawId: order.id,
    status,
    customer: {
      name: order.customerName || order.customer?.name || "Unknown Customer",
      email: order.customerEmail || order.customer?.email || "No email",
    },
    shipping: {
      line1: order.shippingAddress?.line1 || "N/A",
      city: order.shippingAddress?.city || "",
      postalCode: order.shippingAddress?.postalCode || "",
      country: order.shippingAddress?.country || "",
      carrier: order.paymentProvider || "STANDARD SHIPPING",
    },
    total: order.total ?? 0,
    subtotal: order.subtotal ?? 0,
    tax: order.tax ?? 0,
    shippingCost: order.shipping ?? 0,
    date: formatDate(order.createdAt),
    currency: order.currency || "NGN",
    items: (order.items || []).map((item, index) => ({
      id: item.productId || index,
      title: item.title || "Item",
      size: item.size || "OS",
      unitPrice: item.unitPrice ?? 0,
      quantity: item.quantity || 1,
      lineTotal: item.lineTotal ?? (item.unitPrice ?? 0) * (item.quantity || 1),
    })),
  };
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        const response = await api.get(`/admin/orders/${id}`);
        setOrder(normalizeOrder(getResponsePayload(response)));
      } catch (err) {
        setError(err.message || "Failed to load order.");
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [id]);

  const handleStatusChange = async (event) => {
    const nextStatus = event.target.value;
    if (!order || nextStatus === order.status) return;

    const previousStatus = order.status;
    setOrder((prev) => ({ ...prev, status: nextStatus }));
    setUpdatingStatus(true);
    setStatusError("");

    try {
      await api.patch(`/admin/orders/${order.rawId}`, {
        status: nextStatus.replace(/ /g, "_").toLowerCase(),
      });
    } catch (err) {
      setOrder((prev) => ({ ...prev, status: previousStatus }));
      setStatusError(err.message || "Failed to update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-12 text-black lg:ml-64 lg:px-12">
        <p className="text-xs font-black uppercase tracking-widest">
          Loading order...
        </p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-white px-6 py-12 text-black lg:ml-64 lg:px-12">
        <p className="text-xs font-black uppercase tracking-widest text-red-600">
          {error || "Order not found."}
        </p>
        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          className="mt-6 inline-flex items-center gap-2 border-b-2 border-black text-xs font-black uppercase tracking-widest"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </button>
      </main>
    );
  }

  const addressLines = [
    order.shipping.line1,
    order.shipping.city,
    order.shipping.postalCode,
    order.shipping.country,
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-black lg:ml-64 lg:px-12 lg:py-12">
      <button
        type="button"
        onClick={() => navigate("/admin/orders")}
        className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black/60 hover:text-black"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </button>

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 border-b-4 border-black pb-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-widest opacity-50">
            Transaction Record
          </p>
          <h1 className="text-3xl font-black uppercase leading-none tracking-tight md:text-5xl">
            Order #{order.id}
          </h1>
        </div>
        <span className="inline-flex w-fit bg-black px-6 py-3 text-sm font-black uppercase tracking-widest text-white md:text-base">
          {order.status}
        </span>
      </div>

      {/* Bento Grid */}
      <div className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Customer */}
        <div className="border-2 border-black p-6 lg:col-span-4">
          <div className="mb-4 flex items-center gap-2">
            <User size={18} />
            <h2 className="border-b-2 border-black text-xs font-black uppercase tracking-widest">
              Customer Identity
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase opacity-40">
                Full Name
              </label>
              <p className="text-xl font-black uppercase leading-tight">
                {order.customer.name}
              </p>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase opacity-40">
                Email
              </label>
              <p className="text-sm font-semibold">{order.customer.email}</p>
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="border-2 border-black p-6 lg:col-span-4">
          <div className="mb-4 flex items-center gap-2">
            <MapPin size={18} />
            <h2 className="border-b-2 border-black text-xs font-black uppercase tracking-widest">
              Shipping Destination
            </h2>
          </div>
          <p className="text-sm font-semibold uppercase leading-relaxed">
            {addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <div className="mt-4 border-t border-black/10 pt-4">
            <label className="block text-[10px] font-black uppercase opacity-40">
              Payment Provider
            </label>
            <p className="text-xs font-black uppercase tracking-widest">
              {order.shipping.carrier}
            </p>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="flex flex-col justify-between bg-black p-6 text-white lg:col-span-4">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <Receipt size={18} />
              <h2 className="border-b-2 border-white/30 text-xs font-black uppercase tracking-widest">
                Financial Summary
              </h2>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase opacity-40">
                Total Transaction
              </label>
              <p className="text-4xl font-black leading-none md:text-5xl">
                {formatAmount(order.total)}
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase opacity-40">
                  Post Date
                </label>
                <p className="text-xs font-black uppercase tracking-widest">
                  {order.date}
                </p>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase opacity-40">
                  Currency
                </label>
                <p className="text-xs font-black uppercase tracking-widest">
                  {order.currency}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-10 overflow-hidden border-2 border-black">
        <div className="flex items-center gap-2 bg-black px-6 py-3 text-white">
          <ShoppingBag size={18} />
          <h2 className="text-xs font-black uppercase tracking-widest">
            Manifest: Items Included
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b-2 border-black bg-black/[0.03] text-left">
                <th className="p-4 text-[11px] font-black uppercase">
                  Product
                </th>
                <th className="p-4 text-center text-[11px] font-black uppercase">
                  Size
                </th>
                <th className="p-4 text-right text-[11px] font-black uppercase">
                  Unit Price
                </th>
                <th className="p-4 text-center text-[11px] font-black uppercase">
                  Qty
                </th>
                <th className="p-4 text-right text-[11px] font-black uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {order.items.length > 0 ? (
                order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-black/[0.02]">
                    <td className="p-4">
                      <p className="text-sm font-black uppercase">
                        {item.title}
                      </p>
                    </td>
                    <td className="p-4 text-center text-sm font-black">
                      {item.size}
                    </td>
                    <td className="p-4 text-right text-sm font-black">
                      {formatAmount(item.unitPrice)}
                    </td>
                    <td className="p-4 text-center text-sm font-black">
                      {item.quantity}
                    </td>
                    <td className="p-4 text-right text-sm font-black">
                      {formatAmount(item.lineTotal)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center text-xs font-black uppercase tracking-widest text-black/50"
                  >
                    No items on this order
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update */}
      <div className="flex flex-col items-start justify-end gap-3 border-t-2 border-black/20 py-6 md:flex-row md:items-center">
        <div className="relative w-full md:w-64">
          <select
            value={order.status}
            onChange={handleStatusChange}
            disabled={updatingStatus}
            className="w-full cursor-pointer appearance-none border-none bg-black px-6 py-4 text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:ring-0 disabled:opacity-50"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === order.status ? `Status: ${option}` : `Set to: ${option}`}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <ChevronDown size={18} className="text-white" />
          </div>
        </div>
        {updatingStatus && (
          <span className="text-[10px] font-black uppercase tracking-widest opacity-50">
            Updating...
          </span>
        )}
        {statusError && (
          <span className="text-[10px] font-black uppercase tracking-widest text-red-600">
            {statusError}
          </span>
        )}
      </div>
    </main>
  );
}