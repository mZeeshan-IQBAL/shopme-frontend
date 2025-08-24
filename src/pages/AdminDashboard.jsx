// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";

// ✅ Fixed: Removed trailing spaces in URL
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
  const [products, setProducts] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null); // Track edit mode

  const token = localStorage.getItem('adminToken');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError('Could not load orders: ' + err.message);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (token) fetchOrders();
  }, [token, BACKEND_URL]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError('Could not load products: ' + err.message);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (token) fetchProducts();
  }, [token, BACKEND_URL]);

  // Populate form when editing
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        id: editingProduct.id,
        title: editingProduct.title,
        rating: editingProduct.rating,
        color: editingProduct.color,
        price: editingProduct.price,
        aosDelay: editingProduct.aosDelay || ''
      });
    }
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate
    if (!formData.id || !formData.title || !formData.rating || !formData.price) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    const rating = parseFloat(formData.rating);
    const price = parseFloat(formData.price);

    if (isNaN(rating) || rating < 0 || rating > 5) {
      setError('Rating must be between 0 and 5');
      setLoading(false);
      return;
    }

    if (isNaN(price) || price <= 0) {
      setError('Price must be greater than 0');
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('id', formData.id);
    data.append('title', formData.title);
    data.append('rating', rating);
    data.append('color', formData.color);
    data.append('price', price);
    data.append('aosDelay', formData.aosDelay || '');

    if (image) {
      data.append('image', image);
    }

    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct
        ? `${BACKEND_URL}/api/products/${formData.id}`
        : `${BACKEND_URL}/api/products`;

      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(`✅ Product ${editingProduct ? 'updated' : 'added'} successfully!`);
        setFormData({ id: '', title: '', rating: '', color: '', price: '', aosDelay: '' });
        setImage(null);
        setEditingProduct(null);

        // Refresh product list
        const updated = await fetch(`${BACKEND_URL}/api/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json());
        setProducts(updated);
      } else {
        setError(result.error || 'Failed to save product');
      }
    } catch (err) {
      setError('⚠️ Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setSuccess('✅ Product deleted successfully!');
        setProducts(products.filter(p => p.id !== id));
      } else {
        const result = await res.json();
        setError(result.error || 'Failed to delete product');
      }
    } catch (err) {
      setError('⚠️ Network error. Try again.');
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Login Required</h2>
          <p className="text-gray-600 mb-6">You must be logged in to access the dashboard.</p>
          <a href="/admin/login" className="inline-block bg-primary text-white py-2 px-6 rounded-full hover:scale-105 transition-transform duration-200">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 text-white p-6 rounded-t-xl relative">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-300 mt-1">Manage products and view customer orders</p>
          <button
            onClick={() => {
              localStorage.removeItem('adminToken');
              window.location.href = '/admin/login';
            }}
            className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

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
          {/* Add/Edit Product Form */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="id"
                placeholder="Product ID"
                value={formData.id}
                onChange={handleChange}
                required
                disabled={editingProduct}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image {editingProduct && '(leave blank to keep current)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-white hover:file:bg-black"
                />
                {image && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: <span className="font-medium">{image.name}</span>
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-black text-white py-2 px-6 rounded-full font-medium transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {editingProduct ? 'Updating...' : 'Uploading...'}
                    </>
                  ) : (
                    editingProduct ? 'Update Product' : 'Add Product'
                  )}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setFormData({ id: '', title: '', rating: '', color: '', price: '', aosDelay: '' });
                      setImage(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Manage Products & Orders */}
          <div className="space-y-6">
            {/* Product List */}
            <div>
              <h2 className="text-xl font-bold mb-4">Manage Products</h2>
              {loadingProducts ? (
                <p className="text-gray-500">Loading products...</p>
              ) : products.length === 0 ? (
                <p className="text-gray-500">No products yet.</p>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.img}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/60x80" }}
                        />
                        <div>
                          <p className="font-medium">{product.title}</p>
                          <p className="text-sm text-gray-500">ID: {product.id} | ₹{product.price}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Orders List */}
            <div>
              <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
              {loadingOrders ? (
                <p className="text-gray-500">Loading orders...</p>
              ) : orders.length === 0 ? (
                <p className="text-gray-500">No orders yet.</p>
              ) : (
                <div className="space-y-4 max-h-60 overflow-y-auto">
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
                          {order.items.map((item, i) => (
                            <li key={i}>{item.title} × {item.quantity} = ₹{item.price * item.quantity}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 pt-0">
          <a href="/" className="text-primary hover:underline text-sm font-medium">← Back to Store</a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;