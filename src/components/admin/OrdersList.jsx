// src/components/admin/OrdersList.jsx
export default function OrdersList({ orders }) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-medium mb-4">Recent Orders</h3>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4 max-h-60 overflow-y-auto">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4 bg-gray-50">
              <p><strong>ID:</strong> {order._id.slice(-6)}</p>
              <p><strong>Name:</strong> {order.name}</p>
              <p><strong>Total:</strong> ₹{order.totalPrice}</p>
              <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}