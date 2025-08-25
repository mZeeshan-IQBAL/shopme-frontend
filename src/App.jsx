// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Main Components
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import TopProducts from "./components/TopProducts/TopProducts";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Testimonials from "./components/Testimonials/Testimonials";
import Footer from "./components/Footer/Footer";
import Popup from "./components/Popup/Popup";

// Auth Components
import Register from "./pages/Register";   // ← You created this
import Login from "./pages/Login";         // ← Just added
import Profile from "./pages/Profile";     // ← Coming soon

// Admin Components
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// Context
import { CartProvider } from "./context/CartContext";

const App = () => {
  const [orderPopup, setOrderPopup] = useState(false);

  const handleOrderPopup = () => setOrderPopup(!orderPopup);

  useEffect(() => {
    import("aos").then((AOS) => {
      AOS.init({ offset: 100, duration: 800, easing: "ease-in-sine", delay: 100 });
      AOS.refresh();
    });
  }, []);

  return (
    <CartProvider>
      <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
        <Routes>
          {/* Public Shop Route */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Hero />
                <Products />
                <TopProducts />
                <Banner />
                <Subscribe />
                <Testimonials />
                <Footer />
                <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
              </>
            }
          />

          {/* Customer Auth Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </CartProvider>
  );
};

export default App;