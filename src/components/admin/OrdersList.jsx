export default function OrdersList({ orders }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-sm">No orders yet.</p>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-2">
          {orders.map((order) => (
            <div key={order._id} className="border rounded p-2 text-xs">
              <p><strong>ID:</strong> {order._id.slice(-6)}</p>
              <p>{order.name} – ₹{order.totalPrice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}