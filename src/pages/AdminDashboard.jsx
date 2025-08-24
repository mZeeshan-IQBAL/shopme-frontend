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
  const [topFormData, setTopFormData] = useState({
    id: '',
    title: '',
    rating: '',
    description: '',
    price: '',
    aosDelay: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingTopProducts, setLoadingTopProducts] = useState(true);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editingTopProduct, setEditingTopProduct] = useState(null);

  const token = localStorage.getItem('adminToken');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTopChange = (e) => {
    setTopFormData({ ...topFormData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Populate forms when editing
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

  useEffect(() => {
    if (editingTopProduct) {
      setTopFormData({
        id: editingTopProduct.id,
        title: editingTopProduct.title,
        rating: editingTopProduct.rating,
        description: editingTopProduct.description,
        price: editingTopProduct.price,
        aosDelay: editingTopProduct.aosDelay || ''
      });
    }
  }, [editingTopProduct]);

  // Fetch Data
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      const fetchWithAuth = async (url) => {
        const res = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      };

      try {
        const [ordersData, productsData, topProductsData] = await Promise.all([
          fetchWithAuth(`${BACKEND_URL}/api/orders`),
          fetchWithAuth(`${BACKEND_URL}/api/products`),
          fetchWithAuth(`${BACKEND_URL}/api/top-products`)
        ]);

        setOrders(ordersData);
        setProducts(productsData);
        setTopProducts(topProductsData);
      } catch (err) {
        setError('Failed to load data: ' + err.message);
      } finally {
        setLoadingOrders(false);
        setLoadingProducts(false);
        setLoadingTopProducts(false);
      }
    };

    fetchData();
  }, [token, BACKEND_URL]);

  // Handle Product Submit (Create/Edit)
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { id, title, rating, color, price, aosDelay } = formData;
    const numId = parseInt(id);
    const numRating = parseFloat(rating);
    const numPrice = parseFloat(price);

    if (!id || !title || !rating || !price || (!editingProduct && !image)) {
      setError('Please fill all required fields and upload an image');
      setLoading(false);
      return;
    }
    if (isNaN(numId) || isNaN(numRating) || isNaN(numPrice)) {
      setError('ID, rating, and price must be numbers');
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('id', numId);
    data.append('title', title);
    data.append('rating', numRating);
    data.append('color', color);
    data.append('price', numPrice);
    data.append('aosDelay', aosDelay || '');

    if (image) data.append('image', image);

    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct
        ? `${BACKEND_URL}/api/products/${numId}`
        : `${BACKEND_URL}/api/products`;

      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(`✅ Product ${editingProduct ? 'updated' : 'added'}!`);
        setFormData({ id: '', title: '', rating: '', color: '', price: '', aosDelay: '' });
        setImage(null);
        setEditingProduct(null);

        // Refresh list
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

  // Handle Top Product Submit (Create/Edit)
  const handleSubmitTopProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { id, title, rating, description, price, aosDelay } = topFormData;
    const numId = parseInt(id);
    const numRating = parseFloat(rating);
    const numPrice = parseFloat(price);

    if (!id || !title || !rating || !description || !price || (!editingTopProduct && !image)) {
      setError('Please fill all required fields and upload an image');
      setLoading(false);
      return;
    }
    if (isNaN(numId) || isNaN(numRating) || isNaN(numPrice)) {
      setError('ID, rating, and price must be numbers');
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('id', numId);
    data.append('title', title);
    data.append('rating', numRating);
    data.append('description', description);
    data.append('price', numPrice);
    data.append('aosDelay', aosDelay || '');

    if (image) data.append('image', image);

    try {
      const method = editingTopProduct ? 'PUT' : 'POST';
      const url = editingTopProduct
        ? `${BACKEND_URL}/api/top-products/${numId}`
        : `${BACKEND_URL}/api/top-products`;

      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(`✅ Top product ${editingTopProduct ? 'updated' : 'added'}!`);
        setTopFormData({ id: '', title: '', rating: '', description: '', price: '', aosDelay: '' });
        setImage(null);
        setEditingTopProduct(null);

        const updated = await fetch(`${BACKEND_URL}/api/top-products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json());
        setTopProducts(updated);
      } else {
        setError(result.error || 'Failed to save top product');
      }
    } catch (err) {
      setError('⚠️ Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setSuccess('✅ Product deleted!');
        setProducts(products.filter(p => p.id !== id));
      } else {
        const result = await res.json();
        setError(result.error || 'Failed to delete');
      }
    } catch (err) {
      setError('⚠️ Network error.');
    }
  };

  // Delete Top Product
  const handleDeleteTopProduct = async (id) => {
    if (!window.confirm("Delete this top product?")) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/top-products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setSuccess('✅ Top product deleted!');
        setTopProducts(topProducts.filter(p => p.id !== id));
      } else {
        const result = await res.json();
        setError(result.error || 'Failed to delete');
      }
    } catch (err) {
      setError('⚠️ Network error.');
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  // If not logged in
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
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-gray-800 text-white p-6 rounded-t-xl relative">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-300 mt-1">Manage products, top products, and orders</p>
          <button
            onClick={handleLogout}
            className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded"
          >
            Logout
          </button>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 bg-white rounded-b-xl">

          {/* Add/Edit Product */}
          <div>
            <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmitProduct} className="space-y-4">
              <input name="id" placeholder="ID" value={formData.id} onChange={handleChange} required disabled={editingProduct} className="w-full border border-gray-300 rounded px-3 py-1 text-sm" />
              <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-1 text-sm" />
              <input name="rating" type="number" step="0.1" placeholder="Rating" value={formData.rating} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-1 text-sm" />
              <input name="color" placeholder="Color" value={formData.color} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-1 text-sm" />
              <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-1 text-sm" />
              <input name="aosDelay" type="text" placeholder="AOS Delay" value={formData.aosDelay} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-1 text-sm" />
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} required={!editingProduct} className="w-full text-sm" />
                {image && <p className="text-xs text-gray-500 mt-1">Selected: {image.name}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-black text-white py-2 px-4 rounded font-medium"
              >
                {loading ? 'Saving...' : editingProduct ? 'Update' : 'Add'}
              </button>
            </form>
          </div>

          {/* Add/Edit Top Product */}
          <div>
            <h2 className="text-xl font-bold mb-4">{editingTopProduct ? 'Edit Top Product' : 'Add Top Product'}</h2>
            <form onSubmit={handleSubmitTopProduct} className="space-y-4">
              <input name="id" placeholder="ID" value={topFormData.id} onChange={handleTopChange} required disabled={editingTopProduct} className="w-full border border-gray-300 rounded px-3 py-1 text-sm" />
              <input name="title" placeholder="Title" value={topFormData.title} onChange={handleTopChange} required className="w-full border border-gray-300 rounded px-3 py-1 text-sm" />
              <input name="rating" type="number" step="0.1" placeholder="Rating" value={topFormData.rating} onChange={handleTopChange} required className="w-full border border-gray-300 rounded px-3 py-1 text-sm" />
              <input name="description" placeholder="Description" value={topFormData.description} onChange={handleTopChange} required className="w-full border border-gray-300 rounded px-3 py-1 text-sm" />
              <input name="price" type="number" placeholder="Price" value={topFormData.price} onChange={handleTopChange} required className="w-full border border-gray-300 rounded px-3 py-1 text-sm" />
              <input name="aosDelay" type="text" placeholder="AOS Delay" value={topFormData.aosDelay} onChange={handleTopChange} className="w-full border border-gray-300 rounded px-3 py-1 text-sm" />
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} required={!editingTopProduct} className="w-full text-sm" />
                {image && <p className="text-xs text-gray-500 mt-1">Selected: {image.name}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-black text-white py-2 px-4 rounded font-medium"
              >
                {loading ? 'Saving...' : editingTopProduct ? 'Update' : 'Add'}
              </button>
            </form>
          </div>

          {/* Orders & Product Lists */}
          <div className="space-y-6">

            {/* Orders */}
            <div>
              <h2 className="text-xl font-bold mb-4">Orders</h2>
              {loadingOrders ? (
                <p className="text-gray-500 text-sm">Loading...</p>
              ) : orders.length === 0 ? (
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

            {/* Product List */}
            <div>
              <h2 className="text-xl font-bold mb-4">Products</h2>
              {loadingProducts ? (
                <p className="text-gray-500 text-sm">Loading...</p>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {products.map((p) => (
                    <div key={p.id} className="flex justify-between text-sm">
                      <span>{p.title}</span>
                      <span>
                        <button onClick={() => setEditingProduct(p)} className="text-blue-600 mx-1">✏️</button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 mx-1">🗑️</button>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Product List */}
            <div>
              <h2 className="text-xl font-bold mb-4">Top Products</h2>
              {loadingTopProducts ? (
                <p className="text-gray-500 text-sm">Loading...</p>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {topProducts.map((p) => (
                    <div key={p.id} className="flex justify-between text-sm">
                      <span>{p.title}</span>
                      <span>
                        <button onClick={() => setEditingTopProduct(p)} className="text-blue-600 mx-1">✏️</button>
                        <button onClick={() => handleDeleteTopProduct(p.id)} className="text-red-600 mx-1">🗑️</button>
                      </span>
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