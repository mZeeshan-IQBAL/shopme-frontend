// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://shopme-backend-production.up.railway.app";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const userRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      setUser(userData);

      if (userData.email) {
        const ordersRes = await fetch(
          `${BACKEND_URL}/api/orders/email/${encodeURIComponent(
            userData.email
          )}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const ordersData = await ordersRes.json();
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }

    // ✅ Re-fetch when order is placed
    const handleOrderPlaced = () => {
      if (user?.email) {
        setLoading(true);
        fetchData();
      }
    };

    window.addEventListener("order-placed", handleOrderPlaced);

    return () => {
      window.removeEventListener("order-placed", handleOrderPlaced);
    };
  }, [token, user?.email]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            You must be logged in to view your profile.
          </p>
          <Link to="/login" className="text-primary hover:underline">
            Login here
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  const handleLogout = () => {
    if (window.confirm("Log out?")) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  };

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "Unknown";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            My Profile
          </h1>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
          >
            Logout
          </button>

          {/* Back Link */}
          <div className="mt-4 sm:mt-0 sm:ml-auto">
            <Link
              to="/"
              className="text-gray-500 dark:text-gray-300 hover:text-primary hover:underline text-sm transition-colors"
            >
              ← Back to Store
            </Link>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Personal Info</h2>
          <p>
            <strong>Name:</strong> {user?.name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {user?.email || "N/A"}
          </p>
          <p>
            <strong>Joined:</strong> {joinedDate}
          </p>
        </div>

        {/* Order History */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Order History ({orders.length})
          </h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <div>
                      <p>
                        <strong>Order ID:</strong> {order._id.slice(-6)}
                      </p>
                      <p>
                        <strong>Total:</strong> ₹
                        {order.totalPrice.toLocaleString()}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span className="text-blue-600">
                          {order.status || "pending"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <strong>Items:</strong>
                    <ul className="list-disc list-inside text-sm mt-1">
                      {order.items.map((item, i) => (
                        <li key={i}>
                          {item.title} × {item.quantity}
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
    </div>
  );
}
