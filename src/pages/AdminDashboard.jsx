import React, { useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import ProductManagement from "../components/admin/ProductManagement";
import TopProductManagement from "../components/admin/TopProductManagement";
import AdminOrders from "../components/admin/AdminOrders"; // ✅ new component

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://shopme-backend-production.up.railway.app";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Admin Login Required
          </h2>
          <p className="text-gray-600 mb-6">
            You must be logged in to access the dashboard.
          </p>
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
    <AdminLayout>
      {/* Tabs */}
      <div className="border-b border-gray-300 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "products"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            🛍️ Products
          </button>
          <button
            onClick={() => setActiveTab("topProducts")}
            className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "topProducts"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            ⭐ Top Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "orders"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            📦 Orders
          </button>
        </nav>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <p className="text-green-700 font-medium">{success}</p>
        </div>
      )}

      {/* Content */}
      {activeTab === "products" && (
        <ProductManagement
          BACKEND_URL={BACKEND_URL}
          token={token}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}

      {activeTab === "topProducts" && (
        <TopProductManagement
          BACKEND_URL={BACKEND_URL}
          token={token}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}

      {activeTab === "orders" && (
        <AdminOrders BACKEND_URL={BACKEND_URL} token={token} />
      )}
    </AdminLayout>
  );
}
