// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import ProductCRUD from "../components/admin/ProductCRUD";
import TopProductCRUD from "../components/admin/TopProductCRUD";
import OrdersList from "../components/admin/OrdersList";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://shopme-backend-production.up.railway.app";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('adminToken');

  // Fetch all data
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [ordersData, productsData, topProductsData] = await Promise.all([
          fetch(`${BACKEND_URL}/api/orders`, { headers: { 'Authorization': `Bearer ${token}` }}).then(r => r.json()),
          fetch(`${BACKEND_URL}/api/products`, { headers: { 'Authorization': `Bearer ${token}` }}).then(r => r.json()),
          fetch(`${BACKEND_URL}/api/top-products`, { headers: { 'Authorization': `Bearer ${token}` }}).then(r => r.json())
        ]);
        setOrders(ordersData);
        setProducts(productsData);
        setTopProducts(topProductsData);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, BACKEND_URL]);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Login Required</h2>
          <a href="/admin/login" className="inline-block bg-primary text-white py-2 px-6 rounded-full hover:scale-105 transition-transform duration-200">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 bg-white rounded-b-xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ProductCRUD {...{ products, setProducts, BACKEND_URL, token, setError, setSuccess }} />
        <TopProductCRUD {...{ topProducts, setTopProducts, BACKEND_URL, token, setError, setSuccess }} />
        <OrdersList orders={orders} />
      </div>
    </AdminLayout>
  );
}