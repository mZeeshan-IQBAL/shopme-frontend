// src/components/admin/OrdersList.jsx
export default function OrdersList({ orders }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Recent Orders</h3>
      
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No orders yet.</p>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-900">#{order._id.slice(-6)}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full
                    ${order.status === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                    }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-gray-800 font-medium mt-1">{order.name}</p>
              <p className="text-sm text-gray-600">₹{order.totalPrice}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}