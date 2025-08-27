// src/components/Navbar/Navbar.jsx
import React, { useState, useEffect } from "react";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FiShoppingBag } from "react-icons/fi";
import DarkMode from "./DarkMode";
import Cart from "./Cart";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://shopme-backend-production.up.railway.app";

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const { cart } = useCart();
  const toggleCart = () => setCartOpen(!cartOpen);

  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");

  const handleLogout = () => {
    if (window.confirm("Log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      window.location.href = "/";
    }
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userData = await res.json();
          setUser(userData);
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, [token]);

  return (
    <div className="shadow-md bg-white dark:bg-slate-900 dark:text-white z-50 relative">
      <div className="bg-primary/40 py-3">
        <div className="container flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white"
          >
            <FiShoppingBag size={30} /> ShopMe
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search products..."
                className="transition-all duration-300 w-48 group-hover:w-64 rounded-lg border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-slate-800 dark:text-white"
              />
              <IoMdSearch className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 dark:text-gray-300" />
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {token ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Hi, {user?.name || "User"}
                  </span>
                  <Link
                    to="/profile"
                    className="text-sm text-gray-700 hover:text-primary dark:text-gray-300"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-700 hover:text-primary dark:text-gray-300"
                  >
                    Logout
                  </button>
                </div>
              ) : adminToken ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Admin
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-700 hover:text-primary dark:text-gray-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-sm text-gray-700 hover:text-primary dark:text-gray-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm bg-primary hover:bg-black text-white py-1 px-3 rounded-lg transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-full hover:scale-105 transition-transform"
            >
              <FaCartShopping className="text-xl" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center text-white">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Dark Mode */}
            <DarkMode />
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {cartOpen && <Cart onClose={toggleCart} />}
    </div>
  );
}

