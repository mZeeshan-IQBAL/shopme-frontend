// src/components/Navbar/Navbar.jsx
import React, { useState, useEffect } from "react"; // ✅ Added useEffect
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import DarkMode from "./DarkMode";
import { FiShoppingBag } from "react-icons/fi";
import Cart from "./Cart";
import { useCart } from "../../context/CartContext";

// ✅ Define BACKEND_URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://shopme-backend-production.up.railway.app";

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
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const userData = await res.json();
          setUser(userData);
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      } else {
        setUser(null); // ✅ Clear user when logged out
      }
    };
    fetchUser();
  }, [token]); // ✅ Only re-run when token changes

  return (
    <div className="shadow-md bg-white dark:bg-slate-800 dark:text-white duration-200 relative z-40">
      <div className="bg-primary/40 py-2">
        <div className="container flex justify-between items-center">
          {/* Logo */}
          <div>
            <a href="/" className="font-bold text-xl flex items-center gap-1">
              <FiShoppingBag size="30" /> ShopMe
            </a>
          </div>

          {/* Right Side: Search, Cart, Auth, Dark Mode */}
          <div className="flex items-center gap-4">
            {/* Search Bar (Hidden on mobile) */}
            <div className="relative group hidden sm:block">
              <input
                type="text"
                placeholder="Search"
                className="w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-lg border border-gray-300 py-1 px-2 text-sm focus:outline-none focus:border-primary dark:border-gray-500 dark:bg-slate-800"
              />
              <IoMdSearch className="text-slate-800 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3" />
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {token ? (
                // Customer logged in
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    Hi, {user?.name || "User"} {/* ✅ Shows real name */}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 hover:text-primary dark:text-gray-300"
                  >
                    Logout
                  </button>
                </div>
              ) : adminToken ? (
                // Admin logged in
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Admin</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 hover:text-primary dark:text-gray-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                // Not logged in – show Login/Register
                <div className="flex items-center gap-3">
                  <a
                    href="/login"
                    className="text-sm text-gray-700 hover:text-primary dark:text-gray-300"
                  >
                    Login
                  </a>
                  <a
                    href="/register"
                    className="text-sm bg-primary hover:bg-black text-white py-1 px-3 rounded"
                  >
                    Register
                  </a>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative bg-gradient-to-r from-primary to-secondary text-white py-1 px-4 rounded-full flex items-center gap-2"
            >
              <FaCartShopping className="text-xl" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
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