// src/components/Navbar/Navbar.jsx
import React, { useState, useEffect } from "react";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import DarkMode from "./DarkMode";
import { FiShoppingBag } from "react-icons/fi";
import Cart from "./Cart";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom"; // ✅ Added

// ✅ Define backend URL
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://shopme-backend-production.up.railway.app";

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const { cart } = useCart();

  const toggleCart = () => setCartOpen(!cartOpen);

  // Check login states
  const token = localStorage.getItem("token"); // Customer token
  const adminToken = localStorage.getItem("adminToken"); // Admin token

  const handleLogout = () => {
    if (window.confirm("Log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      window.location.href = "/";
    }
  };

  const [user, setUser] = useState(null);

  // ✅ Fetch user data when token changes
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
        setUser(null); // Clear user when logged out
      }
    };
    fetchUser();
  }, [token, BACKEND_URL]);

  return (
    <div className="shadow-lg bg-white dark:bg-slate-900 dark:text-white duration-200 relative z-40 border-b border-gray-100 dark:border-slate-700">
      <div className="bg-gradient-to-r from-primary/30 to-primary/40 backdrop-blur-sm py-3">
        <div className="container flex justify-between items-center">
          {/* Logo */}
          <div>
            <Link to="/" className="font-bold text-2xl flex items-center gap-2 text-gray-900 dark:text-white hover:scale-105 transition-transform duration-200">
              <div className="p-2 bg-gradient-to-r from-primary to-black rounded-xl text-white shadow-lg">
                <FiShoppingBag size="24" />
              </div>
              <span className="bg-gradient-to-r from-primary to-black bg-clip-text text-transparent font-extrabold">ShopMe</span>
            </Link>
          </div>

          {/* Right Side: Search, Cart, Auth, Dark Mode */}
          <div className="flex items-center gap-4">
            {/* Search Bar (Hidden on mobile) */}
            <div className="relative group hidden sm:block">
              <input
                type="text"
                placeholder="Search products..."
                className="w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-xl border-2 border-gray-200 dark:border-slate-600 py-2 px-4 pr-10 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white bg-white/80 backdrop-blur-sm shadow-sm"
              />
              <IoMdSearch className="text-gray-500 group-hover:text-primary dark:text-gray-400 absolute top-1/2 -translate-y-1/2 right-3 text-lg transition-colors duration-200" />
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2">
              {token ? (
                <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-black rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Hi, {user?.name || "User"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/profile"
                      className="text-sm text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-primary/10"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : adminToken ? (
                <div className="flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white px-4 py-2 rounded-xl backdrop-blur-sm border border-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold">Admin Panel</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-300 hover:text-red-400 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-red-900/20"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-primary/10 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm bg-gradient-to-r from-primary to-black hover:from-black hover:to-primary text-white py-2 px-4 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative bg-gradient-to-r from-primary to-black hover:from-black hover:to-primary text-white py-2 px-4 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FaCartShopping className="text-lg" />
              <span className="hidden sm:inline text-sm font-medium">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-pulse">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <DarkMode />
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {cartOpen && <Cart onClose={toggleCart} />}
    </div>
  );
}
