// App.jsx
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

// Admin Components (create these in src/pages/)
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
      <Routes>
        {/* Public Shop Routes */}
        <Route
          path="/"
          element={
            <>
              <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
                <Navbar />
                <Hero />
                <Products />
                <TopProducts />
                <Banner />
                <Subscribe />
                <Testimonials />
                <Footer />
                <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
              </div>
            </>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Optional: Redirect any unknown route to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </CartProvider>
  );
};

export default App;