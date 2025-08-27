import React, { useEffect, useState } from "react";

export default function AdminOrders({ BACKEND_URL, token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📦 Orders</h2>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mt-4 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border p-2">{order._id}</td>
                <td className="border p-2">{order.name}</td>
                <td className="border p-2">{order.email}</td>
                <td className="border p-2">₹{order.totalPrice}</td>
                <td className="border p-2">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="border p-2">
                  <ul>
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.title} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
