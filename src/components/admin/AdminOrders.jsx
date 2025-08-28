// src/components/admin/AdminOrders.jsx
import React, { useEffect, useState } from "react";

export default function AdminOrders({ BACKEND_URL, token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to update status");
      }

      const { order } = await res.json();

      setOrders((prevOrders) =>
        prevOrders.map((o) => (o._id === orderId ? { ...o, ...order } : o))
      );
    } catch (err) {
      console.error("❌ Error updating order status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📦 Orders</h2>

      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No orders found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full bg-white border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left rounded-tl-lg">ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
                <th className="px-4 py-3 text-left rounded-tr-lg">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {order._id.slice(-6)}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {order.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm">
                    {order.email}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    ₹{order.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                        ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : order.status === "pending"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="p-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
