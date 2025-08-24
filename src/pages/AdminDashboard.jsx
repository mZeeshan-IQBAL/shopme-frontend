// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://shopme-backend-production.up.railway.app";

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    rating: '',
    color: '',
    price: '',
    aosDelay: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const token = localStorage.getItem('adminToken');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Failed to fetch orders');

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError('Could not load orders: ' + err.message);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token, BACKEND_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) data.append(key, formData[key]);
    });
    if (image) data.append('image', image);

    try {
      const res = await fetch(`${BACKEND_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess('✅ Product added successfully!');
        setFormData({ id: '', title: '', rating: '', color: '', price: '', aosDelay: '' });
        setImage(null);
      } else {
        setError(result.error || 'Failed to add product');
      }
    } catch (err) {
      setError('⚠️ Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Login Required</h2>
          <p className="text-gray-600 mb-6">You must be logged in to access the dashboard.</p>
          <a
            href="/admin/login"
            className="inline-block bg-primary text-white py-2 px-6 rounded-full hover:scale-105 transition-transform duration-200"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-gray-800 text-white p-6 rounded-t-xl">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-300 mt-1">Manage products and view customer orders</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 mt-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 mt-6">
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 bg-white rounded-b-xl">

          {/* Add Product Form */}
          <div>
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="id"
                placeholder="Product ID"
                value={formData.id}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                name="title"
                placeholder="Product Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                name="rating"
                type="number"
                step="0.1"
                placeholder="Rating (e.g., 4.5)"
                value={formData.rating}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                name="color"
                placeholder="Color (optional)"
                value={formData.color}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                name="price"
                type="number"
                placeholder="Price (in Rs)"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                name="aosDelay"
                type="text"
                placeholder="AOS Delay (e.g., 200)"
                value={formData.aosDelay}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-white hover:file:bg-black"
                />
                {image && (
                  <p className="mt-2 text-sm text-gray-600">Selected: <span className="font-medium">{image.name}</span></p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-black text-white py-2 px-6 rounded-full font-medium transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  'Add Product'
                )}
              </button>
            </form>
          </div>

          {/* Orders List */}
          <div>
            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
            {loadingOrders ? (
              <p className="text-gray-500">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-500">No orders yet.</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {orders.map((order) => (
                  <div key={order._id} className="border rounded-lg p-4 bg-gray-50">
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Name:</strong> {order.name}</p>
                    <p><strong>Email:</strong> {order.email}</p>
                    <p><strong>Address:</strong> {order.address}</p>
                    <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                    <p><strong>Status:</strong> <span className="text-blue-600">{order.status || 'pending'}</span></p>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                    <div className="mt-2">
                      <strong>Items:</strong>
                      <ul className="list-disc list-inside text-sm">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.title} × {item.quantity} = ₹{item.price * item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Back Link */}
        <div className="p-6 pt-0">
          <a
            href="/"
            className="text-primary hover:underline text-sm font-medium"
          >
            ← Back to Store
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;