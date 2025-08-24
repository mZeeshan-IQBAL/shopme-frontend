import React, { useState } from "react";

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

  const token = localStorage.getItem('adminToken');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const data = new FormData();
    data.append('id', formData.id);
    data.append('title', formData.title);
    data.append('rating', formData.rating);
    data.append('color', formData.color);
    data.append('price', formData.price);
    data.append('aosDelay', formData.aosDelay);
    data.append('image', image);

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
        setSuccess('Product added successfully!');
        setFormData({ id: '', title: '', rating: '', color: '', price: '', aosDelay: '' });
        setImage(null);
      } else {
        setError(result.error || 'Failed to add product');
      }
    } catch (err) {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center mt-10">
        <p>You are not logged in.</p>
        <a href="/admin/login" className="text-primary hover:underline">Go to Login</a>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          name="id"
          placeholder="ID"
          value={formData.id}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="rating"
          placeholder="Rating"
          value={formData.rating}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="color"
          placeholder="Color"
          value={formData.color}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="aosDelay"
          placeholder="AOS Delay"
          value={formData.aosDelay}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white py-2 px-6 rounded hover:scale-105 disabled:opacity-70"
        >
          {loading ? 'Uploading...' : 'Add Product'}
        </button>
      </form>

      <div className="mt-8">
        <a href="/" className="text-primary hover:underline">← Back to Store</a>
      </div>
    </div>
  );
};

export default AdminDashboard;