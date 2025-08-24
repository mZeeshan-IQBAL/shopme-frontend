import React, { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://shopme-backend-production.up.railway.app";

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        window.location.href = '/admin';
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-primary"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-primary"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded hover:scale-105 disabled:opacity-70"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;